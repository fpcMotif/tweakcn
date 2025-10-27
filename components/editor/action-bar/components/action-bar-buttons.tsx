import { Separator } from "@/components/ui/separator";
import { useAIThemeGenerationCore } from "@/hooks/use-ai-theme-generation-core";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { CodeButton } from "./code-button";
import { EditButton } from "./edit-button";
import { ImportButton } from "./import-button";
import { MoreOptions } from "./more-options";
import { ResetButton } from "./reset-button";
import { SaveButton } from "./save-button";
import { ShareButton } from "./share-button";
import { ThemeToggle } from "./theme-toggle";
import { UndoRedoButtons } from "./undo-redo-buttons";

interface ActionBarButtonsProps {
  onImportClick: () => void;
  onCodeClick: () => void;
  onSaveClick: () => void;
  onShareClick: (id?: string) => void;
  isSaving: boolean;
}

export function ActionBarButtons({
  onImportClick,
  onCodeClick,
  onSaveClick,
  onShareClick,
  isSaving,
}: ActionBarButtonsProps) {
  const { themeState, resetToCurrentPreset, hasUnsavedChanges } =
    useEditorStore();
  const { isGeneratingTheme } = useAIThemeGenerationCore();
  const { getPreset } = useThemePresetStore();
  const currentPreset = themeState?.preset
    ? getPreset(themeState?.preset)
    : undefined;
  const isSavedPreset = !!currentPreset && currentPreset.source === "SAVED";

  const handleReset = () => {
    resetToCurrentPreset();
  };

  return (
    <div className="flex items-center gap-1">
      <MoreOptions disabled={isGeneratingTheme} />
      <Separator className="mx-1 h-8" orientation="vertical" />
      <ThemeToggle />
      <Separator className="mx-1 h-8" orientation="vertical" />
      <UndoRedoButtons disabled={isGeneratingTheme} />
      <Separator className="mx-1 h-8" orientation="vertical" />
      <ResetButton
        disabled={!hasUnsavedChanges() || isGeneratingTheme}
        onClick={handleReset}
      />
      <div className="hidden items-center gap-1 md:flex">
        <ImportButton disabled={isGeneratingTheme} onClick={onImportClick} />
      </div>
      <Separator className="mx-1 h-8" orientation="vertical" />
      {isSavedPreset && (
        <EditButton
          disabled={isGeneratingTheme}
          themeId={themeState.preset as string}
        />
      )}
      <ShareButton
        disabled={isGeneratingTheme}
        onClick={() => onShareClick(themeState.preset)}
      />
      <SaveButton
        disabled={isGeneratingTheme}
        isSaving={isSaving}
        onClick={onSaveClick}
      />
      <CodeButton disabled={isGeneratingTheme} onClick={onCodeClick} />
    </div>
  );
}
