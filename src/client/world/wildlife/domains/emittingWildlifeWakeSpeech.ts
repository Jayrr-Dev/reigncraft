/**
 * Forces a species-unique wake vocalization bubble.
 *
 * @module components/world/wildlife/domains/emittingWildlifeWakeSpeech
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import { resolvingWildlifeSpeciesSpeechLines } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSpeechRegistry';
import {
  DEFINING_WILDLIFE_SPEECH_BUBBLE_DURATION_MS,
  DEFINING_WILDLIFE_SPEECH_LINE_PICK_SALT,
} from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpeechState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeSpeechLinePresentation,
  resolvingWildlifeSpeechLineText,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpeechLinePresentation';

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
  const lines = resolvingWildlifeSpeciesSpeechLines(instance.speciesId, 'wake');
  const previousSpeechState = instance.speechState;

  if (lines.length === 0) {
    return previousSpeechState;
  }

  const tileX = Math.floor(instance.position.x);
  const tileY = Math.floor(instance.position.y);
  const lineRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_SPEECH_LINE_PICK_SALT +
      'wake'.charCodeAt(0) +
      Math.floor(nowMs / 500)
  );
  const lineIndex = Math.floor(lineRoll * lines.length);
  const line = lines[lineIndex] ?? lines[0];

  if (!line) {
    return previousSpeechState;
  }

  const message = resolvingWildlifeSpeechLineText(line);

  if (message.length === 0) {
    return previousSpeechState;
  }

  return {
    activeBubble: {
      message,
      expiresAtMs: nowMs + DEFINING_WILDLIFE_SPEECH_BUBBLE_DURATION_MS,
      presentation: resolvingWildlifeSpeechLinePresentation(line, 'wake'),
    },
    lastEmittedAtMs: nowMs,
    lastContextKey: 'wake',
  };
}
