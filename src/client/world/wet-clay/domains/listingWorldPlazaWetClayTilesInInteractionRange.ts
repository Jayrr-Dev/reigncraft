/**
 * Lists adjacent water tiles where the player can wet clay.
 *
 * @module components/world/wet-clay/domains/listingWorldPlazaWetClayTilesInInteractionRange
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaWetClayEligibility } from '@/components/world/wet-clay/domains/checkingWorldPlazaWetClayEligibility';
import { DEFINING_WORLD_PLAZA_WET_CLAY_PLAYER_RANGE_TILES } from '@/components/world/wet-clay/domains/definingWorldPlazaWetClayConstants';

export type ListingWorldPlazaWetClayTilesInInteractionRangeEntry = {
  readonly tileX: number;
  readonly tileY: number;
};

/**
 * Scans a square around the player for eligible wetting water tiles.
 */
export function listingWorldPlazaWetClayTilesInInteractionRange(
  playerPosition: DefiningWorldPlazaWorldPoint
): readonly ListingWorldPlazaWetClayTilesInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaWetClayTilesInInteractionRangeEntry[] = [];
  const centerTileX = Math.floor(playerPosition.x);
  const centerTileY = Math.floor(playerPosition.y);
  const radius = DEFINING_WORLD_PLAZA_WET_CLAY_PLAYER_RANGE_TILES;

  for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
    for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      const tileX = centerTileX + offsetX;
      const tileY = centerTileY + offsetY;
      const eligibility = checkingWorldPlazaWetClayEligibility(
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
