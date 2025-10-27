import { MutationCtx, QueryCtx } from "../_generated/server";
import { auth } from "../auth";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Get the current authenticated user ID from Convex Auth context
 * @throws UnauthorizedError if user is not authenticated
 */
export async function getCurrentUserId(
  ctx: QueryCtx | MutationCtx
): Promise<string> {
  const userId = await auth.getUserId(ctx);

  if (!userId) {
    throw new UnauthorizedError();
  }

  return userId;
}

/**
 * Get the current authenticated user object from Convex Auth
 * @throws UnauthorizedError if user is not authenticated
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getCurrentUserId(ctx);
  const user = await ctx.db.get(userId as any);

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return user;
}
