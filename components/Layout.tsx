
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { storage } from '../storageService';

const Layout: React.FC = () => {
  const { currentUser, setCurrentUser, notifications, refreshData } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const handleExport = () => {
    const data = storage.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `starweeb_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (storage.importAllData(content)) {
        alert("Resilience sync successful! Application state restored.");
        refreshData();
        window.location.reload();
      } else {
        alert("Failed to restore state. Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const unreadNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;
  const unansweredQuestions = storage.getQuestions().filter(q => q.toUserId === currentUser?.id && !q.answer).length;

  const profileLink = currentUser?.customUrl ? `/${currentUser.customUrl}` : `/profile/${currentUser?.id}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#0a001a] text-gray-200">
      {/* Header */}
      <header className="bg-[#120029] border-b border-fuchsia-500/30 text-white shadow-[0_0_15px_rgba(191,0,255,0.2)] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-2 group">
            <i className="fa-solid fa-star text-[#00e5ff] drop-shadow-[0_0_8px_#00e5ff] group-hover:rotate-180 transition-transform duration-500"></i>
            <span className="bg-gradient-to-r from-[#bf00ff] to-[#00e5ff] bg-clip-text text-transparent italic">Starweeb</span>
          </Link>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search the neon web..." 
                className="w-full bg-[#1a003a] border border-fuchsia-900/50 rounded-full py-1.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00e5ff] placeholder-fuchsia-300/30 text-cyan-50 shadow-inner"
              />
              <i className="fa-solid fa-magnifying-glass absolute right-4 top-2.5 text-fuchsia-500/50"></i>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" title="Home" className="text-fuchsia-400 hover:text-[#00e5ff] transition drop-shadow-[0_0_2px_rgba(191,0,255,0.5)]"><i className="fa-solid fa-house"></i></Link>
            <Link to="/bulletins" title="Bulletins" className="text-fuchsia-400 hover:text-[#00e5ff] transition drop-shadow-[0_0_2px_rgba(191,0,255,0.5)]"><i className="fa-solid fa-newspaper"></i></Link>
            <Link to="/forums" title="Forums" className="text-fuchsia-400 hover:text-[#00e5ff] transition drop-shadow-[0_0_2px_rgba(191,0,255,0.5)]"><i className="fa-solid fa-comments"></i></Link>
            <Link to="/gallery" title="Gallery" className="text-fuchsia-400 hover:text-[#00e5ff] transition drop-shadow-[0_0_2px_rgba(191,0,255,0.5)]"><i className="fa-solid fa-image"></i></Link>
            <Link to="/inbox" title="Inbox" className="relative text-fuchsia-400 hover:text-[#00e5ff] transition drop-shadow-[0_0_2px_rgba(191,0,255,0.5)]">
              <i className="fa-solid fa-envelope"></i>
              {unansweredQuestions > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#00e5ff] text-[#0a001a] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_8px_#00e5ff]">
                  {unansweredQuestions}
                </span>
              )}
            </Link>
            <Link to="/dating" title="StarCrossed Dating" className="text-[#00e5ff] hover:text-white transition drop-shadow-[0_0_5px_#00e5ff]">
              <i className="fa-solid fa-heart-pulse"></i>
            </Link>
            <Link to="/admirers" title="Secret Admirers" className="relative text-fuchsia-400 hover:text-[#00e5ff] transition drop-shadow-[0_0_2px_rgba(191,0,255,0.5)]">
              <i className="fa-solid fa-heart"></i>
              {unreadNotifs > 0 && (
                <span className="absolute -top-2 -right-2 bg-fuchsia-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_8px_#bf00ff]">
                  {unreadNotifs}
                </span>
              )}
            </Link>
            <Link to={profileLink} className="flex items-center gap-2 hover:underline">
              <img src={currentUser?.avatar} className="w-7 h-7 rounded-full border border-[#00e5ff] shadow-[0_0_5px_#00e5ff]" alt="me" />
              <span className="hidden lg:inline text-cyan-100">{currentUser?.displayName}</span>
            </Link>
            <button onClick={handleLogout} className="text-fuchsia-300 hover:text-[#00e5ff] transition text-xs font-black uppercase">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <aside className="hidden md:block md:col-span-3 space-y-4">
          <div className="bg-[#120029] p-4 border border-fuchsia-500/20 shadow-lg rounded-2xl">
            <h3 className="font-black text-[#bf00ff] uppercase text-xs tracking-widest mb-3 border-b border-fuchsia-500/20 pb-1">Nexus Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-cyan-100/70 hover:text-[#00e5ff] hover:drop-shadow-[0_0_3px_#00e5ff] transition flex items-center gap-2"><i className="fa-solid fa-rss text-fuchsia-500 w-5"></i> Post Feed</Link></li>
              <li><Link to="/dating" className="text-[#00e5ff] font-bold hover:drop-shadow-[0_0_5px_#00e5ff] transition flex items-center gap-2"><i className="fa-solid fa-heart-pulse text-cyan-400 w-5"></i> StarCrossed (18+)</Link></li>
              <li><Link to="/inbox" className="text-cyan-100/70 hover:text-[#00e5ff] transition flex items-center gap-2"><i className="fa-solid fa-inbox text-fuchsia-500 w-5"></i> Question Box</Link></li>
              <li><Link to="/bulletins" className="text-cyan-100/70 hover:text-[#00e5ff] transition flex items-center gap-2"><i className="fa-solid fa-bullhorn text-fuchsia-500 w-5"></i> Bulletins</Link></li>
              <li><Link to="/gallery" className="text-cyan-100/70 hover:text-[#00e5ff] transition flex items-center gap-2"><i className="fa-solid fa-images text-fuchsia-500 w-5"></i> Art Gallery</Link></li>
              <li><Link to="/groups" className="text-cyan-100/70 hover:text-[#00e5ff] transition flex items-center gap-2"><i className="fa-solid fa-users text-fuchsia-500 w-5"></i> Groups</Link></li>
              <li><Link to="/forums" className="text-cyan-100/70 hover:text-[#00e5ff] transition flex items-center gap-2"><i className="fa-solid fa-table-list text-fuchsia-500 w-5"></i> Forums</Link></li>
            </ul>
          </div>

          <div className="bg-[#120029] p-4 border border-[#00e5ff]/20 shadow-lg rounded-2xl">
            <h3 className="font-black text-[#00e5ff] uppercase text-xs tracking-widest mb-3 border-b border-[#00e5ff]/20 pb-1 flex items-center gap-2">
              <i className="fa-solid fa-shield-halved"></i>
              Resilience Hub
            </h3>
            <p className="text-[10px] text-cyan-50/50 mb-3 uppercase font-bold leading-tight">Data is stored in your local shell. Secure it via export.</p>
            <div className="space-y-2">
              <button 
                onClick={handleExport}
                className="w-full bg-[#0a001a] border border-[#00e5ff]/30 text-cyan-400 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00e5ff] hover:text-[#0a001a] transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-file-export"></i>
                Export Backup
              </button>
              <label className="w-full bg-[#0a001a] border border-[#bf00ff]/30 text-[#bf00ff] py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#bf00ff] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
                <i className="fa-solid fa-file-import"></i>
                Restore State
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>

          <div className="bg-[#120029] p-4 border border-fuchsia-500/20 shadow-lg rounded-2xl">
            <h3 className="font-black text-[#bf00ff] uppercase text-xs tracking-widest mb-3 border-b border-fuchsia-500/20 pb-1">Pulse Count</h3>
            <div className="text-center py-4 bg-[#1a003a] border border-fuchsia-500/10 border-dashed rounded-xl">
              <span className="text-4xl font-black text-[#00e5ff] drop-shadow-[0_0_8px_#00e5ff]">1,248</span>
              <p className="text-[10px] text-fuchsia-400 uppercase font-black mt-2 tracking-tighter opacity-70">Total Profile Scans</p>
            </div>
          </div>
        </aside>

        {/* Center Feed */}
        <section className="col-span-1 md:col-span-6 space-y-6">
          <Outlet />
        </section>

        {/* Right Sidebar */}
        <aside className="hidden md:block md:col-span-3 space-y-4">
          <div className="bg-[#120029] p-4 border border-fuchsia-500/20 shadow-lg rounded-2xl">
            <h3 className="font-black text-[#bf00ff] uppercase text-xs tracking-widest mb-3 border-b border-fuchsia-500/20 pb-1">Hot Signals</h3>
            <div className="space-y-3">
              <div className="bg-[#1a003a] p-3 rounded-xl border border-cyan-400/20 hover:border-cyan-400/50 transition">
                <p className="font-black text-[#00e5ff] text-[10px] uppercase tracking-widest mb-1">StarCrossed Active</p>
                <p className="text-cyan-50/70 text-xs">Find your neon resonance. Now open for 18+ units.</p>
                <Link to="/dating" className="text-[#bf00ff] font-black uppercase text-[9px] underline block mt-2 hover:text-[#00e5ff]">Connect now &raquo;</Link>
              </div>
            </div>
          </div>

          <div className="bg-[#120029] p-4 border border-fuchsia-500/20 shadow-lg rounded-2xl">
            <h3 className="font-black text-[#bf00ff] uppercase text-xs tracking-widest mb-3 border-b border-fuchsia-500/20 pb-1">My Top Units</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="text-center group cursor-pointer">
                  <img src={`https://picsum.photos/seed/${i + 15}/100/100`} className="w-full aspect-square border border-fuchsia-500/20 rounded-lg group-hover:border-[#00e5ff] transition-all shadow-sm" alt="unit" />
                  <p className="text-[9px] text-fuchsia-300 truncate mt-1 uppercase font-bold group-hover:text-cyan-300">Unit {i}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <footer className="bg-[#0a001a] border-t border-fuchsia-500/20 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-[10px] text-fuchsia-400/50 space-y-3 uppercase font-black tracking-widest">
          <div className="flex justify-center gap-6 text-fuchsia-400">
            <Link to="/" className="hover:text-[#00e5ff] transition">Manifesto</Link>
            <Link to="/terms" className="hover:text-[#00e5ff] transition">Protocols</Link>
            <Link to="/" className="hover:text-[#00e5ff] transition">Encryption</Link>
            <Link to="/" className="hover:text-[#00e5ff] transition">Neutrality</Link>
            <Link to="/" className="hover:text-[#00e5ff] transition">Support</Link>
          </div>
          <p className="opacity-30">&copy; 2025 Starweeb. Powered by Neon & Dark Matter.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
