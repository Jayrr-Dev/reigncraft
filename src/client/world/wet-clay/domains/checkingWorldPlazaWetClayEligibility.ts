/**
 * Checks whether the player can wet clay at a water tile.
 *
 * @module components/world/wet-clay/domains/checkingWorldPlazaWetClayEligibility
 */

import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { DEFINING_WORLD_PLAZA_WET_CLAY_PLAYER_RANGE_TILES } from '@/components/world/wet-clay/domains/definingWorldPlazaWetClayConstants';

export type CheckingWorldPlazaWetClayEligibilityResult = {
  readonly isEligible: boolean;
  readonly reason: string | null;
};

/**
 * Returns true when the tile is liquid, unfrozen, and within wetting range.
 */
export function checkingWorldPlazaWetClayEligibility(
  playerPosition: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number
): CheckingWorldPlazaWetClayEligibilityResult {
  const waterKind = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

  if (!waterKind) {
    return { isEligible: false, reason: 'No water here.' };
  }

  if (checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY)) {
    return { isEligible: false, reason: 'The water is frozen.' };
  }

  const distance = computingWorldPlazaGridChebyshevDistance(
    playerPosition.x,
    playerPosition.y,
    tileX + 0.5,
    tileY + 0.5
  );

  if (distance > DEFINING_WORLD_PLAZA_WET_CLAY_PLAYER_RANGE_TILES) {
    return { isEligible: false, reason: 'Move closer to the water.' };
  }

  return { isEligible: true, reason: null };
}
