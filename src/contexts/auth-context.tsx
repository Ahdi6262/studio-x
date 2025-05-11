
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  login: (userData: UserData, keepLoggedIn?: boolean) => void;
  logout: () => void;
  updateAvatar: (avatarUrl: string) => void; // Added function to update avatar
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'currentUser';
const SESSION_STORAGE_KEY = 'sessionUser';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let foundUser = false;
    const storedUserLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedUserLocal) {
      try {
        const parsedUser = JSON.parse(storedUserLocal);
        setUser(parsedUser);
        setIsAuthenticated(true);
        foundUser = true;
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    if (!foundUser) {
      const storedUserSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedUserSession) {
         try {
          const parsedUser = JSON.parse(storedUserSession);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Failed to parse user from sessionStorage", e);
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: UserData, keepLoggedIn: boolean = false) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsLoading(false);
    if (keepLoggedIn) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const updateAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      // Update storage
      if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
      }
      if (sessionStorage.getItem(SESSION_STORAGE_KEY)) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, updateAvatar }}>
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
