import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Stethoscope } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DoctorSearch() {
  const [doctors, setDoctors] = useState<any[]>([]);
  useEffect(() => { supabase.from('doctors').select('*, profiles:id(full_name, avatar_url, email)').then(({ data }: any) => setDoctors(data ?? [])); }, []);
  return <div className="max-w-7xl mx-auto px-4 py-10"><h1 className="text-4xl font-black mb-2">Find a Specialist</h1><p className="text-gray-500 mb-8">Book appointments with verified doctors.</p><div className="grid md:grid-cols-3 gap-6">{doctors.map((d) => <div key={d.id} className="bg-white p-6 rounded-3xl border"><Stethoscope className="text-primary-600 mb-4" /><h3 className="font-black text-xl">{d.profiles?.full_name}</h3><p className="text-primary-600 font-bold">{d.specialization}</p><p className="flex gap-1 items-center mt-2"><Star className="text-amber-400 fill-amber-400 w-4 h-4" /> {d.rating} · {d.experience_years} yrs</p><p className="text-gray-500 mt-2">{d.hospital_clinic}</p><Link to={`/patient/book/${d.id}`} className="block mt-6 py-3 text-center bg-primary-600 text-white rounded-xl font-black">Book Appointment</Link></div>)}</div></div>;
}
