
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { storage } from './storageService';
import { User, Post, Bulletin, Notification } from './types';

// Components
import Layout from './components/Layout';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Bulletins from './pages/Bulletins';
import Forums from './pages/Forums';
import ArtGallery from './pages/ArtGallery';
import SecretAdmirers from './pages/SecretAdmirers';
import GroupsPage from './pages/Groups';
import Inbox from './pages/Inbox';
import Dating from './pages/Dating';
import Login from './pages/Login';
import Terms from './pages/Terms';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  notifications: Notification[];
  refreshData: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [currentUser, setInternalCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [users, setUsers] = useState<User[]>(storage.getUsers());
  const [notifications, setNotifications] = useState<Notification[]>(storage.getNotifications());

  const refreshData = () => {
    setUsers(storage.getUsers());
    setNotifications(storage.getNotifications());
    const curr = storage.getCurrentUser();
    if (curr) {
       setInternalCurrentUser(storage.getUsers().find(u => u.id === curr.id) || null);
    }
  };

  const setCurrentUser = (user: User | null) => {
    setInternalCurrentUser(user);
    storage.setCurrentUser(user);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, users, setUsers, notifications, refreshData }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/" element={currentUser ? <Layout /> : <Navigate to="/login" />}>
            <Route index element={<Feed />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="bulletins" element={<Bulletins />} />
            <Route path="forums" element={<Forums />} />
            <Route path="gallery" element={<ArtGallery />} />
            <Route path="admirers" element={<SecretAdmirers />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="dating" element={<Dating />} />
            {/* Vanity URL catch-all - must be last in the / group */}
            <Route path=":slug" element={<Profile />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
