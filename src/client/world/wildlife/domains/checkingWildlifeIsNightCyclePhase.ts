/**
 * Whether the day/night cycle phase is night (sunset → sunrise).
 *
 * @module components/world/wildlife/domains/checkingWildlifeIsNightCyclePhase
 */

import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE,
} from '@/components/world/domains/definingWorldPlazaDayNightCycleConstants';

function checkingWildlifeIsWithinWrappedPhaseWindow(
  cyclePhase: number,
  startPhase: number,
  endPhase: number
): boolean {
  if (startPhase <= endPhase) {
    return cyclePhase >= startPhase && cyclePhase < endPhase;
  }

  return cyclePhase >= startPhase || cyclePhase < endPhase;
}

/** True from sunset through sunrise (wrapped night window). */
export function checkingWildlifeIsNightCyclePhase(cyclePhase: number): boolean {
  return checkingWildlifeIsWithinWrappedPhaseWindow(
    cyclePhase,
    DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE,
    DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE
  );
}
