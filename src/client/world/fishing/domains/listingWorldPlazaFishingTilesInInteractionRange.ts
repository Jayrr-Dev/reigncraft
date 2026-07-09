/**
 * Lists adjacent water tiles the player can fish with an equipped rod.
 *
 * @module components/world/fishing/domains/listingWorldPlazaFishingTilesInInteractionRange
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaFishingCastEligibility } from '@/components/world/fishing/domains/checkingWorldPlazaFishingCastEligibility';
import { DEFINING_WORLD_PLAZA_FISHING_PLAYER_RANGE_TILES } from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';

export type ListingWorldPlazaFishingTilesInInteractionRangeEntry = {
  readonly tileX: number;
  readonly tileY: number;
};

/**
 * Scans a square around the player for eligible fishing water tiles.
 */
export function listingWorldPlazaFishingTilesInInteractionRange(
  playerPosition: DefiningWorldPlazaWorldPoint
): readonly ListingWorldPlazaFishingTilesInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaFishingTilesInInteractionRangeEntry[] = [];
  const centerTileX = Math.floor(playerPosition.x);
  const centerTileY = Math.floor(playerPosition.y);
  const radius = DEFINING_WORLD_PLAZA_FISHING_PLAYER_RANGE_TILES;

  for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
    for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      const tileX = centerTileX + offsetX;
      const tileY = centerTileY + offsetY;
      const eligibility = checkingWorldPlazaFishingCastEligibility(
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
