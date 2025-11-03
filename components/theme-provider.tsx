"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { useThemePresetFromUrl } from "@/hooks/use-theme-preset-from-url";
import {
  type ThemeMode,
  useThemeTransition,
} from "@/hooks/use-theme-transition";
import { applyThemeToElement } from "@/utils/apply-theme";
import { useEditorStore } from "../store/editor-store";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
};

type Coords = { x: number; y: number };

type ThemeProviderState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: (coords?: Coords) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { themeState } = useEditorStore();
  const { mode, setMode, toggleAt } = useThemeTransition();

  // Handle theme preset from URL
  useThemePresetFromUrl();

  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;

    applyThemeToElement(themeState, root);
  }, [themeState]);

  const value = useMemo<ThemeProviderState>(
    () => ({
      theme: mode,
      setTheme: setMode,
      toggleTheme: toggleAt,
    }),
    [mode, setMode, toggleAt]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
