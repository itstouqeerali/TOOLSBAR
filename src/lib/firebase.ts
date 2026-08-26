import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { 
  initializeFirestore, 
  getFirestore, 
  Firestore 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Enforce local persistence across browser refreshes
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase auth persistence warning:', err);
});

// Configure Firestore with forced long-polling to maintain seamless connectivity in sandboxed container/proxy/iframe environments
let db: Firestore;
try {
  db = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true,
    },
    firebaseConfig.firestoreDatabaseId || undefined
  );
} catch {
  db = firebaseConfig.firestoreDatabaseId 
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export { app, auth, db };
