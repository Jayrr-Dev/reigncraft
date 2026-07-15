/**
 * Checks whether the player can fill an empty teapot at a water tile.
 *
 * @module components/world/tea-brewing/domains/checkingWorldPlazaTeaPotAddWaterEligibility
 */

import { checkingWorldPlazaLiquidWaterTileEligibility } from '@/components/world/domains/checkingWorldPlazaLiquidWaterTileEligibility';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_TEA_BREWING_WATER_RANGE_TILES } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';

export type CheckingWorldPlazaTeaPotAddWaterEligibilityResult = {
  readonly isEligible: boolean;
  readonly reason: string | null;
};

/**
 * Returns true when the tile is liquid, unfrozen, and within fill range.
 */
export function checkingWorldPlazaTeaPotAddWaterEligibility(
  playerPosition: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number
): CheckingWorldPlazaTeaPotAddWaterEligibilityResult {
  return checkingWorldPlazaLiquidWaterTileEligibility(
    playerPosition,
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TEA_BREWING_WATER_RANGE_TILES
  );
}
