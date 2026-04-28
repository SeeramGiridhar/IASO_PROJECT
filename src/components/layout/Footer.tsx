import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return <footer className="bg-gray-900 text-gray-300"><div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8"><div><Link to="/" className="flex items-center gap-2 text-white font-black text-xl mb-4"><Heart className="text-primary-400" />IASO Med</Link><p className="text-sm text-gray-400">AI-powered medical reports, appointments, and doctor workflows.</p></div><div><h4 className="text-white font-black mb-3">Platform</h4><p className="text-sm">Reports, doctors, appointments</p></div><div><h4 className="text-white font-black mb-3">Security</h4><p className="text-sm">Supabase auth and row-level security</p></div><div><h4 className="text-white font-black mb-3">Contact</h4><p className="text-sm flex gap-2"><Mail className="w-4 h-4" /> giridharpandu22@gmail.com</p><p className="text-sm flex gap-2"><Phone className="w-4 h-4" /> +91 75694 50282</p><p className="text-sm flex gap-2"><MapPin className="w-4 h-4" /> Hyderabad, India</p></div></div></footer>;
}
