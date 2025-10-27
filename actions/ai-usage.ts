"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

/**
 * Get AI usage statistics for the current user
 */
export async function getMyUsageStats(timeframe: "1d" | "7d" | "30d" = "7d") {
  const token = await convexAuthNextjsToken();

  const stats = await fetchQuery(
    api.aiUsage.getMyUsageStats,
    { timeframe },
    { token }
  );

  return stats;
}

/**
 * Get AI usage chart data for the current user
 */
export async function getMyUsageChartData(
  timeframe: "1d" | "7d" | "30d" = "7d"
) {
  const token = await convexAuthNextjsToken();

  const chartData = await fetchQuery(
    api.aiUsage.getMyUsageChartData,
    { timeframe },
    { token }
  );

  return chartData;
}

/**
 * Record AI usage
 */
export async function recordAIUsage(data: {
  modelId: string;
  promptTokens: number | string;
  completionTokens: number | string;
}) {
  const token = await convexAuthNextjsToken();

  await fetchMutation(
    api.aiUsage.recordAIUsage,
    {
      modelId: data.modelId,
      promptTokens:
        typeof data.promptTokens === "string"
          ? Number.parseInt(data.promptTokens, 10)
          : data.promptTokens,
      completionTokens:
        typeof data.completionTokens === "string"
          ? Number.parseInt(data.completionTokens, 10)
          : data.completionTokens,
    },
    { token }
  );
}
