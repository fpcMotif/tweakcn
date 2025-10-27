import { PenLine } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditButtonProps extends React.ComponentProps<typeof Button> {
  themeId: string;
}

export function EditButton({
  themeId,
  disabled,
  className,
  ...props
}: EditButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEditing = pathname.includes(themeId);

  // Keep the current search params for tab persistence
  const href = `/editor/theme/${themeId}?${searchParams}`;

  return (
    <TooltipWrapper asChild label="Edit theme">
      <Link href={href}>
        <Button
          className={cn(className)}
          disabled={disabled || isEditing}
          size="sm"
          variant="ghost"
          {...props}
        >
          <PenLine className="size-3.5" />
          <span className="hidden text-sm md:block">Edit</span>
        </Button>
      </Link>
    </TooltipWrapper>
  );
}
