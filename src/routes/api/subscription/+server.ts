import { json } from "@sveltejs/kit";
import { api } from "$convex/_generated/api";
import { getConvexClient } from "$lib/convex-client";
import type { SubscriptionStatus } from "$types/subscription";
import type { RequestHandler } from "./$types";

/**
 * Get subscription status for the authenticated user
 *
 * Note: This calls the Convex validateSubscriptionAndUsage query
 * which requires authentication. The auth token should be passed
 * in the request headers by the client.
 */
export const GET: RequestHandler = async ({ locals }) => {
  try {
    const session = await locals.auth();
    if (!session?.user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call Convex function to validate subscription and usage
    const client = getConvexClient();
    const result = await client.query(
      api.subscriptions.validateSubscriptionAndUsage,
      {}
    );

    const response: SubscriptionStatus = {
      isSubscribed: result.isSubscribed,
      requestsRemaining: result.requestsRemaining ?? Number.POSITIVE_INFINITY,
      requestsUsed: result.requestsUsed,
    };

    return json(response);
  } catch (error) {
    console.error("Subscription check error:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
