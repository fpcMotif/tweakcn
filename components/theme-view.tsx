"use client";

import { Edit, Moon, MoreVertical, Share, Sun } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useEditorStore } from "@/store/editor-store";
import type { Theme } from "@/types/theme";
import ThemePreviewPanel from "./editor/theme-preview-panel";

export default function ThemeView({ theme }: { theme: Theme }) {
  const {
    themeState,
    setThemeState,
    saveThemeCheckpoint,
    restoreThemeCheckpoint,
  } = useEditorStore();
  const router = useRouter();
  const currentMode = themeState.currentMode;

  useEffect(() => {
    saveThemeCheckpoint();
    setThemeState({
      ...themeState,
      styles: theme.styles,
    });
    return () => {
      restoreThemeCheckpoint();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, saveThemeCheckpoint, setThemeState, restoreThemeCheckpoint]);

  if (!theme) {
    notFound();
  }

  const toggleTheme = () => {
    setThemeState({
      ...themeState,
      currentMode: currentMode === "light" ? "dark" : "light",
    });
  };

  const handleOpenInEditor = () => {
    setThemeState({
      ...themeState,
      styles: theme.styles,
    });
    saveThemeCheckpoint();
    router.push("/editor/theme");
  };

  const handleShare = () => {
    const url = `https://tweakcn.com/themes/${theme.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Theme URL copied to clipboard!",
    });
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{theme.name}</h1>
        <div className="flex items-center gap-2">
          <Button onClick={toggleTheme} size="icon" variant="outline">
            {currentMode === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
          <Button onClick={handleShare} size="default" variant="outline">
            <Share className="size-4" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2" onClick={handleOpenInEditor}>
                <Edit className="size-4" />
                Open in Editor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="-m-4 mt-6 flex h-[min(80svh,900px)] flex-col">
        <ThemePreviewPanel currentMode={currentMode} styles={theme.styles} />
      </div>
    </>
  );
}
