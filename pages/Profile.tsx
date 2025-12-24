
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { storage } from '../storageService';
import { AnonymousQuestion, User } from '../types';

const Profile: React.FC = () => {
  const { userId, slug } = useParams<{ userId?: string, slug?: string }>();
  const { users, currentUser, refreshData } = useApp();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState('');
  const [isSent, setIsSent] = useState(false);
  
  // Customization state
  const [isEditingStyles, setIsEditingStyles] = useState(false);
  const [tempCss, setTempCss] = useState('');
  const [tempEmbed, setTempEmbed] = useState('');
  const [tempBio, setTempBio] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const identifier = userId || slug;
  const user = users.find(u => u.id === identifier || (u.customUrl && u.customUrl === identifier));
  const isMe = currentUser?.id === user?.id;

  useEffect(() => {
    if (user?.customCss) {
      const styleTag = document.getElementById('user-profile-css') || document.createElement('style');
      styleTag.id = 'user-profile-css';
      styleTag.innerHTML = user.customCss;
      if (!document.getElementById('user-profile-css')) {
        document.head.appendChild(styleTag);
      }
    }
    return () => {
      const styleTag = document.getElementById('user-profile-css');
      if (styleTag) styleTag.innerHTML = '';
    };
  }, [user?.customCss, user?.id]);

  useEffect(() => {
    if (isMe && user) {
      setTempCss(user.customCss || '');
      setTempEmbed(user.customEmbed || '');
      setTempBio(user.bio || '');
      setTempUrl(user.customUrl || '');
    }
  }, [isMe, user]);

  if (!user) {
    return <div className="p-16 text-center bg-[#120029] rounded-3xl border border-fuchsia-500/20 text-fuchsia-300 italic font-black uppercase text-xs tracking-widest">Identity ghost detected • No match found.</div>;
  }

  const answeredQuestions = storage.getQuestions().filter(q => q.toUserId === user.id && q.answer);

  const handleAsk = () => {
    if (!question.trim()) return;
    const newQ: AnonymousQuestion = {
      id: Date.now().toString(),
      toUserId: user.id,
      question: question.trim(),
      timestamp: Date.now()
    };
    const all = [newQ, ...storage.getQuestions()];
    storage.saveQuestions(all);
    setQuestion('');
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  const saveCustomization = () => {
    // Validate custom URL uniqueness
    const slugRegex = /^[a-zA-Z0-9_-]*$/;
    if (!slugRegex.test(tempUrl)) {
      setUrlError('URL can only contain letters, numbers, underscores, and dashes.');
      return;
    }

    if (tempUrl) {
      const isTaken = users.some(u => u.id !== currentUser?.id && u.customUrl === tempUrl);
      const reserved = ['login', 'terms', 'bulletins', 'forums', 'gallery', 'admirers', 'groups', 'inbox', 'dating', 'profile'];
      if (isTaken || reserved.includes(tempUrl.toLowerCase())) {
        setUrlError('This custom URL is taken or reserved.');
        return;
      }
    }

    setUrlError('');
    const updatedUsers = storage.getUsers().map(u => {
      if (u.id === currentUser?.id) {
        return { 
          ...u, 
          customCss: tempCss, 
          customEmbed: tempEmbed,
          bio: tempBio,
          customUrl: tempUrl
        };
      }
      return u;
    });
    storage.saveUsers(updatedUsers);
    refreshData();
    setIsEditingStyles(false);
    
    // Redirect to the new vanity URL if changed
    if (tempUrl && tempUrl !== user.customUrl) {
      navigate(`/${tempUrl}`);
    }
  };

  return (
    <div className="profile-container space-y-6 animate-in fade-in duration-700">
      {/* Profile Customization Modal */}
      {isEditingStyles && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a001a]/95 backdrop-blur-xl p-4 animate-in zoom-in duration-300">
          <div className="bg-[#120029] w-full max-w-2xl rounded-3xl border border-cyan-400/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-[#bf00ff] to-[#00e5ff] p-6">
              <h2 className="text-2xl font-black italic text-white flex items-center gap-3">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                Customize Identity
              </h2>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto">
              <div>
                <label className="block text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-2">Custom Vanity URL Slug</label>
                <div className="flex items-center bg-[#0a001a] border border-fuchsia-500/20 rounded-2xl px-4 py-3">
                   <span className="text-fuchsia-500/50 text-xs font-bold mr-1">starweeb.com/</span>
                   <input 
                    type="text" 
                    className="bg-transparent border-none outline-none text-cyan-50 flex-1 text-xs font-bold"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="my-cool-name"
                  />
                </div>
                {urlError && <p className="text-red-500 text-[9px] mt-1 font-bold uppercase">{urlError}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-2">Manifesto (Bio)</label>
                <textarea 
                  className="w-full p-4 bg-[#0a001a] border border-fuchsia-500/20 rounded-2xl text-cyan-50 focus:ring-2 focus:ring-[#00e5ff] outline-none h-24"
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  placeholder="Tell the web who you are..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-2">Custom CSS (MySpace Style)</label>
                <textarea 
                  className="w-full p-4 bg-[#0a001a] border border-fuchsia-500/20 rounded-2xl text-cyan-50 font-mono text-xs focus:ring-2 focus:ring-[#00e5ff] outline-none h-32"
                  value={tempCss}
                  onChange={(e) => setTempCss(e.target.value)}
                  placeholder=".profile-container { background: black !important; }"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-2">Embed Code (Music Player / Video)</label>
                <textarea 
                  className="w-full p-4 bg-[#0a001a] border border-fuchsia-500/20 rounded-2xl text-cyan-50 font-mono text-xs focus:ring-2 focus:ring-[#00e5ff] outline-none h-24"
                  value={tempEmbed}
                  onChange={(e) => setTempEmbed(e.target.value)}
                  placeholder="<iframe>...</iframe>"
                />
              </div>
            </div>
            <div className="p-6 bg-[#0a001a] border-t border-fuchsia-500/10 flex gap-4">
              <button 
                onClick={saveCustomization}
                className="flex-1 bg-[#00e5ff] text-[#0a001a] py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:shadow-[#00e5ff]/50 transition-all active:scale-95"
              >
                Sync Changes
              </button>
              <button 
                onClick={() => setIsEditingStyles(false)}
                className="flex-1 bg-fuchsia-950/30 text-fuchsia-400 py-3 rounded-2xl font-black uppercase text-xs tracking-widest border border-fuchsia-500/20 hover:bg-fuchsia-900/40 transition-all"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-[#120029] border border-fuchsia-500/20 rounded-3xl shadow-2xl overflow-hidden profile-header">
        <div 
          className="h-44 bg-gradient-to-r from-[#1a0033] via-[#bf00ff]/40 to-[#00e5ff]/30 relative profile-banner"
        >
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
           <i className="fa-solid fa-star absolute top-6 right-10 text-[#00e5ff]/10 text-[12rem] rotate-12 drop-shadow-[0_0_20px_#00e5ff]"></i>
        </div>
        <div className="p-10 -mt-24 flex flex-col items-center sm:items-start sm:flex-row gap-10 relative profile-info-row">
          <div className="relative group profile-avatar-container">
            <img src={user.avatar} className="w-40 h-40 rounded-3xl border-4 border-[#00e5ff] shadow-[0_0_25px_rgba(0,229,255,0.4)] z-10 bg-[#0a001a] transition-transform duration-500 group-hover:scale-105 profile-avatar-img" alt={user.displayName} />
            <div className="absolute -bottom-3 -right-3 bg-[#bf00ff] p-2 rounded-xl border-2 border-[#120029] text-white text-xs shadow-lg animate-pulse"><i className="fa-solid fa-bolt"></i></div>
          </div>
          <div className="mt-24 sm:mt-16 flex-1 text-center sm:text-left profile-text-group">
            <h1 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_5px_#bf00ff] profile-name">{user.displayName}</h1>
            <p className="text-[#00e5ff] font-black uppercase text-[10px] tracking-[0.4em] mt-2 opacity-80 profile-handle">@{user.username} • Unit Cycle {user.age}</p>
            {user.customUrl && (
              <p className="text-fuchsia-400 font-black uppercase text-[8px] tracking-[0.3em] mt-1 opacity-60">starweeb.com/{user.customUrl}</p>
            )}
            <div className="flex justify-center sm:justify-start gap-10 mt-6 profile-stats">
               <div className="text-center group cursor-pointer">
                 <span className="block font-black text-3xl text-white tracking-tighter group-hover:text-[#bf00ff] transition-colors">{user.friends.length}</span>
                 <span className="text-[9px] uppercase font-black text-fuchsia-400/50 tracking-widest">Resonances</span>
               </div>
               <div className="text-center group cursor-pointer">
                 <span className="block font-black text-3xl text-white tracking-tighter group-hover:text-[#00e5ff] transition-colors">1.2k</span>
                 <span className="text-[9px] uppercase font-black text-fuchsia-400/50 tracking-widest">Profile Scans</span>
               </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:mt-16 w-full sm:w-auto profile-actions">
            {isMe ? (
              <button 
                onClick={() => setIsEditingStyles(true)}
                className="bg-[#bf00ff] text-white border border-fuchsia-400 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-fuchsia-500 transition-all shadow-[0_0_15px_rgba(191,0,255,0.4)] active:scale-95"
              >
                Customize Identity
              </button>
            ) : (
              <>
                <button className="bg-gradient-to-r from-[#bf00ff] to-[#7b00ff] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_#bf00ff] transition-all shadow-lg active:scale-95 border border-white/10">
                  Resonate
                </button>
                <button className="bg-[#120029] text-[#00e5ff] border-2 border-cyan-400/30 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#00e5ff] hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all active:scale-95">
                  Signal
                </button>
              </>
            )}
          </div>
        </div>
        <div className="px-10 pb-10">
          <div className="bg-[#0a001a] p-6 rounded-3xl border-2 border-fuchsia-500/10 border-dashed text-sm text-cyan-50/70 font-bold italic leading-relaxed shadow-inner profile-bio-container">
            "{user.bio}"
          </div>
          {/* User Custom Embed (Music/Video) */}
          {user.customEmbed && (
            <div 
              className="mt-6 profile-embed-container flex justify-center overflow-hidden rounded-2xl bg-black/20 p-2 border border-fuchsia-500/10"
              dangerouslySetInnerHTML={{ __html: user.customEmbed }}
            />
          )}
        </div>
      </div>

      {/* Ask Anonymous Question Form */}
      {!isMe && (
        <div className="bg-[#0a001a] border-2 border-[#00e5ff]/50 rounded-3xl p-8 shadow-[0_0_30px_rgba(0,229,255,0.1)] animate-in slide-in-from-right-8 duration-700 anonymous-box">
          <h3 className="font-black text-[#00e5ff] mb-4 flex items-center gap-3 uppercase text-xs tracking-[0.3em] drop-shadow-[0_0_5px_#00e5ff]">
            <i className="fa-solid fa-user-secret text-fuchsia-500"></i>
            Broadcast Anonymous Signal
          </h3>
          <textarea
            className="w-full p-5 bg-[#120029] border border-cyan-400/20 rounded-2xl text-sm focus:ring-2 focus:ring-[#00e5ff] outline-none min-h-[120px] text-cyan-50 placeholder-cyan-900/40 transition-all shadow-inner"
            placeholder="Encrypted transmission beginning... Speak your truth anonymously."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
               <span className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.2em]">Signal Encrypted</span>
            </div>
            <button
              onClick={handleAsk}
              disabled={isSent}
              className={`px-10 py-3 rounded-2xl text-[#0a001a] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 ${isSent ? 'bg-green-400 text-white shadow-[0_0_15px_#4ade80]' : 'bg-[#00e5ff] hover:bg-white hover:shadow-[0_0_20px_#00e5ff]'}`}
            >
              {isSent ? 'Signal Sent' : 'Relay Pulse'}
            </button>
          </div>
        </div>
      )}

      {/* Answered Questions List */}
      {answeredQuestions.length > 0 && (
        <div className="bg-[#120029] border border-fuchsia-500/20 rounded-3xl shadow-2xl overflow-hidden profile-qa-section">
          <div className="bg-[#0a001a] px-8 py-4 border-b border-fuchsia-500/10 font-black text-[#bf00ff] uppercase text-[10px] tracking-[0.3em] flex items-center gap-3">
             <i className="fa-solid fa-satellite animate-pulse text-[#00e5ff]"></i>
             Archived Signal Interactions
          </div>
          <div className="divide-y divide-fuchsia-500/10">
            {answeredQuestions.map(q => (
              <div key={q.id} className="p-8 space-y-6 hover:bg-[#1a003a] transition-all duration-500 profile-qa-item">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#0a001a] flex items-center justify-center flex-shrink-0 border border-fuchsia-500/20 shadow-lg">
                    <i className="fa-solid fa-user-secret text-fuchsia-600"></i>
                  </div>
                  <div className="flex-1 bg-[#0a001a] p-5 rounded-3xl border border-fuchsia-500/10 text-sm text-cyan-50 font-bold shadow-inner italic leading-relaxed">
                    "{q.question}"
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <div className="flex-1 bg-gradient-to-r from-cyan-950/20 to-[#00e5ff]/10 p-5 rounded-3xl border border-cyan-400/20 text-sm text-[#00e5ff] text-right font-black leading-relaxed shadow-lg">
                    {q.answer}
                  </div>
                  <img src={user.avatar} className="w-12 h-12 rounded-2xl border-2 border-[#00e5ff] flex-shrink-0 shadow-[0_0_10px_#00e5ff]" alt="author" />
                </div>
                <p className="text-[8px] text-fuchsia-900 text-center uppercase font-black tracking-[0.5em] opacity-50">
                  Entanglement established on {new Date(q.answeredAt!).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 profile-lower-grid">
        <div className="bg-[#120029] border border-fuchsia-500/20 rounded-3xl shadow-2xl p-8 profile-box-left">
          <h3 className="font-black text-[#bf00ff] uppercase text-[10px] tracking-[0.3em] border-b border-fuchsia-500/10 pb-4 mb-6">Unit Parameters</h3>
          <ul className="text-sm space-y-5">
            <li className="flex gap-4"><span className="font-black text-fuchsia-900 w-32 text-[9px] uppercase pt-1">Primary Task:</span> <span className="text-cyan-50 font-bold">Retro Coding, Neon Design</span></li>
            <li className="flex gap-4"><span className="font-black text-fuchsia-900 w-32 text-[9px] uppercase pt-1">Audio Sync:</span> <span className="text-cyan-50 font-bold">Synthwave, Cyber-Industrial</span></li>
            <li className="flex gap-4"><span className="font-black text-fuchsia-900 w-32 text-[9px] uppercase pt-1">Visual Log:</span> <span className="text-cyan-50 font-bold">Blade Runner, Tron Legacy</span></li>
            <li className="flex gap-4"><span className="font-black text-fuchsia-900 w-32 text-[9px] uppercase pt-1">Node Friends:</span> <span className="text-cyan-50 font-bold">Tom (Founder), The Grid</span></li>
          </ul>
        </div>
        
        <div className="bg-[#120029] border border-fuchsia-500/20 rounded-3xl shadow-2xl p-8 profile-box-right">
          <h3 className="font-black text-[#bf00ff] uppercase text-[10px] tracking-[0.3em] border-b border-fuchsia-500/10 pb-4 mb-6">Nexus Resonances</h3>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="text-center group cursor-pointer relative">
                <img src={`https://picsum.photos/seed/p${i}/100/100`} className="w-full aspect-square rounded-2xl border border-fuchsia-500/10 shadow-lg group-hover:border-[#00e5ff] group-hover:shadow-[0_0_10px_#00e5ff] transition-all duration-300" alt="friend" />
                <div className="absolute inset-0 bg-[#00e5ff]/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none"></div>
                <p className="text-[9px] font-black text-fuchsia-900 group-hover:text-cyan-400 truncate mt-2 uppercase tracking-tighter transition-colors">Unit {i}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
