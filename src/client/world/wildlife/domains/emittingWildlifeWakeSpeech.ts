/**
 * Forces a species-unique wake vocalization bubble.
 *
 * @module components/world/wildlife/domains/emittingWildlifeWakeSpeech
 */

import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpeechState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { emittingWildlifeForcedSpeech } from '@/components/world/wildlife/domains/emittingWildlifeForcedSpeech';

export type EmittingWildlifeWakeSpeechParams = {
  instance: DefiningWildlifeInstance;
  nowMs: number;
};

/**
 * Picks a wake line for the species and shows it immediately (no cooldown gate).
 */
export function emittingWildlifeWakeSpeech({
  instance,
  nowMs,
}: EmittingWildlifeWakeSpeechParams): DefiningWildlifeSpeechState {
  return emittingWildlifeForcedSpeech({
    instance,
    nowMs,
    context: 'wake',
  });
}
