import Logo from "@/assets/logo.svg";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { AIPromptData, type ChatMessage } from "@/types/ai";
import { buildAIPromptRender } from "@/utils/ai/ai-prompt";
import ColorPreview from "../theme-preview/color-preview";
import { ChatImagePreview } from "./chat-image-preview";
import { ChatThemePreview } from "./chat-theme-preview";
import { LoadingLogo } from "./loading-logo";
import { MessageActions } from "./message-actions";
import { MessageEditForm } from "./message-edit-form";
import { StreamText } from "./stream-text";

type MessageProps = {
  message: ChatMessage;
  onRetry: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onEditSubmit: (newPromptData: AIPromptData) => void;
  onEditCancel: () => void;
  isLastMessageStreaming: boolean;
  isGeneratingTheme: boolean;
};

export default function Message({
  message,
  onRetry,
  isEditing,
  onEdit,
  onEditSubmit,
  onEditCancel,
  isLastMessageStreaming,
  isGeneratingTheme,
}: MessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const showMessageActions = !isLastMessageStreaming;

  return (
    <div
      className={cn(
        "flex w-full items-start gap-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("flex w-full max-w-[90%] items-start")}>
        <div
          className={cn(
            "group/message relative flex w-full flex-col gap-2 wrap-anywhere whitespace-pre-wrap"
          )}
        >
          {isUser && (
            <UserMessage
              isEditing={isEditing}
              isGeneratingTheme={isGeneratingTheme}
              message={message}
              onEdit={onEdit}
              onEditCancel={onEditCancel}
              onEditSubmit={onEditSubmit}
              onRetry={onRetry}
            />
          )}

          {isAssistant && (
            <AssistantMessage
              isLastMessageStreaming={isLastMessageStreaming}
              message={message}
            />
          )}

          {showMessageActions && (
            <MessageActions
              isEditing={isEditing}
              isGeneratingTheme={isGeneratingTheme}
              message={message}
              onEdit={onEdit}
              onRetry={onRetry}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface AssistantMessageProps {
  message: ChatMessage;
  isLastMessageStreaming: boolean;
}

function AssistantMessage({
  message,
  isLastMessageStreaming,
}: AssistantMessageProps) {
  const { themeState } = useEditorStore();

  return (
    <div className="flex items-start gap-1.5">
      {isLastMessageStreaming ? (
        <div className="relative flex size-6 shrink-0 items-center justify-center">
          <LoadingLogo />
        </div>
      ) : (
        <div
          className={cn(
            "border-border/50! bg-foreground relative flex size-6 shrink-0 items-center justify-center rounded-full border select-none"
          )}
        >
          <Logo className={cn("text-background size-full p-0.5")} />
        </div>
      )}

      <div className="relative flex w-full flex-col gap-3">
        {message.parts.map((part, idx) => {
          const { type } = part;
          const key = `message-${message.id}-part-${idx}`;

          if (type === "text") {
            return (
              <StreamText
                animate={isLastMessageStreaming}
                className="w-fit text-sm"
                key={key}
                markdown
                text={part.text}
              />
            );
          }

          if (type === "tool-generateTheme") {
            const { state } = part;

            if (state === "output-available") {
              const themeStyles = part.output;
              return (
                <ChatThemePreview
                  className="p-0"
                  key={key}
                  status="complete"
                  themeStyles={themeStyles}
                >
                  <ScrollArea className="h-48">
                    <div className="p-2">
                      <ColorPreview
                        currentMode={themeState.currentMode}
                        styles={themeStyles}
                      />
                    </div>
                  </ScrollArea>
                </ChatThemePreview>
              );
            }

            if (state === "output-error") {
              return (
                <ChatThemePreview className="p-0" key={key} status="error" />
              );
            }

            return (
              <ChatThemePreview className="p-0" key={key} status="loading" />
            );
          }
        })}
      </div>
    </div>
  );
}

interface UserMessageProps {
  message: ChatMessage;
  isEditing: boolean;
  onRetry: () => void;
  onEdit: () => void;
  onEditSubmit: (newPromptData: AIPromptData) => void;
  onEditCancel: () => void;
  isGeneratingTheme: boolean;
}

function UserMessage({
  message,
  isEditing,
  onEditSubmit,
  onEditCancel,
  isGeneratingTheme,
}: UserMessageProps) {
  const promptData = message.metadata?.promptData;
  const shouldDisplayMsgContent = promptData?.content?.trim() != "";

  const getDisplayContent = () => {
    if (promptData) {
      return buildAIPromptRender(promptData);
    }

    return message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("");
  };

  const msgContent = getDisplayContent();

  const getImagesToDisplay = () => {
    const images = promptData?.images ?? [];

    if (images.length === 1) {
      return (
        <div className="self-end">
          <ChatImagePreview alt="Image preview" src={images[0].url} />
        </div>
      );
    } else if (images.length > 1) {
      return (
        <div className="flex flex-row items-center justify-end gap-1 self-end">
          {images.map((image, idx) => (
            <div className="aspect-square size-full max-w-32 flex-1" key={idx}>
              <ChatImagePreview
                alt="Image preview"
                className="size-full object-cover"
                src={image.url}
              />
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const msgImages = getImagesToDisplay();

  if (isEditing) {
    return (
      <MessageEditForm
        disabled={isGeneratingTheme}
        key={message.id}
        message={message}
        onEditCancel={onEditCancel}
        onEditSubmit={onEditSubmit}
      />
    );
  }

  return (
    <div className="relative flex flex-col gap-1">
      {msgImages}

      {shouldDisplayMsgContent && (
        <div
          className={cn(
            "bg-card/75 text-card-foreground/90 w-fit self-end rounded-lg border p-3 text-sm"
          )}
        >
          {msgContent}
        </div>
      )}
    </div>
  );
}
