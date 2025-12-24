
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { storage } from '../storageService';
import { User, DatingCrush, Match, Notification } from '../types';
import { Link } from 'react-router-dom';

const Dating: React.FC = () => {
  const { currentUser, setCurrentUser, users, refreshData } = useApp();
  const [activeTab, setActiveTab] = useState<'discover' | 'matches'>('discover');
  const [crushes, setCrushes] = useState<DatingCrush[]>(storage.getCrushes());
  const [matches, setMatches] = useState<Match[]>(storage.getMatches());
  const [datingUsers, setDatingUsers] = useState<User[]>([]);
  const [justMatched, setJustMatched] = useState<User | null>(null);

  useEffect(() => {
    const candidates = users.filter(u => u.id !== currentUser?.id && u.age >= 18);
    setDatingUsers(candidates);
  }, [users, currentUser]);

  if (!currentUser) return null;

  if (currentUser.age < 18) {
    return (
      <div className="bg-[#120029] border border-fuchsia-500/20 rounded-3xl shadow-2xl p-12 text-center space-y-6">
        <div className="text-8xl text-fuchsia-900/30 mb-4 animate-pulse">
          <i className="fa-solid fa-lock"></i>
        </div>
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Neon Restricted Space</h2>
        <p className="text-fuchsia-400/70 max-w-md mx-auto text-sm">
          StarCrossed protocols are strictly enforced for adult units only. Your current cycle count does not permit entry. 
          Return when your hardware matures!
        </p>
        <Link to="/" className="inline-block bg-gradient-to-r from-[#bf00ff] to-[#7b00ff] text-white px-10 py-3 rounded-2xl font-black uppercase text-xs hover:shadow-[0_0_15px_#bf00ff] transition-all">Abort & Return</Link>
      </div>
    );
  }

  const handleCrush = (targetId: string) => {
    const existing = crushes.find(c => c.fromId === currentUser.id && c.toId === targetId);
    if (existing) return;

    const newCrush: DatingCrush = { fromId: currentUser.id, toId: targetId, timestamp: Date.now() };
    const allCrushes = [...crushes, newCrush];
    storage.saveCrushes(allCrushes);
    setCrushes(allCrushes);

    const mutual = crushes.find(c => c.fromId === targetId && c.toId === currentUser.id);
    if (mutual) {
      const newMatch: Match = {
        id: Date.now().toString(),
        userIds: [currentUser.id, targetId],
        timestamp: Date.now()
      };
      const allMatches = [...matches, newMatch];
      storage.saveMatches(allMatches);
      setMatches(allMatches);

      const target = users.find(u => u.id === targetId);
      setJustMatched(target || null);

      const notif: Notification = {
        id: Date.now().toString() + "-m",
        userId: currentUser.id,
        fromUserId: targetId,
        type: 'match',
        message: `Cosmic Resonance Found! You and ${target?.displayName} are in sync.`,
        timestamp: Date.now(),
        read: false
      };
      storage.saveNotifications([notif, ...storage.getNotifications()]);
      refreshData();
    }
  };

  const getMatchUser = (match: Match) => {
    const otherId = match.userIds.find(id => id !== currentUser.id);
    return users.find(u => u.id === otherId);
  };

  const myMatches = matches.filter(m => m.userIds.includes(currentUser.id));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Brand Header */}
      <div className="bg-gradient-to-br from-[#1a003a] via-[#4c1d95] to-[#00e5ff]/20 p-10 rounded-3xl shadow-[0_0_30px_rgba(191,0,255,0.2)] text-white relative overflow-hidden border border-fuchsia-500/20">
        <i className="fa-solid fa-star-and-crescent absolute -right-10 -bottom-10 text-[12rem] opacity-5 rotate-12 text-cyan-400"></i>
        <h2 className="text-5xl font-black italic tracking-tighter flex items-center gap-4">
          <span className="bg-gradient-to-r from-[#bf00ff] to-[#00e5ff] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(191,0,255,0.5)]">StarCrossed</span>
          <span className="text-[10px] bg-cyan-400 text-[#0a001a] px-3 py-1 rounded-full not-italic font-black tracking-widest uppercase shadow-[0_0_8px_#00e5ff]">Nexus Verified</span>
        </h2>
        <p className="mt-4 text-cyan-100/70 font-bold uppercase text-[10px] tracking-[0.3em]">Quantum entanglement for the modern unit.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#120029] border border-fuchsia-500/20 rounded-2xl overflow-hidden shadow-2xl">
        <button 
          onClick={() => setActiveTab('discover')}
          className={`flex-1 py-5 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 ${activeTab === 'discover' ? 'bg-[#bf00ff] text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]' : 'text-fuchsia-400/40 hover:bg-fuchsia-500/5'}`}
        >
          <i className="fa-solid fa-wand-magic-sparkles text-[#00e5ff]"></i>
          Scan Pool
        </button>
        <button 
          onClick={() => setActiveTab('matches')}
          className={`flex-1 py-5 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 ${activeTab === 'matches' ? 'bg-[#00e5ff] text-[#0a001a] shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]' : 'text-fuchsia-400/40 hover:bg-fuchsia-500/5'}`}
        >
          <i className="fa-solid fa-bolt-lightning text-[#bf00ff]"></i>
          Resonances ({myMatches.length})
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'discover' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {datingUsers.length === 0 ? (
              <div className="col-span-full py-24 text-center bg-[#120029] border border-fuchsia-500/10 rounded-3xl">
                <i className="fa-solid fa-satellite text-6xl text-fuchsia-900/20 mb-6 block animate-bounce"></i>
                <p className="text-fuchsia-500/40 italic font-black uppercase text-xs tracking-widest">Scanning sector... No compatible hardware found.</p>
              </div>
            ) : (
              datingUsers.map(user => {
                const hasCrushed = crushes.some(c => c.fromId === currentUser.id && c.toId === user.id);
                return (
                  <div key={user.id} className="bg-[#120029] border border-fuchsia-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-[#00e5ff]/10 hover:border-[#00e5ff]/40 transition-all duration-500 flex flex-col group relative">
                    <div className="relative aspect-[4/5] overflow-hidden">
                       <img src={user.avatar} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000 grayscale-[0.5] group-hover:grayscale-0" alt={user.displayName} />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#0a001a] via-transparent to-transparent opacity-80"></div>
                       <div className="absolute bottom-0 inset-x-0 p-8 text-white">
                         <h3 className="text-3xl font-black italic tracking-tighter drop-shadow-[0_0_5px_#bf00ff]">{user.displayName}, {user.age}</h3>
                         <p className="text-xs text-[#00e5ff] font-black uppercase tracking-widest mt-2 bg-black/40 inline-block px-2 py-1 rounded backdrop-blur-sm">{user.bio}</p>
                       </div>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-6 mt-auto bg-[#120029]">
                       <button 
                        className="bg-fuchsia-950/30 text-fuchsia-700 py-4 rounded-2xl hover:bg-fuchsia-900/50 hover:text-fuchsia-500 transition-all active:scale-90 border border-fuchsia-500/10"
                        title="Skip Unit"
                       >
                         <i className="fa-solid fa-xmark text-2xl"></i>
                       </button>
                       <button 
                        disabled={hasCrushed}
                        onClick={() => handleCrush(user.id)}
                        className={`py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 border border-white/10 ${hasCrushed ? 'bg-cyan-900/20 text-[#00e5ff]/40 cursor-not-allowed' : 'bg-[#bf00ff] text-white hover:bg-[#d000ff] hover:shadow-[0_0_20px_#bf00ff]'}`}
                       >
                         <i className={`fa-solid ${hasCrushed ? 'fa-check' : 'fa-star-of-david'} text-2xl ${!hasCrushed ? 'animate-pulse text-[#00e5ff]' : ''}`}></i>
                         <span className="font-black uppercase text-[10px] tracking-widest">{hasCrushed ? 'Locked' : 'Sync'}</span>
                       </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-6">
             {myMatches.length === 0 ? (
               <div className="py-24 text-center bg-[#120029] border border-fuchsia-500/10 rounded-3xl italic text-fuchsia-800 font-black uppercase text-xs tracking-widest">
                 The quantum field is empty... Broadcast more signals!
               </div>
             ) : (
               myMatches.map(m => {
                 const u = getMatchUser(m);
                 if (!u) return null;
                 return (
                   <div key={m.id} className="bg-[#120029] border border-fuchsia-500/20 p-6 rounded-3xl flex items-center gap-6 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-all hover:border-[#00e5ff]/50 group">
                     <div className="relative">
                        <img src={u.avatar} className="w-24 h-24 rounded-2xl border-2 border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.3)] group-hover:rotate-3 transition-transform" alt={u.displayName} />
                        <div className="absolute -top-2 -right-2 bg-[#bf00ff] text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg animate-bounce">SYNC</div>
                     </div>
                     <div className="flex-1">
                        <h4 className="font-black text-2xl italic text-white group-hover:text-[#00e5ff] transition-colors tracking-tighter">{u.displayName}</h4>
                        <p className="text-[10px] text-fuchsia-400 font-black uppercase tracking-widest mt-1">Established on {new Date(m.timestamp).toLocaleDateString()}</p>
                        <div className="mt-3 flex gap-2">
                           <span className="text-[8px] bg-fuchsia-500/10 text-fuchsia-400 px-3 py-1 rounded-full border border-fuchsia-500/20 font-black uppercase tracking-widest">Resonating Level 10</span>
                        </div>
                     </div>
                     <Link to={`/profile/${u.id}`} className="bg-gradient-to-r from-[#bf00ff] to-[#7b00ff] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:shadow-[#bf00ff]/50 transition-all border border-white/10">
                        Initiate Link
                     </Link>
                   </div>
                 );
               })
             )}
          </div>
        )}
      </div>

      {/* Match Modal */}
      {justMatched && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a001a]/95 backdrop-blur-xl p-4 animate-in fade-in zoom-in duration-500">
          <div className="bg-[#120029] max-w-sm w-full rounded-[3rem] overflow-hidden shadow-[0_0_60px_rgba(0,229,255,0.3)] relative border border-cyan-400/30">
             <div className="bg-gradient-to-b from-[#bf00ff]/30 to-transparent py-20 flex justify-center items-center gap-6 overflow-hidden relative">
               <div className="absolute top-0 inset-x-0 h-full opacity-40 pointer-events-none">
                 {[...Array(20)].map((_, i) => (
                   <i key={i} className="fa-solid fa-star absolute text-[#00e5ff] animate-ping" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, fontSize: `${Math.random()*15 + 5}px`, animationDelay: `${Math.random()*3}s` }}></i>
                 ))}
               </div>
               <div className="relative">
                 <img src={currentUser.avatar} className="w-24 h-24 rounded-3xl border-4 border-[#00e5ff] shadow-[0_0_20px_#00e5ff] relative z-10 grayscale group-hover:grayscale-0 transition-all" alt="me" />
                 <div className="absolute -bottom-3 -right-3 bg-white rounded-full px-2 py-0.5 text-[#0a001a] text-[9px] font-black uppercase z-20 shadow-lg">Source</div>
               </div>
               <i className="fa-solid fa-bolt-lightning text-5xl text-[#00e5ff] animate-pulse z-10 drop-shadow-[0_0_10px_#00e5ff]"></i>
               <div className="relative">
                 <img src={justMatched.avatar} className="w-24 h-24 rounded-3xl border-4 border-[#bf00ff] shadow-[0_0_20px_#bf00ff] relative z-10" alt="match" />
                 <div className="absolute -bottom-3 -left-3 bg-white rounded-full px-2 py-0.5 text-[#0a001a] text-[9px] font-black uppercase z-20 shadow-lg">Target</div>
               </div>
             </div>
             <div className="p-10 text-center space-y-6">
                <h3 className="text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_#00e5ff]">Nexus Sync!</h3>
                <p className="text-cyan-100/60 text-sm font-bold leading-relaxed">Identity <strong>{justMatched.displayName}</strong> matches your resonance frequency. Finalize entanglement?</p>
                <div className="pt-6 flex flex-col gap-4">
                   <button 
                    onClick={() => setJustMatched(null)}
                    className="bg-[#00e5ff] text-[#0a001a] py-4 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-[0_0_25px_#00e5ff] hover:bg-white transition-all active:scale-95"
                   >
                     Initiate Link
                   </button>
                   <button 
                    onClick={() => setJustMatched(null)}
                    className="text-fuchsia-400 text-[10px] font-black uppercase tracking-widest py-2 transition hover:text-[#00e5ff] opacity-60"
                   >
                     Stay in Orbit
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dating;
