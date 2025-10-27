"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

/**
 * Convex client provider for the application
 * Wraps the app with ConvexAuthProvider
 */
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!),
    []
  );

  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
