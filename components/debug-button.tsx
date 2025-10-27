import { Bug } from "lucide-react";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DebugButtonProps extends React.ComponentProps<typeof Button> {
  debug?: boolean;
}

const isDevMode = process.env.NODE_ENV === "development";

export function DebugButton({
  className,
  debug = isDevMode,
  ...props
}: DebugButtonProps) {
  if (!debug) return null;

  return (
    <TooltipWrapper asChild label="Debug">
      <Button
        className={cn("", className)}
        size="icon"
        variant="ghost"
        {...props}
      >
        <Bug />
      </Button>
    </TooltipWrapper>
  );
}
