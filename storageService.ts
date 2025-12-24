
import { User, Post, Bulletin, Group, ForumThread, Photo, Notification, SecretMessage, AnonymousQuestion, DatingCrush, Match } from './types';

const KEYS = {
  USERS: 'starweeb_users',
  POSTS: 'starweeb_posts',
  BULLETINS: 'starweeb_bulletins',
  GROUPS: 'starweeb_groups',
  FORUMS: 'starweeb_forums',
  PHOTOS: 'starweeb_photos',
  NOTIFS: 'starweeb_notifications',
  SECRET_MESSAGES: 'starweeb_secrets',
  QUESTIONS: 'starweeb_questions',
  CRUSHES: 'starweeb_crushes',
  MATCHES: 'starweeb_matches',
  AUTH: 'starweeb_current_user'
};

export const storage = {
  get: <T,>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Users
  getUsers: () => storage.get<User[]>(KEYS.USERS, []),
  saveUsers: (users: User[]) => storage.set(KEYS.USERS, users),

  // Auth
  getCurrentUser: () => storage.get<User | null>(KEYS.AUTH, null),
  setCurrentUser: (user: User | null) => storage.set(KEYS.AUTH, user),

  // Posts
  getPosts: () => storage.get<Post[]>(KEYS.POSTS, []),
  savePosts: (posts: Post[]) => storage.set(KEYS.POSTS, posts),

  // Bulletins
  getBulletins: () => storage.get<Bulletin[]>(KEYS.BULLETINS, []),
  saveBulletins: (b: Bulletin[]) => storage.set(KEYS.BULLETINS, b),

  // Secrets
  getSecrets: () => storage.get<SecretMessage[]>(KEYS.SECRET_MESSAGES, []),
  saveSecrets: (s: SecretMessage[]) => storage.set(KEYS.SECRET_MESSAGES, s),

  // Questions
  getQuestions: () => storage.get<AnonymousQuestion[]>(KEYS.QUESTIONS, []),
  saveQuestions: (q: AnonymousQuestion[]) => storage.set(KEYS.QUESTIONS, q),

  // Dating
  getCrushes: () => storage.get<DatingCrush[]>(KEYS.CRUSHES, []),
  saveCrushes: (c: DatingCrush[]) => storage.set(KEYS.CRUSHES, c),
  getMatches: () => storage.get<Match[]>(KEYS.MATCHES, []),
  saveMatches: (m: Match[]) => storage.set(KEYS.MATCHES, m),

  // Photos
  getPhotos: () => storage.get<Photo[]>(KEYS.PHOTOS, []),
  savePhotos: (p: Photo[]) => storage.set(KEYS.PHOTOS, p),

  // Groups
  getGroups: () => storage.get<Group[]>(KEYS.GROUPS, []),
  saveGroups: (g: Group[]) => storage.set(KEYS.GROUPS, g),

  // Forums
  getForums: () => storage.get<ForumThread[]>(KEYS.FORUMS, []),
  saveForums: (f: ForumThread[]) => storage.set(KEYS.FORUMS, f),

  // Notifications
  getNotifications: () => storage.get<Notification[]>(KEYS.NOTIFS, []),
  saveNotifications: (n: Notification[]) => storage.set(KEYS.NOTIFS, n),

  // Resilience: Full Export/Import
  exportAllData: () => {
    const data: Record<string, any> = {};
    Object.entries(KEYS).forEach(([keyName, keyValue]) => {
      data[keyValue] = localStorage.getItem(keyValue);
    });
    return JSON.stringify(data);
  },
  importAllData: (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      });
      return true;
    } catch (e) {
      console.error("Failed to import data", e);
      return false;
    }
  }
};
