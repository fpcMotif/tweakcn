import { FileCode } from "lucide-react";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImportButtonProps extends React.ComponentProps<typeof Button> {}

export function ImportButton({ className, ...props }: ImportButtonProps) {
  return (
    <TooltipWrapper asChild label="Import CSS variables">
      <Button className={cn(className)} size="sm" variant="ghost" {...props}>
        <FileCode className="size-3.5" />
        <span className="hidden text-sm md:block">Import</span>
      </Button>
    </TooltipWrapper>
  );
}
