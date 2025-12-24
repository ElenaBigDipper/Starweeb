
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { storage } from '../storageService';
import { geminiService } from '../geminiService';
import { SecretMessage, User } from '../types';

const SecretAdmirers: React.FC = () => {
  const { currentUser, users, refreshData } = useApp();
  const [notes, setNotes] = useState<SecretMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingTo, setSendingTo] = useState('');

  useEffect(() => {
    if (currentUser) {
      setNotes(storage.getSecrets().filter(s => s.toUserId === currentUser.id));
    }
  }, [currentUser]);

  const requestSecretNote = async () => {
    if (!currentUser || !sendingTo) return;
    setLoading(true);
    
    const targetUser = users.find(u => u.id === sendingTo);
    const targetName = targetUser?.displayName || "someone special";

    const aiNote = await geminiService.generateSecretAdmirerNote(targetName);
    
    const newSecret: SecretMessage = {
      id: Date.now().toString(),
      toUserId: sendingTo,
      content: aiNote,
      timestamp: Date.now(),
      isAI: true
    };

    const all = [newSecret, ...storage.getSecrets()];
    storage.saveSecrets(all);
    
    const notif = {
        id: Date.now().toString() + "-n",
        userId: sendingTo,
        fromUserId: 'system',
        type: 'mention' as const,
        message: 'A secret admirer has sent a resonance to your inbox!',
        timestamp: Date.now(),
        read: false
    };
    storage.saveNotifications([notif, ...storage.getNotifications()]);

    refreshData();
    setLoading(false);
    alert(`AI Secret resonance sent to ${targetName}!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#7dd3fc] p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
        <i className="fa-solid fa-heart absolute -right-6 -bottom-6 text-9xl opacity-10 rotate-12"></i>
        <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3 mb-2">
          <i className="fa-solid fa-mask text-[#7dd3fc]"></i>
          Secret Resonance
        </h2>
        <p className="text-sky-100 opacity-80 font-medium">Send anonymous, poetic, AI-curated notes to your connections. Pure mystery.</p>
      </div>

      <div className="bg-white p-6 border border-violet-100 rounded-2xl shadow-sm">
        <h3 className="font-black text-[#2e1065] uppercase text-xs tracking-[0.2em] mb-4">Send a Cosmic Note</h3>
        <div className="flex gap-4 items-center">
          <select 
            className="flex-1 p-3 border border-violet-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#7dd3fc] bg-violet-50/30 font-bold text-[#4c1d95]"
            value={sendingTo}
            onChange={(e) => setSendingTo(e.target.value)}
          >
            <option value="">Select a receiver...</option>
            {users.filter(u => u.id !== currentUser?.id).map(u => (
              <option key={u.id} value={u.id}>{u.displayName}</option>
            ))}
          </select>
          <button 
            disabled={loading || !sendingTo}
            onClick={requestSecretNote}
            className="bg-[#2e1065] text-[#7dd3fc] px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4c1d95] disabled:opacity-50 transition shadow-lg active:scale-95 whitespace-nowrap"
          >
            {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Initiate Resonance'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-violet-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-[#2e1065] px-6 py-3 font-black text-[#7dd3fc] uppercase text-[10px] tracking-widest">
          My Received Resonances
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.length === 0 ? (
            <div className="col-span-full py-16 text-center">
               <i className="fa-solid fa-heart-crack text-4xl text-violet-50 mb-4 block"></i>
               <p className="text-violet-200 italic font-medium">No secret resonances received in this sector.</p>
            </div>
          ) : (
            notes.map(note => (
              <div key={note.id} className="bg-violet-50/30 border border-violet-100 p-6 rounded-2xl relative overflow-hidden group hover:border-[#7dd3fc] transition-all">
                <i className="fa-solid fa-star-of-david absolute -right-4 -bottom-4 text-violet-100 text-6xl rotate-12 group-hover:scale-125 transition-transform duration-700"></i>
                <div className="relative z-10">
                  <p className="text-[#2e1065] font-black italic text-lg leading-relaxed mb-4">"{note.content}"</p>
                  <div className="flex justify-between items-center mt-6">
                     <span className="text-[8px] bg-white text-violet-300 px-2 py-0.5 rounded font-black uppercase tracking-widest">Received</span>
                     <p className="text-[9px] text-[#7dd3fc] font-bold uppercase">{new Date(note.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretAdmirers;
