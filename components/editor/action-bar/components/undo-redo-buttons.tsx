import { Redo, Undo } from "lucide-react";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";

interface UndoRedoButtonsProps extends React.ComponentProps<typeof Button> {}

export function UndoRedoButtons({ disabled, ...props }: UndoRedoButtonsProps) {
  const { undo, redo, canUndo, canRedo } = useEditorStore();

  return (
    <div className="flex items-center gap-1">
      <TooltipWrapper asChild label="Undo">
        <Button
          disabled={disabled || !canUndo()}
          size="icon"
          variant="ghost"
          {...props}
          onClick={undo}
        >
          <Undo className="h-4 w-4" />
        </Button>
      </TooltipWrapper>

      <TooltipWrapper asChild label="Redo">
        <Button
          disabled={disabled || !canRedo()}
          size="icon"
          variant="ghost"
          {...props}
          onClick={redo}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </TooltipWrapper>
    </div>
  );
}
