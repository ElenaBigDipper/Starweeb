
import React, { useState } from 'react';
import { useApp } from '../App';
import { storage } from '../storageService';
import { ForumThread } from '../types';

const CATEGORIES = ['General', 'Music', 'Coding', 'Gaming', 'Arts', 'Off-Topic'];

const Forums: React.FC = () => {
  const { currentUser, users } = useApp();
  const [forums, setForums] = useState<ForumThread[]>(storage.getForums());
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [category, setCategory] = useState('General');
  const [replyText, setReplyText] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const createThread = () => {
    if (!newTitle || !newContent || !currentUser) return;
    const thread: ForumThread = {
      id: Date.now().toString(),
      title: newTitle,
      category,
      content: newContent,
      authorId: currentUser.id,
      timestamp: Date.now(),
      replies: []
    };
    const all = [thread, ...storage.getForums()];
    storage.saveForums(all);
    setForums(all);
    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
  };

  const postReply = () => {
    if (!replyText || !selectedThread || !currentUser) return;
    const reply = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      content: replyText,
      timestamp: Date.now()
    };
    const all = storage.getForums().map(f => {
      if (f.id === selectedThread.id) {
        return { ...f, replies: [...f.replies, reply] };
      }
      return f;
    });
    storage.saveForums(all);
    setForums(all);
    setSelectedThread({ ...selectedThread, replies: [...selectedThread.replies, reply] });
    setReplyText('');
  };

  const getAuthor = (id: string) => users.find(u => u.id === id);

  if (selectedThread) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <button onClick={() => setSelectedThread(null)} className="text-[#4c1d95] text-sm font-black uppercase tracking-widest hover:text-[#0ea5e9] flex items-center gap-2">
          <i className="fa-solid fa-arrow-left"></i>
          Back to Forums
        </button>
        <div className="bg-white border border-violet-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-[#2e1065] text-[#7dd3fc] p-4 font-black italic text-lg tracking-tighter">
            {selectedThread.title}
          </div>
          <div className="p-6 border-b border-violet-50 bg-violet-50/30 flex gap-6">
            <div className="text-center w-24 flex-shrink-0">
               <img src={getAuthor(selectedThread.authorId)?.avatar} className="w-16 h-16 mx-auto rounded-xl border-2 border-white shadow-sm" alt="author" />
               <p className="text-[10px] font-black text-[#4c1d95] mt-2 truncate uppercase">{getAuthor(selectedThread.authorId)?.displayName}</p>
               <span className="text-[8px] font-bold text-violet-300 uppercase">Original Poster</span>
            </div>
            <div className="flex-1 text-sm text-gray-700">
               <p className="whitespace-pre-wrap leading-relaxed">{selectedThread.content}</p>
               <p className="text-[10px] text-violet-300 mt-6 font-bold uppercase">{new Date(selectedThread.timestamp).toLocaleString()}</p>
            </div>
          </div>
          {selectedThread.replies.map(reply => (
            <div key={reply.id} className="p-6 border-b border-violet-50 flex gap-6 hover:bg-sky-50/20 transition-colors">
              <div className="text-center w-24 flex-shrink-0">
                 <img src={getAuthor(reply.authorId)?.avatar} className="w-12 h-12 mx-auto rounded-lg border-2 border-white shadow-sm" alt="author" />
                 <p className="text-[10px] font-black text-[#4c1d95] mt-2 truncate uppercase">{getAuthor(reply.authorId)?.displayName}</p>
              </div>
              <div className="flex-1 text-sm text-gray-700">
                 <p className="whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                 <p className="text-[10px] text-violet-200 mt-2 font-bold uppercase">{new Date(reply.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
          <div className="p-6 bg-violet-50/50">
            <textarea 
              className="w-full p-4 border border-violet-100 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-[#7dd3fc] outline-none"
              placeholder="Join the discussion..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button 
              onClick={postReply}
              className="mt-3 bg-[#2e1065] text-white px-8 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4c1d95] transition shadow-lg active:scale-95"
            >
              Post Reply
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-violet-100 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="bg-[#2e1065] text-white p-4 flex justify-between items-center">
        <h2 className="font-black italic text-xl tracking-tighter">Community Forums</h2>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-[#7dd3fc] text-[#2e1065] px-6 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition"
        >
          {isCreating ? 'Cancel' : 'New Thread'}
        </button>
      </div>

      {isCreating && (
        <div className="p-6 border-b border-violet-50 bg-violet-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input 
                type="text" 
                placeholder="Thread Title" 
                className="w-full p-3 border border-violet-100 rounded-xl text-sm focus:ring-2 focus:ring-[#7dd3fc] outline-none"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <select 
              className="p-3 border border-violet-100 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#7dd3fc] outline-none font-bold text-violet-700"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea 
            placeholder="What's on your mind?..." 
            className="w-full p-3 border border-violet-100 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-[#7dd3fc] outline-none"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button 
            onClick={createThread}
            className="w-full bg-[#2e1065] text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-[#4c1d95] transition shadow-lg active:scale-95"
          >
            Create Thread
          </button>
        </div>
      )}

      <div className="divide-y divide-violet-50">
        <div className="grid grid-cols-12 bg-violet-50/50 p-3 text-[10px] font-black text-violet-400 uppercase tracking-widest">
          <div className="col-span-7 px-2">Topic</div>
          <div className="col-span-2 text-center">Category</div>
          <div className="col-span-1 text-center">Hits</div>
          <div className="col-span-2 text-right px-2">Recent</div>
        </div>
        {forums.length === 0 ? (
          <p className="p-16 text-center text-violet-200 italic font-medium">The halls are silent. Start the first discussion!</p>
        ) : (
          forums.map(f => (
            <div 
              key={f.id} 
              onClick={() => setSelectedThread(f)}
              className="grid grid-cols-12 p-4 hover:bg-sky-50 cursor-pointer transition-all items-center group"
            >
              <div className="col-span-7 px-2">
                <span className="block font-black text-[#4c1d95] group-hover:text-[#0ea5e9] transition-colors">{f.title}</span>
                <span className="text-[10px] text-violet-300 font-bold uppercase">Signal from {getAuthor(f.authorId)?.displayName}</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-[9px] uppercase font-black px-3 py-1 bg-violet-50 text-violet-400 rounded-full group-hover:bg-[#7dd3fc] group-hover:text-[#2e1065] transition-colors">
                  {f.category}
                </span>
              </div>
              <div className="col-span-1 text-center font-bold text-violet-400">
                {f.replies.length}
              </div>
              <div className="col-span-2 text-right px-2 text-[10px] text-violet-300 font-bold uppercase">
                {new Date(f.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Forums;
