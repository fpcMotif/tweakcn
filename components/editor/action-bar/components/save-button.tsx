import { Heart, Loader2 } from "lucide-react";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SaveButtonProps extends React.ComponentProps<typeof Button> {
  isSaving: boolean;
}

export function SaveButton({
  isSaving,
  disabled,
  className,
  ...props
}: SaveButtonProps) {
  return (
    <TooltipWrapper asChild label="Save theme">
      <Button
        className={cn(className)}
        disabled={isSaving || disabled}
        size="sm"
        variant="ghost"
        {...props}
      >
        {isSaving ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Heart className="size-3.5" />
        )}
        <span className="hidden text-sm md:block">Save</span>
      </Button>
    </TooltipWrapper>
  );
}
