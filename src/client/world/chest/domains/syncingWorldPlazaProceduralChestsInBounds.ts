/**
 * Upserts procedural locked chest instances for tiles inside visible bounds.
 *
 * @module components/world/chest/domains/syncingWorldPlazaProceduralChestsInBounds
 */

import {
  upsertingWorldPlazaChestInstanceFromPlacement,
  type ManagingWorldPlazaChestInstanceStore,
} from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';
import { resolvingWorldPlazaProceduralChestAtTileIndex } from '@/components/world/chest/domains/resolvingWorldPlazaProceduralChestAtTileIndex';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { listingWorldPlazaTileIndicesInBounds } from '@/components/world/domains/listingWorldPlazaTileIndicesInBounds';

export type SyncingWorldPlazaProceduralChestsInBoundsResult = {
  readonly upsertedCount: number;
};

/**
 * Materializes procedural chest instances for tiles in bounds.
 * Skips tiles that already have an instance (preserves open/unlocked state).
 */
export function syncingWorldPlazaProceduralChestsInBounds(
  bounds: DefiningWorldPlazaVisibleTileBounds,
  persistenceOwnerId: string | null,
  store?: ManagingWorldPlazaChestInstanceStore
): SyncingWorldPlazaProceduralChestsInBoundsResult {
  let upsertedCount = 0;

  for (const { tileX, tileY } of listingWorldPlazaTileIndicesInBounds(bounds)) {
    const placement = resolvingWorldPlazaProceduralChestAtTileIndex(
      tileX,
      tileY
    );

    if (!placement) {
      continue;
    }

    const didUpsert = upsertingWorldPlazaChestInstanceFromPlacement(
      placement,
      persistenceOwnerId,
      store
    );

    if (didUpsert) {
      upsertedCount += 1;
    }
  }

  return { upsertedCount };
}
