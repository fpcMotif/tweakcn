"use client";

import { JSONContent } from "@tiptap/react";
import dynamic from "next/dynamic";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { AI_PROMPT_CHARACTER_LIMIT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { DragAndDropImageUploader } from "./drag-and-drop-image-uploader";
import { UploadedImagePreview } from "./uploaded-image-preview";

const CustomTextarea = dynamic(
  () => import("@/components/editor/custom-textarea"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50px] w-full flex-col gap-1 p-1">
        <div className="bg-muted h-3 w-full animate-pulse rounded-md text-sm" />
        <div className="bg-muted h-3 w-full animate-pulse rounded-md text-sm" />
      </div>
    ),
  }
);

interface AIChatFormBodyProps {
  isUserDragging: boolean;
  disabled: boolean;
  canSubmit: boolean;
  uploadedImages: { url: string; loading: boolean }[];
  handleImagesUpload: (files: File[]) => void;
  handleImageRemove: (index: number) => void;
  handleContentChange: (jsonContent: JSONContent) => void;
  handleGenerate: () => void;
  initialEditorContent: JSONContent | undefined;
  externalEditorContent?: JSONContent;
  textareaKey?: string | number;
  isStreamingContent?: boolean;
}

export function AIChatFormBody({
  isUserDragging,
  disabled,
  canSubmit,
  uploadedImages,
  handleImagesUpload,
  handleImageRemove,
  handleContentChange,
  handleGenerate,
  initialEditorContent,
  externalEditorContent,
  textareaKey,
  isStreamingContent = false,
}: AIChatFormBodyProps) {
  return (
    <>
      {isUserDragging && (
        <div className={cn("flex h-16 items-center rounded-lg")}>
          <DragAndDropImageUploader
            disabled={disabled || uploadedImages.some((img) => img.loading)}
            onDrop={handleImagesUpload}
          />
        </div>
      )}
      {uploadedImages.length > 0 && !isUserDragging && (
        <div
          className={cn(
            "relative flex h-16 items-center rounded-lg",
            disabled && "pointer-events-none opacity-75"
          )}
        >
          <HorizontalScrollArea className="w-full">
            {uploadedImages.map((img, idx) => (
              <UploadedImagePreview
                handleImageRemove={() => handleImageRemove(idx)}
                isImageLoading={img.loading}
                key={idx}
                src={img.url}
              />
            ))}
          </HorizontalScrollArea>
        </div>
      )}
      <div>
        <label className="sr-only">Chat Input</label>
        <div
          aria-disabled={disabled}
          className="relative isolate min-h-[50px] overflow-hidden"
        >
          <CustomTextarea
            canSubmit={canSubmit}
            characterLimit={AI_PROMPT_CHARACTER_LIMIT}
            disabled={disabled}
            externalEditorContent={externalEditorContent}
            initialEditorContent={initialEditorContent}
            isStreamingContent={isStreamingContent}
            key={textareaKey}
            onContentChange={handleContentChange}
            onImagesPaste={handleImagesUpload}
            onSubmit={handleGenerate}
          />
        </div>
      </div>
    </>
  );
}
