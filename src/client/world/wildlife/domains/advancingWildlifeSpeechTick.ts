/**
 * Pure wildlife speech bubble tick.
 *
 * @module components/world/wildlife/domains/advancingWildlifeSpeechTick
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import { resolvingWildlifeSpeciesSpeechLines } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSpeechRegistry';
import {
  DEFINING_WILDLIFE_SPEECH_AGGRO_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_BUBBLE_DURATION_MS,
  DEFINING_WILDLIFE_SPEECH_COOLDOWN_MS,
  DEFINING_WILDLIFE_SPEECH_FLEE_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_BUCKET_MS,
  DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_CHANCE,
  DEFINING_WILDLIFE_SPEECH_LINE_PICK_SALT,
  DEFINING_WILDLIFE_SPEECH_PASSIVE_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_PASSIVE_SUSTAINED_BUCKET_MS,
  DEFINING_WILDLIFE_SPEECH_PASSIVE_SUSTAINED_CHANCE,
  DEFINING_WILDLIFE_SPEECH_ROLL_SALT,
  type DefiningWildlifeSpeechContextKind,
} from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpeechState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSpeechContextFromIntent } from '@/components/world/wildlife/domains/resolvingWildlifeSpeechContextFromIntent';

export type AdvancingWildlifeSpeechTickParams = {
  instance: DefiningWildlifeInstance;
  nowMs: number;
};

function creatingWildlifeInitialSpeechState(): DefiningWildlifeSpeechState {
  return {
    activeBubble: null,
    lastEmittedAtMs: null,
    lastContextKey: null,
  };
}

function pruningWildlifeSpeechBubble(
  speechState: DefiningWildlifeSpeechState,
  nowMs: number
): DefiningWildlifeSpeechState {
  if (
    speechState.activeBubble !== null &&
    speechState.activeBubble.expiresAtMs <= nowMs
  ) {
    return {
      ...speechState,
      activeBubble: null,
    };
  }

  return speechState;
}

function resolvingWildlifeSpeechEnterChance(
  context: DefiningWildlifeSpeechContextKind
): number {
  if (context === 'flee') {
    return DEFINING_WILDLIFE_SPEECH_FLEE_ENTER_CHANCE;
  }

  if (context === 'aggro') {
    return DEFINING_WILDLIFE_SPEECH_AGGRO_ENTER_CHANCE;
  }

  return DEFINING_WILDLIFE_SPEECH_PASSIVE_ENTER_CHANCE;
}

function resolvingWildlifeSpeechSustainedChance(
  context: DefiningWildlifeSpeechContextKind
): number | null {
  if (context === 'passive') {
    return DEFINING_WILDLIFE_SPEECH_PASSIVE_SUSTAINED_CHANCE;
  }

  if (context === 'flee') {
    return DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_CHANCE;
  }

  return null;
}

function resolvingWildlifeSpeechSustainedBucketMs(
  context: DefiningWildlifeSpeechContextKind
): number | null {
  if (context === 'passive') {
    return DEFINING_WILDLIFE_SPEECH_PASSIVE_SUSTAINED_BUCKET_MS;
  }

  if (context === 'flee') {
    return DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_BUCKET_MS;
  }

  return null;
}

function rollingWildlifeSpeechTrigger(
  instance: DefiningWildlifeInstance,
  context: DefiningWildlifeSpeechContextKind,
  isContextEnter: boolean,
  nowMs: number
): boolean {
  const tileX = Math.floor(instance.position.x);
  const tileY = Math.floor(instance.position.y);

  if (isContextEnter) {
    const roll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WILDLIFE_SPEECH_ROLL_SALT +
        context.charCodeAt(0) +
        Math.floor(nowMs / 1000)
    );

    return roll < resolvingWildlifeSpeechEnterChance(context);
  }

  const sustainedBucketMs = resolvingWildlifeSpeechSustainedBucketMs(context);
  const sustainedChance = resolvingWildlifeSpeechSustainedChance(context);

  if (sustainedBucketMs === null || sustainedChance === null) {
    return false;
  }

  const timeBucket = Math.floor(nowMs / sustainedBucketMs);
  const roll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_SPEECH_ROLL_SALT + timeBucket * 7 + context.length
  );

  return roll < sustainedChance;
}

function pickingWildlifeSpeechLine(
  instance: DefiningWildlifeInstance,
  context: DefiningWildlifeSpeechContextKind,
  lines: readonly string[],
  nowMs: number
): string {
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

  return lines[lineIndex] ?? lines[0] ?? '';
}

/**
 * Advances speech bubble state for one wildlife instance.
 */
export function advancingWildlifeSpeechTick({
  instance,
  nowMs,
}: AdvancingWildlifeSpeechTickParams): DefiningWildlifeSpeechState {
  const prunedSpeechState = pruningWildlifeSpeechBubble(
    instance.speechState ?? creatingWildlifeInitialSpeechState(),
    nowMs
  );

  if (prunedSpeechState.activeBubble !== null) {
    return prunedSpeechState;
  }

  if (
    prunedSpeechState.lastEmittedAtMs !== null &&
    nowMs - prunedSpeechState.lastEmittedAtMs <
      DEFINING_WILDLIFE_SPEECH_COOLDOWN_MS
  ) {
    return prunedSpeechState;
  }

  const context = resolvingWildlifeSpeechContextFromIntent({
    intent: instance.aiState.intent,
    startledUntilMs: instance.aiState.startledUntilMs,
    nowMs,
  });

  if (context === null) {
    return {
      ...prunedSpeechState,
      lastContextKey: null,
    };
  }

  const lines = resolvingWildlifeSpeciesSpeechLines(
    instance.speciesId,
    context
  );

  if (lines.length === 0) {
    return {
      ...prunedSpeechState,
      lastContextKey: context,
    };
  }

  const isContextEnter = prunedSpeechState.lastContextKey !== context;

  if (!rollingWildlifeSpeechTrigger(instance, context, isContextEnter, nowMs)) {
    return {
      ...prunedSpeechState,
      lastContextKey: context,
    };
  }

  const message = pickingWildlifeSpeechLine(instance, context, lines, nowMs);

  if (message.length === 0) {
    return {
      ...prunedSpeechState,
      lastContextKey: context,
    };
  }

  return {
    activeBubble: {
      message,
      expiresAtMs: nowMs + DEFINING_WILDLIFE_SPEECH_BUBBLE_DURATION_MS,
    },
    lastEmittedAtMs: nowMs,
    lastContextKey: context,
  };
}
