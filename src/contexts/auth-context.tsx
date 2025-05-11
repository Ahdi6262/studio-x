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
import { doc, setDoc, getDoc, serverTimestamp, arrayUnion, updateDoc, type FieldValue } from "firebase/firestore"; 

export interface UserData {
  uid: string;
  name: string | null;
  email: string | null;
  avatar_url?: string | null; // Matches Firestore schema
  bio?: string | null;
  dashboard_layout_preferences?: Record<string, any>;
  web3_wallets?: Array<{ address: string; chain_id: string; linked_at: FieldValue | Date; is_primary: boolean; }>; // Use FieldValue for write, Date for read
  auth_providers_linked?: Array<{ provider_name: string; provider_user_id: string; }>;
}

// Define a more specific type for data written to Firestore for user creation
interface FirestoreUserCreateData extends Partial<UserData> {
  created_at: FieldValue;
  updated_at: FieldValue;
  // Ensure all required fields from UserData that are not optional are listed or handled
  uid: string;
  email: string | null;
  name: string | null;
}

// Define a more specific type for data written to Firestore for user profile updates
interface FirestoreUserUpdateData extends Partial<UserData> {
  updated_at: FieldValue;
  name?: string | null; // Explicitly include fields that can be updated
  bio?: string | null;
  avatar_url?: string | null;
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

const USER_DATA_STORAGE_KEY = 'authUser'; 

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
          const firestoreUser = userDocSnap.data() as UserData; // Assume data matches UserData
          const userData: UserData = {
            uid: firebaseUser.uid,
            name: firestoreUser.name || firebaseUser.displayName,
            email: firestoreUser.email || firebaseUser.email,
            avatar_url: firestoreUser.avatar_url || firebaseUser.photoURL,
            bio: firestoreUser.bio || '',
            dashboard_layout_preferences: firestoreUser.dashboard_layout_preferences || {},
            web3_wallets: firestoreUser.web3_wallets?.map(w => ({...w, linked_at: (w.linked_at as Timestamp)?.toDate ? (w.linked_at as Timestamp).toDate() : new Date() })) || [],
            auth_providers_linked: firestoreUser.auth_providers_linked || [],
          };
          setUser(userData);
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));
        } else {
          const newUserData: UserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            avatar_url: firebaseUser.photoURL,
            bio: '',
            dashboard_layout_preferences: {},
            web3_wallets: [],
            auth_providers_linked: firebaseUser.providerData.map(p => ({ provider_name: p.providerId, provider_user_id: p.uid })),
          };
          const newFirestoreData: FirestoreUserCreateData = {
            ...newUserData,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          };
          await setDoc(doc(db, "users", firebaseUser.uid), newFirestoreData, { merge: true });
          setUser(newUserData);
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(newUserData));
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
    setIsLoading(false);
    return userCredential.user;
  };

  const signupUser = async (name: string, email: string, password: string): Promise<FirebaseUser> => {
    setIsLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(userCredential.user, { displayName: name });
    
    const newUserFirestoreData: FirestoreUserCreateData = {
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
      const updateData: FirestoreUserUpdateData = { avatar_url: avatarUrl, updated_at: serverTimestamp() };
      await updateDoc(userDocRef, updateData);
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
        const updates: FirestoreUserUpdateData = { 
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

        if (!userDocSnap.exists()) { 
            const newUserFirestoreData: FirestoreUserCreateData = {
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
            };
            await setDoc(userDocRef, newUserFirestoreData);
        } else { 
            const existingData = userDocSnap.data() as UserData;
            const authProviders = existingData.auth_providers_linked || [];
            if (!authProviders.some((p) => p.provider_name === provider.providerId)) {
                authProviders.push(providerData);
            }
            const updateData: FirestoreUserUpdateData = { 
              updated_at: serverTimestamp(),
              name: firebaseUser.displayName || existingData.name, 
              avatar_url: firebaseUser.photoURL || existingData.avatar_url,
              email: firebaseUser.email || existingData.email, 
              auth_providers_linked: authProviders
            };
            await updateDoc(userDocRef, updateData);
        }
        return firebaseUser;
    } catch (error: any) {
        if (error.code === 'auth/account-exists-with-different-credential' && auth.currentUser && error.customData?.email) {
            // const methods = await fetchSignInMethodsForEmail(auth, error.customData.email);
            try {
                await linkWithPopup(auth.currentUser, provider); 
                return auth.currentUser; 
            } catch (linkError) {
                console.error("Social account linking error:", linkError);
                throw linkError; 
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
    if (auth.currentUser && user) {
      const newWallet = { address, chain_id: chainId, linked_at: serverTimestamp(), is_primary: !(user.web3_wallets && user.web3_wallets.length > 0) };
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      
      const updatePayload: { web3_wallets: FieldValue; updated_at: FieldValue } = {
        web3_wallets: arrayUnion(newWallet),
        updated_at: serverTimestamp()
      };
      await updateDoc(userDocRef, updatePayload);
      
      setUser(prevUser => ({
        ...prevUser!,
        web3_wallets: [...(prevUser?.web3_wallets || []), {...newWallet, linked_at: new Date() }] // Simulate immediate update with JS Date
      }));
    } else {
      throw new Error("User not authenticated to connect wallet.");
    }
  };


  return (
    <AuthContext.Provider value={{ 
        isAuthenticated: !!user && !isLoading,
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

// Added Timestamp type from firebase/firestore for web3_wallets.linked_at
import type { Timestamp } from "firebase/firestore";
