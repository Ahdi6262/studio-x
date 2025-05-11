
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LOCAL_STORAGE_THEME_KEY = 'appTheme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
      if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
        return storedTheme as Theme;
      }
    }
    return "dark"; // Default to dark if no preference or server-side
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  const applyTheme = useCallback((currentTheme: Theme) => {
    let newResolvedTheme: "light" | "dark";
    if (currentTheme === "system") {
      newResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      newResolvedTheme = currentTheme;
    }

    setResolvedTheme(newResolvedTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newResolvedTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  const setTheme: Dispatch<SetStateAction<Theme>> = (newThemeValue) => {
    setThemeState(prevTheme => {
      const finalNewTheme = typeof newThemeValue === 'function' ? newThemeValue(prevTheme) : newThemeValue;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, finalNewTheme);
      }
      applyTheme(finalNewTheme);
      return finalNewTheme;
    });
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

    