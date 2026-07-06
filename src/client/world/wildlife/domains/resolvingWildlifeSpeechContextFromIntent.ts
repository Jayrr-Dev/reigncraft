/**
 * Maps wildlife behavior intent to a speech context.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpeechContextFromIntent
 */

import type { DefiningWildlifeSpeechContextKind } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeSpeechContextFromIntentParams = {
  intent: DefiningWildlifeBehaviorIntent;
  startledUntilMs: number | null;
  nowMs: number;
};

/**
 * Resolves which speech context applies, or null when the animal stays quiet.
 */
export function resolvingWildlifeSpeechContextFromIntent({
  intent,
  startledUntilMs,
  nowMs,
}: ResolvingWildlifeSpeechContextFromIntentParams): DefiningWildlifeSpeechContextKind | null {
  if (
    intent.mode === 'flee' ||
    (startledUntilMs !== null && startledUntilMs > nowMs)
  ) {
    return 'flee';
  }

  if (
    intent.mode === 'chase' ||
    intent.mode === 'attack' ||
    intent.mode === 'territoryWarn'
  ) {
    return 'aggro';
  }

  if (
    intent.mode === 'idle' ||
    intent.mode === 'wander' ||
    intent.mode === 'graze'
  ) {
    return 'passive';
  }

  return null;
}
