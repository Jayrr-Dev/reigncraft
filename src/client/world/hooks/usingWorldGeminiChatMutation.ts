"use client";

import {
  WORLD_GEMINI_CHAT_API_PATH,
  type WorldGeminiChatRequest,
  type WorldGeminiChatResult,
} from '../../../shared/worldGeminiChat';
import { useMutation } from '@tanstack/react-query';

type WorldGeminiChatApiResponse = WorldGeminiChatResult & {
  error?: string;
};

async function postingWorldGeminiChatRequest(
  request: WorldGeminiChatRequest,
): Promise<WorldGeminiChatResult> {
  const response = await fetch(WORLD_GEMINI_CHAT_API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const payload = (await response.json()) as WorldGeminiChatApiResponse;

  if (!response.ok) {
    throw new Error(payload.error ?? 'Could not reach Gemini.');
  }

  return { text: payload.text };
}

/**
 * TanStack mutation hook for Gemini chat completions via the server proxy.
 */
export function usingWorldGeminiChatMutation() {
  return useMutation({
    mutationFn: postingWorldGeminiChatRequest,
  });
}
