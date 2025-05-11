
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
  signInWithCustomToken 
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
// serverTimestamp and FieldValue might not be needed if all date handling is JS Date -> API -> MySQL TIMESTAMP
// import type { FieldValue, Timestamp } from "firebase/firestore"; 


// UserData reflects the structure from your MySQL 'users' table and related tables.
export interface UserData {
  uid: string;
  name: string | null;
  email: string | null;
  avatar_url?: string | null; 
  bio?: string | null;
  dashboard_layout_preferences?: Record<string, any> | null; // JSON in MySQL
  web3_wallets?: Array<{ 
    address: string; 
    chain_id: string; 
    linked_at: string; // ISO string from MySQL TIMESTAMP
    is_primary: boolean; 
  }>; 
  auth_providers_linked?: Array<{ 
    provider_name: string; 
    provider_user_id: string; 
  }>;
  created_at?: string; // ISO string from MySQL TIMESTAMP
  updated_at?: string; // ISO string from MySQL TIMESTAMP
}

// Payload for creating a new user via API -> MySQL
interface NewUserAPIPayload {
  uid: string;
  email: string | null;
  name: string | null;
  avatar_url?: string | null;
  auth_providers_linked?: Array<{ provider_name: string; provider_user_id: string; }>;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  loginUser: (email: string, password: string, keepLoggedIn?: boolean) => Promise<FirebaseUser>;
  signupUser: (name: string, email: string, password: string) => Promise<FirebaseUser>;
  logoutUser: () => Promise<void>;
  updateUserAvatar: (avatarDataUrl: string) => Promise<void>; // Will call an API
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

// Helper function to fetch user profile from your new API (MySQL backend)
async function fetchUserProfileFromAPI(uid: string): Promise<UserData | null> {
  try {
    const response = await fetch(`/api/users/${uid}`);
    if (!response.ok) {
      if (response.status === 404) return null; 
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error(`Failed to fetch user profile (${response.status}):`, errorData.message);
      return null;
    }
    const userData: UserData = await response.json();
    // Ensure dashboard_layout_preferences is parsed if it's a string
    if (typeof userData.dashboard_layout_preferences === 'string') {
        try {
            userData.dashboard_layout_preferences = JSON.parse(userData.dashboard_layout_preferences);
        } catch (e) {
            console.warn("Failed to parse dashboard_layout_preferences from API", e);
            userData.dashboard_layout_preferences = null;
        }
    }
    return userData;
  } catch (error) {
    console.error("Error fetching user profile from API:", error);
    return null;
  }
}

// Helper function to create user profile via your new API (MySQL backend)
async function createUserProfileInAPI(payload: NewUserAPIPayload): Promise<UserData | null> {
  try {
    const response = await fetch(`/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to create user profile (${response.status}): ${errorData.message}`);
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
          const initialAuthProviders = firebaseUser.providerData.map(p => ({ provider_name: p.providerId, provider_user_id: p.uid }));
          const newUserPayload: NewUserAPIPayload = {
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
          setUser(null);
          localStorage.removeItem(USER_DATA_STORAGE_KEY);
          console.warn("User authenticated with Firebase, but API profile data issue.");
           // Optionally sign out the Firebase user if local profile is mandatory
           // await signOut(auth); 
        }

      } else {
        setUser(null);
        setConnectedWalletAddress(null);
        localStorage.removeItem(USER_DATA_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        const newAddress = accounts.length > 0 ? accounts[0] : null;
        if (newAddress !== connectedWalletAddress) {
          setConnectedWalletAddress(newAddress);
          // If user is logged in, you might want to update their primary wallet or re-verify
        }
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      // Check for initially connected account
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
    // Firebase handles session persistence. 'keepLoggedIn' is more conceptual here.
    // await auth.setPersistence(keepLoggedIn ? browserLocalPersistence : browserSessionPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle fetching profile from API
    return userCredential.user;
  };

  const signupUser = async (name: string, email: string, password: string): Promise<FirebaseUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(userCredential.user, { displayName: name });
    // Profile creation in MySQL is handled by onAuthStateChanged logic.
    return userCredential.user;
  };

  const logoutUser = async (): Promise<void> => {
    await signOut(auth);
    // onAuthStateChanged will set user to null
  };

  const updateUserAvatar = async (avatarDataUrl: string): Promise<void> => { // Assuming avatarDataUrl for Firebase Storage
    if (auth.currentUser) {
      // Step 1: Upload to Firebase Storage (if you still want to use it for avatars)
      // This requires `storage` to be initialized and exported from `lib/firebase.ts`
      // And you'd need to implement `uploadBytes` and `getDownloadURL` logic here.
      // For now, let's assume avatarDataUrl is already a public URL or you handle upload elsewhere.
      // OR if avatarDataUrl is the final public URL (e.g., after upload to S3/Cloudinary):
      const publicAvatarUrl = avatarDataUrl; // Or result from Firebase Storage upload

      await firebaseUpdateProfile(auth.currentUser, { photoURL: publicAvatarUrl });
      
      const response = await fetch(`/api/users/${auth.currentUser.uid}/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: publicAvatarUrl }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({message: "Failed to update avatar in DB."}));
        throw new Error(errorData.message);
      }

      if (user) {
        const updatedUser = { ...user, avatar_url: publicAvatarUrl };
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
        
        const payload: Partial<Omit<UserData, 'uid' | 'email' | 'created_at' | 'updated_at'>> = { name: displayName };
        if (bio !== undefined) payload.bio = bio;

        const response = await fetch(`/api/users/${auth.currentUser.uid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({message: "Failed to update profile in DB."}));
          throw new Error(errorData.message);
        }
        
        const updatedProfileData: UserData = await response.json();

        if (user) {
          setUser(updatedProfileData); // Use the full updated profile from API
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(updatedProfileData));
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
        // onAuthStateChanged handles MySQL profile creation/fetch.
        // If user linked this provider to an existing account, Firebase handles it.
        // Our API needs to ensure the `user_auth_providers` table is updated for existing user.
        if (result.user && user && result.user.uid === user.uid) { // User was already logged in and linked
             await fetch(`/api/users/${result.user.uid}/link-provider`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider_name: providerInstance.providerId, provider_user_id: result.user.providerData.find(p=>p.providerId === providerInstance.providerId)?.uid }),
              });
        }
        return result.user;
    } catch (error: any) {
        if (error.code === 'auth/account-exists-with-different-credential' && auth.currentUser && error.customData?.email) {
            try {
                const linkResult = await linkWithPopup(auth.currentUser, providerInstance);
                const providerData = linkResult.user.providerData.find(p => p.providerId === providerInstance.providerId);
                if(providerData){
                    await fetch(`/api/users/${auth.currentUser.uid}/link-provider`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ provider_name: providerInstance.providerId, provider_user_id: providerData.uid }),
                    });
                }
                return linkResult.user; 
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
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      const chainId = String(parseInt(chainIdHex, 16)); // Convert hex chainId to string decimal
      
      setConnectedWalletAddress(address);

      if (auth.currentUser && user) {
        const response = await fetch(`/api/users/${auth.currentUser.uid}/link-wallet`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, chain_id: chainId, is_primary: (user.web3_wallets?.length || 0) === 0 }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({message: "Failed to link wallet to user profile."}));
            throw new Error(errorData.message);
        }
        const updatedProfile = await response.json();
        setUser(updatedProfile);
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(updatedProfile));
      }
      return { address, chainId };
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      // Do not nullify connectedWalletAddress here if accountsChanged listener is active
      // setConnectedWalletAddress(null); 
      throw error; 
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const signInWithWalletSignature = async (): Promise<FirebaseUser | null> => {
    if (!connectedWalletAddress) {
        alert("Please connect your wallet first.");
        // Or try to connect: await connectWallet(); if (!connectedWalletAddress)...
        throw new Error("Wallet not connected.");
    }
    setIsLoading(true);
    try {
        // 1. Request a challenge (nonce) from your backend
        const nonceResponse = await fetch('/api/auth/request-message', { // You need to build this API route
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: connectedWalletAddress })
        });
        if (!nonceResponse.ok) throw new Error('Failed to request challenge message.');
        const { messageToSign } = await nonceResponse.json();

        // 2. User signs the message
        if (!window.ethereum) throw new Error("Ethereum provider not found.");
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [messageToSign, connectedWalletAddress]
        });

        // 3. Send signature to backend for verification & get custom token
        const verifyResponse = await fetch('/api/auth/verify-signature', { // You need to build this API route
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageToSign, signature, walletAddress: connectedWalletAddress })
        });
        if (!verifyResponse.ok) throw new Error('Failed to verify signature.');
        const { customToken } = await verifyResponse.json();

        // 4. Sign in with custom token
        const userCredential = await signInWithCustomToken(auth, customToken);
        // onAuthStateChanged will update the user state and local storage
        return userCredential.user;
    } catch (error:any) {
        console.error("Sign in with wallet signature failed:", error);
        throw error;
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
        isAuthenticated: !!user && !isLoading, // isAuthenticated is true if user is loaded and not loading
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
