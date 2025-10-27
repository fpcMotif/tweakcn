import { ConvexClient } from "convex/browser";
import { type Readable, writable } from "svelte/store";
import { browser } from "$app/environment";

// Get Convex URL from environment (supports both naming conventions)
const CONVEX_URL =
  import.meta.env.PUBLIC_CONVEX_URL || import.meta.env.NEXT_PUBLIC_CONVEX_URL;

// Create singleton Convex client
let convexClient: ConvexClient | null = null;

export function getConvexClient(): ConvexClient {
  if (!convexClient) {
    if (!CONVEX_URL) {
      throw new Error(
        "CONVEX_URL is not defined. Set PUBLIC_CONVEX_URL or NEXT_PUBLIC_CONVEX_URL"
      );
    }
    convexClient = new ConvexClient(CONVEX_URL);

    // Set up Convex Auth token handler
    if (browser) {
      convexClient.setAuth(async () => {
        // Get token from localStorage (Convex Auth stores it there)
        const token = localStorage.getItem(`convexAuth:${CONVEX_URL}:token`);
        return token;
      });
    }
  }
  return convexClient;
}

/**
 * Create a reactive Svelte store for a Convex query
 * @param query - The Convex query function reference
 * @param args - Arguments to pass to the query
 * @returns A readable store with the query result
 */
export function convexQuery<T>(
  query: any,
  args: Record<string, any> = {}
): Readable<T | undefined> {
  const client = getConvexClient();
  const store = writable<T | undefined>(undefined);

  // Subscribe to query updates
  client.onUpdate(query, args, (value: T) => {
    store.set(value);
  });

  return {
    subscribe: store.subscribe,
    // Note: Consider implementing cleanup logic when the store is destroyed
  };
}

/**
 * Execute a Convex mutation
 * @param mutation - The Convex mutation function reference
 * @param args - Arguments to pass to the mutation
 * @returns Promise with the mutation result
 */
export async function convexMutation<T>(
  mutation: any,
  args: Record<string, any> = {}
): Promise<T> {
  const client = getConvexClient();
  return client.mutation(mutation, args);
}

/**
 * Execute a Convex action
 * @param action - The Convex action function reference
 * @param args - Arguments to pass to the action
 * @returns Promise with the action result
 */
export async function convexAction<T>(
  action: any,
  args: Record<string, any> = {}
): Promise<T> {
  const client = getConvexClient();
  return client.action(action, args);
}
