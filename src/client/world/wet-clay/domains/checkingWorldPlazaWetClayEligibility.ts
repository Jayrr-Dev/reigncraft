/**
 * Checks whether the player can wet clay at a water tile.
 *
 * @module components/world/wet-clay/domains/checkingWorldPlazaWetClayEligibility
 */

import { checkingWorldPlazaLiquidWaterTileEligibility } from '@/components/world/domains/checkingWorldPlazaLiquidWaterTileEligibility';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
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
  return checkingWorldPlazaLiquidWaterTileEligibility(
    playerPosition,
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WET_CLAY_PLAYER_RANGE_TILES
  );
}
