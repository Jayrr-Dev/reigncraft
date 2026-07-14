/**
 * Picks the wet-clay water tile closest to the player.
 *
 * @module components/world/wet-clay/domains/resolvingWorldPlazaClosestWetClayTileInInteractionRange
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { formattingWorldPlazaWetClayTileSelectionKey } from '@/components/world/wet-clay/domains/formattingWorldPlazaWetClayTileSelectionKey';
import type { ListingWorldPlazaWetClayTilesInInteractionRangeEntry } from '@/components/world/wet-clay/domains/listingWorldPlazaWetClayTilesInInteractionRange';

/**
 * Returns the nearest entry to the player foot, or a preferred active target when present.
 */
export function resolvingWorldPlazaClosestWetClayTileInInteractionRange(
  playerPosition: DefiningWorldPlazaWorldPoint,
  entries: readonly ListingWorldPlazaWetClayTilesInInteractionRangeEntry[],
  preferredTargetKey: string | null = null
): ListingWorldPlazaWetClayTilesInInteractionRangeEntry | null {
  if (entries.length === 0) {
    return null;
  }

  if (preferredTargetKey) {
    for (const entry of entries) {
      if (
        formattingWorldPlazaWetClayTileSelectionKey(
          entry.tileX,
          entry.tileY
        ) === preferredTargetKey
      ) {
        return entry;
      }
    }
  }

  let closestEntry = entries[0]!;
  let closestDistanceSquared = Number.POSITIVE_INFINITY;

  for (const entry of entries) {
    const deltaX = playerPosition.x - (entry.tileX + 0.5);
    const deltaY = playerPosition.y - (entry.tileY + 0.5);
    const distanceSquared = deltaX * deltaX + deltaY * deltaY;

    if (distanceSquared < closestDistanceSquared) {
      closestDistanceSquared = distanceSquared;
      closestEntry = entry;
    }
  }

  return closestEntry;
}
