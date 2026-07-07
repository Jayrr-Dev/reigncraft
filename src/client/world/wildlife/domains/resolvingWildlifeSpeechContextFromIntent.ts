/**
 * Maps wildlife behavior intent to a speech context.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpeechContextFromIntent
 */

import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeechContextKind } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeSpeechContextFromIntentParams = {
  instance: DefiningWildlifeInstance;
  nowMs: number;
};

/**
 * Resolves which speech context applies, or null when the animal stays quiet.
 */
export function resolvingWildlifeSpeechContextFromIntent({
  instance,
  nowMs,
}: ResolvingWildlifeSpeechContextFromIntentParams): DefiningWildlifeSpeechContextKind | null {
  const { intent, startledUntilMs, feedingOnKillUntilMs } = instance.aiState;

  if (
    feedingOnKillUntilMs !== null &&
    feedingOnKillUntilMs > nowMs
  ) {
    return 'eatingAggressive';
  }

  if (
    intent.mode === 'flee' ||
    (startledUntilMs !== null && startledUntilMs > nowMs)
  ) {
    return 'flee';
  }

  if (intent.mode === 'attack') {
    return 'attack';
  }

  if (intent.mode === 'territoryWarn') {
    return 'warn';
  }

  if (intent.mode === 'chase') {
    return 'chase';
  }

  if (intent.mode === 'forageEat' || intent.mode === 'graze') {
    return 'eating';
  }

  if (intent.mode === 'forageChase') {
    const diet = resolvingWildlifeSpeciesDefinition(instance.speciesId)?.diet;

    if (diet === 'carnivore' || diet === 'scavenger') {
      return 'chase';
    }

    return 'eating';
  }

  if (
    intent.mode === 'idle' ||
    intent.mode === 'wander' ||
    intent.mode === 'return'
  ) {
    if (instance.aggressionLevel === 'tame') {
      return 'friendly';
    }

    return 'neutral';
  }

  return null;
}
