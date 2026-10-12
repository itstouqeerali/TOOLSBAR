import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AuthContextType, RecentToolItem, UserProfile, UserRole } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPER_ADMIN_EMAIL = 'kingtouqeerali@gmail.com';

/**
 * Strips all undefined fields recursively from an object/array so Firestore setDoc/updateDoc never fails.
 */
function cleanFirestoreData<T>(obj: T): T {
  if (obj === undefined) {
    return null as unknown as T;
  }
  if (obj === null) {
    return null as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanFirestoreData(item)) as unknown as T;
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user profile document
  const syncUserProfile = useCallback(async (firebaseUser: User, authProvider?: string) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      const userEmail = (firebaseUser.email || '').trim();
      const isSuperAdmin = userEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
      const nowIso = new Date().toISOString();
      
      const detectedProvider = authProvider || 
        (firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'password');

      const photoUrl = firebaseUser.photoURL || null;

      if (!userSnap.exists()) {
        const initialRole: UserRole = isSuperAdmin ? 'admin' : 'user';
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: userEmail,
          displayName: firebaseUser.displayName || '',
          photoURL: photoUrl,
          role: initialRole,
          emailVerified: !!firebaseUser.emailVerified,
          provider: detectedProvider,
          createdAt: nowIso,
          updatedAt: nowIso,
          lastLoginAt: nowIso,
        };

        await setDoc(userRef, cleanFirestoreData(newProfile));
        setUserProfile(newProfile);
      } else {
        const data = userSnap.data() as UserProfile;
        const updates: Partial<UserProfile> = {
          emailVerified: !!firebaseUser.emailVerified,
          displayName: firebaseUser.displayName || data.displayName || '',
          lastLoginAt: nowIso,
          updatedAt: nowIso,
        };

        if (photoUrl || data.photoURL) {
          updates.photoURL = photoUrl || data.photoURL || null;
        }

        if (detectedProvider && !data.provider) {
          updates.provider = detectedProvider;
        }
        
        // If super admin email, guarantee admin role in Firestore profile
        if (isSuperAdmin && data.role !== 'admin') {
          updates.role = 'admin';
          data.role = 'admin';
        }

        await setDoc(userRef, cleanFirestoreData(updates), { merge: true });
        setUserProfile({ ...data, ...updates });
      }
    } catch (err) {
      console.error('Error syncing user profile:', err);
    }
  }, []);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Initial fetch / creation
        await syncUserProfile(firebaseUser);

        // Real-time listener on user doc
        const userRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          }
        }, (err) => {
          console.warn('Profile snapshot subscription warning:', err);
        });
      } else {
        setUserProfile(null);
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [syncUserProfile]);

  const signIn = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    await syncUserProfile(cred.user, 'password');
  };

  const signUp = async (email: string, pass: string, displayName?: string) => {
    const trimmedEmail = email.trim();
    const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
    
    if (displayName && displayName.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim() });
    }

    try {
      await sendEmailVerification(cred.user);
    } catch (e) {
      console.warn('Email verification send notice:', e);
    }

    const isSuperAdmin = trimmedEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    const role: UserRole = isSuperAdmin ? 'admin' : 'user';
    const nowIso = new Date().toISOString();

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: trimmedEmail,
      displayName: displayName?.trim() || '',
      photoURL: cred.user.photoURL || null,
      role,
      emailVerified: !!cred.user.emailVerified,
      provider: 'password',
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: nowIso,
    };

    const userRef = doc(db, 'users', cred.user.uid);
    await setDoc(userRef, cleanFirestoreData(newProfile));
    setUserProfile(newProfile);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    await syncUserProfile(cred.user, 'google');
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const refreshProfile = async () => {
    if (user) {
      await syncUserProfile(user);
    }
  };

  const updateDisplayName = async (newName: string) => {
    const trimmed = newName.trim();
    if (!user) throw new Error('User must be signed in to update profile');
    if (!trimmed) throw new Error('Display name cannot be empty');

    // Update Firebase Auth user
    await updateProfile(user, { displayName: trimmed });

    // Update Firestore profile
    const nowIso = new Date().toISOString();
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { displayName: trimmed, updatedAt: nowIso }, { merge: true });

    setUserProfile((prev) => (prev ? { ...prev, displayName: trimmed, updatedAt: nowIso } : null));
  };

  const toggleFavorite = async (toolSlug: string) => {
    if (!user || !userProfile) throw new Error('User must be signed in to favorite tools');
    const slug = toolSlug.trim();
    if (!slug) return;

    const currentFavorites = userProfile.favorites || [];
    const exists = currentFavorites.includes(slug);
    const updatedFavorites = exists
      ? currentFavorites.filter((s) => s !== slug)
      : [...currentFavorites, slug];

    const nowIso = new Date().toISOString();
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { favorites: updatedFavorites, updatedAt: nowIso }, { merge: true });

    setUserProfile((prev) => (prev ? { ...prev, favorites: updatedFavorites, updatedAt: nowIso } : null));
  };

  const isFavorite = useCallback(
    (toolSlug: string): boolean => {
      if (!userProfile?.favorites) return false;
      return userProfile.favorites.includes(toolSlug);
    },
    [userProfile?.favorites]
  );

  const recordRecentTool = useCallback(
    async (toolSlug: string, toolName: string, category?: string) => {
      if (!user || !userProfile) return;
      const slug = toolSlug.trim();
      if (!slug) return;

      const nowIso = new Date().toISOString();
      const currentRecents = userProfile.recentTools || [];

      // Filter out existing occurrence of this tool slug
      const filtered = currentRecents.filter((item) => item.slug !== slug);

      // Prepend newest entry and cap to 15 items
      const updatedRecents: RecentToolItem[] = [
        {
          slug,
          name: toolName,
          category: category || '',
          lastUsedAt: nowIso,
        },
        ...filtered,
      ].slice(0, 15);

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, cleanFirestoreData({ recentTools: updatedRecents, updatedAt: nowIso }), { merge: true });

      setUserProfile((prev) => (prev ? { ...prev, recentTools: updatedRecents, updatedAt: nowIso } : null));
    },
    [user, userProfile]
  );

  const clearRecentTools = async () => {
    if (!user || !userProfile) return;
    const nowIso = new Date().toISOString();
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { recentTools: [], updatedAt: nowIso }, { merge: true });
    setUserProfile((prev) => (prev ? { ...prev, recentTools: [], updatedAt: nowIso } : null));
  };

  const sendVerificationEmailAgain = async () => {
    if (!user) throw new Error('User must be signed in');
    await sendEmailVerification(user);
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        sendPasswordReset,
        refreshProfile,
        updateDisplayName,
        toggleFavorite,
        isFavorite,
        recordRecentTool,
        clearRecentTools,
        sendVerificationEmailAgain,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

