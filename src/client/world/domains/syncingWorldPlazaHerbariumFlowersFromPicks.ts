/**
 * Backfills herbarium flower discovery from inventory holdings and picked tiles.
 *
 * Flowers unlock by pick only (not proximity). This heals progress for specimens
 * already gathered before the herbarium existed.
 *
 * @module components/world/domains/syncingWorldPlazaHerbariumFlowersFromPicks
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { ensuringWorldPlazaHerbariumFlowerStudyAtLeast } from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import { parsingWorldPlazaFlowerSpeciesIdFromItemTypeId } from '@/components/world/inventory/domains/definingWorldPlazaFlowerEatEffectRegistry';
import {
  resolvingWorldFlowerSpeciesAtTileIndex,
  type WorldFlowerSpeciesId,
} from '../../../shared/worldFlowerRarity';

function parsingWorldPlazaPickedFlowerTileKey(
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
 * Raises each known picked flower species to at least its observed study floor.
 *
 * @param inventoryState - Current player inventory (optional).
 * @param pickedFlowerStateByTileKey - Persisted picked flower tiles (optional).
 */
export function syncingWorldPlazaHerbariumFlowersFromPicks(
  inventoryState?: DefiningInventoryState | null,
  pickedFlowerStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  > | null
): void {
  const studyFloorBySpeciesId = new Map<WorldFlowerSpeciesId, number>();

  const raisingStudyFloor = (
    speciesId: WorldFlowerSpeciesId,
    floor: number
  ): void => {
    const nextFloor = Math.max(1, Math.floor(floor));
    const previousFloor = studyFloorBySpeciesId.get(speciesId) ?? 0;
    studyFloorBySpeciesId.set(speciesId, Math.max(previousFloor, nextFloor));
  };

  if (pickedFlowerStateByTileKey) {
    const pickCountBySpeciesId = new Map<WorldFlowerSpeciesId, number>();

    for (const [tileKey, tileState] of pickedFlowerStateByTileKey.entries()) {
      if (!tileState.isPicked) {
        continue;
      }

      const tile = parsingWorldPlazaPickedFlowerTileKey(tileKey);

      if (!tile) {
        continue;
      }

      const speciesId = resolvingWorldFlowerSpeciesAtTileIndex(
        tile.tileX,
        tile.tileY
      );
      pickCountBySpeciesId.set(
        speciesId,
        (pickCountBySpeciesId.get(speciesId) ?? 0) + 1
      );
    }

    for (const [speciesId, pickCount] of pickCountBySpeciesId.entries()) {
      raisingStudyFloor(speciesId, pickCount);
    }
  }

  if (inventoryState) {
    for (const slot of inventoryState.slots) {
      if (!slot || slot.quantity <= 0) {
        continue;
      }

      const speciesId = parsingWorldPlazaFlowerSpeciesIdFromItemTypeId(
        slot.itemTypeId
      );

      if (!speciesId) {
        continue;
      }

      // Holding a flower proves at least one pick; stack size is a soft floor.
      raisingStudyFloor(speciesId, Math.max(1, slot.quantity));
    }
  }

  for (const [speciesId, studyFloor] of studyFloorBySpeciesId.entries()) {
    ensuringWorldPlazaHerbariumFlowerStudyAtLeast(speciesId, studyFloor);
  }
}
