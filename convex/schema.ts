import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Schema for TweakCN application
export default defineSchema({
  // Convex Auth tables (users, sessions, authAccounts, etc.)
  ...authTables,

  // Theme storage
  themes: defineTable({
    userId: v.string(), // References auth users table
    name: v.string(),
    styles: v.any(), // JSON object for ThemeStyles
  }).index("by_userId", ["userId"]),

  // AI usage tracking
  aiUsage: defineTable({
    userId: v.string(),
    modelId: v.string(),
    promptTokens: v.string(), // Stored as string to match original schema
    completionTokens: v.string(),
    daysSinceEpoch: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_day", ["userId", "daysSinceEpoch"]),

  // Polar subscriptions
  subscriptions: defineTable({
    // Polar subscription ID (not Convex _id)
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
    metadata: v.optional(v.string()), // JSON string
    customFieldData: v.optional(v.string()), // JSON string
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_status", ["userId", "status"])
    .index("by_polarId", ["polarId"]),
});
