"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme; // The user's preference (light, dark, or system)
  setTheme: Dispatch<SetStateAction<Theme>>;
  resolvedTheme: "light" | "dark"; // The actual theme applied (light or dark)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const LOCAL_STORAGE_THEME_KEY = 'appTheme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme state. For the first client render *before* useEffect,
  // this value should match what the server would infer (e.g., a default like "system" or "dark").
  // "system" is a good default as it aligns with user's OS settings until localStorage is checked.
  const [theme, setThemeState] = useState<Theme>("system"); 
  const [resolvedTheme, setResolvedThemeState] = useState<"light" | "dark">("dark"); // Default to dark for SSR, client will update

  // This effect runs once on the client after mount to determine the actual initial theme.
  useEffect(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    let initialUserPreference: Theme;
    if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
      initialUserPreference = storedTheme;
    } else {
      initialUserPreference = "system"; // Default to system if nothing stored or invalid
    }
    
    setThemeState(initialUserPreference); // Set the theme preference state

    // Determine and apply the resolved theme based on the preference
    let currentResolvedTheme: "light" | "dark";
    if (initialUserPreference === "system") {
      currentResolvedTheme = systemPrefersDark ? "dark" : "light";
    } else {
      currentResolvedTheme = initialUserPreference;
    }
    
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(currentResolvedTheme);
    setResolvedThemeState(currentResolvedTheme);

  }, []); // Empty dependency array: runs once on client mount

  // This effect runs when 'theme' (user preference) changes by calling setTheme,
  // or when system preference changes if current theme is "system".
  useEffect(() => {
    const applyAndStorePreference = (newPreference: Theme) => {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      let newResolved: "light" | "dark";

      if (newPreference === "system") {
        newResolved = systemPrefersDark ? "dark" : "light";
      } else {
        newResolved = newPreference;
      }

      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newResolved);
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newPreference); // Store the preference (light, dark, or system)
      setResolvedThemeState(newResolved);
    };
    
    // Only apply if theme is not the initial "system" (which is handled by the first useEffect)
    // or if it's explicitly changed.
    // The first useEffect handles the very first application. This one handles changes.
    if (typeof window !== 'undefined') { // Ensure this only runs client-side
        applyAndStorePreference(theme); 
    }


    // Listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      // Check the 'theme' state directly from the closure, not a stale 'currentThemePreference'
      setThemeState(currentTheme => {
        if (currentTheme === "system") { 
          applyAndStorePreference("system");
        }
        return currentTheme; // Return currentTheme to satisfy type, actual change done by applyAndStorePreference if needed
      });
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme]); // Runs when theme preference (user choice) changes

  const setTheme: Dispatch<SetStateAction<Theme>> = (newThemeValue) => {
    setThemeState(newThemeValue); // This will trigger the useEffect above
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
