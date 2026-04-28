import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PatientProfile() {
  const { user, logout } = useAuth();
  return <div className="max-w-4xl mx-auto px-4 py-10"><div className="bg-white p-8 rounded-3xl border"><User className="text-primary-600 mb-4" /><h1 className="text-4xl font-black">{user?.name}</h1><p className="text-gray-500 mb-8">{user?.email}</p><button onClick={logout} className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black flex gap-2"><LogOut /> Logout</button></div></div>;
}
