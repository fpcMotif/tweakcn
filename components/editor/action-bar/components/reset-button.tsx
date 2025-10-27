import { RefreshCw } from "lucide-react";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResetButtonProps extends React.ComponentProps<typeof Button> {}

export function ResetButton({ className, ...props }: ResetButtonProps) {
  return (
    <TooltipWrapper asChild label="Reset to preset defaults">
      <Button className={cn(className)} size="sm" variant="ghost" {...props}>
        <RefreshCw className="size-3.5" />
        <span className="hidden text-sm md:block">Reset</span>
      </Button>
    </TooltipWrapper>
  );
}
