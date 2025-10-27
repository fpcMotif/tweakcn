import { Check, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUpdateTheme } from "@/hooks/themes";
import { useEditorStore } from "@/store/editor-store";
import { Theme } from "@/types/theme";
import { ThemeSaveDialog } from "./theme-save-dialog";

interface ThemeEditActionsProps {
  theme: Theme;
  disabled?: boolean;
}

const ThemeEditActions: React.FC<ThemeEditActionsProps> = ({
  theme,
  disabled = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateThemeMutation = useUpdateTheme();
  const { themeState, applyThemePreset } = useEditorStore();
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);

  const mainEditorUrl = `/editor/theme?${searchParams}`;

  const handleThemeEditCancel = () => {
    // Keep the current search params for tab persistence
    router.push(mainEditorUrl);
    applyThemePreset(themeState?.preset || "default");
  };

  const handleSaveTheme = async (newName: string) => {
    const dataToUpdate: {
      id: string;
      name?: string;
      styles?: Theme["styles"];
    } = {
      id: theme.id,
    };

    if (newName !== theme.name) {
      dataToUpdate.name = newName;
    } else {
      dataToUpdate.name = theme.name;
    }

    if (themeState.styles) {
      dataToUpdate.styles = themeState.styles;
    }

    if (!dataToUpdate.name && !dataToUpdate.styles) {
      setIsNameDialogOpen(false);
      return;
    }

    try {
      const result = await updateThemeMutation.mutateAsync(dataToUpdate);
      if (result) {
        setIsNameDialogOpen(false);
        router.push(mainEditorUrl);
        applyThemePreset(String(result.id) || themeState?.preset || "default");
      }
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  const handleThemeEditSave = () => {
    setIsNameDialogOpen(true);
  };

  return (
    <>
      <div className="bg-card/80 text-card-foreground flex items-center">
        <div className="flex min-h-14 flex-1 items-center gap-2 px-4">
          <div className="flex animate-pulse items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-card-foreground/60 text-sm font-medium">
              Editing
            </span>
          </div>
          <span className="max-w-56 truncate px-2 text-sm font-semibold">
            {theme.name}
          </span>
        </div>

        <Separator className="bg-border h-8" orientation="vertical" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="size-14 shrink-0 rounded-none"
                disabled={disabled}
                onClick={handleThemeEditCancel}
                size="icon"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cancel changes</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator className="bg-border h-8" orientation="vertical" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="size-14 shrink-0 rounded-none"
                disabled={disabled}
                onClick={handleThemeEditSave}
                size="icon"
                variant="ghost"
              >
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save changes</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ThemeSaveDialog
        ctaLabel="Save Changes"
        description="Confirm or update the theme name before saving."
        initialThemeName={theme.name}
        isSaving={updateThemeMutation.isPending}
        onOpenChange={setIsNameDialogOpen}
        onSave={handleSaveTheme}
        open={isNameDialogOpen}
        title="Save Theme Changes"
      />
    </>
  );
};

export default ThemeEditActions;
