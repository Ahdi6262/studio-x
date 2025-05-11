
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
  // fetchSignInMethodsForEmail, // Not used currently
  signInWithCustomToken 
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // db import might be removed if fully migrating
// Firestore imports for user profile management will be replaced by API calls
// import { doc, setDoc, getDoc, serverTimestamp, arrayUnion, updateDoc, type FieldValue, type Timestamp } from "firebase/firestore"; 
// import { db } from '@/lib/firebase';
import type { FieldValue } from "firebase/firestore"; // Keep for timestamp type if needed elsewhere

// UserData should reflect the structure returned by your new /api/users/[userId] endpoint
export interface UserData {
  uid: string;
  name: string | null;
  email: string | null;
  avatar_url?: string | null; 
  bio?: string | null;
  dashboard_layout_preferences?: Record<string, any>;
  web3_wallets?: Array<{ 
    address: string; 
    chain_id: string; 
    linked_at: string; // Dates from API will likely be ISO strings
    is_primary: boolean; 
  }>; 
  auth_providers_linked?: Array<{ 
    provider_name: string; 
    provider_user_id: string; 
  }>;
  created_at?: string; // Dates from API will likely be ISO strings
  updated_at?: string; // Dates from API will likely be ISO strings
}

// This type might be used by the backend API when creating a new user in MySQL
interface NewUserPayload {
  uid: string;
  email: string | null;
  name: string | null;
  avatar_url?: string | null;
  auth_providers_linked?: Array<{ provider_name: string; provider_user_id: string; }>;
  // Add other fields as necessary for user creation via API
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  loginUser: (email: string, password: string, keepLoggedIn?: boolean) => Promise<FirebaseUser>;
  signupUser: (name: string, email: string, password: string) => Promise<FirebaseUser>;
  logoutUser: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>; // Will call an API
  updateUserProfile: (displayName: string, bio?: string) => Promise<void>; // Will call an API
  sendPasswordReset: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<FirebaseUser>;
  signInWithGithub: () => Promise<FirebaseUser>;
  signInWithFacebook: () => Promise<FirebaseUser>;
  connectWallet: () => Promise<{ address: string; chainId: string } | null>; 
  connectedWalletAddress: string | null;
  isConnectingWallet: boolean;
  signInWithWalletSignature: () => Promise<FirebaseUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_DATA_STORAGE_KEY = 'authUser'; 

// Helper function to fetch user profile from your new API
async function fetchUserProfileFromAPI(uid: string): Promise<UserData | null> {
  try {
    const response = await fetch(`/api/users/${uid}`); // Define this API route
    if (!response.ok) {
      if (response.status === 404) return null; // User not found in your DB
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile from API:", error);
    return null;
  }
}

// Helper function to create user profile via your new API
async function createUserProfileInAPI(payload: NewUserPayload): Promise<UserData | null> {
  try {
    const response = await fetch(`/api/users`, { // Define this API route (e.g., POST to /api/users)
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to create user profile: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating user profile via API:", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        let userProfile = await fetchUserProfileFromAPI(firebaseUser.uid);

        if (!userProfile) {
          // User exists in Firebase Auth but not in our MySQL DB (e.g., first social sign-in)
          // Create profile in MySQL DB via API
          const initialAuthProviders = firebaseUser.providerData.map(p => ({ provider_name: p.providerId, provider_user_id: p.uid }));
          const newUserPayload: NewUserPayload = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            avatar_url: firebaseUser.photoURL,
            auth_providers_linked: initialAuthProviders,
          };
          userProfile = await createUserProfileInAPI(newUserPayload);
        }
        
        if (userProfile) {
          setUser(userProfile);
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userProfile));
          if (userProfile.web3_wallets && userProfile.web3_wallets.length > 0) {
            const primaryWallet = userProfile.web3_wallets.find(w => w.is_primary);
            if (primaryWallet && primaryWallet.address !== connectedWalletAddress) {
                 setConnectedWalletAddress(primaryWallet.address);
            }
          }
        } else {
          // Failed to fetch or create profile, treat as unauthenticated for app-specific data
          setUser(null);
          localStorage.removeItem(USER_DATA_STORAGE_KEY);
          console.warn("User authenticated with Firebase, but profile data could not be fetched or created from API.");
        }

      } else {
        setUser(null);
        setConnectedWalletAddress(null);
        localStorage.removeItem(USER_DATA_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    // Wallet event listeners (unchanged for now)
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          if (accounts[0] !== connectedWalletAddress) setConnectedWalletAddress(accounts[0]);
        } else {
          setConnectedWalletAddress(null);
        }
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (Array.isArray(accounts) && accounts.length > 0) {
            if (accounts[0] !== connectedWalletAddress) setConnectedWalletAddress(accounts[0]);
        }
      }).catch(console.error);

