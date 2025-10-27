import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { convexClient } from "@/lib/convex-server";
import { logError } from "@/lib/shared";
import type { SubscriptionStatus } from "@/types/subscription";

/**
 * Get subscription status for the authenticated user
 *
 * Note: This calls the Convex validateSubscriptionAndUsage query
 * which requires authentication. The auth token should be passed
 * in the request headers by the client.
 */
export async function GET(_request: NextRequest) {
  try {
    // Call Convex function to validate subscription and usage
    // Note: Convex Auth automatically handles authentication
    // from the token in the request headers
    const result = await convexClient.query(
      api.subscriptions.validateSubscriptionAndUsage,
      {}
    );

    const response: SubscriptionStatus = {
      isSubscribed: result.isSubscribed,
      requestsRemaining: result.requestsRemaining ?? Infinity,
      requestsUsed: result.requestsUsed,
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorObj =
      error instanceof Error ? error : new Error("Unknown error");
    logError(errorObj);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
