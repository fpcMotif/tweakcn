"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Re-export Convex Auth hooks for use throughout the app
 */
export { useAuthActions } from "@convex-dev/auth/react";

/**
 * Custom hook that wraps Convex Auth's currentUser query
 * Returns session data in a format compatible with the existing codebase
 */
export function useSession() {
  const user = useQuery(api.users.currentUser);

  return {
    data: user
      ? {
          user: {
            id: user._id,
            name: user.name || null,
            email: user.email || null,
            image: user.image || null,
          },
        }
      : null,
    isPending: user === undefined,
  };
}

/**
 * Compatibility wrapper for authClient API
 * Provides a better-auth-like interface on top of Convex Auth
 */
export const authClient = {
  useSession,
  signOut: async () => {
    // We need to get signOut from useAuthActions
    // This is a limitation - signOut needs to be called from within a component
    // For now, we'll throw an error with instructions
    throw new Error(
      "authClient.signOut() cannot be called directly. Use the useAuthActions hook instead:\n" +
        "const { signOut } = useAuthActions();\n" +
        "await signOut();"
    );
  },
};
