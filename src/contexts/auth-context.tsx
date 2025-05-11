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
import { doc, setDoc, getDoc, serverTimestamp, arrayUnion, updateDoc, type FieldValue, type Timestamp } from "firebase/firestore"; 

export interface UserData {
  uid: string;
  name: string | null;
  email: string | null;
  avatar_url?: string | null; 
  bio?: string | null;
  dashboard_layout_preferences?: Record<string, any>;
  web3_wallets?: Array<{ address: string; chain_id: string; linked_at: FieldValue | Date; is_primary: boolean; }>; 
  auth_providers_linked?: Array<{ provider_name: string; provider_user_id: string; }>;
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
  web3_wallets?: FieldValue; // For arrayUnion
  auth_providers_linked?: FieldValue; // For arrayUnion
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
  connectWallet: () => Promise<{ address: string; chainId: string } | null>; // Connects and links if logged in
  connectedWalletAddress: string | null;
  isConnectingWallet: boolean;
  // Placeholder for signature-based auth and Web3 data fetching
  // signInWithWalletSignature: () => Promise<FirebaseUser | null>;
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
          const firestoreUser = userDocSnap.data() as UserData; 
          userDataToSet = {
            uid: firebaseUser.uid,
            name: firestoreUser.name || firebaseUser.displayName,
            email: firestoreUser.email || firebaseUser.email,
            avatar_url: firestoreUser.avatar_url || firebaseUser.photoURL,
            bio: firestoreUser.bio || '',
            dashboard_layout_preferences: firestoreUser.dashboard_layout_preferences || {},
            web3_wallets: firestoreUser.web3_wallets?.map(w => ({...w, linked_at: (w.linked_at as Timestamp)?.toDate ? (w.linked_at as Timestamp).toDate() : new Date() })) || [],
            auth_providers_linked: firestoreUser.auth_providers_linked || [],
          };
        } else {
          // New user or user data not yet in Firestore (e.g. after social sign-up)
          userDataToSet = {
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
            ...userDataToSet,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          };
          await setDoc(doc(db, "users", firebaseUser.uid), newFirestoreData, { merge: true });
        }
        setUser(userDataToSet);
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userDataToSet));
        // Check if any linked wallets from Firestore should update connectedWalletAddress
        if (userDataToSet.web3_wallets && userDataToSet.web3_wallets.length > 0) {
            const primaryWallet = userDataToSet.web3_wallets.find(w => w.is_primary);
            if (primaryWallet) setConnectedWalletAddress(primaryWallet.address);
        }

      } else {
        setUser(null);
        setConnectedWalletAddress(null);
        localStorage.removeItem(USER_DATA_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    // Listen for MetaMask account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setConnectedWalletAddress(accounts[0]);
          // If user is logged in, consider auto-linking or prompting to link the new active account
        } else {
          setConnectedWalletAddress(null);
        }
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Initial check for connected account
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (Array.isArray(accounts) && accounts.length > 0) {
            setConnectedWalletAddress(accounts[0]);
        }
      }).catch(console.error);

      return () => {
        unsubscribe();
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }

    return () => unsubscribe();
  }, []);


  const loginUser = async (email: string, password: string, keepLoggedIn: boolean = false): Promise<FirebaseUser> => {
    setIsLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Auth state change will handle user data loading
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
    // Auth state change will handle user data loading
    setIsLoading(false);
    return userCredential.user;
  };

  const logoutUser = async (): Promise<void> => {
    await signOut(auth);
    // Auth state change will handle setting user to null
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

  const handleSocialSignIn = async (providerInstance: GoogleAuthProvider | GithubAuthProvider | FacebookAuthProvider): Promise<FirebaseUser> => {
    setIsLoading(true);
    try {
        const result = await signInWithPopup(auth, providerInstance);
        const firebaseUser = result.user;
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        const providerData = { provider_name: providerInstance.providerId, provider_user_id: firebaseUser.uid };

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
            if (!authProviders.some((p) => p.provider_name === providerInstance.providerId)) {
                authProviders.push(providerData);
            }
            const updateData: Partial<FirestoreUserUpdateData> = { 
              updated_at: serverTimestamp(),
              name: firebaseUser.displayName || existingData.name, 
              avatar_url: firebaseUser.photoURL || existingData.avatar_url,
              email: firebaseUser.email || existingData.email, 
              auth_providers_linked: arrayUnion(providerData) // Use arrayUnion to avoid duplicates if logic is complex
            };
            await updateDoc(userDocRef, updateData);
        }
        // Auth state change will handle user data loading
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
      throw new Error("MetaMask (or other Ethereum wallet) not detected. Please install it.");
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
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const currentWallets = user.web3_wallets || [];
        const walletExists = currentWallets.some(w => w.address.toLowerCase() === address.toLowerCase());

        if (!walletExists) {
            const newWalletEntry = { 
                address: address, 
                chain_id: chainId, 
                linked_at: serverTimestamp(), 
                is_primary: currentWallets.length === 0 
            };
            await updateDoc(userDocRef, {
                web3_wallets: arrayUnion(newWalletEntry),
                updated_at: serverTimestamp()
            });
            // Optimistically update local user state
            setUser(prevUser => ({
                ...prevUser!,
                web3_wallets: [...(prevUser?.web3_wallets || []), {...newWalletEntry, linked_at: new Date() }]
            }));
        }
      }
      return { address, chainId };
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      throw error; // Re-throw to be caught by UI
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Placeholder for actual signature-based auth
  // const signInWithWalletSignature = async (): Promise<FirebaseUser | null> => {
  //   // 1. Connect wallet (use connectWallet or similar)
  //   // 2. Request a nonce/message from backend
  //   // 3. User signs message (window.ethereum.request({ method: 'personal_sign', params: [message, address] }))
  //   // 4. Send signature, message, address to backend for verification
  //   // 5. Backend verifies, creates/fetches user, returns custom token
  //   // 6. Frontend signInWithCustomToken(auth, customToken)
  //   console.warn("signInWithWalletSignature not implemented yet.");
  //   return null;
  // };

  // Placeholder for Web3 data fetching (would typically be in a service or hook)
  // const fetchTokenBalance = async (tokenAddress: string): Promise<string | null> => {
  //   // Call backend API which uses ethers.js to get balance
  //   console.warn("fetchTokenBalance not implemented yet.");
  //   return null;
  // };
  // const checkNFTOwnership = async (contractAddress: string, tokenId: string): Promise<boolean> => {
  //   // Call backend API which uses ethers.js
  //   console.warn("checkNFTOwnership not implemented yet.");
  //   return false;
  // };


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
        // signInWithWalletSignature, 
        // fetchTokenBalance,
        // checkNFTOwnership,
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
