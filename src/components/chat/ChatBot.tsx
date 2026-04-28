import { useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello! I am IASO AI. I can help explain reports and appointments.' }]);
  const send = () => { if (!input.trim()) return; setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: 'I can help with that. Please remember this is AI guidance and not a replacement for a doctor.' }]); setInput(''); };
  return <div className="fixed bottom-6 right-6 z-[9999]">{open && <div className="mb-4 w-[360px] max-w-[calc(100vw-3rem)] h-[520px] bg-white rounded-3xl shadow-2xl border flex flex-col overflow-hidden"><div className="p-4 bg-primary-600 text-white flex justify-between"><span className="font-black flex gap-2"><Bot /> IASO AI</span><button onClick={() => setOpen(false)}><X /></button></div><div className="flex-1 overflow-auto p-4 bg-gray-50 space-y-3">{messages.map((m, i) => <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}><span className={`inline-block p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white border'}`}>{m.content}</span></div>)}</div><div className="p-3 border-t flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} className="flex-1 bg-gray-50 rounded-xl px-3 outline-none" /><button onClick={send} className="p-3 bg-primary-600 text-white rounded-xl"><Send className="w-4 h-4" /></button></div></div>}<button onClick={() => setOpen(true)} className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-2xl"><MessageCircle /></button></div>;
}
