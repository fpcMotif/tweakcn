"use client";

import {
  Copy,
  Edit,
  ExternalLink,
  Loader2,
  MoreVertical,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useDeleteTheme } from "@/hooks/themes";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { Theme } from "@/types/theme"; // Assuming Theme type includes foreground colors

interface ThemeCardProps {
  theme: Theme;
  className?: string;
}

type SwatchDefinition = {
  name: string; // Text to display on hover
  bgKey: keyof Theme["styles"]["light" | "dark"]; // Key for background color
  fgKey: keyof Theme["styles"]["light" | "dark"]; // Key for text color
};

const swatchDefinitions: SwatchDefinition[] = [
  { name: "Primary", bgKey: "primary", fgKey: "primary-foreground" },
  { name: "Secondary", bgKey: "secondary", fgKey: "secondary-foreground" },
  { name: "Accent", bgKey: "accent", fgKey: "accent-foreground" },
  { name: "Muted", bgKey: "muted", fgKey: "muted-foreground" },
  // Special case: Background swatch shows "Foreground" text using the main foreground color
  { name: "Background", bgKey: "background", fgKey: "foreground" },
];

export function ThemeCard({ theme, className }: ThemeCardProps) {
  const { themeState, setThemeState } = useEditorStore();
  const deleteThemeMutation = useDeleteTheme();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const mode = themeState.currentMode;

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteThemeMutation.mutate(theme.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  const handleQuickApply = () => {
    setThemeState({
      ...themeState,
      styles: theme.styles,
    });
  };

  const handleShare = () => {
    const url = `https://tweakcn.com/themes/${theme.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Theme URL copied to clipboard!",
    });
  };

  const colorSwatches = useMemo(() => {
    return swatchDefinitions.map((def) => ({
      name: def.name,
      // Get background color, fallback to a default if necessary (e.g., white)
      bg: theme.styles[mode][def.bgKey] || "#ffffff",
      // Get foreground color, fallback to main foreground or a default (e.g., black)
      fg:
        theme.styles[mode][def.fgKey] ||
        theme.styles[mode].foreground ||
        "#000000",
    }));
  }, [mode, theme.styles]);

  return (
    <Card
      className={cn(
        "group overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="relative flex h-36">
        {colorSwatches.map((swatch) => (
          <div
            // Use a combination for a more robust key
            className={cn(
              "group/swatch relative h-full flex-1 transition-all duration-300 ease-in-out",
              "hover:flex-grow-[1.5]"
            )}
            key={swatch.name + swatch.bg}
            style={{ backgroundColor: swatch.bg }}
          >
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "opacity-0 group-hover/swatch:opacity-100",
                "transition-opacity duration-300 ease-in-out",
                "pointer-events-none text-xs font-medium"
              )}
              style={{ color: swatch.fg }}
            >
              {swatch.name}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-background flex items-center justify-between p-4">
        <div>
          <h3 className={cn("text-foreground text-sm font-medium")}>
            {theme.name}
          </h3>
          <p className="text-muted-foreground text-xs">
            {new Date(theme.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="hover:bg-accent rounded-md p-2">
              <MoreVertical className="text-muted-foreground h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover w-48">
            <DropdownMenuItem className="gap-2" onClick={handleQuickApply}>
              <Zap className="h-4 w-4" />
              Quick Apply
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="gap-2">
              <Link href={`/themes/${theme.id}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                Open Theme
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="gap-2">
              <Link href={`/editor/theme/${theme.id}`}>
                <Edit className="h-4 w-4" />
                Edit Theme
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={handleShare}>
              <Copy className="h-4 w-4" />
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-2" />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive gap-2"
              disabled={deleteThemeMutation.isPending}
              onClick={handleDelete}
            >
              {deleteThemeMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Theme
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete your {theme.name} theme?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              theme.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteThemeMutation.isPending}
              onClick={handleConfirmDelete}
            >
              {deleteThemeMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
