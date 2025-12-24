
import React, { useState } from 'react';
import { useApp } from '../App';
import { storage } from '../storageService';
import { User } from '../types';

const Login: React.FC = () => {
  const { setCurrentUser, refreshData } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState<number>(18);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();

    if (isLogin) {
      const found = users.find(u => u.username === username || u.email === username);
      if (found) {
        setCurrentUser(found);
        refreshData();
      } else {
        alert("User account not found. Please create a new identity.");
      }
    } else {
      if (!username || !email || !displayName || !age) {
        alert("All identity fields must be populated.");
        return;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        displayName,
        age: Number(age),
        bio: 'Just another soul in the Starweeb network.',
        avatar: `https://picsum.photos/seed/${username}/200/200`,
        profileColor: '#bf00ff',
        friends: [],
        following: []
      };

      storage.saveUsers([...users, newUser]);
      setCurrentUser(newUser);
      refreshData();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050010] p-4 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#bf00ff] rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00e5ff] rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="mb-12 text-center relative z-10">
        <h1 className="text-7xl font-black text-white tracking-tighter italic flex items-center justify-center gap-4">
          <i className="fa-solid fa-star text-[#00e5ff] drop-shadow-[0_0_15px_#00e5ff]"></i>
          <span className="bg-gradient-to-r from-[#bf00ff] to-[#00e5ff] bg-clip-text text-transparent">Starweeb</span>
        </h1>
        <p className="text-cyan-400 font-black uppercase text-xs tracking-[0.4em] mt-4 opacity-80 animate-pulse">Reconnect with your web • v2.0</p>
      </div>

      <div className="bg-[#120029]/80 backdrop-blur-xl w-full max-w-md p-10 border border-fuchsia-500/30 rounded-3xl shadow-[0_0_40px_rgba(191,0,255,0.15)] relative z-10">
        <div className="flex border-b border-fuchsia-500/10 mb-8">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 font-black uppercase text-xs tracking-widest transition-all ${isLogin ? 'text-[#00e5ff] border-b-2 border-[#00e5ff] drop-shadow-[0_0_5px_#00e5ff]' : 'text-fuchsia-300/40 hover:text-fuchsia-300'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 font-black uppercase text-xs tracking-widest transition-all ${!isLogin ? 'text-[#00e5ff] border-b-2 border-[#00e5ff] drop-shadow-[0_0_5px_#00e5ff]' : 'text-fuchsia-300/40 hover:text-fuchsia-300'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-1.5 ml-1">Identity Tag (Display Name)</label>
                <input 
                  type="text" 
                  className="w-full p-3.5 bg-[#0a001a] border border-fuchsia-500/20 rounded-2xl outline-none focus:ring-2 focus:ring-[#00e5ff] text-cyan-50 transition-all placeholder-fuchsia-900/40"
                  placeholder="NeonDreamer"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-1.5 ml-1">Unit Age</label>
                <input 
                  type="number" 
                  min="13"
                  className="w-full p-3.5 bg-[#0a001a] border border-fuchsia-500/20 rounded-2xl outline-none focus:ring-2 focus:ring-[#00e5ff] text-cyan-50 transition-all placeholder-fuchsia-900/40"
                  placeholder="18"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-1.5 ml-1">Username or Email</label>
            <input 
              type="text" 
              className="w-full p-3.5 bg-[#0a001a] border border-fuchsia-500/20 rounded-2xl outline-none focus:ring-2 focus:ring-[#00e5ff] text-cyan-50 transition-all placeholder-fuchsia-900/40"
              placeholder="user_unit_001"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-1.5 ml-1">Digital Mail (Email)</label>
              <input 
                type="email" 
                className="w-full p-3.5 bg-[#0a001a] border border-fuchsia-500/20 rounded-2xl outline-none focus:ring-2 focus:ring-[#00e5ff] text-cyan-50 transition-all placeholder-fuchsia-900/40"
                placeholder="unit@starweeb.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-fuchsia-400 uppercase tracking-widest mb-1.5 ml-1">Encryption Key (Password)</label>
            <input 
              type="password" 
              className="w-full p-3.5 bg-[#0a001a] border border-fuchsia-500/20 rounded-2xl outline-none focus:ring-2 focus:ring-[#00e5ff] text-cyan-50 transition-all placeholder-fuchsia-900/40"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-[#bf00ff] to-[#7b00ff] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.25em] hover:shadow-[0_0_25px_#bf00ff] transition-all duration-300 mt-6 active:scale-95 border border-white/10"
          >
            {isLogin ? 'Initiate Link' : 'Forge Identity'}
          </button>
        </form>

        {isLogin && (
          <div className="mt-8 text-center">
            <a href="#" className="text-cyan-400/50 hover:text-cyan-400 transition text-[10px] font-black uppercase tracking-widest">Forgot encryption?</a>
          </div>
        )}
      </div>

      <p className="mt-12 text-[9px] text-fuchsia-400/30 text-center max-w-sm font-black uppercase tracking-widest leading-relaxed">
        By connecting, you agree to the <a href="#/terms" className="text-cyan-400 underline hover:text-cyan-200">Starweeb Protocols</a>. Data is locally encrypted in your browser shell.
      </p>
    </div>
  );
};

export default Login;
