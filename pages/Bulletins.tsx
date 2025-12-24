
import React, { useState } from 'react';
import { useApp } from '../App';
import { storage } from '../storageService';
import { Bulletin } from '../types';

const Bulletins: React.FC = () => {
  const { currentUser, users } = useApp();
  const [bulletins, setBulletins] = useState<Bulletin[]>(storage.getBulletins());
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  const postBulletin = () => {
    if (!topic || !content || !currentUser) return;
    const b: Bulletin = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      topic,
      content,
      timestamp: Date.now()
    };
    const all = [b, ...storage.getBulletins()];
    storage.saveBulletins(all);
    setBulletins(all);
    setTopic('');
    setContent('');
    setShowForm(false);
  };

  return (
    <div className="bg-white border border-violet-100 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-[#2e1065] text-white p-4 flex justify-between items-center">
        <h2 className="font-bold flex items-center gap-2">
          <i className="fa-solid fa-bullhorn text-[#7dd3fc]"></i>
          Global Bulletins
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#7dd3fc] text-[#2e1065] px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white transition"
        >
          {showForm ? 'Cancel' : 'New Bulletin'}
        </button>
      </div>

      {showForm && (
        <div className="p-6 border-b border-violet-50 bg-violet-50 space-y-3">
          <input 
            type="text" 
            placeholder="Topic of Broadcast" 
            className="w-full p-3 border border-violet-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#7dd3fc] bg-white"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <textarea 
            placeholder="Your message to the universe..." 
            className="w-full p-3 border border-violet-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#7dd3fc] min-h-[100px] bg-white"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button 
            onClick={postBulletin}
            className="w-full bg-[#2e1065] text-white py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#4c1d95] transition shadow-md"
          >
            Broadcast Signal
          </button>
        </div>
      )}

      <div className="divide-y divide-violet-50 text-sm">
        <div className="grid grid-cols-12 bg-violet-50/50 p-3 font-bold text-violet-400 uppercase text-[10px] tracking-widest border-b border-violet-50">
          <div className="col-span-3">From</div>
          <div className="col-span-6">Topic</div>
          <div className="col-span-3 text-right">Date</div>
        </div>
        {bulletins.length === 0 ? (
          <p className="p-12 text-center text-violet-200 italic">No broadcasts recorded in this sector.</p>
        ) : (
          bulletins.map(b => {
            const author = users.find(u => u.id === b.authorId);
            return (
              <div key={b.id} className="grid grid-cols-12 p-4 hover:bg-sky-50 transition-colors group cursor-default">
                <div className="col-span-3 font-bold text-[#4c1d95] truncate pr-4">
                  {author?.displayName || 'Unknown'}
                </div>
                <div className="col-span-6">
                  <span className="font-bold text-[#2e1065] block group-hover:text-[#0ea5e9] transition-colors">{b.topic}</span>
                  <p className="text-gray-500 text-xs whitespace-pre-wrap mt-1 opacity-80">{b.content}</p>
                </div>
                <div className="col-span-3 text-right text-[10px] text-violet-300 font-bold">
                  {new Date(b.timestamp).toLocaleDateString()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Bulletins;
