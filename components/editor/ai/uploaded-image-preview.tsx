"use client";

import { Loader, X } from "lucide-react";
import Image from "next/image";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  src: string;
  isImageLoading: boolean;
  handleImageRemove: () => void;
  showPreviewOnHover?: boolean;
}

export function UploadedImagePreview({
  src,
  isImageLoading,
  handleImageRemove,
  showPreviewOnHover = true,
}: ImagePreviewProps) {
  if (isImageLoading) {
    return (
      <div className="bg-muted flex size-14 items-center justify-center rounded-md border">
        <Loader className="text-muted-foreground size-4 animate-spin" />
      </div>
    );
  }

  return (
    <HoverCard closeDelay={150} openDelay={150}>
      <HoverCardTrigger asChild>
        <div
          className={cn(
            "group/preview animate-in fade-in-0 relative size-14 shrink-0 rounded-md border p-0.5 transition-all",
            "hover:bg-accent"
          )}
        >
          <Image
            alt="Image preview"
            className="size-full rounded-sm object-cover"
            height={40}
            src={src}
            width={40}
          />

          <TooltipWrapper asChild label="Remove image">
            <Button
              className={cn(
                "absolute top-1 right-1 size-4 rounded-full transition-all"
              )}
              onClick={handleImageRemove}
              size="icon"
              variant="destructive"
            >
              <X className="size-3!" />
            </Button>
          </TooltipWrapper>
        </div>
      </HoverCardTrigger>

      {showPreviewOnHover && (
        <HoverCardContent
          align="center"
          className="size-fit overflow-hidden p-0"
          side="top"
        >
          <div className="size-full overflow-hidden">
            <Image
              alt="Image preview"
              className="h-auto max-h-[300px] w-auto max-w-[300px] object-contain"
              height={300}
              src={src}
              width={300}
            />
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
}
