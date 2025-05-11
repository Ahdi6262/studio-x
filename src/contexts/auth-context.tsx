
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
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"; 

export interface UserData { // Exporting for use elsewhere, e.g., ProfilePage
  uid: string;
  name: string | null;
  email: string | null;
  avatar?: string | null;
  bio?: string | null; // Added bio
  dashboard_layout_preferences?: Record<string, any>; // Added dashboard preferences
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  loginUser: (email: string, password: string, keepLoggedIn?: boolean) => Promise<FirebaseUser>;
  signupUser: (name: string, email: string, password: string) => Promise<FirebaseUser>;
  logoutUser: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  updateUserProfile: (displayName: string, bio?: string) => Promise<void>; // Added bio to signature
  sendPasswordReset: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<FirebaseUser>;
  signInWithGithub: () => Promise<FirebaseUser>;
  signInWithFacebook: () => Promise<FirebaseUser>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_DATA_STORAGE_KEY = 'authUser';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true); // Set loading true at the start of auth state change
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const firestoreUser = userDocSnap.data() as UserData; // Assume UserData includes all fields like name, email, avatar_url, bio
          setUser({
            uid: firebaseUser.uid,
            name: firestoreUser.name || firebaseUser.displayName,
            email: firestoreUser.email || firebaseUser.email,
            avatar: firestoreUser.avatar_url || firebaseUser.photoURL, // Use avatar_url from schema
            bio: firestoreUser.bio, // Get bio from Firestore
            dashboard_layout_preferences: firestoreUser.dashboard_layout_preferences,
          });
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userDocSnap.data()));
        } else {
          // New user or user not in Firestore yet, create a basic profile
          const newUserProfile: UserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            avatar: firebaseUser.photoURL,
            bio: '', // Initialize bio as empty
            dashboard_layout_preferences: {}, // Default empty preferences
          };
          await setDoc(doc(db, "users", firebaseUser.uid), {
            uid: firebaseUser.uid, // Storing uid in the document itself for easier querying if needed
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            avatar_url: firebaseUser.photoURL,
            bio: '',
            dashboard_layout_preferences: {},
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          }, { merge: true });
          setUser(newUserProfile);
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(newUserProfile));
        }
      } else {
        setUser(null);
        localStorage.removeItem(USER_DATA_STORAGE_KEY);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);


  const loginUser = async (email: string, password: string, keepLoggedIn: boolean = false): Promise<FirebaseUser> => {
    setIsLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Auth state change will handle fetching from Firestore and setting user state
    // No need to manually set localStorage here as onAuthStateChanged will do it.
    setIsLoading(false);
    return userCredential.user;
  };

  const signupUser = async (name: string, email: string, password: string): Promise<FirebaseUser> => {
    setIsLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(userCredential.user, { displayName: name });
    
    const newUserProfile: UserData = {
        uid: userCredential.user.uid,
        email: email,
        name: name,
        avatar: userCredential.user.photoURL, // Usually null initially
        bio: '',
        dashboard_layout_preferences: {},
    };
    await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        avatar_url: userCredential.user.photoURL || null,
        bio: '',
        dashboard_layout_preferences: {},
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
    });

    // setUser(newUserProfile); // Let onAuthStateChanged handle this
    // localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(newUserProfile));
    setIsLoading(false);
    return userCredential.user;
  };

  const logoutUser = async (): Promise<void> => {
    // setIsLoading(true); // No need, onAuthStateChanged handles loading state
    await signOut(auth);
    // setUser(null); // onAuthStateChanged handles this
    // localStorage.removeItem(USER_DATA_STORAGE_KEY);
    // sessionStorage.removeItem(USER_DATA_STORAGE_KEY);
    // setIsLoading(false);
  };

  const updateUserAvatar = async (avatarUrl: string): Promise<void> => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, { photoURL: avatarUrl });
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDocRef, { avatar_url: avatarUrl, updated_at: serverTimestamp() }, { merge: true });
      // Refresh user state from Firestore via onAuthStateChanged or by manually updating user state
      if (user) {
        const updatedUser = { ...user, avatar: avatarUrl };
        setUser(updatedUser);
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(updatedUser));
      }
    } else {
      throw new Error("No user is currently signed in.");
    }
  };

  const updateUserProfile = async (displayName: string, bio?: string): Promise<void> => {
    if (auth.currentUser) {
        await firebaseUpdateProfile(auth.currentUser, { displayName });
        const updates: Partial<UserData & { updated_at: any }> = { 
          name: displayName, 
          updated_at: serverTimestamp() 
        };
        if (bio !== undefined) {
          updates.bio = bio;
        }
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, updates, { merge: true });
        
        if (user) {
          const updatedUser = { ...user, name: displayName, bio: bio !== undefined ? bio : user.bio };
          setUser(updatedUser);
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(updatedUser));
        }
    } else {
      throw new Error("No user is currently signed in.");
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
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        const providerData = { provider_name: provider.providerId, provider_user_id: firebaseUser.uid };

        if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                avatar_url: firebaseUser.photoURL,
                bio: '',
                dashboard_layout_preferences: {},
                auth_providers: [providerData],
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            }, { merge: true });
        } else {
            // User exists, update timestamp and ensure provider info is there if needed
            const existingData = userDocSnap.data();
            const authProviders = existingData.auth_providers || [];
            if (!authProviders.some((p:any) => p.provider_name === provider.providerId)) {
                authProviders.push(providerData);
            }
            await setDoc(userDocRef, { 
              updated_at: serverTimestamp(), 
              // Update avatar/name if different from provider, could be optional
              name: firebaseUser.displayName || existingData.name, 
              avatar_url: firebaseUser.photoURL || existingData.avatar_url,
              auth_providers: authProviders
            }, { merge: true });
        }
        // onAuthStateChanged will update the user state and localStorage
        return firebaseUser;
    } catch (error) {
        console.error("Social sign-in error:", error);
        throw error;
    } finally {
        setIsLoading(false);
    }
  };

  const signInWithGoogle = () => handleSocialSignIn(new GoogleAuthProvider());
  const signInWithGithub = () => handleSocialSignIn(new GithubAuthProvider());
  const signInWithFacebook = () => handleSocialSignIn(new FacebookAuthProvider());

  return (
    <AuthContext.Provider value={{ 
        isAuthenticated: !!user && !isLoading, // Ensure not loading before confirming auth
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
