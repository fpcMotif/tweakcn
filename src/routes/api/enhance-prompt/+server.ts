import { json } from "@sveltejs/kit";
import { streamText } from "ai";
import { ENHANCE_PROMPT_SYSTEM } from "$lib/ai/prompts";
import { baseProviderOptions, myProvider } from "$lib/ai/providers";
import { requireSubscriptionOrFreeUsage } from "$lib/subscription";
import type { AIPromptData } from "$types/ai";
import { buildUserContentPartsFromPromptData } from "$utils/ai/message-converter";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const session = await locals.auth();
    await requireSubscriptionOrFreeUsage(session);

    const body = await request.json();
    const { promptData }: { prompt: string; promptData: AIPromptData } = body;
    const userContentParts = buildUserContentPartsFromPromptData(promptData);

    const result = streamText({
      system: ENHANCE_PROMPT_SYSTEM,
      messages: [
        {
          role: "user",
          content: userContentParts,
        },
      ],
      model: myProvider.languageModel("prompt-enhancement"),
      providerOptions: baseProviderOptions,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Enhance prompt error:", error);
    if (error instanceof Error && error.message.includes("subscription")) {
      return json({ error: error.message }, { status: 403 });
    }
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
