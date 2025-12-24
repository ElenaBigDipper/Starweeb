
import React, { useState } from 'react';
import { useApp } from '../App';
import { storage } from '../storageService';
import { Photo } from '../types';

const ArtGallery: React.FC = () => {
  const { currentUser } = useApp();
  const [photos, setPhotos] = useState<Photo[]>(storage.getPhotos());
  const [uploadUrl, setUploadUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [album, setAlbum] = useState('General');
  const [showUpload, setShowUpload] = useState(false);

  const handleUpload = () => {
    if (!uploadUrl || !currentUser) return;
    const newPhoto: Photo = {
      id: Date.now().toString(),
      userId: currentUser.id,
      url: uploadUrl,
      caption: caption || 'Untitled',
      album: album || 'General',
      timestamp: Date.now()
    };
    const all = [newPhoto, ...storage.getPhotos()];
    storage.savePhotos(all);
    setPhotos(all);
    setUploadUrl('');
    setCaption('');
    setShowUpload(false);
  };

  return (
    <div className="bg-white border border-violet-100 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="bg-[#2e1065] text-white p-5 flex justify-between items-center">
        <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
          <i className="fa-solid fa-palette text-[#7dd3fc]"></i>
          Visual Archive
        </h2>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          className="bg-[#7dd3fc] text-[#2e1065] px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition shadow-lg active:scale-95"
        >
          {showUpload ? 'Cancel' : 'Add Visual'}
        </button>
      </div>

      {showUpload && (
        <div className="p-8 bg-violet-50 border-b border-violet-100 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Source URL (Image/Art)</label>
            <input 
              type="text" 
              placeholder="https://..." 
              className="w-full p-3 border border-violet-100 rounded-xl text-sm focus:ring-2 focus:ring-[#7dd3fc] outline-none bg-white"
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Archive Set</label>
              <input 
                type="text" 
                placeholder="Ex: Summer Retro" 
                className="w-full p-3 border border-violet-100 rounded-xl text-sm focus:ring-2 focus:ring-[#7dd3fc] outline-none bg-white"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Designation</label>
              <input 
                type="text" 
                placeholder="A cool description" 
                className="w-full p-3 border border-violet-100 rounded-xl text-sm focus:ring-2 focus:ring-[#7dd3fc] outline-none bg-white"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
          <button 
            onClick={handleUpload}
            className="w-full bg-[#2e1065] text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-[#4c1d95] transition shadow-xl"
          >
            Commit to Archive
          </button>
        </div>
      )}

      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
        {photos.length === 0 ? (
          <div className="col-span-full py-24 text-center">
            <i className="fa-solid fa-satellite text-6xl text-violet-50 mb-6 block"></i>
            <p className="text-violet-200 italic font-medium">No visuals archived in this sector.</p>
          </div>
        ) : (
          photos.map(photo => (
            <div key={photo.id} className="group relative border border-violet-50 rounded-2xl shadow-sm overflow-hidden bg-black aspect-square cursor-pointer hover:shadow-xl hover:shadow-[#7dd3fc]/20 transition-all duration-500">
              <img src={photo.url} className="w-full h-full object-cover group-hover:opacity-60 transition-all duration-700 group-hover:scale-110" alt={photo.caption} />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#2e1065] to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[#7dd3fc] text-[10px] font-black uppercase truncate tracking-widest">{photo.caption}</p>
                <p className="text-white text-[8px] uppercase font-bold opacity-60">{photo.album}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArtGallery;
