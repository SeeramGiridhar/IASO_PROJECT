create extension if not exists "pgcrypto";

do $$ begin create type public.user_role as enum ('patient', 'doctor'); exception when duplicate_object then null; end $$;
do $$ begin create type public.report_severity as enum ('normal', 'warning', 'critical', 'pending'); exception when duplicate_object then null; end $$;
do $$ begin create type public.appointment_status as enum ('scheduled', 'completed', 'cancelled'); exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  role public.user_role not null default 'patient',
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctors (
  id uuid primary key references public.profiles(id) on delete cascade,
  specialization text,
  license_number text,
  experience_years integer default 0,
  education text,
  hospital_clinic text,
  clinic_address text,
  consultation_fee numeric(10, 2) default 0,
  bio text,
  rating numeric(2, 1) default 4.9,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid references public.doctors(id) on delete set null,
  title text not null,
  category text,
  report_type text,
  hospital_clinic text,
  report_date date not null default current_date,
  file_url text,
  notes text,
  status public.report_severity not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  appointment_date timestamptz not null,
  reason text,
  status public.appointment_status not null default 'scheduled',
  reports_shared uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare selected_role public.user_role;
begin
  selected_role := coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'patient');
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), 'User'), new.email, selected_role)
  on conflict (id) do update set full_name = excluded.full_name, email = excluded.email, role = excluded.role;
  if selected_role = 'doctor' then
    insert into public.doctors (id, specialization, hospital_clinic, is_verified) values (new.id, 'General Medicine', 'Private Practice', false) on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.doctors enable row level security;
alter table public.reports enable row level security;
alter table public.appointments enable row level security;

create policy "profiles_read_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "doctors_public_read" on public.doctors for select using (true);
create policy "doctors_update_own" on public.doctors for update using (id = auth.uid()) with check (id = auth.uid());
create policy "reports_patient_or_doctor_read" on public.reports for select using (patient_id = auth.uid() or doctor_id = auth.uid());
create policy "reports_patient_insert" on public.reports for insert with check (patient_id = auth.uid());
create policy "appointments_patient_or_doctor_read" on public.appointments for select using (patient_id = auth.uid() or doctor_id = auth.uid());
create policy "appointments_patient_insert" on public.appointments for insert with check (patient_id = auth.uid());

insert into storage.buckets (id, name, public) values ('medical-reports', 'medical-reports', false) on conflict (id) do nothing;
create policy "patients_upload_own_reports" on storage.objects for insert with check (bucket_id = 'medical-reports' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "patients_read_own_reports" on storage.objects for select using (bucket_id = 'medical-reports' and auth.uid()::text = (storage.foldername(name))[1]);
