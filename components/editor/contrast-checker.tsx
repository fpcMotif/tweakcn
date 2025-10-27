import { AlertTriangle, Check, Contrast, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThemeStyleProps } from "@/types/theme";
import { useContrastChecker } from "../../hooks/use-contrast-checker";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ContrastCheckerProps = {
  currentStyles: ThemeStyleProps;
};

const MIN_CONTRAST_RATIO = 4.5;

type ColorCategory = "content" | "interactive" | "functional";

type ColorPair = {
  id: string;
  foregroundId: keyof ThemeStyleProps;
  backgroundId: keyof ThemeStyleProps;
  foreground: string | undefined;
  background: string | undefined;
  label: string;
  category: ColorCategory;
};

const ContrastChecker = ({ currentStyles }: ContrastCheckerProps) => {
  const [filter, setFilter] = useState<"all" | "issues">("all");
  const { theme, toggleTheme } = useTheme();

  const colorPairsToCheck: ColorPair[] = [
    // Content - Base, background, cards, containers
    {
      id: "base",
      foregroundId: "foreground",
      backgroundId: "background",
      foreground: currentStyles?.["foreground"],
      background: currentStyles?.["background"],
      label: "Base",
      category: "content",
    },
    {
      id: "card",
      foregroundId: "card-foreground",
      backgroundId: "card",
      foreground: currentStyles?.["card-foreground"],
      background: currentStyles?.["card"],
      label: "Card",
      category: "content",
    },
    {
      id: "popover",
      foregroundId: "popover-foreground",
      backgroundId: "popover",
      foreground: currentStyles?.["popover-foreground"],
      background: currentStyles?.["popover"],
      label: "Popover",
      category: "content",
    },
    {
      id: "muted",
      foregroundId: "muted-foreground",
      backgroundId: "muted",
      foreground: currentStyles?.["muted-foreground"],
      background: currentStyles?.["muted"],
      label: "Muted",
      category: "content",
    },

    // Interactive - Buttons, links, actions
    {
      id: "primary",
      foregroundId: "primary-foreground",
      backgroundId: "primary",
      foreground: currentStyles?.["primary-foreground"],
      background: currentStyles?.["primary"],
      label: "Primary",
      category: "interactive",
    },
    {
      id: "secondary",
      foregroundId: "secondary-foreground",
      backgroundId: "secondary",
      foreground: currentStyles?.["secondary-foreground"],
      background: currentStyles?.["secondary"],
      label: "Secondary",
      category: "interactive",
    },
    {
      id: "accent",
      foregroundId: "accent-foreground",
      backgroundId: "accent",
      foreground: currentStyles?.["accent-foreground"],
      background: currentStyles?.["accent"],
      label: "Accent",
      category: "interactive",
    },

    // Functional - Sidebar, destructive, special purposes
    {
      id: "destructive",
      foregroundId: "destructive-foreground",
      backgroundId: "destructive",
      foreground: currentStyles?.["destructive-foreground"],
      background: currentStyles?.["destructive"],
      label: "Destructive",
      category: "functional",
    },
    {
      id: "sidebar",
      foregroundId: "sidebar-foreground",
      backgroundId: "sidebar",
      foreground: currentStyles?.["sidebar-foreground"],
      background: currentStyles?.["sidebar"],
      label: "Sidebar Base",
      category: "functional",
    },
    {
      id: "sidebar-primary",
      foregroundId: "sidebar-primary-foreground",
      backgroundId: "sidebar-primary",
      foreground: currentStyles?.["sidebar-primary-foreground"],
      background: currentStyles?.["sidebar-primary"],
      label: "Sidebar Primary",
      category: "functional",
    },
    {
      id: "sidebar-accent",
      foregroundId: "sidebar-accent-foreground",
      backgroundId: "sidebar-accent",
      foreground: currentStyles?.["sidebar-accent-foreground"],
      background: currentStyles?.["sidebar-accent"],
      label: "Sidebar Accent",
      category: "functional",
    },
  ];

  const validColorPairsToCheck = colorPairsToCheck.filter(
    (pair): pair is ColorPair & { foreground: string; background: string } =>
      !!pair.foreground && !!pair.background
  );
  const contrastResults = useContrastChecker(validColorPairsToCheck);

  const getContrastResult = (pairId: string) => {
    return contrastResults?.find((res) => res.id === pairId);
  };

  const totalIssues = contrastResults?.filter(
    (result) => result.contrastRatio < MIN_CONTRAST_RATIO
  ).length;

  const filteredPairs =
    filter === "all"
      ? colorPairsToCheck
      : colorPairsToCheck.filter((pair) => {
          const result = getContrastResult(pair.id);
          return result && result.contrastRatio < MIN_CONTRAST_RATIO;
        });

  // Group color pairs by category
  const categoryLabels: Record<ColorCategory, string> = {
    content: "Content & Containers",
    interactive: "Interactive Elements",
    functional: "Navigation & Functional",
  };

  const categories: ColorCategory[] = ["content", "interactive", "functional"];
  const groupedPairs = categories
    .map((category) => ({
      category,
      label: categoryLabels[category],
      pairs: filteredPairs.filter((pair) => pair.category === category),
    }))
    .filter((group) => group.pairs.length > 0);

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button className="w-full justify-start px-2" size="sm" variant="ghost">
          <Contrast className="h-4 w-4" />
          <span className="text-sm">Contrast</span>
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="flex max-h-[95dvh] flex-col gap-0 space-y-6 overflow-hidden shadow-lg sm:max-h-[min(700px,85dvh)] sm:w-[calc(100%-2rem)] sm:max-w-4xl sm:pt-6">
        <div className="flex flex-col items-end justify-between gap-4 px-6 sm:flex-row">
          <ResponsiveDialogHeader className="text-left">
            <ResponsiveDialogTitle>Contrast Checker</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              WCAG 2.0 AA requires a contrast ratio of at least{" "}
              {MIN_CONTRAST_RATIO}:1{" • "}
              <a
                className="text-primary hover:text-primary/80 underline transition-colors"
                href="https://www.w3.org/TR/WCAG21/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more
              </a>
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="hidden items-center gap-2 md:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
                  size="sm"
                  variant="ghost"
                >
                  {theme === "light" ? (
                    <Sun className="h-3.5 w-3.5" />
                  ) : (
                    <Moon className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Toggle theme</p>
              </TooltipContent>
            </Tooltip>
            <Button
              onClick={() => setFilter("all")}
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
            >
              All
            </Button>
            <Button
              disabled={totalIssues === 0}
              onClick={() => setFilter("issues")}
              size="sm"
              variant={filter === "issues" ? "default" : "outline"}
            >
              <AlertTriangle className={cn("mr-1 h-3 w-3")} />
              Issues ({totalIssues})
            </Button>
          </div>
        </div>

        <ScrollArea className="relative flex flex-1 flex-col">
          <div className="space-y-6 px-6">
            {groupedPairs.map((group) => (
              <div className="" key={group.category}>
                <div className="bg-background sticky -top-px z-10 flex items-center gap-2 pb-4 sm:rounded-b-xl">
                  <h2 className="text-md font-semibold">{group.label}</h2>
                  <Separator className="flex-1" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {group.pairs.map((pair) => {
                    const result = getContrastResult(pair.id);
                    const isValid =
                      result?.contrastRatio !== undefined &&
                      result?.contrastRatio >= MIN_CONTRAST_RATIO;
                    const contrastRatio =
                      result?.contrastRatio?.toFixed(2) ?? "N/A";
                    return (
                      <Card
                        className={cn(
                          "transition-all duration-200",
                          !isValid && "border-dashed"
                        )}
                        key={pair.id}
                      >
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <h3
                              className={cn(
                                "flex items-center font-medium",
                                !isValid && "text-destructive"
                              )}
                            >
                              {pair.label}
                              {!isValid && (
                                <AlertTriangle className="ml-1 size-3.5" />
                              )}
                            </h3>
                            <Badge
                              className={cn(
                                "flex items-center gap-1 text-xs",
                                isValid
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-destructive text-destructive-foreground"
                              )}
                              variant={isValid ? "default" : "destructive"}
                            >
                              {isValid ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  {contrastRatio}
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="h-3 w-3" />
                                  {contrastRatio}
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-1 flex-col items-center gap-3">
                              <div className="flex w-full items-center gap-3">
                                <div
                                  className="h-12 w-12 flex-shrink-0 rounded-md border shadow-sm"
                                  style={{
                                    backgroundColor:
                                      pair.background ?? "#000000",
                                  }}
                                ></div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium">
                                    Background
                                  </span>
                                  <span className="text-muted-foreground font-mono text-xs">
                                    {pair.background}
                                  </span>
                                </div>
                              </div>
                              <div className="flex w-full items-center gap-3">
                                <div
                                  className="h-12 w-12 flex-shrink-0 rounded-md border shadow-sm"
                                  style={{
                                    backgroundColor:
                                      pair.foreground ?? "#ffffff",
                                  }}
                                ></div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium">
                                    Foreground
                                  </span>
                                  <span className="text-muted-foreground font-mono text-xs">
                                    {pair.foreground}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div
                              className="flex h-full min-h-[120px] flex-1 items-center justify-center overflow-hidden rounded-lg border shadow-sm"
                              style={{
                                backgroundColor:
                                  pair.background ?? "transparent",
                              }}
                            >
                              {pair.foreground && pair.background ? (
                                <div className="p-4 text-center">
                                  <p
                                    className="mb-2 text-4xl font-bold tracking-wider"
                                    style={{ color: pair.foreground }}
                                  >
                                    Aa
                                  </p>
                                  <p
                                    className="text-sm font-medium"
                                    style={{ color: pair.foreground }}
                                  >
                                    Sample Text
                                  </p>
                                </div>
                              ) : (
                                <p className="text-muted-foreground text-xs">
                                  Preview
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default ContrastChecker;
