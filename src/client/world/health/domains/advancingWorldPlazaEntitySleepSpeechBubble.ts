import {
  DEFINING_WORLD_PLAZA_SLEEP_FALL_DURATION_MS,
  DEFINING_WORLD_PLAZA_SLEEP_SPEECH_BUBBLE_DURATION_MS,
  DEFINING_WORLD_PLAZA_SLEEP_SPEECH_LINES,
} from '@/components/world/health/domains/definingWorldPlazaEntitySleepConstants';
import type { DefiningWildlifeSpeechPresentation } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';
import {
  resolvingWildlifeSpeechLinePresentation,
  resolvingWildlifeSpeechLineText,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpeechLinePresentation';

export type DefiningWorldPlazaEntitySleepSpeechBubble = {
  readonly message: string;
  readonly presentation: DefiningWildlifeSpeechPresentation;
  readonly expiresAtMs: number;
  readonly lineIndex: number;
};

export type AdvancingWorldPlazaEntitySleepSpeechBubbleParams = {
  readonly nowMs: number;
  readonly isAsleep: boolean;
  readonly sleepStartedAtMs: number | null;
  readonly activeBubble: DefiningWorldPlazaEntitySleepSpeechBubble | null;
};

/**
 * Advances the local player's sleep Zzz bubble: waits for the fall pose, then
 * refreshes wildlife-style lines for the rest of the sleep window.
 */
export function advancingWorldPlazaEntitySleepSpeechBubble({
  nowMs,
  isAsleep,
  sleepStartedAtMs,
  activeBubble,
}: AdvancingWorldPlazaEntitySleepSpeechBubbleParams): DefiningWorldPlazaEntitySleepSpeechBubble | null {
  if (!isAsleep || sleepStartedAtMs === null) {
    return null;
  }

  if (nowMs < sleepStartedAtMs + DEFINING_WORLD_PLAZA_SLEEP_FALL_DURATION_MS) {
    return null;
  }

  if (activeBubble !== null && activeBubble.expiresAtMs > nowMs) {
    return activeBubble;
  }

  const lineCount = DEFINING_WORLD_PLAZA_SLEEP_SPEECH_LINES.length;

  if (lineCount === 0) {
    return null;
  }

  const nextLineIndex =
    activeBubble === null ? 0 : (activeBubble.lineIndex + 1) % lineCount;
  const line = DEFINING_WORLD_PLAZA_SLEEP_SPEECH_LINES[nextLineIndex];

  if (line === undefined) {
    return null;
  }

  const message = resolvingWildlifeSpeechLineText(line);

  if (message.length === 0) {
    return null;
  }

  return {
    message,
    presentation: resolvingWildlifeSpeechLinePresentation(line, 'sleep'),
    expiresAtMs: nowMs + DEFINING_WORLD_PLAZA_SLEEP_SPEECH_BUBBLE_DURATION_MS,
    lineIndex: nextLineIndex,
  };
}
