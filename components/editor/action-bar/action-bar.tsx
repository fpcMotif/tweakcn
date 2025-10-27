"use client";

import { ActionBarButtons } from "@/components/editor/action-bar/components/action-bar-buttons";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import {
  DialogActionsProvider,
  useDialogActions,
} from "@/hooks/use-dialog-actions";

export function ActionBar() {
  return (
    <DialogActionsProvider>
      <ActionBarContent />
    </DialogActionsProvider>
  );
}

function ActionBarContent() {
  const {
    isCreatingTheme,
    handleSaveClick,
    handleShareClick,
    setCssImportOpen,
    setCodePanelOpen,
  } = useDialogActions();

  return (
    <div className="border-b">
      <HorizontalScrollArea className="flex h-14 w-full items-center justify-end gap-4 px-4">
        <ActionBarButtons
          isSaving={isCreatingTheme}
          onCodeClick={() => setCodePanelOpen(true)}
          onImportClick={() => setCssImportOpen(true)}
          onSaveClick={() => handleSaveClick()}
          onShareClick={handleShareClick}
        />
      </HorizontalScrollArea>
    </div>
  );
}
