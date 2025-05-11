
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
  type User as FirebaseUser,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Assuming db might be used later for user profiles
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import type { MockRegisteredUser } from '@/types/auth'; // Keep for structure, but adapt

interface UserData {
  uid: string;
  name: string | null;
  email: string | null;
  avatar?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  loginUser: (email: string, password: string, keepLoggedIn?: boolean) => Promise<FirebaseUser>;
  signupUser: (name: string, email: string, password: string) => Promise<FirebaseUser>;
  logoutUser: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<FirebaseUser>;
  signInWithGithub: () => Promise<FirebaseUser>;
  signInWithFacebook: () => Promise<FirebaseUser>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_DATA_STORAGE_KEY = 'authUser'; // Unified key

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Attempt to load additional user data from localStorage/sessionStorage or Firestore
        let storedUserData = null;
        try {
            const localData = localStorage.getItem(USER_DATA_STORAGE_KEY);
            if (localData) storedUserData = JSON.parse(localData);
        } catch (e) { console.error("Error reading user data from storage", e); }

        if (storedUserData && storedUserData.uid === firebaseUser.uid) {
            setUser(storedUserData);
        } else {
            // Fetch from Firestore if not in local storage or UID mismatch
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const firestoreUser = userDocSnap.data() as UserData;
                setUser(firestoreUser);
                localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(firestoreUser)); // Cache it
            } else {
                // Basic user data if not in Firestore yet
                const newUser: UserData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    avatar: firebaseUser.photoURL,
                };
                setUser(newUser);
                // Optionally save this basic profile to Firestore
                await setDoc(doc(db, "users", firebaseUser.uid), {
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    avatar_url: firebaseUser.photoURL,
                    created_at: new Date().toISOString(),
                }, { merge: true });
                localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(newUser));
            }
        }
      } else {
        setUser(null);
        localStorage.removeItem(USER_DATA_STORAGE_KEY);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const mapFirebaseUserToUserData = (firebaseUser: FirebaseUser): UserData => {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      avatar: firebaseUser.photoURL,
    };
  };

  const loginUser = async (email: string, password: string, keepLoggedIn: boolean = false): Promise<FirebaseUser> => {
    setIsLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userData = mapFirebaseUserToUserData(userCredential.user);
    setUser(userData);
    if (keepLoggedIn) {
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));
    } else {
        sessionStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));
        localStorage.removeItem(USER_DATA_STORAGE_KEY); // Ensure only one storage method is active
    }
    setIsLoading(false);
    return userCredential.user;
  };

  const signupUser = async (name: string, email: string, password: string): Promise<FirebaseUser> => {
    setIsLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(userCredential.user, { displayName: name });
    
    const newUser: UserData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: name, // Use provided name
        avatar: userCredential.user.photoURL,
    };
    // Save to Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        avatar_url: userCredential.user.photoURL || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    setUser(newUser);
    localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(newUser)); // Persist by default on signup
    setIsLoading(false);
    return userCredential.user;
  };

  const logoutUser = async (): Promise<void> => {
    setIsLoading(true);
    await signOut(auth);
    setUser(null);
    localStorage.removeItem(USER_DATA_STORAGE_KEY);
    sessionStorage.removeItem(USER_DATA_STORAGE_KEY);
    setIsLoading(false);
  };

  const updateUserAvatar = async (avatarUrl: string): Promise<void> => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, { photoURL: avatarUrl });
      const updatedUser = { ...user!, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(updatedUser));
      // Update Firestore
      await setDoc(doc(db, "users", auth.currentUser.uid), { avatar_url: avatarUrl, updated_at: new Date().toISOString() }, { merge: true });
    }
  };

  const updateUserProfile = async (displayName: string): Promise<void> => {
    if (auth.currentUser) {
        await firebaseUpdateProfile(auth.currentUser, { displayName });
        const updatedUser = { ...user!, name: displayName };
        setUser(updatedUser);
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(updatedUser));
         // Update Firestore
        await setDoc(doc(db, "users", auth.currentUser.uid), { name: displayName, updated_at: new Date().toISOString() }, { merge: true });
    }
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const handleSocialSignIn = async (provider: GoogleAuthProvider | GithubAuthProvider | FacebookAuthProvider): Promise<FirebaseUser> => {
    setIsLoading(true);
    try {
        const result = await signInWithPopup(auth, provider);
        const firebaseUser = result.user;
        const userData = mapFirebaseUserToUserData(firebaseUser);

        // Check if user exists in Firestore, if not, create them
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                avatar_url: firebaseUser.photoURL,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                auth_providers: [ // Example of storing provider info
                    { provider_name: provider.providerId, provider_user_id: firebaseUser.uid }
                ]
            }, { merge: true });
        } else {
             await setDoc(userDocRef, { updated_at: new Date().toISOString() }, { merge: true });
        }

        setUser(userData);
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData)); // Persist by default
        return firebaseUser;
    } catch (error) {
        console.error("Social sign-in error:", error);
        throw error; // Re-throw to be caught by the form
    } finally {
        setIsLoading(false);
    }
  };

  const signInWithGoogle = () => handleSocialSignIn(new GoogleAuthProvider());
  const signInWithGithub = () => handleSocialSignIn(new GithubAuthProvider());
  const signInWithFacebook = () => handleSocialSignIn(new FacebookAuthProvider());

  return (
    <AuthContext.Provider value={{ 
        isAuthenticated: !!user, 
        user, 
        isLoading, 
        loginUser, 
        signupUser, 
        logoutUser, 
        updateUserAvatar, 
        updateUserProfile, 
        sendPasswordReset,
        signInWithGoogle,
        signInWithGithub,
        signInWithFacebook
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
