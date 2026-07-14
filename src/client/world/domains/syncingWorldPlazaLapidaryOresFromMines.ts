/**
 * Backfills lapidary ore discovery from inventory holdings and mined ore tiles.
 *
 * @module components/world/domains/syncingWorldPlazaLapidaryOresFromMines
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { ensuringWorldPlazaLapidaryOreStudyAtLeast } from '@/components/world/domains/managingWorldPlazaLapidaryDiscoveryStore';
import { resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import { parsingWorldPlazaOreSpeciesIdFromItemTypeId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreSpriteSheetConstants';
import type { WorldOreSpeciesId } from '../../../shared/worldOreRarity';

function parsingWorldPlazaMinedRockTileKey(
  tileKey: string
): { tileX: number; tileY: number } | null {
  const parts = tileKey.split(',');

  if (parts.length !== 2) {
    return null;
  }

  const tileX = Number(parts[0]);
  const tileY = Number(parts[1]);

  if (!Number.isFinite(tileX) || !Number.isFinite(tileY)) {
    return null;
  }

  return { tileX, tileY };
}

/**
 * Raises each known mined/held ore species to at least its observed study floor.
 *
 * @param inventoryState - Current player inventory (optional).
 * @param minedRockStateByTileKey - Persisted mined rock tiles (optional).
 */
export function syncingWorldPlazaLapidaryOresFromMines(
  inventoryState?: DefiningInventoryState | null,
  minedRockStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaMinedRockTileState
  > | null
): void {
  const studyFloorBySpeciesId = new Map<WorldOreSpeciesId, number>();

  const raisingStudyFloor = (
    speciesId: WorldOreSpeciesId,
    floor: number
  ): void => {
    const nextFloor = Math.max(1, Math.floor(floor));
    const previousFloor = studyFloorBySpeciesId.get(speciesId) ?? 0;
    studyFloorBySpeciesId.set(speciesId, Math.max(previousFloor, nextFloor));
  };

  if (minedRockStateByTileKey) {
    const mineCountBySpeciesId = new Map<WorldOreSpeciesId, number>();

    for (const [tileKey, tileState] of minedRockStateByTileKey.entries()) {
      const tile = parsingWorldPlazaMinedRockTileKey(tileKey);

      if (!tile) {
        continue;
      }

      const metadata = resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex(
        tile.tileX,
        tile.tileY
      );

      if (!metadata?.oreSpeciesId) {
        continue;
      }

      // Any mine progress on an ore vein counts as at least one study floor.
      const studyFloor = tileState.isDepleted ? 3 : 1;
      mineCountBySpeciesId.set(
        metadata.oreSpeciesId,
        (mineCountBySpeciesId.get(metadata.oreSpeciesId) ?? 0) + studyFloor
      );
    }

    for (const [speciesId, mineCount] of mineCountBySpeciesId.entries()) {
      raisingStudyFloor(speciesId, mineCount);
    }
  }

  if (inventoryState) {
    for (const slot of inventoryState.slots) {
      if (!slot || slot.quantity <= 0) {
        continue;
      }

      const speciesId = parsingWorldPlazaOreSpeciesIdFromItemTypeId(
        slot.itemTypeId
      );

      if (!speciesId) {
        continue;
      }

      raisingStudyFloor(speciesId, Math.max(1, slot.quantity));
    }
  }

  for (const [speciesId, studyFloor] of studyFloorBySpeciesId.entries()) {
    ensuringWorldPlazaLapidaryOreStudyAtLeast(speciesId, studyFloor);
  }
}
