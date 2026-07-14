/**
 * Module bridge between picked-shrub persistence and the wildlife sim tick.
 *
 * Marks berry shrubs picked (same persistence as player picks) without
 * granting inventory. Optimistic mid-tick picks stop other animals targeting.
 *
 * @module components/world/wildlife/domains/managingWildlifeGroundShrubBridge
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { formattingWorldPlazaPickedShrubTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { parsingWildlifeGroundShrubItemId } from '@/components/world/wildlife/domains/definingWildlifeGroundShrubIdConstants';

export type ManagingWildlifeGroundShrubBridge = {
  consumeGroundShrub: (
    tileX: number,
    tileY: number,
    consumerPosition: DefiningWorldPlazaWorldPoint
  ) => boolean;
};

let managingWildlifeGroundShrubBridge: ManagingWildlifeGroundShrubBridge | null =
  null;

/** Mid-tick optimistic picks so other animals stop targeting immediately. */
let wildlifeOptimisticPickedShrubTileKeys = new Set<string>();

function resolvingShrubTileCenter(
  tileX: number,
  tileY: number
): DefiningWorldPlazaWorldPoint {
  return {
    x: tileX + 0.5,
    y: tileY + 0.5,
    layer: 1,
  };
}

/** Registers the active shrub-consume bridge for wildlife foraging. */
export function registeringWildlifeGroundShrubBridge(
  bridge: ManagingWildlifeGroundShrubBridge | null
): void {
  managingWildlifeGroundShrubBridge = bridge;
}

/** Clears optimistic mid-tick shrub picks (tests / sim teardown). */
export function clearingWildlifeOptimisticPickedGroundShrubs(): void {
  wildlifeOptimisticPickedShrubTileKeys = new Set();
}

/** True when wildlife already marked this tile picked this session tick. */
export function checkingWildlifeGroundShrubOptimisticIsPicked(
  tileX: number,
  tileY: number
): boolean {
  return wildlifeOptimisticPickedShrubTileKeys.has(
    formattingWorldPlazaPickedShrubTileKey(tileX, tileY)
  );
}

/**
 * Marks a shrub tile picked optimistically so render + AI see it immediately.
 */
export function markingWildlifeGroundShrubOptimisticPicked(
  tileX: number,
  tileY: number
): void {
  wildlifeOptimisticPickedShrubTileKeys = new Set(
    wildlifeOptimisticPickedShrubTileKeys
  ).add(formattingWorldPlazaPickedShrubTileKey(tileX, tileY));
}

/**
 * Marks a berry shrub tile picked when wildlife is in melee range.
 * Returns false when out of range, already picked, or no bridge is registered.
 */
export function consumingWildlifeGroundShrubBridge(
  groundItemId: string,
  consumerPosition: DefiningWorldPlazaWorldPoint
): boolean {
  const tile = parsingWildlifeGroundShrubItemId(groundItemId);

  if (!tile) {
    return false;
  }

  if (checkingWildlifeGroundShrubOptimisticIsPicked(tile.tileX, tile.tileY)) {
    return false;
  }

  const targetPoint = resolvingShrubTileCenter(tile.tileX, tile.tileY);
  const distance = Math.hypot(
    consumerPosition.x - targetPoint.x,
    consumerPosition.y - targetPoint.y
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return false;
  }

  markingWildlifeGroundShrubOptimisticPicked(tile.tileX, tile.tileY);

  const consumed =
    managingWildlifeGroundShrubBridge?.consumeGroundShrub(
      tile.tileX,
      tile.tileY,
      consumerPosition
    ) ?? false;

  if (!consumed) {
    const next = new Set(wildlifeOptimisticPickedShrubTileKeys);
    next.delete(formattingWorldPlazaPickedShrubTileKey(tile.tileX, tile.tileY));
    wildlifeOptimisticPickedShrubTileKeys = next;
  }

  return consumed;
}
