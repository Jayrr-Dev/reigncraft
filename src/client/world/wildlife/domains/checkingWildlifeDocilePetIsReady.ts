/**
 * Pet cooldown readiness for living cats and dogs.
 *
 * @module components/world/wildlife/domains/checkingWildlifeDocilePetIsReady
 */

import { computingWorldPlazaInGameHoursToRealMs } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_IN_GAME_HOURS } from '@/components/world/wildlife/domains/definingWildlifeDocilePetConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * True when this living companion can accept a Pet right now.
 */
export function checkingWildlifeDocilePetIsReady(
  instance: Pick<DefiningWildlifeInstance, 'petCooldownUntilMs'> | null | undefined,
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
 * Pet cooldown duration in real milliseconds (one in-game hour).
 */
export function computingWildlifeDocilePetCooldownDurationMs(): number {
  return computingWorldPlazaInGameHoursToRealMs(
    DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_IN_GAME_HOURS
  );
}
