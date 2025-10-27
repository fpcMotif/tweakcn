import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { getCurrentUserId } from "./lib/auth";

const AI_REQUEST_FREE_TIER_LIMIT = 25; // Match constant from lib/constants

/**
 * Get active subscription for authenticated user
 */
export const getMyActiveSubscription = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("subscriptions"),
      _creationTime: v.number(),
      polarId: v.string(),
      userId: v.optional(v.string()),
      createdAt: v.number(),
      modifiedAt: v.optional(v.number()),
      amount: v.number(),
      currency: v.string(),
      recurringInterval: v.string(),
      status: v.string(),
      currentPeriodStart: v.number(),
      currentPeriodEnd: v.number(),
      cancelAtPeriodEnd: v.boolean(),
      canceledAt: v.optional(v.number()),
      startedAt: v.number(),
      endsAt: v.optional(v.number()),
      endedAt: v.optional(v.number()),
      customerId: v.string(),
      productId: v.string(),
      discountId: v.optional(v.string()),
      checkoutId: v.string(),
      customerCancellationReason: v.optional(v.string()),
      customerCancellationComment: v.optional(v.string()),
      metadata: v.optional(v.string()),
      customFieldData: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId_and_status", (q) =>
        q.eq("userId", userId).eq("status", "active")
      )
      .collect();

    return subscriptions[0] ?? null;
  },
});

/**
 * Validate subscription and usage for authenticated user
 */
export const validateSubscriptionAndUsage = query({
  args: {},
  returns: v.object({
    canProceed: v.boolean(),
    isSubscribed: v.boolean(),
    requestsUsed: v.number(),
    requestsRemaining: v.union(v.number(), v.null()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    // Get active subscription
    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId_and_status", (q) =>
        q.eq("userId", userId).eq("status", "active")
      )
      .collect();

    const activeSubscription = subscriptions[0] ?? null;

    // Get request count
    const allUsage = await ctx.db
      .query("aiUsage")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const requestsUsed = allUsage.length;

    // Check if subscribed to Pro product
    const isSubscribed =
      !!activeSubscription &&
      activeSubscription.productId ===
        process.env.NEXT_PUBLIC_TWEAKCN_PRO_PRODUCT_ID;

    if (isSubscribed) {
      return {
        canProceed: true,
        isSubscribed: true,
        requestsUsed,
        requestsRemaining: null, // Unlimited for subscribers
      };
    }

    // Check free tier limits
    const requestsRemaining = Math.max(
      0,
      AI_REQUEST_FREE_TIER_LIMIT - requestsUsed
    );
    const canProceed = requestsUsed < AI_REQUEST_FREE_TIER_LIMIT;

    if (!canProceed) {
      return {
        canProceed: false,
        isSubscribed: false,
        requestsUsed,
        requestsRemaining: 0,
        error: `You've reached your free limit of ${AI_REQUEST_FREE_TIER_LIMIT} requests. Please upgrade to continue.`,
      };
    }

    return {
      canProceed: true,
      isSubscribed: false,
      requestsUsed,
      requestsRemaining,
    };
  },
});

/**
 * Internal mutation to upsert subscription from Polar webhook
 */
export const upsertSubscription = internalMutation({
  args: {
    subscriptionData: v.any(), // Polar webhook payload
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const data = args.subscriptionData;

    const safeParseDate = (
      value: string | number | null | undefined
    ): number | undefined => {
      if (!value) return undefined;
      if (typeof value === "number") return value;
      return new Date(value).getTime();
    };

    const userId = data.customer?.externalId as string | undefined;

    const subscriptionData = {
      polarId: data.id,
      createdAt: new Date(data.createdAt).getTime(),
      modifiedAt: safeParseDate(data.modifiedAt),
      amount: data.amount,
      currency: data.currency,
      recurringInterval: data.recurringInterval,
      status: data.status,
      currentPeriodStart: safeParseDate(data.currentPeriodStart) || Date.now(),
      currentPeriodEnd: safeParseDate(data.currentPeriodEnd) || Date.now(),
      cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
      canceledAt: safeParseDate(data.canceledAt),
      startedAt: safeParseDate(data.startedAt) || Date.now(),
      endsAt: safeParseDate(data.endsAt),
      endedAt: safeParseDate(data.endedAt),
      customerId: data.customerId,
      productId: data.productId,
      discountId: data.discountId || undefined,
      checkoutId: data.checkoutId || "",
      customerCancellationReason: data.customerCancellationReason || undefined,
      customerCancellationComment:
        data.customerCancellationComment || undefined,
      metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      customFieldData: data.customFieldData
        ? JSON.stringify(data.customFieldData)
        : undefined,
      userId,
    };

    console.log("💾 Upserting subscription:", {
      polarId: subscriptionData.polarId,
      status: subscriptionData.status,
      userId: subscriptionData.userId,
      amount: subscriptionData.amount,
    });

    // Check if subscription already exists
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_polarId", (q) => q.eq("polarId", data.id))
      .first();

    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, subscriptionData);
      console.log("✅ Updated existing subscription");
    } else {
      // Insert new subscription
      await ctx.db.insert("subscriptions", subscriptionData);
      console.log("✅ Created new subscription");
    }

    return null;
  },
});
