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
  fetchSignInMethodsForEmail,
  signInWithCustomToken // For signature-based auth
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, arrayUnion, updateDoc, type FieldValue, type Timestamp } from "firebase/firestore"; 

// Extended UserData to better match Firestore schema
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
    linked_at: Date; // Changed from FieldValue | Date to just Date after fetch
    is_primary: boolean; 
  }>; 
  auth_providers_linked?: Array<{ 
    provider_name: string; 
    provider_user_id: string; 
  }>;
  // Fields from Firestore schema that might not be directly on FirebaseUser
  created_at?: Date | FieldValue; // Keep FieldValue for creation
  updated_at?: Date | FieldValue; // Keep FieldValue for updates
}

interface FirestoreUserCreateData {
  uid: string;
  email: string | null;
  name: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  dashboard_layout_preferences?: Record<string, any>;
  web3_wallets?: Array<{ address: string; chain_id: string; linked_at: FieldValue; is_primary: boolean; }>;
  auth_providers_linked?: Array<{ provider_name: string; provider_user_id: string; }>;
  created_at: FieldValue;
  updated_at: FieldValue;
}

interface FirestoreUserUpdateData {
  updated_at: FieldValue;
  name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  web3_wallets?: FieldValue; 
  auth_providers_linked?: FieldValue; 
  email?: string | null; // Allow email update if necessary, though Firebase handles primary email
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
  connectWallet: () => Promise<{ address: string; chainId: string } | null>; 
  connectedWalletAddress: string | null;
  isConnectingWallet: boolean;
  signInWithWalletSignature: () => Promise<FirebaseUser | null>; // Added
  // Placeholder for Web3 data fetching (to be implemented elsewhere, e.g., services or hooks)
  // fetchTokenBalance: (tokenAddress: string) => Promise<string | null>;
  // checkNFTOwnership: (contractAddress: string, tokenId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_DATA_STORAGE_KEY = 'authUser'; 

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let userDataToSet: UserData;

