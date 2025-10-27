import { JSONContent } from "@tiptap/react";
import { Check, X } from "lucide-react";
import { useMemo, useReducer, useState } from "react";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useDocumentDragAndDropIntent } from "@/hooks/use-document-drag-and-drop-intent";
import { useImageUpload } from "@/hooks/use-image-upload";
import { imageUploadReducer } from "@/hooks/use-image-upload-reducer";
import {
  AI_PROMPT_CHARACTER_LIMIT,
  MAX_IMAGE_FILE_SIZE,
  MAX_IMAGE_FILES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AIPromptData, type ChatMessage } from "@/types/ai";
import {
  convertJSONContentToPromptData,
  convertPromptDataToJSONContent,
  isEmptyPromptData,
} from "@/utils/ai/ai-prompt";
import CustomTextarea from "../custom-textarea";
import { DragAndDropImageUploader } from "./drag-and-drop-image-uploader";
import { ImageUploader } from "./image-uploader";
import { UploadedImagePreview } from "./uploaded-image-preview";

interface MessageEditFormProps {
  message: ChatMessage;
  onEditSubmit: (newPromptData: AIPromptData) => void;
  onEditCancel: () => void;
  disabled: boolean;
}

export function MessageEditForm({
  message,
  onEditSubmit,
  onEditCancel,
  disabled,
}: MessageEditFormProps) {
  const promptData = message.metadata?.promptData;

  const [editJsonContent, setEditJsonContent] = useState<JSONContent>(() => {
    if (!promptData) return { type: "doc", content: [] };
    return convertPromptDataToJSONContent(promptData);
  });

  const [uploadedImages, dispatch] = useReducer(
    imageUploadReducer,
    promptData?.images
      ? promptData.images.map((img) => ({ ...img, loading: false }))
      : []
  );

  const {
    fileInputRef,
    handleImagesUpload,
    handleImageRemove,
    isSomeImageUploading,
    canUploadMore,
  } = useImageUpload({
    maxFiles: MAX_IMAGE_FILES,
    maxFileSize: MAX_IMAGE_FILE_SIZE,
    images: uploadedImages,
    dispatch,
  });

  const newPromptData = useMemo(
    () => convertJSONContentToPromptData(editJsonContent),
    [editJsonContent]
  );
  const isEmptyPrompt = isEmptyPromptData(newPromptData, uploadedImages);

  const handleEditConfirm = () => {
    if (isEmptyPrompt) return;

    onEditSubmit({
      ...promptData,
      ...newPromptData,
      images: uploadedImages
        .filter((img) => !img.loading)
        .map(({ url }) => ({ url })),
    });
  };

  const { isUserDragging } = useDocumentDragAndDropIntent();

  return (
    <div className="bg-card/75 text-card-foreground/90 relative isolate flex size-full flex-col gap-2 self-end rounded-lg border border-dashed p-2">
      {isUserDragging && (
        <div className={cn("flex h-16 items-center rounded-lg")}>
          <DragAndDropImageUploader
            disabled={uploadedImages.some((img) => img.loading)}
            onDrop={handleImagesUpload}
          />
        </div>
      )}
      {uploadedImages.length > 0 && !isUserDragging && (
        <div className={cn("relative flex h-16 items-center rounded-lg")}>
          <HorizontalScrollArea className="w-full">
            {uploadedImages.map((img, idx) => (
              <UploadedImagePreview
                handleImageRemove={() => handleImageRemove(idx)}
                isImageLoading={img.loading}
                key={idx}
                showPreviewOnHover={false}
                src={img.url}
              />
            ))}
          </HorizontalScrollArea>
        </div>
      )}

      <CustomTextarea
        characterLimit={AI_PROMPT_CHARACTER_LIMIT}
        className="min-h-none size-full max-h-[300px] bg-transparent"
        disabled={disabled}
        initialEditorContent={editJsonContent}
        onContentChange={setEditJsonContent}
        onImagesPaste={handleImagesUpload}
        onSubmit={handleEditConfirm}
      />

      <div className="@container/form flex items-center justify-between gap-2">
        <ImageUploader
          disabled={!canUploadMore}
          fileInputRef={fileInputRef}
          onClick={() => fileInputRef.current?.click()}
          onImagesUpload={handleImagesUpload}
        />

        <div className="flex items-center gap-2">
          <TooltipWrapper asChild label="Cancel edit">
            <Button
              className="size-8 shadow-none"
              onClick={onEditCancel}
              size="sm"
              variant="outline"
            >
              <X />
            </Button>
          </TooltipWrapper>

          <TooltipWrapper asChild label="Confirm edit">
            <Button
              className="size-8 shadow-none"
              disabled={isSomeImageUploading || isEmptyPrompt || disabled}
              onClick={handleEditConfirm}
              size="sm"
              variant="secondary"
            >
              <Check />
            </Button>
          </TooltipWrapper>
        </div>
      </div>
    </div>
  );
}
