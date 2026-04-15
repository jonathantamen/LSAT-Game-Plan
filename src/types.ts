import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'student';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  createdAt: Timestamp;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  linkUrl?: string;
  linkText?: string;
  order: number;
  createdAt: Timestamp;
}

export interface UserProgress {
  userId: string;
  taskId: string;
  completedAt: Timestamp;
}

export interface Resource {
  id: string;
  title: string;
  fileUrl: string;
  fileName?: string;
  createdAt: Timestamp;
}
