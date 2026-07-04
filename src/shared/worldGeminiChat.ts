/** Client-facing chat proxy path for Gemini completions. */
export const WORLD_GEMINI_CHAT_API_PATH = '/api/world/gemini/chat' as const;

/** Gemini REST API host (Devvit HTTP fetch allowlist). */
export const WORLD_GEMINI_API_HOST =
  'generativelanguage.googleapis.com' as const;

/** Default Gemini model for in-game chat and NPC dialogue. */
export const WORLD_GEMINI_DEFAULT_MODEL = 'gemini-2.0-flash' as const;

/** Devvit secret setting key for the Gemini API key. */
export const WORLD_GEMINI_API_KEY_SETTING = 'geminiApiKey' as const;

/** Local env var fallback for the Gemini API key. */
export const WORLD_GEMINI_API_KEY_ENV = 'GEMINI_API_KEY' as const;

/** Maximum user message length accepted by the proxy route. */
export const WORLD_GEMINI_MAX_MESSAGE_LENGTH = 2000;

/** Maximum system prompt length accepted by the proxy route. */
export const WORLD_GEMINI_MAX_SYSTEM_PROMPT_LENGTH = 4000;

export type WorldGeminiChatMessage = {
  /** User or model turn text. */
  text: string;
  /** When true, the message is treated as a model response in history. */
  isModel?: boolean;
};

export type WorldGeminiChatRequest = {
  /** Latest user message to send to Gemini. */
  message: string;
  /** Optional system instruction for persona or game context. */
  systemPrompt?: string;
  /** Prior turns for multi-turn dialogue. */
  history?: WorldGeminiChatMessage[];
};

export type WorldGeminiChatResult = {
  /** Model reply text. */
  text: string;
};

type GeminiContentPart = {
  text?: string;
};

type GeminiContent = {
  role?: string;
  parts?: GeminiContentPart[];
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: GeminiContent;
  }>;
  error?: {
    message?: string;
  };
};

function buildingWorldGeminiGenerateContentUrl(
  apiKey: string,
  model: string
): string {
  const params = new URLSearchParams({ key: apiKey });

  return `https://${WORLD_GEMINI_API_HOST}/v1beta/models/${model}:generateContent?${params.toString()}`;
}

function mappingWorldGeminiChatMessagesToContents(
  history: WorldGeminiChatMessage[],
  message: string
): GeminiContent[] {
  const contents: GeminiContent[] = history.map((entry) => ({
    role: entry.isModel ? 'model' : 'user',
    parts: [{ text: entry.text }],
  }));

  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });

  return contents;
}

function extractingWorldGeminiResponseText(
  payload: GeminiGenerateContentResponse
): string {
  const parts = payload.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((part) => part.text?.trim() ?? '')
    .filter((part) => part.length > 0)
    .join('\n')
    .trim();

  if (text.length === 0) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}

/**
 * Sends a chat completion request to the Gemini REST API.
 *
 * @param apiKey - Google AI Studio / Gemini API key.
 * @param request - User message, optional system prompt, and prior turns.
 * @param model - Gemini model id.
 */
export async function fetchingWorldGeminiChatCompletion(
  apiKey: string,
  request: WorldGeminiChatRequest,
  model: string = WORLD_GEMINI_DEFAULT_MODEL
): Promise<WorldGeminiChatResult> {
  const trimmedMessage = request.message.trim();

  if (trimmedMessage.length === 0) {
    throw new Error('Message cannot be empty.');
  }

  if (trimmedMessage.length > WORLD_GEMINI_MAX_MESSAGE_LENGTH) {
    throw new Error(
      `Message exceeds ${WORLD_GEMINI_MAX_MESSAGE_LENGTH} characters.`
    );
  }

  const systemPrompt = request.systemPrompt?.trim();
  const history = request.history ?? [];

  const body: Record<string, unknown> = {
    contents: mappingWorldGeminiChatMessagesToContents(history, trimmedMessage),
  };

  if (systemPrompt && systemPrompt.length > 0) {
    if (systemPrompt.length > WORLD_GEMINI_MAX_SYSTEM_PROMPT_LENGTH) {
      throw new Error(
        `System prompt exceeds ${WORLD_GEMINI_MAX_SYSTEM_PROMPT_LENGTH} characters.`
      );
    }

    body.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  const response = await fetch(
    buildingWorldGeminiGenerateContentUrl(apiKey, model),
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  const payload = (await response.json()) as GeminiGenerateContentResponse;

  if (!response.ok) {
    const message =
      payload.error?.message ?? `Gemini request failed (${response.status}).`;

    throw new Error(message);
  }

  return {
    text: extractingWorldGeminiResponseText(payload),
  };
}
