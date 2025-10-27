import { Loader2, Share2 } from "lucide-react";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonProps extends React.ComponentProps<typeof Button> {
  isSharing?: boolean;
}

export function ShareButton({
  onClick,
  isSharing,
  disabled,
  className,
  ...props
}: ShareButtonProps) {
  return (
    <TooltipWrapper asChild label="Share theme">
      <Button
        className={cn(className)}
        disabled={isSharing || disabled}
        onClick={onClick}
        size="sm"
        variant="ghost"
        {...props}
      >
        {isSharing ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Share2 className="size-3.5" />
        )}
        <span className="hidden text-sm md:block">Share</span>
      </Button>
    </TooltipWrapper>
  );
}
