"use server";

import { NextRequest } from "next/server";
import { SubscriptionRequiredError } from "@/types/errors";

/**
 * Subscription validation functions for Convex migration
 *
 * Note: These functions are now handled by Convex queries/mutations.
 * See convex/subscriptions.ts for the actual implementation.
 *
 * This file is kept for backwards compatibility with API routes
 * but should be migrated to call Convex functions directly.
 */

export async function getMyActiveSubscription(_userId: string): Promise<any> {
  throw new Error(
    "getMyActiveSubscription: Use Convex query api.subscriptions.getMyActiveSubscription instead"
  );
}

export async function validateSubscriptionAndUsage(
  _userId: string
): Promise<any> {
  throw new Error(
    "validateSubscriptionAndUsage: Use Convex query api.subscriptions.validateSubscriptionAndUsage instead"
  );
}

export async function requireSubscriptionOrFreeUsage(
  _req: NextRequest
): Promise<void> {
  throw new SubscriptionRequiredError(
    "Use Convex functions for subscription validation"
  );
}
