import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { getCurrentUserId } from "./lib/auth";

const getDaysSinceEpoch = (daysAgo: number = 0): number =>
  Math.floor(Date.now() / (24 * 60 * 60 * 1000)) - daysAgo;

/**
 * Record AI usage for the authenticated user
 */
export const recordAIUsage = mutation({
  args: {
    modelId: v.string(),
    promptTokens: v.optional(v.number()),
    completionTokens: v.optional(v.number()),
  },
  returns: v.id("aiUsage"),
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);

    const promptTokens = args.promptTokens ?? 0;
    const completionTokens = args.completionTokens ?? 0;
    const daysSinceEpoch = getDaysSinceEpoch(0);

    const usageId = await ctx.db.insert("aiUsage", {
      userId,
      modelId: args.modelId,
      promptTokens: promptTokens.toString(),
      completionTokens: completionTokens.toString(),
      daysSinceEpoch: daysSinceEpoch.toString(),
    });

    return usageId;
  },
});

/**
 * Get usage stats for authenticated user for a given timeframe
 */
export const getMyUsageStats = query({
  args: {
    timeframe: v.union(v.literal("1d"), v.literal("7d"), v.literal("30d")),
  },
  returns: v.object({
    requests: v.number(),
    timeframe: v.union(v.literal("1d"), v.literal("7d"), v.literal("30d")),
  }),
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);

    const days = args.timeframe === "1d" ? 1 : args.timeframe === "7d" ? 7 : 30;
    const startDay = getDaysSinceEpoch(days);

    // Get all usage records for the user in the timeframe
    const allUsage = await ctx.db
      .query("aiUsage")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Filter by day range
    const filteredUsage = allUsage.filter(
      (record) => parseInt(record.daysSinceEpoch) >= startDay
    );

    return {
      requests: filteredUsage.length,
      timeframe: args.timeframe,
    };
  },
});

/**
 * Get all-time request count for a user
 */
export const getMyAllTimeRequestCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const allUsage = await ctx.db
      .query("aiUsage")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return allUsage.length;
  },
});

/**
 * Get chart data for usage visualization
 */
export const getMyUsageChartData = query({
  args: {
    timeframe: v.union(v.literal("1d"), v.literal("7d"), v.literal("30d")),
  },
  returns: v.array(
    v.object({
      daysSinceEpoch: v.optional(v.number()),
      hoursSinceEpoch: v.optional(v.number()),
      date: v.string(),
      totalRequests: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);

    // For 1d, we want hourly granularity
    if (args.timeframe === "1d") {
      const hours = 24;
      const startTime = Date.now() - hours * 60 * 60 * 1000;

      // Get all usage records for the user
      const allUsage = await ctx.db
        .query("aiUsage")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();

      // Filter by creation time (last 24 hours)
      const recentUsage = allUsage.filter(
        (record) => record._creationTime >= startTime
      );

      // Group by hour
      const chartData = [];
      for (let i = hours - 1; i >= 0; i--) {
        const hourStart = Date.now() - i * 60 * 60 * 1000;
        const hourEnd = Date.now() - (i - 1) * 60 * 60 * 1000;
        const hourEvents = recentUsage.filter(
          (e) => e._creationTime >= hourStart && e._creationTime < hourEnd
        );

        chartData.push({
          hoursSinceEpoch: Math.floor(hourStart / (60 * 60 * 1000)),
          date: new Date(hourStart).toISOString(),
          totalRequests: hourEvents.length,
        });
      }

      return chartData;
    }

    // Daily logic for 7d and 30d
    const days = args.timeframe === "7d" ? 7 : 30;
    const startDay = getDaysSinceEpoch(days);

    // Get all usage for the user
    const allUsage = await ctx.db
      .query("aiUsage")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Filter by day range
    const filteredUsage = allUsage.filter(
      (record) => parseInt(record.daysSinceEpoch) >= startDay
    );

    // Group by day
    const chartData = [];
    for (let i = days - 1; i >= 0; i--) {
      const daysSince = getDaysSinceEpoch(i);
      const dayEvents = filteredUsage.filter(
        (e) => parseInt(e.daysSinceEpoch) === daysSince
      );

      chartData.push({
        daysSinceEpoch: daysSince,
        date: new Date(daysSince * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        totalRequests: dayEvents.length,
      });
    }

    return chartData;
  },
});

/**
 * Internal query for detailed usage stats (including tokens)
 */
export const getDetailedUsageStats = internalQuery({
  args: {
    userId: v.string(),
    timeframe: v.union(v.literal("1d"), v.literal("7d"), v.literal("30d")),
    modelId: v.string(),
  },
  returns: v.object({
    requests: v.number(),
    promptTokens: v.number(),
    completionTokens: v.number(),
    totalTokens: v.number(),
    timeframe: v.union(v.literal("1d"), v.literal("7d"), v.literal("30d")),
  }),
  handler: async (ctx, args) => {
    const days = args.timeframe === "1d" ? 1 : args.timeframe === "7d" ? 7 : 30;
    const startDay = getDaysSinceEpoch(days);

    // Get all usage for the user and model
    const allUsage = await ctx.db
      .query("aiUsage")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter by model and day range
    const filteredUsage = allUsage.filter(
      (record) =>
        record.modelId === args.modelId &&
        parseInt(record.daysSinceEpoch) >= startDay
    );

    const requests = filteredUsage.length;
    const promptTokens = filteredUsage.reduce(
      (sum, e) => sum + parseInt(e.promptTokens),
      0
    );
    const completionTokens = filteredUsage.reduce(
      (sum, e) => sum + parseInt(e.completionTokens),
      0
    );

    return {
      requests,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      timeframe: args.timeframe,
    };
  },
});
