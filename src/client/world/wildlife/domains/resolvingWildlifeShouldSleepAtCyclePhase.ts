/**
 * Resolves whether a species should be asleep at a given day/night cycle phase.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeShouldSleepAtCyclePhase
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE,
} from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';
import {
  DEFINING_WILDLIFE_CATHEMERAL_PHASE_BUCKET_COUNT,
  DEFINING_WILDLIFE_CATHEMERAL_SLEEP_ROLL_SALT,
  DEFINING_WILDLIFE_CREPUSCULAR_TWILIGHT_PHASE_HALF_WIDTH,
} from '@/components/world/wildlife/domains/definingWildlifeSleepConstants';
import { resolvingWildlifeSleepScheduleProfileFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeSleepScheduleProfileFromSample';
import type { DefiningWildlifeActivityPattern } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function resolvingWildlifeCyclePhaseDistance(
  cyclePhase: number,
  targetPhase: number
): number {
  const directDistance = Math.abs(cyclePhase - targetPhase);
  const wrappedDistance = 1 - directDistance;

  return Math.min(directDistance, wrappedDistance);
}

function checkingWildlifeIsWithinWrappedSleepWindow(
  cyclePhase: number,
  sleepStartPhase: number,
  sleepEndPhase: number
): boolean {
  if (sleepStartPhase <= sleepEndPhase) {
    return cyclePhase >= sleepStartPhase && cyclePhase < sleepEndPhase;
  }

  return cyclePhase >= sleepStartPhase || cyclePhase < sleepEndPhase;
}

function checkingWildlifeDiurnalSleepPhase(
  cyclePhase: number,
  phaseWindowOffset: number
): boolean {
  const sleepStartPhase =
    DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE - phaseWindowOffset;
  const sleepEndPhase =
    DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE + phaseWindowOffset;

  return checkingWildlifeIsWithinWrappedSleepWindow(
    cyclePhase,
    sleepStartPhase,
    sleepEndPhase
  );
}

function checkingWildlifeNocturnalSleepPhase(
  cyclePhase: number,
  phaseWindowOffset: number
): boolean {
  const sleepStartPhase =
    DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE - phaseWindowOffset;
  const sleepEndPhase =
    DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE + phaseWindowOffset;

  return (
    cyclePhase >= sleepStartPhase &&
    cyclePhase < sleepEndPhase
  );
}

function checkingWildlifeIsCrepuscularActivePhase(
  cyclePhase: number,
  phaseWindowOffset: number
): boolean {
  const twilightHalfWidth = Math.max(
    0.02,
    DEFINING_WILDLIFE_CREPUSCULAR_TWILIGHT_PHASE_HALF_WIDTH -
      phaseWindowOffset
  );
  const nearSunrise =
    resolvingWildlifeCyclePhaseDistance(
      cyclePhase,
      DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE
    ) <= twilightHalfWidth;
  const nearSunset =
    resolvingWildlifeCyclePhaseDistance(
      cyclePhase,
      DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE
    ) <= twilightHalfWidth;

  return nearSunrise || nearSunset;
}

function checkingWildlifeCathemeralShouldSleep(
  instanceId: string,
  cyclePhase: number,
  cathemeralSleepProbability: number
): boolean {
  const bucketIndex = Math.min(
    DEFINING_WILDLIFE_CATHEMERAL_PHASE_BUCKET_COUNT - 1,
    Math.floor(cyclePhase * DEFINING_WILDLIFE_CATHEMERAL_PHASE_BUCKET_COUNT)
  );
  const roll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    bucketIndex,
    instanceId.length,
    DEFINING_WILDLIFE_CATHEMERAL_SLEEP_ROLL_SALT + bucketIndex * 13
  );

  return roll < cathemeralSleepProbability;
}

export type ResolvingWildlifeShouldSleepAtCyclePhaseParams = {
  activityPattern: DefiningWildlifeActivityPattern;
  cyclePhase: number;
  isDaytime: boolean;
  instanceId: string;
  sleepScheduleSample: number;
  sleepScheduleMeanShift?: number;
};

/**
 * Returns true when this instance's personal schedule calls for sleep.
 */
export function resolvingWildlifeShouldSleepAtCyclePhase({
  activityPattern,
  cyclePhase,
  isDaytime,
  instanceId,
  sleepScheduleSample,
  sleepScheduleMeanShift = 0,
}: ResolvingWildlifeShouldSleepAtCyclePhaseParams): boolean {
  const sleepProfile = resolvingWildlifeSleepScheduleProfileFromSample(
    sleepScheduleSample,
    sleepScheduleMeanShift
  );

  if (activityPattern === 'nocturnal') {
    return checkingWildlifeNocturnalSleepPhase(
      cyclePhase,
      sleepProfile.phaseWindowOffset
    );
  }

  if (activityPattern === 'diurnal') {
    return checkingWildlifeDiurnalSleepPhase(
      cyclePhase,
      sleepProfile.phaseWindowOffset
    );
  }

  if (activityPattern === 'crepuscular') {
    return !checkingWildlifeIsCrepuscularActivePhase(
      cyclePhase,
      sleepProfile.phaseWindowOffset
    );
  }

  return checkingWildlifeCathemeralShouldSleep(
    instanceId,
    cyclePhase,
    sleepProfile.cathemeralSleepProbability
  );
}
