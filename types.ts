
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  bio: string;
  avatar: string;
  profileColor: string;
  friends: string[];
  following: string[];
  age: number;
  isBlocked?: boolean;
  datingEnabled?: boolean;
  customCss?: string; // For CSS customization
  customEmbed?: string; // For embedding music/videos
  customUrl?: string; // For vanity URLs (e.g., starweeb.com/tom)
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  timestamp: number;
  likes: string[]; // User IDs
  comments: Comment[];
  type: 'status' | 'blog';
  title?: string;
  imageUrl?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  timestamp: number;
}

export interface Bulletin {
  id: string;
  authorId: string;
  topic: string;
  content: string;
  timestamp: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: string[];
  imageUrl: string;
}

export interface ForumThread {
  id: string;
  title: string;
  authorId: string;
  category: string;
  content: string;
  timestamp: number;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  authorId: string;
  content: string;
  timestamp: number;
}

export interface Photo {
  id: string;
  userId: string;
  album: string;
  url: string;
  caption: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  userId: string;
  fromUserId: string;
  type: 'friend_request' | 'like' | 'comment' | 'mention' | 'match';
  message: string;
  timestamp: number;
  read: boolean;
}

export interface SecretMessage {
  id: string;
  toUserId: string;
  fromUserId?: string;
  content: string;
  timestamp: number;
  isAI?: boolean;
}

export interface AnonymousQuestion {
  id: string;
  toUserId: string;
  question: string;
  answer?: string;
  timestamp: number;
  answeredAt?: number;
}

export interface DatingCrush {
  fromId: string;
  toId: string;
  timestamp: number;
}

export interface Match {
  id: string;
  userIds: [string, string];
  timestamp: number;
}
