import { ConvexHttpClient } from "convex/browser";

/**
 * Server-side Convex client for API routes
 * Use this to call Convex functions from Next.js API routes
 */
export const convexClient = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);
