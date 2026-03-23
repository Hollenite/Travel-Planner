import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false); // Unblock UI immediately
        
        // Fire and forget the user doc creation so network/ad-blocker issues don't freeze the app
        setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: serverTimestamp(),
          tripsCount: 0,
        }, { merge: true }).catch((error) => {
          console.error("Error writing user to Firestore:", error);
        });
      } else {
        setUser(null);
        setLoading(false); // Unblock UI
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    return signInWithPopup(auth, googleProvider);
  };

  const signOut = async () => {
    return firebaseSignOut(auth);
  };

  const value = { user, loading, signInWithGoogle, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
