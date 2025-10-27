import { json } from "@sveltejs/kit";
import { streamText } from "ai";
import { THEME_GENERATION_TOOLS } from "$lib/ai/generate-theme/tools";
import { GENERATE_THEME_SYSTEM } from "$lib/ai/prompts";
import { baseProviderOptions, myProvider } from "$lib/ai/providers";
import { validateSubscriptionAndUsage } from "$lib/subscription";
import type { ChatMessage } from "$types/ai";
import { convertMessagesToModelMessages } from "$utils/ai/message-converter";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  request,
  locals,
  getClientAddress,
}) => {
  try {
    const session = await locals.auth();
    if (!session?.user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Implement rate limiting with Upstash/Vercel KV if needed
    // For now, rely on subscription checks

    const userId = session.user.id;
    const subscriptionCheck = await validateSubscriptionAndUsage(userId);

    if (!subscriptionCheck.canProceed) {
      return json(
        {
          error: subscriptionCheck.error,
          requestsRemaining: subscriptionCheck.requestsRemaining,
        },
        { status: 403 }
      );
    }

    const { messages }: { messages: ChatMessage[] } = await request.json();
    const modelMessages = await convertMessagesToModelMessages(messages);

    const model = myProvider.languageModel("base");

    const result = streamText({
      model: model,
      providerOptions: baseProviderOptions,
      system: GENERATE_THEME_SYSTEM,
      messages: modelMessages,
      tools: THEME_GENERATION_TOOLS,
      maxSteps: 5,
      onError: (error) => {
        if (error instanceof Error) console.error(error);
      },
      onFinish: async (result) => {
        const { usage } = result;
        try {
          // TODO: Record AI usage with Convex
          // await recordAIUsage({
          //   modelId: model.modelId,
          //   promptTokens: usage.promptTokens || 0,
          //   completionTokens: usage.completionTokens || 0,
          // });
        } catch (error) {
          console.error("Failed to record AI usage:", error);
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Generate theme error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return new Response("Request aborted by user", { status: 499 });
    }

    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
