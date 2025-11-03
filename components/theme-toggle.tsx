"use client";

import { Moon, Sun } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "./tooltip-wrapper";

interface ThemeToggleProps extends React.ComponentProps<typeof Button> {}

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const originRef = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    originRef.current = { x: e.clientX, y: e.clientY };
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const coords = originRef.current ?? center;
    originRef.current = null;
    toggleTheme(coords);
  };

  return (
    <TooltipWrapper asChild label="Toggle theme">
      <Button
        className={cn("cursor-pointer", className)}
        {...props}
        aria-label={
          theme === "light" ? "Switch to dark theme" : "Switch to light theme"
        }
        aria-pressed={theme === "dark"}
        onClick={onClick}
        onPointerDown={onPointerDown}
      >
        {theme === "light" ? <Sun /> : <Moon />}
      </Button>
    </TooltipWrapper>
  );
}
