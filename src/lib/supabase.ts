import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'placeholder-key';
const isMockMode = supabaseUrl.includes('placeholder') || supabaseUrl.includes('your-project');

export const isSupabaseConfigured = !isMockMode;

const doctors = [
  { id: 'doctor-1', specialization: 'Cardiology', experience_years: 12, hospital_clinic: 'Apollo Heart Centre', consultation_fee: 120, rating: 4.9, is_verified: true, profiles: { full_name: 'Dr. Anika Rao', avatar_url: '', email: 'anika@example.com' } },
  { id: 'doctor-2', specialization: 'General Medicine', experience_years: 8, hospital_clinic: 'Care Plus Clinic', consultation_fee: 80, rating: 4.7, is_verified: true, profiles: { full_name: 'Dr. Kiran Mehta', avatar_url: '', email: 'kiran@example.com' } },
  { id: 'doctor-3', specialization: 'Neurology', experience_years: 15, hospital_clinic: 'NeuroLife Institute', consultation_fee: 150, rating: 4.8, is_verified: true, profiles: { full_name: 'Dr. Nisha Kapoor', avatar_url: '', email: 'nisha@example.com' } },
];

const reports = [
  { id: 'report-1', patient_id: 'mock-id-123', doctor_id: 'doctor-1', title: 'Blood Test - City Lab', category: 'Blood Test', report_type: 'Blood Test', hospital_clinic: 'City Lab', report_date: new Date().toISOString(), status: 'normal', notes: 'Most markers are within normal limits. Cholesterol is mildly elevated and should be discussed with a doctor.' },
];

const appointments = [
  { id: 'appt-1', patient_id: 'mock-id-123', doctor_id: 'doctor-1', appointment_date: new Date(Date.now() + 86400000).toISOString(), reason: 'Review blood panel', status: 'scheduled', doctor: { id: 'doctor-1', specialization: 'Cardiology', profiles: doctors[0].profiles }, patient: { id: 'mock-id-123', full_name: 'Demo User', avatar_url: '' } },
];

const profiles = [
  { id: 'mock-id-123', full_name: 'Demo User', email: 'demo@example.com', role: 'patient' },
  ...doctors.map((doctor) => ({ id: doctor.id, full_name: doctor.profiles.full_name, email: doctor.profiles.email, role: 'doctor' })),
];

function getMockUser() {
  const stored = localStorage.getItem('mock_user');
  return stored ? JSON.parse(stored) : null;
}

function setMockUser(user: any) {
  localStorage.setItem('mock_user', JSON.stringify(user));
}

function makeQuery(table: string) {
  let rows: any[] = table === 'doctors' ? [...doctors] : table === 'reports' ? [...reports] : table === 'appointments' ? [...appointments] : table === 'profiles' ? [...profiles] : [];
  const chain: any = {
    select: () => chain,
    eq: (key: string, value: any) => { rows = rows.filter((row) => row[key] === value); return chain; },
    gte: (key: string, value: any) => { rows = rows.filter((row) => new Date(row[key]).getTime() >= new Date(value).getTime()); return chain; },
    lte: (key: string, value: any) => { rows = rows.filter((row) => new Date(row[key]).getTime() <= new Date(value).getTime()); return chain; },
    in: () => Promise.resolve({ data: rows, error: null }),
    order: () => chain,
    limit: (count: number) => { rows = rows.slice(0, count); return chain; },
    single: async () => ({ data: rows[0] ?? null, error: rows[0] ? null : { message: 'Not found' } }),
    insert: async (payload: any) => ({ data: Array.isArray(payload) ? payload : [payload], error: null }),
    update: () => chain,
    then: (resolve: any) => resolve({ data: rows, error: null, count: rows.length }),
  };
  return chain;
}

export const supabase = isMockMode
  ? ({
      auth: {
        signUp: async ({ email, options }: any) => { const user = { id: 'mock-id-123', email, user_metadata: options?.data ?? {} }; setMockUser(user); return { data: { user, session: { user } }, error: null }; },
        signInWithPassword: async ({ email }: any) => { const user = getMockUser() ?? { id: 'mock-id-123', email, user_metadata: { role: email.toLowerCase().includes('doctor') ? 'doctor' : 'patient', full_name: 'Demo User' } }; setMockUser(user); return { data: { user, session: { user } }, error: null }; },
        getSession: async () => { const user = getMockUser(); return { data: { session: user ? { user } : null }, error: null }; },
        onAuthStateChange: (callback: any) => { const user = getMockUser(); setTimeout(() => callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null), 100); return { data: { subscription: { unsubscribe: () => undefined } } }; },
        signOut: async () => { localStorage.removeItem('mock_user'); return { error: null }; },
      },
      from: (table: string) => makeQuery(table),
      storage: { from: () => ({ upload: async (path: string) => ({ data: { path }, error: null }) }) },
    } as any)
  : createClient(supabaseUrl, supabaseAnonKey);
