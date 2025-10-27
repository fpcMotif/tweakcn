"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { getMyUsageChartData, getMyUsageStats } from "@/actions/ai-usage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type Timeframe = "1d" | "7d" | "30d";

interface UsageStats {
  requests: number;
  timeframe: Timeframe;
}

interface ChartDataPoint {
  daysSinceEpoch?: number;
  hoursSinceEpoch?: number;
  date: string;
  totalRequests: number;
}

const timeframeLabels = {
  "1d": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};

const chartConfig = {
  totalRequests: {
    label: "Requests",
    color: "var(--primary)",
  },
};

export function UsageStats() {
  const [timeframe, setTimeframe] = useState<Timeframe>("7d");
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, chartDataResponse] = await Promise.all([
          getMyUsageStats(timeframe),
          getMyUsageChartData(timeframe),
        ]);
        setStats(statsData);
        setChartData(chartDataResponse);
      } catch (error) {
        console.error("Error fetching usage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  const formatDate = (dateString: string, timeframe: Timeframe) => {
    const date = new Date(dateString);
    if (timeframe === "1d") {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Select
          onValueChange={(value: Timeframe) => setTimeframe(value)}
          value={timeframe}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-3xl font-bold tracking-tight">
                {stats?.requests || 0}
              </div>
              <p className="text-muted-foreground text-sm">
                requests in {timeframeLabels[timeframe].toLowerCase()}
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-[200px] w-full rounded-md" />
            </div>
          ) : chartData.length > 0 ? (
            <ChartContainer className="h-[200px] w-full" config={chartConfig}>
              <BarChart data={chartData}>
                <XAxis
                  axisLine={false}
                  className="text-xs"
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value, timeframe)}
                  tickLine={false}
                />
                <YAxis hide />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => formatDate(value, timeframe)}
                />
                <Bar
                  dataKey="totalRequests"
                  fill="var(--color-totalRequests)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  No usage data available
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Make some AI requests to see your usage statistics
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
