/**
 * Lists adjacent water tiles where the player can fill an empty teapot.
 *
 * @module components/world/tea-brewing/domains/listingWorldPlazaTeaPotAddWaterTilesInInteractionRange
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaTeaPotAddWaterEligibility } from '@/components/world/tea-brewing/domains/checkingWorldPlazaTeaPotAddWaterEligibility';
import { DEFINING_WORLD_PLAZA_TEA_BREWING_WATER_RANGE_TILES } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';

export type ListingWorldPlazaTeaPotAddWaterTilesInInteractionRangeEntry = {
  readonly tileX: number;
  readonly tileY: number;
};

/**
 * Scans a square around the player for eligible Add Water shore tiles.
 */
export function listingWorldPlazaTeaPotAddWaterTilesInInteractionRange(
  playerPosition: DefiningWorldPlazaWorldPoint
): readonly ListingWorldPlazaTeaPotAddWaterTilesInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaTeaPotAddWaterTilesInInteractionRangeEntry[] =
    [];
  const centerTileX = Math.floor(playerPosition.x);
  const centerTileY = Math.floor(playerPosition.y);
  const radius = DEFINING_WORLD_PLAZA_TEA_BREWING_WATER_RANGE_TILES;

  for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
    for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      const tileX = centerTileX + offsetX;
      const tileY = centerTileY + offsetY;
      const eligibility = checkingWorldPlazaTeaPotAddWaterEligibility(
        playerPosition,
        tileX,
        tileY
      );

      if (eligibility.isEligible) {
        entries.push({ tileX, tileY });
      }
    }
  }

  return entries;
}
