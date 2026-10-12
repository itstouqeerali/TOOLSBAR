export type UserRole = 'user' | 'admin';

export interface RecentToolItem {
  slug: string;
  name: string;
  category?: string;
  lastUsedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string | null;
  role: UserRole;
  emailVerified?: boolean;
  provider?: string;
  favorites?: string[];
  recentTools?: RecentToolItem[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthContextType {
  user: import('firebase/auth').User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateDisplayName: (newName: string) => Promise<void>;
  toggleFavorite: (toolSlug: string) => Promise<void>;
  isFavorite: (toolSlug: string) => boolean;
  recordRecentTool: (toolSlug: string, toolName: string, category?: string) => Promise<void>;
  clearRecentTools: () => Promise<void>;
  sendVerificationEmailAgain: () => Promise<void>;
}


