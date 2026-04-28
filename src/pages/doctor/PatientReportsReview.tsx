import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function DoctorReportsReview() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  useEffect(() => { if (user) supabase.from('reports').select('*, patient:patient_id(id, full_name)').eq('doctor_id', user.id).then(({ data }: any) => setReports(data ?? [])); }, [user]);
  return <div className="max-w-7xl mx-auto px-4 py-10"><h1 className="text-4xl font-black mb-2">Patient Reports</h1><p className="text-gray-500 mb-8">Review reports assigned to your practice.</p><div className="grid gap-4">{reports.map((r) => <div key={r.id} className="bg-white p-6 rounded-3xl border flex gap-4"><FileText className="text-primary-600" /><div><h3 className="font-black text-xl">{r.title}</h3><p className="text-gray-500">Status: {r.status}</p></div></div>)}</div>{reports.length === 0 && <div className="p-16 bg-white rounded-3xl border text-center"><FileText className="mx-auto text-gray-300 mb-4" /><h2 className="text-2xl font-black">No reports yet</h2></div>}</div>;
}
