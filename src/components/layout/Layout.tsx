import { Outlet } from 'react-router-dom';
import ChatBot from '../chat/ChatBot';
import Footer from './Footer';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
