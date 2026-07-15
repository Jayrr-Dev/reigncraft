/**
 * Module bridge between picked-flower persistence and the wildlife sim tick.
 *
 * Marks biome flowers picked (same persistence as player picks) without
 * granting inventory. Optimistic mid-tick picks stop other animals targeting.
 *
 * @module components/world/wildlife/domains/managingWildlifeGroundFlowerBridge
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { formattingWorldPlazaPickedFlowerTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { parsingWildlifeGroundFlowerItemId } from '@/components/world/wildlife/domains/definingWildlifeGroundFlowerIdConstants';

export type ManagingWildlifeGroundFlowerBridge = {
  consumeGroundFlower: (
    tileX: number,
    tileY: number,
    consumerPosition: DefiningWorldPlazaWorldPoint
  ) => boolean;
};

let managingWildlifeGroundFlowerBridge: ManagingWildlifeGroundFlowerBridge | null =
  null;

/** Mid-tick optimistic picks so other animals stop targeting immediately. */
let wildlifeOptimisticPickedFlowerTileKeys = new Set<string>();

function resolvingFlowerTileCenter(
  tileX: number,
  tileY: number
): DefiningWorldPlazaWorldPoint {
  return {
    x: tileX + 0.5,
    y: tileY + 0.5,
    layer: 1,
  };
}

/** Registers the active flower-consume bridge for wildlife foraging. */
export function registeringWildlifeGroundFlowerBridge(
  bridge: ManagingWildlifeGroundFlowerBridge | null
): void {
  managingWildlifeGroundFlowerBridge = bridge;
}

/** Clears optimistic mid-tick flower picks (tests / sim teardown). */
export function clearingWildlifeOptimisticPickedGroundFlowers(): void {
  wildlifeOptimisticPickedFlowerTileKeys = new Set();
}

/** True when wildlife already marked this tile picked this session tick. */
export function checkingWildlifeGroundFlowerOptimisticIsPicked(
  tileX: number,
  tileY: number
): boolean {
  return wildlifeOptimisticPickedFlowerTileKeys.has(
    formattingWorldPlazaPickedFlowerTileKey(tileX, tileY)
  );
}

/**
 * Marks a flower tile picked optimistically so render + AI see it immediately.
 */
export function markingWildlifeGroundFlowerOptimisticPicked(
  tileX: number,
  tileY: number
): void {
  wildlifeOptimisticPickedFlowerTileKeys = new Set(
    wildlifeOptimisticPickedFlowerTileKeys
  ).add(formattingWorldPlazaPickedFlowerTileKey(tileX, tileY));
}

/** Clears one optimistic flower pick (failed / rejected player or wildlife pick). */
export function clearingWildlifeGroundFlowerOptimisticPicked(
  tileX: number,
  tileY: number
): void {
  const tileKey = formattingWorldPlazaPickedFlowerTileKey(tileX, tileY);

  if (!wildlifeOptimisticPickedFlowerTileKeys.has(tileKey)) {
    return;
  }

  const next = new Set(wildlifeOptimisticPickedFlowerTileKeys);
  next.delete(tileKey);
  wildlifeOptimisticPickedFlowerTileKeys = next;
}

/**
 * Consumes one biome flower tile when wildlife is in melee range.
 * Returns false when out of range, already picked, or no bridge is registered.
 */
export function consumingWildlifeGroundFlowerBridge(
  groundItemId: string,
  consumerPosition: DefiningWorldPlazaWorldPoint
): boolean {
  const tile = parsingWildlifeGroundFlowerItemId(groundItemId);

  if (!tile) {
    return false;
  }

  if (checkingWildlifeGroundFlowerOptimisticIsPicked(tile.tileX, tile.tileY)) {
    return false;
  }

  const targetPoint = resolvingFlowerTileCenter(tile.tileX, tile.tileY);
  const distance = Math.hypot(
    consumerPosition.x - targetPoint.x,
    consumerPosition.y - targetPoint.y
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return false;
  }

  // Optimistic first so same-tick neighbors cannot also claim this flower.
  markingWildlifeGroundFlowerOptimisticPicked(tile.tileX, tile.tileY);

  const consumed =
    managingWildlifeGroundFlowerBridge?.consumeGroundFlower(
      tile.tileX,
      tile.tileY,
      consumerPosition
    ) ?? false;

  if (!consumed) {
    clearingWildlifeGroundFlowerOptimisticPicked(tile.tileX, tile.tileY);
  }

  return consumed;
}
