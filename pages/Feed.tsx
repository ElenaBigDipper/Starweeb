
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { storage } from '../storageService';
import { Post, User } from '../types';

const Feed: React.FC = () => {
  const { currentUser, users, refreshData } = useApp();
  const [posts, setPosts] = useState<Post[]>(storage.getPosts());
  const [newPost, setNewPost] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [isBlogMode, setIsBlogMode] = useState(false);

  const handlePost = () => {
    if (!newPost.trim() || !currentUser) return;

    const p: Post = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      content: newPost,
      title: isBlogMode ? postTitle : undefined,
      timestamp: Date.now(),
      likes: [],
      comments: [],
      type: isBlogMode ? 'blog' : 'status'
    };

    const allPosts = [p, ...storage.getPosts()];
    storage.savePosts(allPosts);
    setPosts(allPosts);
    setNewPost('');
    setPostTitle('');
    setIsBlogMode(false);
  };

  const toggleLike = (postId: string) => {
    if (!currentUser) return;
    const allPosts = storage.getPosts().map(p => {
      if (p.id === postId) {
        const likes = p.likes.includes(currentUser.id) 
          ? p.likes.filter(id => id !== currentUser.id)
          : [...p.likes, currentUser.id];
        return { ...p, likes };
      }
      return p;
    });
    storage.savePosts(allPosts);
    setPosts(allPosts);
  };

  const getAuthor = (id: string) => users.find(u => u.id === id);

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-[#120029] p-5 border border-fuchsia-500/20 rounded-2xl shadow-xl">
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setIsBlogMode(false)} 
            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${!isBlogMode ? 'border-[#00e5ff] text-[#00e5ff] drop-shadow-[0_0_5px_#00e5ff]' : 'border-transparent text-fuchsia-400/40 hover:text-fuchsia-400'}`}
          >
            Update Pulse
          </button>
          <button 
            onClick={() => setIsBlogMode(true)} 
            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${isBlogMode ? 'border-[#bf00ff] text-[#bf00ff] drop-shadow-[0_0_5px_#bf00ff]' : 'border-transparent text-fuchsia-400/40 hover:text-fuchsia-400'}`}
          >
            Write Blog Log
          </button>
        </div>
        
        {isBlogMode && (
          <input 
            type="text" 
            placeholder="Log Title..." 
            className="w-full mb-3 p-3 border border-fuchsia-500/10 bg-[#0a001a] rounded-xl focus:ring-2 focus:ring-[#bf00ff] outline-none text-sm font-black text-fuchsia-100 placeholder-fuchsia-900/50"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
        )}

        <textarea 
          placeholder={isBlogMode ? "What's resonating in your sector?" : "Broadcast to the web..."}
          className={`w-full p-4 border rounded-2xl outline-none text-sm min-h-[120px] transition-all bg-[#0a001a] text-cyan-50 ${isBlogMode ? 'border-fuchsia-500/20 focus:ring-2 focus:ring-[#bf00ff]' : 'border-cyan-400/20 focus:ring-2 focus:ring-[#00e5ff]'}`}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-4 text-fuchsia-400/50 text-base ml-2">
            <button className="hover:text-[#00e5ff] transition hover:drop-shadow-[0_0_5px_#00e5ff]"><i className="fa-solid fa-camera"></i></button>
            <button className="hover:text-[#00e5ff] transition hover:drop-shadow-[0_0_5px_#00e5ff]"><i className="fa-solid fa-video"></i></button>
            <button className="hover:text-[#00e5ff] transition hover:drop-shadow-[0_0_5px_#00e5ff]"><i className="fa-solid fa-music"></i></button>
          </div>
          <button 
            onClick={handlePost}
            className={`px-8 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest transition shadow-lg active:scale-95 ${isBlogMode ? 'bg-[#bf00ff] hover:bg-[#d000ff] hover:shadow-[0_0_15px_#bf00ff]' : 'bg-[#00e5ff] text-[#0a001a] hover:bg-cyan-300 hover:shadow-[0_0_15px_#00e5ff]'}`}
          >
            Broadcast
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map(post => {
          const author = getAuthor(post.authorId);
          if (!author) return null;
          return (
            <div key={post.id} className={`bg-[#120029] border rounded-2xl shadow-xl overflow-hidden transition-all hover:border-fuchsia-500/30 ${post.type === 'blog' ? 'border-fuchsia-500/40 border-l-4' : 'border-cyan-400/20'}`}>
              {post.type === 'blog' && (
                <div className="bg-gradient-to-r from-[#bf00ff] to-[#7b00ff] text-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] italic">
                  Critical Blog Signal
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <img src={author.avatar} className="w-11 h-11 rounded-xl shadow-lg border border-fuchsia-500/30" alt={author.displayName} />
                  <div>
                    <h4 className="font-black italic text-cyan-50 hover:text-[#00e5ff] hover:drop-shadow-[0_0_5px_#00e5ff] cursor-pointer transition-all text-lg">{author.displayName}</h4>
                    <p className="text-[10px] text-fuchsia-400/60 font-black uppercase tracking-tighter">{new Date(post.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                
                {post.title && <h3 className="text-xl font-black text-white italic mb-3 drop-shadow-[0_0_2px_#bf00ff]">{post.title}</h3>}
                <p className="text-sm text-cyan-50/80 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                
                <div className="mt-6 pt-4 border-t border-fuchsia-500/10 flex items-center justify-between text-[10px] text-fuchsia-400/50 font-black uppercase tracking-widest">
                  <div className="flex gap-6">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 transition-all ${currentUser && post.likes.includes(currentUser.id) ? 'text-[#00e5ff] drop-shadow-[0_0_5px_#00e5ff]' : 'hover:text-white'}`}
                    >
                      <i className={`fa-solid fa-thumbs-up ${currentUser && post.likes.includes(currentUser.id) ? 'text-[#00e5ff]' : ''}`}></i>
                      {post.likes.length > 0 && post.likes.length} Kudos
                    </button>
                    <button className="flex items-center gap-2 hover:text-white transition-all">
                      <i className="fa-solid fa-comment"></i>
                      Link
                    </button>
                    <button className="flex items-center gap-2 hover:text-white transition-all">
                      <i className="fa-solid fa-share"></i>
                      Relay
                    </button>
                  </div>
                  <button className="text-fuchsia-900 hover:text-red-500 transition-all"><i className="fa-solid fa-flag"></i></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Feed;
