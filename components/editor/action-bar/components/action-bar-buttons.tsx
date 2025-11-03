import { Separator } from "@/components/ui/separator";
import { useAIThemeGenerationCore } from "@/hooks/use-ai-theme-generation-core";
import { useHydrated } from "@/hooks/use-hydrated";
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
  const hydrated = useHydrated();
  const disabledUi = hydrated && isGeneratingTheme;
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
      <MoreOptions disabled={disabledUi} />
      <Separator className="mx-1 h-8" orientation="vertical" />
      <ThemeToggle />
      <Separator className="mx-1 h-8" orientation="vertical" />
      <UndoRedoButtons disabled={disabledUi} />
      <Separator className="mx-1 h-8" orientation="vertical" />
      <ResetButton
        disabled={!hasUnsavedChanges() || disabledUi}
        onClick={handleReset}
      />
      <div className="hidden items-center gap-1 md:flex">
        <ImportButton disabled={disabledUi} onClick={onImportClick} />
      </div>
      <Separator className="mx-1 h-8" orientation="vertical" />
      {isSavedPreset && (
        <EditButton
          disabled={disabledUi}
          themeId={themeState.preset as string}
        />
      )}
      <ShareButton
        disabled={disabledUi}
        onClick={() => onShareClick(themeState.preset)}
      />
      <SaveButton
        disabled={disabledUi}
        isSaving={isSaving}
        onClick={onSaveClick}
      />
      <CodeButton disabled={disabledUi} onClick={onCodeClick} />
    </div>
  );
}
