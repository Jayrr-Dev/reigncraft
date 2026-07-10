/**
 * Wolf howl playback lock and trigger requests.
 *
 * @module components/world/wildlife/domains/advancingWildlifeWolfHowlTick
 */

import { resolvingWildlifeStalkPhaseOrIdle } from '@/components/world/wildlife/domains/checkingWildlifeStalkPhase';
import { checkingWildlifeWolfComboSpecies } from '@/components/world/wildlife/domains/checkingWildlifeWolfComboSpecies';
import { checkingWildlifeOmegaWolfSpecies } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';
import type {
  DefiningWildlifeAggroState,
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { notifyingWildlifeOmegaWolfSfxEvent } from '@/components/world/wildlife/domains/notifyingWildlifeOmegaWolfSfxEvent';
import { resolvingWildlifeWolfComboTuning } from '@/components/world/wildlife/domains/resolvingWildlifeWolfComboTuning';
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
  if (!checkingWildlifeWolfComboSpecies(instance.speciesId)) {
    return instance;
  }

  if (checkingWildlifeInstanceIsHowling(instance, nowMs)) {
    return instance;
  }

  const { howlCooldownMs, howlDurationMs } = resolvingWildlifeWolfComboTuning(
    instance.speciesId
  );
  const lastHowlAtMs = instance.aiState.lastHowlAtMs;

  if (lastHowlAtMs !== null && nowMs - lastHowlAtMs < howlCooldownMs) {
    return instance;
  }

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      howlingUntilMs: nowMs + howlDurationMs,
      lastHowlAtMs: nowMs,
    },
  };
}

/** Keeps the howl clip visible and clears the lock when finished. */
export function applyingWildlifeWolfHowlPresentation(
  instance: DefiningWildlifeInstance,
  nowMs: number
): DefiningWildlifeInstance {
  if (!checkingWildlifeWolfComboSpecies(instance.speciesId)) {
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
  if (!checkingWildlifeWolfComboSpecies(instance.speciesId)) {
    return instance;
  }

  const previousPhase = resolvingWildlifeStalkPhaseOrIdle(previousAggroState);
  const nextPhase = resolvingWildlifeStalkPhaseOrIdle(nextAggroState);
  const huntJustStarted = previousPhase === 'idle' && nextPhase === 'shadowing';
  const territoryWarnStarted =
    nextIntent.mode === 'territoryWarn' &&
    previousIntent.mode !== 'territoryWarn';
  const alphaCalledRush =
    isPackAlpha &&
    previousIntent.mode === 'stalk' &&
    (nextIntent.mode === 'chase' || nextIntent.mode === 'attack');
  const packTurnedConfident =
    isPackAlpha && previousPhase !== 'formingUp' && nextPhase === 'formingUp';

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

  if (checkingWildlifeOmegaWolfSpecies(instance.speciesId)) {
    if (alphaCalledRush) {
      notifyingWildlifeOmegaWolfSfxEvent({
        eventKind: 'chase_call',
        worldPoint: instance.position,
      });
    } else if (territoryWarnStarted) {
      notifyingWildlifeOmegaWolfSfxEvent({
        eventKind: 'territory_warn',
        worldPoint: instance.position,
      });
    } else {
      notifyingWildlifeOmegaWolfSfxEvent({
        eventKind: 'howl',
        worldPoint: instance.position,
      });
    }
  }

  return requestingWildlifeWolfHowl(instance, nowMs);
}
