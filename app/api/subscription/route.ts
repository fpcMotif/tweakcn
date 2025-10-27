import { Effect, pipe } from "effect";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { safeApiCall } from "@/lib/effect-helpers";
import { getCurrentUserId, logError } from "@/lib/shared";
import { validateSubscriptionAndUsage } from "@/lib/subscription";
import type { SubscriptionStatus } from "@/types/subscription";

export function GET(request: NextRequest) {
  // Manage side effects and error handling using Effect-TS
  const program = pipe(
    safeApiCall(() => getCurrentUserId(request), "Get user ID"),
    Effect.flatMap((userId) =>
      safeApiCall(
        () => validateSubscriptionAndUsage(userId),
        "Validate subscription and usage"
      )
    ),
    Effect.map(({ isSubscribed, requestsRemaining, requestsUsed }) => {
      const response: SubscriptionStatus = {
        isSubscribed,
        requestsRemaining,
        requestsUsed,
      };
      return NextResponse.json(response);
    }),
    Effect.catchAll((error) =>
      Effect.sync(() => {
        const errorObj = new Error(
          error._tag === "ApiError" ? error.message : "Unknown error"
        );
        logError(errorObj);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      })
    )
  );

  return Effect.runPromise(program);
}
