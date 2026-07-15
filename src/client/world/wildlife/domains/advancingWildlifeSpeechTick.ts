/**
 * Pure wildlife speech bubble tick.
 *
 * @module components/world/wildlife/domains/advancingWildlifeSpeechTick
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import { DEFINING_WILDLIFE_SLEEP_SPEECH_BUBBLE_DURATION_MS } from '@/components/world/wildlife/domains/definingWildlifeSleepConstants';
import {
  DEFINING_WILDLIFE_SPEECH_ATTACK_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_ATTACK_SUSTAINED_BUCKET_MS,
  DEFINING_WILDLIFE_SPEECH_ATTACK_SUSTAINED_CHANCE,
  DEFINING_WILDLIFE_SPEECH_BUBBLE_DURATION_MS,
  DEFINING_WILDLIFE_SPEECH_CHASE_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_COOLDOWN_MS,
  DEFINING_WILDLIFE_SPEECH_EATING_AGGRESSIVE_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_EATING_AGGRESSIVE_SUSTAINED_BUCKET_MS,
  DEFINING_WILDLIFE_SPEECH_EATING_AGGRESSIVE_SUSTAINED_CHANCE,
  DEFINING_WILDLIFE_SPEECH_EATING_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_EATING_SUSTAINED_BUCKET_MS,
  DEFINING_WILDLIFE_SPEECH_EATING_SUSTAINED_CHANCE,
  DEFINING_WILDLIFE_SPEECH_FLEE_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_BUCKET_MS,
  DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_CHANCE,
  DEFINING_WILDLIFE_SPEECH_HOWL_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_HOWL_SUSTAINED_BUCKET_MS,
  DEFINING_WILDLIFE_SPEECH_HOWL_SUSTAINED_CHANCE,
  DEFINING_WILDLIFE_SPEECH_LINE_PICK_SALT,
  DEFINING_WILDLIFE_SPEECH_NEUTRAL_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_NEUTRAL_SUSTAINED_BUCKET_MS,
  DEFINING_WILDLIFE_SPEECH_NEUTRAL_SUSTAINED_CHANCE,
  DEFINING_WILDLIFE_SPEECH_ROLL_SALT,
  DEFINING_WILDLIFE_SPEECH_STALK_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_STALK_SUSTAINED_BUCKET_MS,
  DEFINING_WILDLIFE_SPEECH_STALK_SUSTAINED_CHANCE,
  DEFINING_WILDLIFE_SPEECH_WAKE_ENTER_CHANCE,
  DEFINING_WILDLIFE_SPEECH_WARN_ENTER_CHANCE,
  type DefiningWildlifeSpeechContextKind,
} from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type { DefiningWildlifeSpeechLine } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpeechState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSpeechContextFromIntent } from '@/components/world/wildlife/domains/resolvingWildlifeSpeechContextFromIntent';
import {
  resolvingWildlifeSpeechLinePresentation,
  resolvingWildlifeSpeechLineText,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpeechLinePresentation';
import { resolvingWildlifeSpeechLinesForInstance } from '@/components/world/wildlife/domains/resolvingWildlifeSpeechLinesForInstance';

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
  if (context === 'eating') {
    return DEFINING_WILDLIFE_SPEECH_EATING_ENTER_CHANCE;
  }

  if (context === 'flee') {
    return DEFINING_WILDLIFE_SPEECH_FLEE_ENTER_CHANCE;
  }

  if (context === 'chase') {
    return DEFINING_WILDLIFE_SPEECH_CHASE_ENTER_CHANCE;
  }

  if (context === 'attack') {
    return DEFINING_WILDLIFE_SPEECH_ATTACK_ENTER_CHANCE;
  }

  if (context === 'warn') {
    return DEFINING_WILDLIFE_SPEECH_WARN_ENTER_CHANCE;
  }

  if (context === 'eatingAggressive') {
    return DEFINING_WILDLIFE_SPEECH_EATING_AGGRESSIVE_ENTER_CHANCE;
  }

  if (context === 'stalk') {
    return DEFINING_WILDLIFE_SPEECH_STALK_ENTER_CHANCE;
  }

  if (context === 'howl') {
    return DEFINING_WILDLIFE_SPEECH_HOWL_ENTER_CHANCE;
  }

  if (context === 'wake') {
    return DEFINING_WILDLIFE_SPEECH_WAKE_ENTER_CHANCE;
  }

  return DEFINING_WILDLIFE_SPEECH_NEUTRAL_ENTER_CHANCE;
}

function resolvingWildlifeSpeechSustainedChance(
  context: DefiningWildlifeSpeechContextKind
): number | null {
  if (context === 'neutral' || context === 'friendly') {
    return DEFINING_WILDLIFE_SPEECH_NEUTRAL_SUSTAINED_CHANCE;
  }

  if (context === 'eating') {
    return DEFINING_WILDLIFE_SPEECH_EATING_SUSTAINED_CHANCE;
  }

  if (context === 'flee') {
    return DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_CHANCE;
  }

  if (context === 'attack') {
    return DEFINING_WILDLIFE_SPEECH_ATTACK_SUSTAINED_CHANCE;
  }

  if (context === 'eatingAggressive') {
    return DEFINING_WILDLIFE_SPEECH_EATING_AGGRESSIVE_SUSTAINED_CHANCE;
  }

  if (context === 'stalk') {
    return DEFINING_WILDLIFE_SPEECH_STALK_SUSTAINED_CHANCE;
  }

  if (context === 'howl') {
    return DEFINING_WILDLIFE_SPEECH_HOWL_SUSTAINED_CHANCE;
  }

  return null;
}

function resolvingWildlifeSpeechSustainedBucketMs(
  context: DefiningWildlifeSpeechContextKind
): number | null {
  if (context === 'neutral' || context === 'friendly') {
    return DEFINING_WILDLIFE_SPEECH_NEUTRAL_SUSTAINED_BUCKET_MS;
  }

  if (context === 'eating') {
    return DEFINING_WILDLIFE_SPEECH_EATING_SUSTAINED_BUCKET_MS;
  }

  if (context === 'flee') {
    return DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_BUCKET_MS;
  }

  if (context === 'attack') {
    return DEFINING_WILDLIFE_SPEECH_ATTACK_SUSTAINED_BUCKET_MS;
  }

  if (context === 'eatingAggressive') {
    return DEFINING_WILDLIFE_SPEECH_EATING_AGGRESSIVE_SUSTAINED_BUCKET_MS;
  }

  if (context === 'stalk') {
    return DEFINING_WILDLIFE_SPEECH_STALK_SUSTAINED_BUCKET_MS;
  }

  if (context === 'howl') {
    return DEFINING_WILDLIFE_SPEECH_HOWL_SUSTAINED_BUCKET_MS;
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
  lines: readonly DefiningWildlifeSpeechLine[],
  nowMs: number
): DefiningWildlifeSpeechLine | null {
  if (lines.length === 0) {
    return null;
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

  return lines[lineIndex] ?? lines[0] ?? null;
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

  if (instance.aiState.isSleeping) {
    const sleepLines = resolvingWildlifeSpeechLinesForInstance(
      instance,
      'sleep'
    );
    const sleepLine = pickingWildlifeSpeechLine(
      instance,
      'sleep',
      sleepLines,
      nowMs
    );

    if (sleepLine === null) {
      return prunedSpeechState;
    }

    const message = resolvingWildlifeSpeechLineText(sleepLine);

    if (message.length === 0) {
      return prunedSpeechState;
    }

    const shouldRefreshSleepBubble =
      prunedSpeechState.activeBubble === null ||
      prunedSpeechState.activeBubble.expiresAtMs <= nowMs;

    if (!shouldRefreshSleepBubble) {
      return prunedSpeechState;
    }

    return {
      activeBubble: {
        message,
        expiresAtMs: nowMs + DEFINING_WILDLIFE_SLEEP_SPEECH_BUBBLE_DURATION_MS,
        presentation: resolvingWildlifeSpeechLinePresentation(
          sleepLine,
          'sleep'
        ),
      },
      lastEmittedAtMs: nowMs,
      lastContextKey: 'sleep',
    };
  }

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
    instance,
    nowMs,
  });

  if (context === null) {
    return {
      ...prunedSpeechState,
      lastContextKey: null,
    };
  }

  const lines = resolvingWildlifeSpeechLinesForInstance(instance, context);

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

  const line = pickingWildlifeSpeechLine(instance, context, lines, nowMs);

  if (line === null) {
    return {
      ...prunedSpeechState,
      lastContextKey: context,
    };
  }

  const message = resolvingWildlifeSpeechLineText(line);

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
      presentation: resolvingWildlifeSpeechLinePresentation(line, context),
    },
    lastEmittedAtMs: nowMs,
    lastContextKey: context,
  };
}
