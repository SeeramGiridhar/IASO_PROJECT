import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';
import { analyzeMedicalReport } from '../../lib/aiAnalysis';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function ReportUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState('Blood Test');
  const [hospital, setHospital] = useState('');
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (!file || !user) return; const path = `${user.id}/${Date.now()}-${file.name}`; await supabase.storage.from('medical-reports').upload(path, file); const analysis = await analyzeMedicalReport(file); await supabase.from('reports').insert({ patient_id: user.id, title: `${type} - ${hospital || 'Report'}`, category: type, report_type: type, hospital_clinic: hospital, report_date: new Date().toISOString(), file_url: path, notes: analysis.summary, status: analysis.severity }); navigate('/patient/reports'); };
  return <div className="max-w-3xl mx-auto px-4 py-10"><form onSubmit={submit} className="bg-white p-8 rounded-3xl border space-y-5"><FileText className="text-primary-600" /><h1 className="text-4xl font-black">Upload Medical Report</h1><input type="file" required accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full p-4 bg-gray-50 rounded-xl" /><select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 border-2 rounded-xl"><option>Blood Test</option><option>X-Ray</option><option>MRI / CT Scan</option><option>Prescription</option><option>Lab Report</option><option>Other</option></select><input value={hospital} onChange={(e) => setHospital(e.target.value)} placeholder="Hospital / Lab" className="w-full p-3 border-2 rounded-xl" /><button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black flex justify-center gap-2"><Upload /> Upload & Analyze</button></form></div>;
}
