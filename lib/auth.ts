/**
 * Server-side auth utilities for Convex Auth
 *
 * Note: Convex Auth handles authentication via HTTP routes
 * mounted in convex/http.ts. This file provides a compatibility
 * layer for the better-auth style API.
 */

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

/**
 * Auth object that mimics better-auth API structure
 * Provides compatibility with existing code that uses auth.api.getSession
 */
export const auth = {
  api: {
    async getSession(_options?: { headers?: Headers | Promise<Headers> }) {
      try {
        const token = await convexAuthNextjsToken();

        if (!token) {
          return null;
        }

        const user = await fetchQuery(api.users.currentUser, {}, { token });

        if (!user) {
          return null;
        }

        return {
          session: {
            id: user._id,
            userId: user._id,
          },
          user: {
            id: user._id,
            name: user.name || null,
            email: user.email || null,
            image: user.image || null,
          },
        };
      } catch (error) {
        console.error("Failed to get session:", error);
        return null;
      }
    },
  },
};
