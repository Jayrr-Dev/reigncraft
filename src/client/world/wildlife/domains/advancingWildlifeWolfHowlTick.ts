/**
 * Grey wolf howl playback lock and trigger requests.
 *
 * @module components/world/wildlife/domains/advancingWildlifeWolfHowlTick
 */

import type {
  DefiningWildlifeAggroState,
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeStalkPhaseOrIdle } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPhase';
import {
  DEFINING_WILDLIFE_WOLF_HOWL_COOLDOWN_MS,
  DEFINING_WILDLIFE_WOLF_HOWL_DURATION_MS,
} from '@/components/world/wildlife/domains/definingWildlifeWolfVocalizationConstants';

function checkingWildlifeGreyWolfSpecies(speciesId: string): boolean {
  return speciesId === 'grey-wolf';
}

/** True while the howl one-shot is still playing. */
export function checkingWildlifeInstanceIsHowling(
  instance: DefiningWildlifeInstance,
  nowMs: number
): boolean {
  const howlingUntilMs = instance.aiState.howlingUntilMs;

  return howlingUntilMs !== null && howlingUntilMs > nowMs;
}

/** Starts a howl when cooldown allows. */
export function requestingWildlifeWolfHowl(
  instance: DefiningWildlifeInstance,
  nowMs: number
): DefiningWildlifeInstance {
  if (!checkingWildlifeGreyWolfSpecies(instance.speciesId)) {
    return instance;
  }

  if (checkingWildlifeInstanceIsHowling(instance, nowMs)) {
    return instance;
  }

  const lastHowlAtMs = instance.aiState.lastHowlAtMs;

  if (
    lastHowlAtMs !== null &&
    nowMs - lastHowlAtMs < DEFINING_WILDLIFE_WOLF_HOWL_COOLDOWN_MS
  ) {
    return instance;
  }

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      howlingUntilMs: nowMs + DEFINING_WILDLIFE_WOLF_HOWL_DURATION_MS,
      lastHowlAtMs: nowMs,
    },
  };
}

/** Keeps the howl clip visible and clears the lock when finished. */
export function applyingWildlifeWolfHowlPresentation(
  instance: DefiningWildlifeInstance,
  nowMs: number
): DefiningWildlifeInstance {
  if (!checkingWildlifeGreyWolfSpecies(instance.speciesId)) {
    return instance;
  }

  if (checkingWildlifeInstanceIsHowling(instance, nowMs)) {
    return {
      ...instance,
      aiState: {
        ...instance.aiState,
        motionClip: 'howl',
        isMoving: false,
      },
    };
  }

  if (instance.aiState.howlingUntilMs !== null) {
    return {
      ...instance,
      aiState: {
        ...instance.aiState,
        howlingUntilMs: null,
      },
    };
  }

  return instance;
}

export type AdvancingWildlifeWolfHowlTriggerParams = {
  instance: DefiningWildlifeInstance;
  previousAggroState: DefiningWildlifeAggroState;
  nextAggroState: DefiningWildlifeAggroState;
  previousIntent: DefiningWildlifeBehaviorIntent;
  nextIntent: DefiningWildlifeBehaviorIntent;
  isPackAlpha: boolean;
  nowMs: number;
};

/**
 * Requests howls when the pack alpha opens a hunt, warns territory, or calls a rush.
 */
export function advancingWildlifeWolfHowlTriggers({
  instance,
  previousAggroState,
  nextAggroState,
  previousIntent,
  nextIntent,
  isPackAlpha,
  nowMs,
}: AdvancingWildlifeWolfHowlTriggerParams): DefiningWildlifeInstance {
  if (!checkingWildlifeGreyWolfSpecies(instance.speciesId)) {
    return instance;
  }

  const previousPhase = resolvingWildlifeStalkPhaseOrIdle(previousAggroState);
  const nextPhase = resolvingWildlifeStalkPhaseOrIdle(nextAggroState);
  const huntJustStarted =
    previousPhase === 'idle' && nextPhase === 'shadowing';
  const territoryWarnStarted =
    nextIntent.mode === 'territoryWarn' &&
    previousIntent.mode !== 'territoryWarn';
  const alphaCalledRush =
    isPackAlpha &&
    previousIntent.mode === 'stalk' &&
    (nextIntent.mode === 'chase' || nextIntent.mode === 'attack');
  const packTurnedConfident =
    isPackAlpha &&
    previousPhase !== 'formingUp' &&
    nextPhase === 'formingUp';

  if (
    !huntJustStarted &&
    !territoryWarnStarted &&
    !alphaCalledRush &&
    !packTurnedConfident
  ) {
    return instance;
  }

  if (huntJustStarted && !isPackAlpha) {
    return instance;
  }

  return requestingWildlifeWolfHowl(instance, nowMs);
}
