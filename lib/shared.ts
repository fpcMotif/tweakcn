import { NextRequest } from "next/server";
import { UnauthorizedError } from "@/types/errors";

/**
 * Get current user ID from request
 *
 * Note: With Convex Auth, authentication is handled differently.
 * For server-side API routes, you should call Convex functions directly
 * which will handle authentication via the Convex Auth context.
 *
 * This function is kept for backwards compatibility with existing API routes
 * but should be migrated to use Convex functions directly.
 */
export async function getCurrentUserId(_req?: NextRequest): Promise<string> {
  // TODO: Implement Convex Auth token verification for API routes
  // For now, this will throw an error to prevent unauthenticated access
  throw new UnauthorizedError(
    "Authentication via API routes not yet implemented. Use Convex functions instead."
  );
}

/**
 * Get current user from request
 *
 * @deprecated Use Convex queries/mutations with Convex Auth instead
 */
export async function getCurrentUser(_req?: NextRequest): Promise<any> {
  throw new UnauthorizedError(
    "Authentication via API routes not yet implemented. Use Convex functions instead."
  );
}

export function logError(error: Error, context?: Record<string, unknown>) {
  console.error("Action error:", error, context);

  if (error.name === "UnauthorizedError" || error.name === "ValidationError") {
    console.warn("Expected error:", { error: error.message, context });
  } else {
    console.error("Unexpected error:", {
      error: error.message,
      stack: error.stack,
      context,
    });
  }
}
