import { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function DoctorSchedule() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  useEffect(() => { if (user) supabase.from('appointments').select('*, patient:patient_id(id, full_name)').eq('doctor_id', user.id).then(({ data }: any) => setAppointments(data ?? [])); }, [user]);
  return <div className="max-w-7xl mx-auto px-4 py-10"><h1 className="text-4xl font-black mb-2">Consultation Schedule</h1><p className="text-gray-500 mb-8">Manage clinical sessions and appointments.</p><div className="grid gap-4">{appointments.map((a) => <div key={a.id} className="bg-white p-6 rounded-3xl border flex gap-4"><Calendar className="text-primary-600" /><div><h3 className="font-black text-xl">{a.patient?.full_name || 'Patient'}</h3><p className="text-gray-500 flex gap-2"><Clock /> {new Date(a.appointment_date).toLocaleString()}</p></div></div>)}</div>{appointments.length === 0 && <div className="p-16 bg-white rounded-3xl border text-center"><Calendar className="mx-auto text-gray-300 mb-4" /><h2 className="text-2xl font-black">No appointments</h2></div>}</div>;
}
