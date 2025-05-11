
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
  login: (userData: UserData, keepLoggedIn?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'currentUser';
const SESSION_STORAGE_KEY = 'sessionUser';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Check localStorage first (for "Keep me signed in")
    const storedUserLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedUserLocal) {
      try {
        const parsedUser = JSON.parse(storedUserLocal);
        setUser(parsedUser);
        setIsAuthenticated(true);
        return; 
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    // Then check sessionStorage (for regular session)
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
  }, []);

  const login = (userData: UserData, keepLoggedIn: boolean = false) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (keepLoggedIn) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
      sessionStorage.removeItem(SESSION_STORAGE_KEY); // Clear session storage if local is used
    } else {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear local storage if session is used
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
