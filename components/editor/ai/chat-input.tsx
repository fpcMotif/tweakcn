"use client";

import { ArrowUp, Loader as LoaderIcon, Plus, StopCircle } from "lucide-react";
import { Loader } from "@/components/loader";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { useAIChatForm } from "@/hooks/use-ai-chat-form";
import { useAIEnhancePrompt } from "@/hooks/use-ai-enhance-prompt";
import { useChatContext } from "@/hooks/use-chat-context";
import { useGuards } from "@/hooks/use-guards";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import { useSubscription } from "@/hooks/use-subscription";
import { MAX_IMAGE_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AIPromptData } from "@/types/ai";
import { AIChatFormBody } from "./ai-chat-form-body";
import { AlertBanner, BannerWrapper } from "./alert-banner";
import { EnhancePromptButton } from "./enhance-prompt-button";
import { ImageUploader } from "./image-uploader";

type ThemeGenerationPayload = {
  promptData: AIPromptData;
  options: {
    shouldClearLocalDraft?: boolean;
  };
};

interface ChatInputProps {
  onThemeGeneration: (promptData: AIPromptData) => Promise<void>;
  isGeneratingTheme: boolean;
  onCancelThemeGeneration: () => void;
}

export function ChatInput({
  onThemeGeneration,
  isGeneratingTheme,
  onCancelThemeGeneration,
}: ChatInputProps) {
  const { messages, startNewChat } = useChatContext();
  const { checkValidSession, checkValidSubscription } = useGuards();
  const { subscriptionStatus } = useSubscription();
  const isPro = subscriptionStatus?.isSubscribed ?? false;
  const hasFreeRequestsLeft = (subscriptionStatus?.requestsRemaining ?? 0) > 0;

  const {
    editorContentDraft,
    handleContentChange,
    promptData,
    isEmptyPrompt,
    clearLocalDraft,
    uploadedImages,
    fileInputRef,
    handleImagesUpload,
    handleImageRemove,
    clearUploadedImages,
    isSomeImageUploading,
    isUserDragging,
    isInitializing,
  } = useAIChatForm();

  const handleNewChat = () => {
    startNewChat();
    clearLocalDraft();
    clearUploadedImages();
  };

  const {
    startEnhance,
    stopEnhance,
    enhancedPromptAsJsonContent,
    isEnhancingPrompt,
  } = useAIEnhancePrompt();

  const handleEnhancePrompt = () => {
    if (!checkValidSession() || !checkValidSubscription()) return;

    // Only send images that are not loading, and strip loading property
    const images = uploadedImages
      .filter((img) => !img.loading)
      .map(({ url }) => ({ url }));
    startEnhance({ ...promptData, images });
  };

  const generateTheme = async (payload: ThemeGenerationPayload) => {
    const { promptData, options } = payload;

    if (options.shouldClearLocalDraft) {
      clearLocalDraft();
      clearUploadedImages();
    }

    onThemeGeneration(promptData);
  };

  const handleGenerateSubmit = async () => {
    // Only send images that are not loading, and strip loading property
    const images = uploadedImages
      .filter((img) => !img.loading)
      .map(({ url }) => ({ url }));

    // Proceed only if there is text, or at least one image
    if (isEmptyPrompt && images.length === 0) return;

    const payload: ThemeGenerationPayload = {
      promptData: {
        ...promptData,
        images,
      },
      options: {
        shouldClearLocalDraft: true,
      },
    };

    if (!checkValidSession("signup", "AI_GENERATE_FROM_CHAT", payload)) return;
    if (!checkValidSubscription()) return;

    generateTheme(payload);
  };

  usePostLoginAction("AI_GENERATE_FROM_CHAT", (payload) => {
    generateTheme(payload);
  });

  return (
    <div className="relative transition-all contain-layout">
      <BannerWrapper show={isGeneratingTheme}>
        <div className="flex size-full items-center gap-1.5">
          <LoaderIcon className="size-2.5 animate-spin" />
          <Loader size="sm" text="Generating..." variant="text-shimmer" />
        </div>
      </BannerWrapper>

      <AlertBanner />
      <div className="bg-background relative isolate z-10 flex size-full min-h-[100px] flex-1 flex-col gap-2 overflow-hidden rounded-lg border p-2 shadow-xs">
        <AIChatFormBody
          canSubmit={
            !isGeneratingTheme &&
            !isEnhancingPrompt &&
            !isEmptyPrompt &&
            !isSomeImageUploading &&
            !isInitializing
          }
          disabled={isEnhancingPrompt}
          externalEditorContent={enhancedPromptAsJsonContent}
          handleContentChange={handleContentChange}
          handleGenerate={handleGenerateSubmit}
          handleImageRemove={handleImageRemove}
          handleImagesUpload={handleImagesUpload}
          initialEditorContent={editorContentDraft ?? undefined}
          isStreamingContent={isEnhancingPrompt}
          isUserDragging={isUserDragging}
          textareaKey={editorContentDraft ? "with-draft" : "no-draft"}
          uploadedImages={uploadedImages}
        />
        <div className="@container/form flex items-center justify-between gap-2">
          <TooltipWrapper asChild label="Create new chat">
            <Button
              className="flex items-center gap-1.5 shadow-none"
              disabled={
                isGeneratingTheme ||
                isEnhancingPrompt ||
                isInitializing ||
                messages.length === 0
              }
              onClick={handleNewChat}
              size="sm"
              variant="outline"
            >
              <Plus />
              <span>New chat</span>
            </Button>
          </TooltipWrapper>

          <div className="flex items-center gap-2">
            {(isPro || hasFreeRequestsLeft) && promptData?.content ? (
              <EnhancePromptButton
                disabled={isGeneratingTheme || isInitializing}
                isEnhancing={isEnhancingPrompt}
                onStart={handleEnhancePrompt}
                onStop={stopEnhance}
              />
            ) : null}

            <ImageUploader
              disabled={
                isGeneratingTheme ||
                isEnhancingPrompt ||
                isInitializing ||
                uploadedImages.some((img) => img.loading) ||
                uploadedImages.length >= MAX_IMAGE_FILES
              }
              fileInputRef={fileInputRef}
              onClick={() => fileInputRef.current?.click()}
              onImagesUpload={handleImagesUpload}
            />

            {isGeneratingTheme ? (
              <TooltipWrapper asChild label="Cancel generation">
                <Button
                  className={cn(
                    "flex items-center gap-1.5 shadow-none",
                    "@max-[350px]/form:w-8"
                  )}
                  onClick={onCancelThemeGeneration}
                  size="sm"
                  variant="destructive"
                >
                  <StopCircle />
                  <span className="hidden @[350px]/form:inline-flex">Stop</span>
                </Button>
              </TooltipWrapper>
            ) : (
              <TooltipWrapper asChild label="Send message">
                <Button
                  className="size-8 shadow-none"
                  disabled={
                    isEmptyPrompt ||
                    isSomeImageUploading ||
                    isGeneratingTheme ||
                    isEnhancingPrompt ||
                    isInitializing
                  }
                  onClick={handleGenerateSubmit}
                  size="sm"
                >
                  {isGeneratingTheme ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    <ArrowUp />
                  )}
                </Button>
              </TooltipWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
