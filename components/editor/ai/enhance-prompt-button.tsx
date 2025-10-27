import { CircleStop, WandSparkles } from "lucide-react";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnhancePromptButtonProps extends React.ComponentProps<typeof Button> {
  isEnhancing: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function EnhancePromptButton({
  className,
  disabled,
  isEnhancing,
  onStart,
  onStop,
  ...props
}: EnhancePromptButtonProps) {
  return (
    <TooltipWrapper asChild label={isEnhancing ? "Stop" : "Enhance prompt"}>
      <Button
        className={cn("relative size-8 shadow-none", className)}
        disabled={disabled}
        onClick={isEnhancing ? onStop : onStart}
        size="icon"
        variant={isEnhancing ? "destructive" : "outline"}
        {...props}
      >
        {isEnhancing ? <CircleStop /> : <WandSparkles />}
      </Button>
    </TooltipWrapper>
  );
}
