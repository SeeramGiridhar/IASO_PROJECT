import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dashboard = user?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
  const profile = user?.role === 'doctor' ? '/doctor/profile' : '/patient/profile';
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-black text-xl"><span className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center"><Heart className="w-5 h-5" /></span>IASO<span className="text-primary-600 -ml-2">Med</span></Link>
        <nav className="hidden md:flex items-center gap-2">
          {isAuthenticated ? <>
            <Link to={dashboard} className="px-4 py-2 font-bold text-gray-600 hover:text-primary-600">Dashboard</Link>
            {user?.role === 'patient' && <Link to="/patient/reports" className="px-4 py-2 font-bold text-gray-600 hover:text-primary-600">Reports</Link>}
            {user?.role === 'patient' && <Link to="/patient/doctors" className="px-4 py-2 font-bold text-gray-600 hover:text-primary-600">Find Doctors</Link>}
            {user?.role === 'doctor' && <Link to="/doctor/reports" className="px-4 py-2 font-bold text-gray-600 hover:text-primary-600">Reports</Link>}
            {user?.role === 'doctor' && <Link to="/doctor/schedule" className="px-4 py-2 font-bold text-gray-600 hover:text-primary-600">Schedule</Link>}
          </> : <>
            <a href="/#features" className="px-4 py-2 font-bold text-gray-600 hover:text-primary-600">Features</a>
            <Link to="/login" className="px-4 py-2 font-bold text-gray-700">Sign In</Link>
            <Link to="/register" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-black">Get Started</Link>
          </>}
        </nav>
        {isAuthenticated && <div className="hidden md:flex items-center gap-3"><Link to={profile} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary-600"><User /></Link><button onClick={logout} className="p-2 text-red-500"><LogOut /></button></div>}
        <button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="md:hidden bg-white border-t p-4 space-y-2"><Link to={isAuthenticated ? dashboard : '/login'} className="block p-3 font-bold">{isAuthenticated ? 'Dashboard' : 'Sign In'}</Link><Link to={isAuthenticated ? profile : '/register'} className="block p-3 font-bold">{isAuthenticated ? 'Profile' : 'Register'}</Link></div>}
    </header>
  );
}
