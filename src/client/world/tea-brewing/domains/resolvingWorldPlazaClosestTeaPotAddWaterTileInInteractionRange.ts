/**
 * Picks the Add Water shore tile closest to the player.
 *
 * @module components/world/tea-brewing/domains/resolvingWorldPlazaClosestTeaPotAddWaterTileInInteractionRange
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { formattingWorldPlazaTeaPotAddWaterTileSelectionKey } from '@/components/world/tea-brewing/domains/formattingWorldPlazaTeaPotAddWaterTileSelectionKey';
import type { ListingWorldPlazaTeaPotAddWaterTilesInInteractionRangeEntry } from '@/components/world/tea-brewing/domains/listingWorldPlazaTeaPotAddWaterTilesInInteractionRange';

/**
 * Returns the nearest entry to the player foot, or a preferred active target when present.
 */
export function resolvingWorldPlazaClosestTeaPotAddWaterTileInInteractionRange(
  playerPosition: DefiningWorldPlazaWorldPoint,
  entries: readonly ListingWorldPlazaTeaPotAddWaterTilesInInteractionRangeEntry[],
  preferredTargetKey: string | null = null
): ListingWorldPlazaTeaPotAddWaterTilesInInteractionRangeEntry | null {
  if (entries.length === 0) {
    return null;
  }

  if (preferredTargetKey) {
    for (const entry of entries) {
      if (
        formattingWorldPlazaTeaPotAddWaterTileSelectionKey(
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
