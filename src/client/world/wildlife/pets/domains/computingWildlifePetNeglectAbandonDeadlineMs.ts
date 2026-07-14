/**
 * Rolls the wall-clock deadline for a neglect abandon after prolonged hunger.
 *
 * @module components/world/wildlife/pets/domains/computingWildlifePetNeglectAbandonDeadlineMs
 */

import { computingWorldPlazaInGameHoursToRealMs } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import {
  DEFINING_WILDLIFE_PET_NEGLECT_ABANDON_MAX_IN_GAME_HOURS,
  DEFINING_WILDLIFE_PET_NEGLECT_ABANDON_MIN_IN_GAME_HOURS,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetHungerLoyaltyNeglectConstants';

/**
 * Uniform roll in [minHours, maxHours] in-game hours from `nowMs`.
 * `unitSample` is a `[0, 1)` random (injectable for tests).
 */
export function computingWildlifePetNeglectAbandonDeadlineMs(
  nowMs: number,
  unitSample: number = Math.random()
): number {
  const clampedSample = Math.min(1, Math.max(0, unitSample));
  const spanHours =
    DEFINING_WILDLIFE_PET_NEGLECT_ABANDON_MAX_IN_GAME_HOURS -
    DEFINING_WILDLIFE_PET_NEGLECT_ABANDON_MIN_IN_GAME_HOURS;
  const hours =
    DEFINING_WILDLIFE_PET_NEGLECT_ABANDON_MIN_IN_GAME_HOURS +
    clampedSample * spanHours;

  return nowMs + computingWorldPlazaInGameHoursToRealMs(hours);
}
