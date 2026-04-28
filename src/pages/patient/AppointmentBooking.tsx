import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Stethoscope } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function AppointmentBooking() {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<any>(null);
  const [done, setDone] = useState(false);
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  useEffect(() => { supabase.from('doctors').select('*, profiles:id(full_name)').eq('id', doctorId).single().then(({ data }: any) => setDoctor(data)); }, [doctorId]);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); await supabase.from('appointments').insert({ patient_id: user?.id, doctor_id: doctorId, appointment_date: new Date(date).toISOString(), reason, status: 'scheduled' }); setDone(true); };
  if (done) return <div className="max-w-2xl mx-auto p-10 text-center"><CheckCircle2 className="mx-auto text-green-500 w-20 h-20 mb-6" /><h1 className="text-4xl font-black mb-4">Appointment Confirmed</h1><Link to="/patient/dashboard" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-black">Dashboard</Link></div>;
  return <div className="max-w-3xl mx-auto px-4 py-10"><div className="bg-white p-8 rounded-3xl border"><Stethoscope className="text-primary-600 mb-4" /><h1 className="text-3xl font-black mb-2">Book {doctor?.profiles?.full_name || 'Doctor'}</h1><p className="text-gray-500 mb-8">{doctor?.specialization}</p><form onSubmit={submit} className="space-y-5"><input type="datetime-local" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 border-2 rounded-xl" /><textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for visit" className="w-full p-3 border-2 rounded-xl" /><button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black">Confirm Booking</button></form></div></div>;
}
