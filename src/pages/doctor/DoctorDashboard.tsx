import { Link } from 'react-router-dom';
import { Calendar, FileText, Star, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DoctorDashboard() {
  const { user } = useAuth();
  return <div className="max-w-7xl mx-auto px-4 py-10"><h1 className="text-4xl font-black mb-2">Welcome, <span className="text-primary-600">Dr. {user?.name}</span></h1><p className="text-gray-500 mb-10">Manage your appointments, reports, and practice.</p><div className="grid md:grid-cols-4 gap-6 mb-10">{[[Calendar,'Appointments','1'],[FileText,'Reports','1'],[Users,'Patients','1'],[Star,'Rating','4.9']].map(([Icon,label,value]: any) => <div key={label} className="bg-white p-6 rounded-3xl border"><Icon className="text-primary-600 mb-3" /><p className="text-3xl font-black">{value}</p><p className="text-gray-500 font-bold">{label}</p></div>)}</div><div className="grid md:grid-cols-3 gap-6"><Link to="/doctor/reports" className="p-8 bg-white rounded-3xl border"><FileText className="text-primary-600 mb-4" /><h2 className="text-2xl font-black">Review Reports</h2></Link><Link to="/doctor/schedule" className="p-8 bg-white rounded-3xl border"><Calendar className="text-primary-600 mb-4" /><h2 className="text-2xl font-black">Schedule</h2></Link><Link to="/doctor/profile" className="p-8 bg-white rounded-3xl border"><Star className="text-primary-600 mb-4" /><h2 className="text-2xl font-black">Profile</h2></Link></div></div>;
}
