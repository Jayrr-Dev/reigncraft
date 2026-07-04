import { Hono } from 'hono';
import { settings } from '@devvit/web/server';
import {
  WORLD_GEMINI_API_KEY_ENV,
  WORLD_GEMINI_API_KEY_SETTING,
  WORLD_GEMINI_MAX_MESSAGE_LENGTH,
  WORLD_GEMINI_MAX_SYSTEM_PROMPT_LENGTH,
  fetchingWorldGeminiChatCompletion,
  type WorldGeminiChatMessage,
  type WorldGeminiChatRequest,
  type WorldGeminiChatResult,
} from '../../shared/worldGeminiChat';

type WorldGeminiChatResponse = WorldGeminiChatResult & {
  error?: string;
};

type WorldGeminiChatRequestBody = {
  message?: unknown;
  systemPrompt?: unknown;
  history?: unknown;
};

async function resolvingWorldGeminiApiKey(): Promise<string | null> {
  const configured = await settings.get(WORLD_GEMINI_API_KEY_SETTING);

  if (typeof configured === 'string' && configured.length > 0) {
    return configured;
  }

  const fromEnv = process.env[WORLD_GEMINI_API_KEY_ENV];

  if (typeof fromEnv === 'string' && fromEnv.length > 0) {
    return fromEnv;
  }

  return null;
}

function parsingWorldGeminiChatHistory(
  rawHistory: unknown,
): WorldGeminiChatMessage[] {
  if (!Array.isArray(rawHistory)) {
    return [];
  }

  return rawHistory.flatMap((entry): WorldGeminiChatMessage[] => {
    if (typeof entry !== 'object' || entry === null) {
      return [];
    }

    const text =
      'text' in entry && typeof entry.text === 'string' ? entry.text.trim() : '';

    if (text.length === 0) {
      return [];
    }

    const isModel =
      'isModel' in entry && typeof entry.isModel === 'boolean'
        ? entry.isModel
        : false;

    return [{ text, isModel }];
  });
}

function parsingWorldGeminiChatRequest(
  body: WorldGeminiChatRequestBody,
): WorldGeminiChatRequest | null {
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (message.length === 0) {
    return null;
  }

  if (message.length > WORLD_GEMINI_MAX_MESSAGE_LENGTH) {
    return null;
  }

  const systemPrompt =
    typeof body.systemPrompt === 'string' ? body.systemPrompt.trim() : undefined;

  if (
    systemPrompt &&
    systemPrompt.length > WORLD_GEMINI_MAX_SYSTEM_PROMPT_LENGTH
  ) {
    return null;
  }

  return {
    message,
    systemPrompt,
    history: parsingWorldGeminiChatHistory(body.history),
  };
}

export const worldGemini = new Hono();

worldGemini.post('/chat', async (c) => {
  const apiKey = await resolvingWorldGeminiApiKey();

  if (!apiKey) {
    return c.json<WorldGeminiChatResponse>(
      { text: '', error: 'Gemini API key is not configured.' },
      503,
    );
  }

  let body: WorldGeminiChatRequestBody;

  try {
    body = await c.req.json<WorldGeminiChatRequestBody>();
  } catch {
    return c.json<WorldGeminiChatResponse>(
      { text: '', error: 'Invalid request body.' },
      400,
    );
  }

  const request = parsingWorldGeminiChatRequest(body);

  if (!request) {
    return c.json<WorldGeminiChatResponse>(
      { text: '', error: 'Message is required and must be within size limits.' },
      400,
    );
  }

  try {
    const result = await fetchingWorldGeminiChatCompletion(apiKey, request);

    return c.json<WorldGeminiChatResponse>(result);
  } catch (error) {
    console.error('Gemini chat failed:', error);

    const message =
      error instanceof Error ? error.message : 'Could not reach Gemini.';

    return c.json<WorldGeminiChatResponse>({ text: '', error: message }, 502);
  }
});
