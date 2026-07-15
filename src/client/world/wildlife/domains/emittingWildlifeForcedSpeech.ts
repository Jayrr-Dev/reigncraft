/**
 * Forces a species vocalization bubble for a speech context (no cooldown gate).
 * Uses species-authored lines only so approach/wake reacts stay on-brand
 * (no shared stretchers like "hummm~").
 *
 * @module components/world/wildlife/domains/emittingWildlifeForcedSpeech
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_SPEECH_BUBBLE_DURATION_MS,
  DEFINING_WILDLIFE_SPEECH_LINE_PICK_SALT,
  type DefiningWildlifeSpeechContextKind,
} from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpeechState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeSpeechLinePresentation,
  resolvingWildlifeSpeechLineText,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpeechLinePresentation';
import { resolvingWildlifeSpeechLinesOnlyForInstance } from '@/components/world/wildlife/domains/resolvingWildlifeSpeechLinesForInstance';

export type EmittingWildlifeForcedSpeechParams = {
  instance: DefiningWildlifeInstance;
  nowMs: number;
  context: DefiningWildlifeSpeechContextKind;
};

/**
 * Picks a species-only line for the context and shows it immediately.
 */
export function emittingWildlifeForcedSpeech({
  instance,
  nowMs,
  context,
}: EmittingWildlifeForcedSpeechParams): DefiningWildlifeSpeechState {
  const lines = resolvingWildlifeSpeechLinesOnlyForInstance(instance, context);
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
      context.charCodeAt(0) +
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
      presentation: resolvingWildlifeSpeechLinePresentation(line, context),
    },
    lastEmittedAtMs: nowMs,
    lastContextKey: context,
  };
}
