import { ImagePlus } from "lucide-react";
import { ComponentProps } from "react";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { MAX_IMAGE_FILE_SIZE, MAX_IMAGE_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ALLOWED_IMAGE_TYPES } from "@/utils/ai/image-upload";

interface ImageUploaderProps extends ComponentProps<typeof Button> {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImagesUpload: (files: File[]) => void;
}

export function ImageUploader({
  fileInputRef,
  onImagesUpload,
  disabled,
  className,
  ...props
}: ImageUploaderProps) {
  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const files = Array.from(fileList);
    onImagesUpload(files);
  };

  return (
    <>
      <input
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        aria-label="Upload image for theme generation"
        className="hidden"
        disabled={disabled}
        max={MAX_IMAGE_FILES}
        multiple
        onChange={handleImagesUpload}
        ref={fileInputRef}
        size={MAX_IMAGE_FILE_SIZE}
        type="file"
      />
      <TooltipWrapper asChild label="Attach image">
        <Button
          className={cn(
            "flex items-center gap-1.5 shadow-none",
            "@max-[350px]/form:w-8",
            className
          )}
          disabled={disabled}
          size="sm"
          variant="outline"
          {...props}
        >
          <ImagePlus />{" "}
          <span className="hidden @[350px]/form:inline-flex">Image</span>
        </Button>
      </TooltipWrapper>
    </>
  );
}