      return () => {
        unsubscribe();
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const loginUser = async (email: string, password: string, keepLoggedIn: boolean = false): Promise<FirebaseUser> => {
    setIsLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle fetching profile from API
    setIsLoading(false);
    return userCredential.user;
  };

  const signupUser = async (name: string, email: string, password: string): Promise<FirebaseUser> => {
    setIsLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(userCredential.user, { displayName: name });
    
    // Profile creation will be handled by onAuthStateChanged calling createUserProfileInAPI
    // if fetchUserProfileFromAPI returns null for the new user.
    
    setIsLoading(false);
    return userCredential.user;
  };

  const logoutUser = async (): Promise<void> => {
    await signOut(auth);
    // onAuthStateChanged will set user to null
  };

  const updateUserAvatar = async (avatarUrl: string): Promise<void> => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, { photoURL: avatarUrl });
      // API call to update avatar_url in MySQL
      const response = await fetch(`/api/users/${auth.currentUser.uid}/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: avatarUrl }),
      });
      if (!response.ok) throw new Error("Failed to update avatar in database.");

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
        
        const payload: Partial<UserData> = { name: displayName };
        if (bio !== undefined) payload.bio = bio;

        // API call to update profile in MySQL
        const response = await fetch(`/api/users/${auth.currentUser.uid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to update profile in database.");
        
        const updatedProfileData = await response.json(); // Assuming API returns the updated profile

        if (user) {
          // Merge changes from API response
          const updatedUser = { ...user, ...updatedProfileData };
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

  const handleSocialSignIn = async (providerInstance: GoogleAuthProvider | GithubAuthProvider | FacebookAuthProvider): Promise<FirebaseUser> => {
    setIsLoading(true);
    try {
        const result = await signInWithPopup(auth, providerInstance);
        // onAuthStateChanged will handle fetching/creating profile from API
        return result.user;
    } catch (error: any) {
        if (error.code === 'auth/account-exists-with-different-credential' && auth.currentUser && error.customData?.email) {
            try {
                await linkWithPopup(auth.currentUser, providerInstance);
                // API call to update auth_providers_linked in MySQL for auth.currentUser.uid
                 await fetch(`/api/users/${auth.currentUser.uid}/link-provider`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ provider_name: providerInstance.providerId, provider_user_id: auth.currentUser.uid }),
                  });
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

  const connectWallet = async (): Promise<{ address: string; chainId: string } | null> => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask (or other Ethereum wallet) not detected. Please install it to connect your wallet.");
      throw new Error("MetaMask (or other Ethereum wallet) not detected.");
    }
    setIsConnectingWallet(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts.length === 0) {
        throw new Error("No accounts found. Please create or import an account in your wallet.");
      }
      const address = accounts[0];
      const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      
      setConnectedWalletAddress(address);

      if (auth.currentUser && user) {
        // API call to link wallet to user in MySQL
        const response = await fetch(`/api/users/${auth.currentUser.uid}/link-wallet`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, chain_id: chainId, is_primary: (user.web3_wallets?.length || 0) === 0 }),
        });
        if (!response.ok) throw new Error("Failed to link wallet in database.");
        
        const updatedProfile = await response.json(); // Assuming API returns updated user profile with wallets
        setUser(updatedProfile);
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(updatedProfile));
      }
      return { address, chainId };
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      setConnectedWalletAddress(null);
      throw error; 
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const signInWithWalletSignature = async (): Promise<FirebaseUser | null> => {
    // Placeholder for signature-based login logic
    // This will involve backend calls to request a message, sign it, verify, and get a custom token.
    // Example:
    // const nonceResponse = await fetch('/api/auth/request-message', { method: 'POST', body: JSON.stringify({ address: connectedWalletAddress }) });
    // const { messageToSign } = await nonceResponse.json();
    // const signature = await window.ethereum.request({ method: 'personal_sign', params: [messageToSign, connectedWalletAddress] });
    // const verifyResponse = await fetch('/api/auth/verify-signature', { method: 'POST', body: JSON.stringify({ message: messageToSign, signature, address: connectedWalletAddress }) });
    // const { customToken } = await verifyResponse.json();
    // const userCredential = await signInWithCustomToken(auth, customToken);
    // return userCredential.user;
    
    console.warn("signInWithWalletSignature not fully implemented. Requires backend API for nonce and signature verification.");
    alert("Feature coming soon: Sign in with your Web3 wallet!");
    return null;
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
        connectWallet,
        connectedWalletAddress,
        isConnectingWallet,
        signInWithWalletSignature,
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

declare global {
  interface Window {
    ethereum?: any;
  }
}
