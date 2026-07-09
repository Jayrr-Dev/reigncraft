/**
 * Advances per-instance sleep state from the day/night schedule.
 *
 * @module components/world/wildlife/domains/advancingWildlifeSleepTick
 */

import { checkingWorldPlazaEntityPlayerSleepIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityPlayerSleepIsActive';
import { checkingWildlifeScheduleSleepBlocked } from '@/components/world/wildlife/domains/checkingWildlifeScheduleSleepBlocked';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { emittingWildlifeWakeSpeech } from '@/components/world/wildlife/domains/emittingWildlifeWakeSpeech';
import { resolvingWildlifeShouldSleepAtCyclePhase } from '@/components/world/wildlife/domains/resolvingWildlifeShouldSleepAtCyclePhase';

export type AdvancingWildlifeSleepTickParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  cyclePhase: number;
  nowMs: number;
};

function applyingWildlifeAwakeAiState(
  instance: DefiningWildlifeInstance,
  nowMs: number,
  emitWakeSpeech: boolean
): DefiningWildlifeInstance {
  const awakeInstance: DefiningWildlifeInstance = {
    ...instance,
    aiState: {
      ...instance.aiState,
      isSleeping: false,
      motionClip:
        instance.aiState.motionClip === 'sleep'
          ? 'idle'
          : instance.aiState.motionClip,
    },
  };

  if (!emitWakeSpeech) {
    return awakeInstance;
  }

  return {
    ...awakeInstance,
    speechState: emittingWildlifeWakeSpeech({
      instance: awakeInstance,
      nowMs,
    }),
  };
}

function applyingWildlifeSleepingAiState(
  instance: DefiningWildlifeInstance
): DefiningWildlifeInstance {
  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      isSleeping: true,
      intent: { mode: 'idle' },
      isMoving: false,
      motionClip: 'sleep',
      steeringCache: null,
      chargeWindupStartedAtMs: null,
      jumpState: null,
    },
  };
}

/**
 * Updates sleep state for one wildlife instance.
 */
export function advancingWildlifeSleepTick({
  instance,
  species,
  cyclePhase,
  nowMs,
}: AdvancingWildlifeSleepTickParams): DefiningWildlifeInstance {
  if (instance.isDead || instance.aiState.hasSleepBeenDisturbed || species.neverSleeps) {
    return instance;
  }

  const scheduleSaysSleep = resolvingWildlifeShouldSleepAtCyclePhase({
    activityPattern: species.activityPattern,
    cyclePhase,
    instanceId: instance.instanceId,
    sleepScheduleSample: instance.sleepScheduleSample,
    sleepScheduleMeanShift: species.sleepSchedule?.bellCurveMeanShift ?? 0,
  });
  const sleepDebuffActive = checkingWorldPlazaEntityPlayerSleepIsActive(
    instance.healthState,
    nowMs
  );
  const scheduleSleepBlocked = checkingWildlifeScheduleSleepBlocked(
    instance,
    nowMs
  );

  if (sleepDebuffActive) {
    return applyingWildlifeSleepingAiState(instance);
  }

  if (instance.aiState.isSleeping) {
    if (scheduleSaysSleep && !scheduleSleepBlocked) {
      return applyingWildlifeSleepingAiState(instance);
    }

    return applyingWildlifeAwakeAiState(instance, nowMs, true);
  }

  if (scheduleSaysSleep && !scheduleSleepBlocked) {
    return applyingWildlifeSleepingAiState(instance);
  }

  return instance;
}
