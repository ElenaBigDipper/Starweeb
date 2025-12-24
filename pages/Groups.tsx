
import React, { useState } from 'react';
import { useApp } from '../App';
import { storage } from '../storageService';
import { Group } from '../types';

const DEFAULT_GROUPS: Group[] = [
  { id: 'g1', name: 'Synthwave Lovers', description: 'Neon lights and 80s beats.', ownerId: 'sys', members: [], imageUrl: 'https://picsum.photos/seed/synth/300/200' },
  { id: 'g2', name: 'Web Dev 1.0', description: 'Building the web like it is 1999.', ownerId: 'sys', members: [], imageUrl: 'https://picsum.photos/seed/code/300/200' },
  { id: 'g3', name: 'Top 8 Exchange', description: 'Who is on your list today?', ownerId: 'sys', members: [], imageUrl: 'https://picsum.photos/seed/friends/300/200' },
];

const Groups: React.FC = () => {
  const { currentUser } = useApp();
  const [groups, setGroups] = useState<Group[]>(storage.getGroups().length ? storage.getGroups() : DEFAULT_GROUPS);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const createGroup = () => {
    if (!name || !currentUser) return;
    const g: Group = {
      id: Date.now().toString(),
      name,
      description: desc,
      ownerId: currentUser.id,
      members: [currentUser.id],
      imageUrl: `https://picsum.photos/seed/${name}/300/200`
    };
    const all = [...groups, g];
    storage.saveGroups(all);
    setGroups(all);
    setShowCreate(false);
    setName('');
    setDesc('');
  };

  const joinGroup = (id: string) => {
    if (!currentUser) return;
    const all = groups.map(g => {
      if (g.id === id && !g.members.includes(currentUser.id)) {
        return { ...g, members: [...g.members, currentUser.id] };
      }
      return g;
    });
    storage.saveGroups(all);
    setGroups(all);
  };

  return (
    <div className="bg-white border rounded shadow-sm overflow-hidden">
      <div className="bg-[#003399] text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-users"></i>
          Groups & Communities
        </h2>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="bg-white text-[#003399] px-4 py-1.5 rounded text-xs font-bold"
        >
          {showCreate ? 'Close' : 'Create Group'}
        </button>
      </div>

      {showCreate && (
        <div className="p-6 bg-gray-50 border-b space-y-4">
          <input 
            type="text" 
            placeholder="Group Name" 
            className="w-full p-2 border rounded text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea 
            placeholder="Description" 
            className="w-full p-2 border rounded text-sm h-24"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button onClick={createGroup} className="w-full bg-[#003399] text-white py-2 rounded font-bold">
            Start Group
          </button>
        </div>
      )}

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(group => (
          <div key={group.id} className="border rounded overflow-hidden flex flex-col hover:border-blue-300 transition group">
            <img src={group.imageUrl} className="h-32 w-full object-cover group-hover:scale-105 transition duration-500" alt={group.name} />
            <div className="p-4 flex-1">
              <h3 className="font-bold text-blue-800 text-lg">{group.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{group.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">{group.members.length} Members</span>
                <button 
                  onClick={() => joinGroup(group.id)}
                  className={`px-4 py-1 rounded text-xs font-bold ${currentUser && group.members.includes(currentUser.id) ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {currentUser && group.members.includes(currentUser.id) ? 'Joined' : 'Join Group'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