        if (userDocSnap.exists()) {
          const firestoreUser = userDocSnap.data(); 
          userDataToSet = {
            uid: firebaseUser.uid,
            name: firestoreUser.name || firebaseUser.displayName,
            email: firestoreUser.email || firebaseUser.email,
            avatar_url: firestoreUser.avatar_url || firebaseUser.photoURL,
            bio: firestoreUser.bio || '',
            dashboard_layout_preferences: firestoreUser.dashboard_layout_preferences || {},
            web3_wallets: firestoreUser.web3_wallets?.map((w: any) => ({...w, linked_at: (w.linked_at as Timestamp)?.toDate ? (w.linked_at as Timestamp).toDate() : new Date(w.linked_at) })) || [],
            auth_providers_linked: firestoreUser.auth_providers_linked || [],
            created_at: (firestoreUser.created_at as Timestamp)?.toDate ? (firestoreUser.created_at as Timestamp).toDate() : undefined,
            updated_at: (firestoreUser.updated_at as Timestamp)?.toDate ? (firestoreUser.updated_at as Timestamp).toDate() : undefined,
          };
        } else {
          // New user or user data not yet in Firestore (e.g. after social sign-up)
          const initialAuthProviders = firebaseUser.providerData.map(p => ({ provider_name: p.providerId, provider_user_id: p.uid }));
          userDataToSet = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            avatar_url: firebaseUser.photoURL,
            bio: '',
            dashboard_layout_preferences: {},
            web3_wallets: [],
            auth_providers_linked: initialAuthProviders,
          };
          const newFirestoreData: FirestoreUserCreateData = {
            ...userDataToSet,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          };
          await setDoc(doc(db, "users", firebaseUser.uid), newFirestoreData, { merge: true });
        }
        setUser(userDataToSet);
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userDataToSet));
        
        if (userDataToSet.web3_wallets && userDataToSet.web3_wallets.length > 0) {
            const primaryWallet = userDataToSet.web3_wallets.find(w => w.is_primary);
            if (primaryWallet && primaryWallet.address !== connectedWalletAddress) { // Check if update is needed
                 setConnectedWalletAddress(primaryWallet.address);
            }
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
        if (accounts.length > 0) {
          if (accounts[0] !== connectedWalletAddress) {
            setConnectedWalletAddress(accounts[0]);
          }
          // TODO: Consider auto-linking or prompting to link if the user is logged in and this new account isn't linked.
        } else {
          setConnectedWalletAddress(null);
        }
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (Array.isArray(accounts) && accounts.length > 0) {
            if (accounts[0] !== connectedWalletAddress) {
                setConnectedWalletAddress(accounts[0]);
            }
        }
      }).catch(console.error);

      return () => {
        unsubscribe();
        if (window.ethereum?.removeListener) { // Check if removeListener exists
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // connectedWalletAddress removed to avoid re-runs that might cause issues


  const loginUser = async (email: string, password: string, keepLoggedIn: boolean = false): Promise<FirebaseUser> => {
    setIsLoading(true);
    // Note: Firebase handles session persistence based on its own rules (e.g., 'local', 'session', 'none').
    // The `keepLoggedIn` flag is more for custom logic if needed, but Firebase Auth handles it.
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
      const updateData: Partial<FirestoreUserUpdateData> = { avatar_url: avatarUrl, updated_at: serverTimestamp() };
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
        const updates: Partial<FirestoreUserUpdateData> = { 
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

  const handleSocialSignIn = async (providerInstance: GoogleAuthProvider | GithubAuthProvider | FacebookAuthProvider): Promise<FirebaseUser> => {
    setIsLoading(true);
    try {
        const result = await signInWithPopup(auth, providerInstance);
        const firebaseUser = result.user;
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        const providerDataPayload = { provider_name: providerInstance.providerId, provider_user_id: firebaseUser.uid };

        if (!userDocSnap.exists()) { 
            const newUserFirestoreData: FirestoreUserCreateData = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                avatar_url: firebaseUser.photoURL,
                bio: '',
                dashboard_layout_preferences: {},
                web3_wallets: [],
                auth_providers_linked: [providerDataPayload],
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            };
            await setDoc(userDocRef, newUserFirestoreData);
        } else { 
            const existingData = userDocSnap.data() as UserData;
            const authProviders = existingData.auth_providers_linked || [];
            const updateNeeded = !authProviders.some(p => p.provider_name === providerInstance.providerId);
            
            const updateData: Partial<FirestoreUserUpdateData> = { 
              updated_at: serverTimestamp(),
              name: firebaseUser.displayName || existingData.name, 
              avatar_url: firebaseUser.photoURL || existingData.avatar_url,
              email: firebaseUser.email || existingData.email, 
            };
            if (updateNeeded) {
                updateData.auth_providers_linked = arrayUnion(providerDataPayload);
            }
            await updateDoc(userDocRef, updateData);
        }
        return firebaseUser;
    } catch (error: any) {
        if (error.code === 'auth/account-exists-with-different-credential' && auth.currentUser && error.customData?.email) {
            try {
                await linkWithPopup(auth.currentUser, providerInstance); 
                const userDocRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userDocRef, { 
                    auth_providers_linked: arrayUnion({ provider_name: providerInstance.providerId, provider_user_id: auth.currentUser.uid }),
                    updated_at: serverTimestamp()
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
      // Consider showing a toast or modal here to guide the user.
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
      
      setConnectedWalletAddress(address); // Update immediately for UI responsiveness

      if (auth.currentUser && user) { // Check if user is logged in to link wallet
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const currentWallets = user.web3_wallets || [];
        const walletExists = currentWallets.some(w => w.address.toLowerCase() === address.toLowerCase());

        if (!walletExists) {
            const newWalletEntry = { 
                address: address, 
                chain_id: chainId, 
                linked_at: serverTimestamp(), 
                is_primary: currentWallets.length === 0 // Make first linked wallet primary
            };
            await updateDoc(userDocRef, {
                web3_wallets: arrayUnion(newWalletEntry),
                updated_at: serverTimestamp()
            });
            // Optimistically update local user state to reflect the new wallet
            setUser(prevUser => {
                if (!prevUser) return null;
                const updatedWallets = [...(prevUser.web3_wallets || []), {...newWalletEntry, linked_at: new Date() }];
                const updatedLocalUser = { ...prevUser, web3_wallets: updatedWallets };
                localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(updatedLocalUser));
                return updatedLocalUser;
            });
        }
      }
      return { address, chainId };
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      setConnectedWalletAddress(null); // Reset if connection failed
      throw error; 
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const signInWithWalletSignature = async (): Promise<FirebaseUser | null> => {
    // TODO: Implement signature-based login
    // 1. Check if wallet is connected (use `connectedWalletAddress` or call `connectWallet`)
    //    If not, prompt to connect.
    if (!connectedWalletAddress) {
        alert("Please connect your wallet first.");
        // Or, try to connect:
        // try {
        //   const walletInfo = await connectWallet();
        //   if (!walletInfo) throw new Error("Wallet connection cancelled or failed.");
        // } catch (err) {
        //   console.error("Connection failed during sign-in attempt:", err);
        //   return null;
        // }
        return null;
    }
    // 2. Request a nonce/message from a backend API endpoint (e.g., /api/auth/request-signature-message).
    //    const nonceResponse = await fetch('/api/auth/request-signature-message', { method: 'POST', body: JSON.stringify({ address: connectedWalletAddress }) });
    //    const { messageToSign } = await nonceResponse.json();

    // 3. User signs the message using `window.ethereum.request({ method: 'personal_sign', params: [messageToSign, connectedWalletAddress] })`.
    //    const signature = await window.ethereum.request({ method: 'personal_sign', params: [messageToSign, connectedWalletAddress] });

    // 4. Send signature, original message, and address to another backend API endpoint (e.g., /api/auth/verify-signature).
    //    const verifyResponse = await fetch('/api/auth/verify-signature', { method: 'POST', body: JSON.stringify({ message: messageToSign, signature, address: connectedWalletAddress }) });
    //    const { customToken } = await verifyResponse.json();

    // 5. If backend verification is successful and returns a custom Firebase token:
    //    const userCredential = await signInWithCustomToken(auth, customToken);
    //    // Auth state change will handle updating the user.
    //    return userCredential.user;
    
    console.warn("signInWithWalletSignature not fully implemented yet. Requires backend API endpoints.");
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

// Helper to declare global ethereum property
declare global {
  interface Window {
    ethereum?: any; // Use a more specific type if available from MetaMask/ethers.js
  }
}
