/**
 * Advances per-instance sleep state from the day/night schedule.
 *
 * @module components/world/wildlife/domains/advancingWildlifeSleepTick
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifeRecentlyAggroed } from '@/components/world/wildlife/domains/checkingWildlifeRecentlyAggroed';
import { resolvingWildlifeShouldSleepAtCyclePhase } from '@/components/world/wildlife/domains/resolvingWildlifeShouldSleepAtCyclePhase';

export type AdvancingWildlifeSleepTickParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  cyclePhase: number;
  nowMs: number;
};

function applyingWildlifeAwakeAiState(
  instance: DefiningWildlifeInstance
): DefiningWildlifeInstance {
  return {
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
  if (instance.isDead || instance.aiState.hasSleepBeenDisturbed) {
    return instance;
  }

  const scheduleSaysSleep = resolvingWildlifeShouldSleepAtCyclePhase({
    activityPattern: species.activityPattern,
    cyclePhase,
    instanceId: instance.instanceId,
    sleepScheduleSample: instance.sleepScheduleSample,
    sleepScheduleMeanShift: species.sleepSchedule?.bellCurveMeanShift ?? 0,
  });
  const recentlyAggroed = checkingWildlifeRecentlyAggroed(
    instance.aggroState.lastAggroedAtMs,
    nowMs
  );

  if (instance.aiState.isSleeping) {
    if (scheduleSaysSleep && !recentlyAggroed) {
      return applyingWildlifeSleepingAiState(instance);
    }

    return applyingWildlifeAwakeAiState(instance);
  }

  if (scheduleSaysSleep && !recentlyAggroed) {
    return applyingWildlifeSleepingAiState(instance);
  }

  return instance;
}
