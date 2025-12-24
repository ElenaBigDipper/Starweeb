
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { storage } from '../storageService';
import { AnonymousQuestion } from '../types';

const Inbox: React.FC = () => {
  const { currentUser, refreshData } = useApp();
  const [questions, setQuestions] = useState<AnonymousQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser) {
      setQuestions(storage.getQuestions().filter(q => q.toUserId === currentUser.id));
    }
  }, [currentUser]);

  const unanswered = questions.filter(q => !q.answer);
  const answered = questions.filter(q => !!q.answer);

  const handleReply = (qId: string) => {
    const text = answers[qId];
    if (!text?.trim()) return;

    const all = storage.getQuestions().map(q => {
      if (q.id === qId) {
        return {
          ...q,
          answer: text.trim(),
          answeredAt: Date.now()
        };
      }
      return q;
    });

    storage.saveQuestions(all);
    setQuestions(all.filter(q => q.toUserId === currentUser?.id));
    setAnswers(prev => ({ ...prev, [qId]: '' }));
    refreshData();
  };

  const deleteQuestion = (qId: string) => {
    const all = storage.getQuestions().filter(q => q.id !== qId);
    storage.saveQuestions(all);
    setQuestions(all.filter(q => q.toUserId === currentUser?.id));
    refreshData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#2e1065] to-[#0ea5e9] p-8 rounded-2xl shadow-xl text-white">
        <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3 mb-2">
          <i className="fa-solid fa-inbox text-[#7dd3fc]"></i>
          Questions Inbox
        </h2>
        <p className="text-sky-100 opacity-80 font-medium">Handle your anonymous signals here. Replying makes them public on your profile!</p>
      </div>

      <div className="bg-white border border-violet-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-[#2e1065] text-[#7dd3fc] px-6 py-3 font-black uppercase text-xs tracking-[0.2em] flex justify-between items-center">
          <span>Incoming Signals ({unanswered.length})</span>
          <i className="fa-solid fa-satellite-dish animate-pulse"></i>
        </div>
        <div className="p-6 space-y-6">
          {unanswered.length === 0 ? (
            <div className="text-center py-16">
               <i className="fa-solid fa-ghost text-4xl text-violet-50 mb-4 block"></i>
               <p className="text-violet-200 italic font-medium">No signals detected. Ask friends to scan you!</p>
            </div>
          ) : (
            unanswered.map(q => (
              <div key={q.id} className="bg-violet-50/50 border border-violet-100 rounded-2xl p-5 space-y-4 relative group hover:border-[#7dd3fc] transition-all">
                <button 
                  onClick={() => deleteQuestion(q.id)}
                  className="absolute top-4 right-4 text-violet-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Wipe Signal"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-violet-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <i className="fa-solid fa-user-secret text-[#4c1d95]"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-[#2e1065] uppercase tracking-widest mb-1">Anonymous Signal:</p>
                    <p className="text-gray-700 font-medium italic leading-relaxed">"{q.question}"</p>
                    <p className="text-[9px] text-violet-300 mt-2 font-bold uppercase tracking-tighter">{new Date(q.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <input 
                    type="text"
                    placeholder="Relay your response..."
                    className="flex-1 p-3 border border-violet-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#7dd3fc] bg-white transition-all"
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  />
                  <button 
                    onClick={() => handleReply(q.id)}
                    className="bg-[#2e1065] text-[#7dd3fc] px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4c1d95] transition shadow-md active:scale-95"
                  >
                    Relay
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {answered.length > 0 && (
        <div className="bg-white border border-violet-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-violet-50 px-6 py-3 border-b border-violet-100 font-black text-[#2e1065] uppercase text-[10px] tracking-widest">
            Broadcast Archive
          </div>
          <div className="divide-y divide-violet-50">
            {answered.map(q => (
              <div key={q.id} className="p-6 hover:bg-sky-50 transition-colors">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <p className="text-sm font-bold text-[#4c1d95] leading-relaxed italic"><span className="text-violet-300 uppercase text-[9px] block not-italic font-black mb-1">Q:</span> {q.question}</p>
                  <button onClick={() => deleteQuestion(q.id)} className="text-violet-200 hover:text-red-400 transition-colors"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <p className="text-sm text-[#0369a1] border-l-4 border-[#7dd3fc] pl-4 py-1 mt-2 font-medium bg-sky-50/50 rounded-r-lg">
                  <span className="text-[#0ea5e9] uppercase text-[9px] block font-black mb-1">A:</span> {q.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
