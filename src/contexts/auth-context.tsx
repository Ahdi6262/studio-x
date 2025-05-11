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
  signInWithPopup,
  linkWithPopup,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, arrayUnion, updateDoc } from "firebase/firestore"; 

export interface UserData {
  uid: string;
  name: string | null;
  email: string | null;
  avatar_url?: string | null; // Matches Firestore schema
  bio?: string | null;
  dashboard_layout_preferences?: Record<string, any>;
  web3_wallets?: Array<{ address: string; chain_id: string; linked_at: any; is_primary: boolean; }>;
  auth_providers_linked?: Array<{ provider_name: string; provider_user_id: string; }>;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  loginUser: (email: string, password: string, keepLoggedIn?: boolean) => Promise<FirebaseUser>;
  signupUser: (name: string, email: string, password: string) => Promise<FirebaseUser>;
  logoutUser: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  updateUserProfile: (displayName: string, bio?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<FirebaseUser>;
  signInWithGithub: () => Promise<FirebaseUser>;
  signInWithFacebook: () => Promise<FirebaseUser>;
  connectWallet: (address: string, chainId: string) => Promise<void>; // Basic wallet connect
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_DATA_STORAGE_KEY = 'authUser'; // For client-side caching if needed, though Firestore is primary

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const firestoreUser = userDocSnap.data() as UserData;
          const userData: UserData = {
            uid: firebaseUser.uid,
            name: firestoreUser.name || firebaseUser.displayName,
            email: firestoreUser.email || firebaseUser.email,
            avatar_url: firestoreUser.avatar_url || firebaseUser.photoURL,
            bio: firestoreUser.bio || '',
            dashboard_layout_preferences: firestoreUser.dashboard_layout_preferences || {},
            web3_wallets: firestoreUser.web3_wallets || [],
            auth_providers_linked: firestoreUser.auth_providers_linked || [],
          };
          setUser(userData);
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));
        } else {
          // New user from Firebase Auth but not in Firestore (e.g. first social login)
          const newUserProfile: UserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            avatar_url: firebaseUser.photoURL,
            bio: '',
            dashboard_layout_preferences: {},
            web3_wallets: [],
            auth_providers_linked: firebaseUser.providerData.map(p => ({ provider_name: p.providerId, provider_user_id: p.uid })),
          };
          await setDoc(doc(db, "users", firebaseUser.uid), {
            ...newUserProfile,
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
    // Firebase handles session persistence based on its own rules, keepLoggedIn is more for app-level logic if needed
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setIsLoading(false);
    return userCredential.user;
  };

  const signupUser = async (name: string, email: string, password: string): Promise<FirebaseUser> => {
    setIsLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(userCredential.user, { displayName: name });
    
    const newUserFirestoreData: Partial<UserData> &amp; { created_at: any, updated_at: any } = {
        uid: userCredential.user.uid,
        email: email,
        name: name,
        avatar_url: userCredential.user.photoURL || null,
        bio: '',
        dashboard_layout_preferences: {},
        web3_wallets: [],
        auth_providers_linked: [{ provider_name: 'password', provider_user_id: userCredential.user.uid }],
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
    };
    await setDoc(doc(db, "users", userCredential.user.uid), newUserFirestoreData);
    setIsLoading(false);
    return userCredential.user;
  };

  const logoutUser = async (): Promise<void> => {
    await signOut(auth);
  };

  const updateUserAvatar = async (avatarUrl: string): Promise<void> => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, { photoURL: avatarUrl });
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { avatar_url: avatarUrl, updated_at: serverTimestamp() });
      if (user) {
        const updatedUser = { ...user, avatar_url: avatarUrl };
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
        const updates: Partial<UserData &amp; { updated_at: any }> = { 
          name: displayName, 
          updated_at: serverTimestamp() 
        };
        if (bio !== undefined) {
          updates.bio = bio;
        }
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, updates);
        
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

        if (!userDocSnap.exists()) { // New user via social sign-in
            await setDoc(userDocRef, {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                avatar_url: firebaseUser.photoURL,
                bio: '',
                dashboard_layout_preferences: {},
                web3_wallets: [],
                auth_providers_linked: [providerData],
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            });
        } else { // Existing user, link provider or update info
            const existingData = userDocSnap.data() as UserData;
            const authProviders = existingData.auth_providers_linked || [];
            if (!authProviders.some((p) => p.provider_name === provider.providerId)) {
                authProviders.push(providerData);
            }
            await updateDoc(userDocRef, { 
              updated_at: serverTimestamp(),
              name: firebaseUser.displayName || existingData.name, 
              avatar_url: firebaseUser.photoURL || existingData.avatar_url,
              email: firebaseUser.email || existingData.email, // Update email if changed by provider
              auth_providers_linked: authProviders
            });
        }
        return firebaseUser;
    } catch (error: any) {
        // Handle account-exists-with-different-credential error
        if (error.code === 'auth/account-exists-with-different-credential' &amp;&amp; auth.currentUser &amp;&amp; error.customData?.email) {
            const methods = await fetchSignInMethodsForEmail(auth, error.customData.email);
            // Here you might prompt the user to link accounts or sign in with the existing method.
            // For simplicity, we'll try to link if the current user is anonymous or if we have a way to confirm.
            // This part needs careful UX design.
            try {
                await linkWithPopup(auth.currentUser, provider); // This attempts to link the new credential
                return auth.currentUser; // Return the updated user
            } catch (linkError) {
                console.error("Social account linking error:", linkError);
                throw linkError; // Rethrow or handle specific link errors
            }
        }
        console.error("Social sign-in error:", error);
        throw error;
    } finally {
        setIsLoading(false);
    }
  };

  const signInWithGoogle = () => handleSocialSignIn(new GoogleAuthProvider());
  const signInWithGithub = () => handleSocialSignIn(new GithubAuthProvider());
  const signInWithFacebook = () => handleSocialSignIn(new FacebookAuthProvider());

  const connectWallet = async (address: string, chainId: string): Promise<void> => {
    if (auth.currentUser &amp;&amp; user) {
      const newWallet = { address, chain_id: chainId, linked_at: serverTimestamp(), is_primary: !(user.web3_wallets &amp;&amp; user.web3_wallets.length > 0) };
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        web3_wallets: arrayUnion(newWallet),
        updated_at: serverTimestamp()
      });
      // Update local user state
      setUser(prevUser => ({
        ...prevUser!,
        web3_wallets: [...(prevUser?.web3_wallets || []), newWallet]
      }));
    } else {
      throw new Error("User not authenticated to connect wallet.");
    }
  };


  return (
    <AuthContext.Provider value={{ 
        isAuthenticated: !!user &amp;&amp; !isLoading,
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
        signInWithFacebook,
        connectWallet
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

