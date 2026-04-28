import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Heart, Lock, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); const { data, error } = await supabase.auth.signInWithPassword(formData); if (error) setError(error.message); else navigate(data.user?.user_metadata?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'); };
  return <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4"><form onSubmit={submit} className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border space-y-5"><div className="text-center"><Heart className="mx-auto text-primary-600" /><h1 className="text-3xl font-black mt-3">Sign In</h1><p className="text-gray-500">Use patient@example.com or doctor@example.com in demo mode.</p></div>{error && <div className="p-3 bg-red-50 text-red-600 rounded-xl flex gap-2"><AlertCircle /> {error}</div>}<label className="block"><span className="font-bold text-sm">Email</span><div className="relative mt-2"><Mail className="absolute left-3 top-3 text-gray-400" /><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-11 py-3 border-2 rounded-xl" /></div></label><label className="block"><span className="font-bold text-sm">Password</span><div className="relative mt-2"><Lock className="absolute left-3 top-3 text-gray-400" /><input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-11 py-3 border-2 rounded-xl" /></div></label><button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black">Sign In</button><p className="text-center text-sm">No account? <Link to="/register" className="text-primary-600 font-black">Register</Link></p></form></div>;
}
