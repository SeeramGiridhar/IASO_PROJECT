import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function ReportList() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  useEffect(() => { if (user) supabase.from('reports').select('*').eq('patient_id', user.id).then(({ data }: any) => setReports(data ?? [])); }, [user]);
  return <div className="max-w-7xl mx-auto px-4 py-10"><div className="flex justify-between mb-8"><div><h1 className="text-4xl font-black">My Medical Reports</h1><p className="text-gray-500">Stored securely and analyzed with AI.</p></div><Link to="/patient/upload" className="px-5 py-3 bg-primary-600 text-white rounded-xl font-black flex gap-2"><Plus /> Upload</Link></div><div className="grid md:grid-cols-3 gap-6">{reports.map((r) => <Link key={r.id} to={`/patient/reports/${r.id}`} className="bg-white p-6 rounded-3xl border hover:border-primary-300"><FileText className="text-primary-600 mb-4" /><h3 className="font-black text-xl">{r.title}</h3><p className="text-gray-500">{r.report_type}</p><p className="mt-4 text-xs font-black uppercase text-primary-600">{r.status}</p></Link>)}</div>{reports.length === 0 && <div className="text-center p-16 bg-white rounded-3xl border"><FileText className="mx-auto text-gray-300 mb-4" /><h2 className="text-2xl font-black">No reports yet</h2></div>}</div>;
}
