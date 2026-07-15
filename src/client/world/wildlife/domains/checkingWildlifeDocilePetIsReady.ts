/**
 * Pet cooldown readiness for living cats and dogs.
 *
 * @module components/world/wildlife/domains/checkingWildlifeDocilePetIsReady
 */

import { computingWorldPlazaInGameHoursToRealMs } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import {
  DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MAX_IN_GAME_HOURS,
  DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MIN_IN_GAME_HOURS,
} from '@/components/world/wildlife/domains/definingWildlifeDocilePetConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * True when this living companion can accept a Pet right now.
 */
export function checkingWildlifeDocilePetIsReady(
  instance:
    | Pick<DefiningWildlifeInstance, 'petCooldownUntilMs'>
    | null
    | undefined,
  nowMs: number
): boolean {
  if (!instance) {
    return false;
  }

  const cooldownUntilMs = instance.petCooldownUntilMs;

  if (cooldownUntilMs === null || cooldownUntilMs === undefined) {
    return true;
  }

  return nowMs >= cooldownUntilMs;
}

/**
 * Rolls a Pet cooldown duration in real milliseconds from the in-game hour band.
 * `rollUnit` is `[0, 1)` (pass a fixed value in tests).
 */
export function rollingWildlifeDocilePetCooldownDurationMs(
  rollUnit: number = Math.random()
): number {
  const clampedRoll = Math.min(1, Math.max(0, rollUnit));
  const spanHours =
    DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MAX_IN_GAME_HOURS -
    DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MIN_IN_GAME_HOURS;
  const hours =
    DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MIN_IN_GAME_HOURS +
    clampedRoll * spanHours;

  return computingWorldPlazaInGameHoursToRealMs(hours);
}
