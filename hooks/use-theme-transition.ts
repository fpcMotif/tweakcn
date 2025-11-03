"use client";

import { useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import { useEditorStore } from "@/store/editor-store";

export type ThemeMode = "light" | "dark";
type Coords = { x: number; y: number };

function supportsViewTransitions(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof (document as Document & { startViewTransition?: unknown })
      .startViewTransition === "function"
  );
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  );
}

export function useThemeTransition(): {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleAt: (coords?: Coords) => void;
} {
  const { themeState } = useEditorStore();
  const isTransitioningRef = useRef(false);

  const setMode = useCallback((mode: ThemeMode) => {
    const { themeState: current, setThemeState } = useEditorStore.getState();
    setThemeState({ ...current, currentMode: mode });
  }, []);

  const toggleAt = useCallback(
    (coords?: Coords) => {
      if (typeof document === "undefined") return; // SSR safety

      if (isTransitioningRef.current) return; // Re-entrancy guard

      const root = document.documentElement;
      const next: ThemeMode =
        themeState.currentMode === "light" ? "dark" : "light";

      const skipAnimation =
        prefersReducedMotion() || !supportsViewTransitions();
      if (skipAnimation) {
        setMode(next);
        return;
      }

      // Set origin vars (or clear for center default)
      if (coords) {
        root.style.setProperty("--x", `${coords.x}px`);
        root.style.setProperty("--y", `${coords.y}px`);
      } else {
        root.style.removeProperty("--x");
        root.style.removeProperty("--y");
      }

      const startVT = (
        document as Document & {
          startViewTransition?: (cb: () => void) => { finished: Promise<void> };
        }
      ).startViewTransition?.bind(document);

      if (!startVT) {
        setMode(next);
        root.style.removeProperty("--x");
        root.style.removeProperty("--y");
        return;
      }

      isTransitioningRef.current = true;
      try {
        const vt = startVT(() => {
          flushSync(() => {
            setMode(next);
          });
        });
        vt?.finished.finally(() => {
          isTransitioningRef.current = false;
          root.style.removeProperty("--x");
          root.style.removeProperty("--y");
        });
      } catch {
        isTransitioningRef.current = false;
        setMode(next);
        root.style.removeProperty("--x");
        root.style.removeProperty("--y");
      }
    },
    [themeState.currentMode, setMode]
  );

  return { mode: themeState.currentMode, setMode, toggleAt };
}
