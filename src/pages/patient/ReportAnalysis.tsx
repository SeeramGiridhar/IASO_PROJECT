import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Brain, Calendar, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ReportAnalysis() {
  const { reportId } = useParams();
  const [report, setReport] = useState<any>(null);
  useEffect(() => { supabase.from('reports').select('*').eq('id', reportId).single().then(({ data }: any) => setReport(data)); }, [reportId]);
  if (!report) return <div className="max-w-3xl mx-auto p-10">Loading report...</div>;
  return <div className="max-w-5xl mx-auto px-4 py-10"><Link to="/patient/reports" className="flex gap-2 text-primary-600 font-black mb-6"><ArrowLeft /> Back</Link><div className="bg-white p-8 rounded-3xl border mb-8"><FileText className="text-primary-600 mb-4" /><h1 className="text-4xl font-black">{report.title}</h1><p className="text-gray-500 flex gap-2 mt-2"><Calendar /> {new Date(report.report_date).toLocaleDateString()}</p></div><div className="bg-primary-700 text-white p-8 rounded-3xl"><Brain className="mb-4" /><h2 className="text-2xl font-black mb-3">AI Summary</h2><p className="text-primary-50">{report.notes}</p></div></div>;
}
