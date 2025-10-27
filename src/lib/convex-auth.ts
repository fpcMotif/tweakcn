import type { FunctionReference } from "convex/server";
import { writable } from "svelte/store";
import { api } from "../../convex/_generated/api";
import { getConvexClient } from "./convex-client";

/**
 * Auth store for tracking authentication state
 */
export const isAuthenticated = writable(false);
export const isLoading = writable(true);

/**
 * Sign in with a provider (Google, GitHub, etc.)
 * @param provider - The provider ID (e.g., 'google', 'github')
 * @param params - Optional parameters for the sign-in flow
 */
export async function signIn(
  provider: string,
  params?: Record<string, string>
): Promise<{ signingIn: boolean; redirect?: URL }> {
  const client = getConvexClient();

  try {
    // Call the Convex Auth signIn action
    const result = await client.action(
      api.auth.signIn as FunctionReference<"action", "public">,
      { provider, params: params || {} }
    );

    // If there's a redirect URL, navigate to it (for OAuth)
    if (result.redirect) {
      window.location.href = result.redirect;
      return { signingIn: false, redirect: new URL(result.redirect) };
    }

    return { signingIn: result.signingIn };
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const client = getConvexClient();

  try {
    await client.action(
      api.auth.signOut as FunctionReference<"action", "public">,
      {}
    );

    // Clear local auth state
    isAuthenticated.set(false);

    // Clear tokens from localStorage
    const convexUrl =
      import.meta.env.PUBLIC_CONVEX_URL ||
      import.meta.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      localStorage.removeItem(`convexAuth:${convexUrl}:token`);
      localStorage.removeItem(`convexAuth:${convexUrl}:refreshToken`);
    }
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

/**
 * Initialize auth state by checking for existing session
 */
export async function initAuth(): Promise<void> {
  isLoading.set(true);

  try {
    const client = getConvexClient();

    // Try to get current user to verify authentication
    const user = await client.query(
      api.users.getCurrentUser as FunctionReference<"query", "public">,
      {}
    );

    isAuthenticated.set(!!user);
  } catch (error) {
    // User is not authenticated
    isAuthenticated.set(false);
  } finally {
    isLoading.set(false);
  }
}
