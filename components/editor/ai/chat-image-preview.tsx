import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { ComponentProps } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { cn } from "@/lib/utils";

interface ChatImagePreviewProps extends ComponentProps<typeof Image> {
  name?: string;
}

export function ChatImagePreview({
  name,
  src,
  className,
  alt,
  ...props
}: ChatImagePreviewProps) {
  return (
    <ResponsiveDialog onlyDialog>
      <ResponsiveDialogTrigger asChild>
        <div className="group/preview relative isolate size-full cursor-pointer overflow-hidden rounded-lg border">
          <Image
            alt={alt || "Image preview"}
            className={cn(
              "h-auto max-h-[250px] w-auto max-w-[250px] object-cover object-center",
              className
            )}
            height={250}
            src={src}
            title={name}
            width={250}
            {...props}
          />

          <div className="bg-accent/75 text-accent-foreground border-border/50! absolute right-2 bottom-2 z-1 flex items-center justify-end rounded-lg border p-1 opacity-0 backdrop-blur transition-opacity group-hover/preview:opacity-100">
            <ImageIcon className="size-3.5" />
          </div>
        </div>
      </ResponsiveDialogTrigger>

      <ResponsiveDialogContent
        className="size-fit max-h-[80dvh] overflow-hidden sm:max-w-[80vw]"
        closeButtonClassName="bg-white/10 backdrop-blur-md"
      >
        <ResponsiveDialogHeader className="sr-only">
          <ResponsiveDialogTitle>Image Preview</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <Image
          alt="Full image preview"
          className="size-auto max-h-[80vh] max-w-[80vw] object-contain"
          height={500}
          src={src}
          width={500}
        />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
