/**
 * Module bridge between cleared long-grass persistence and the wildlife sim tick.
 *
 * @module components/world/wildlife/domains/managingWildlifeGroundGrassBridge
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { formattingWorldPlazaClearedLongGrassTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { parsingWildlifeGroundGrassItemId } from '@/components/world/wildlife/domains/definingWildlifeGroundGrassIdConstants';

export type ManagingWildlifeGroundGrassBridge = {
  consumeGroundGrass: (
    tileX: number,
    tileY: number,
    consumerPosition: DefiningWorldPlazaWorldPoint
  ) => boolean;
};

let managingWildlifeGroundGrassBridge: ManagingWildlifeGroundGrassBridge | null =
  null;

let wildlifeOptimisticClearedLongGrassTileKeys = new Set<string>();

function resolvingGrassTileCenter(
  tileX: number,
  tileY: number
): DefiningWorldPlazaWorldPoint {
  return {
    x: tileX + 0.5,
    y: tileY + 0.5,
    layer: 1,
  };
}

export function registeringWildlifeGroundGrassBridge(
  bridge: ManagingWildlifeGroundGrassBridge | null
): void {
  managingWildlifeGroundGrassBridge = bridge;
}

export function clearingWildlifeOptimisticClearedGroundGrass(): void {
  wildlifeOptimisticClearedLongGrassTileKeys = new Set();
}

export function checkingWildlifeGroundGrassOptimisticIsCleared(
  tileX: number,
  tileY: number
): boolean {
  return wildlifeOptimisticClearedLongGrassTileKeys.has(
    formattingWorldPlazaClearedLongGrassTileKey(tileX, tileY)
  );
}

export function markingWildlifeGroundGrassOptimisticCleared(
  tileX: number,
  tileY: number
): void {
  wildlifeOptimisticClearedLongGrassTileKeys = new Set(
    wildlifeOptimisticClearedLongGrassTileKeys
  ).add(formattingWorldPlazaClearedLongGrassTileKey(tileX, tileY));
}

export function consumingWildlifeGroundGrassBridge(
  groundItemId: string,
  consumerPosition: DefiningWorldPlazaWorldPoint
): boolean {
  const tile = parsingWildlifeGroundGrassItemId(groundItemId);

  if (!tile) {
    return false;
  }

  if (checkingWildlifeGroundGrassOptimisticIsCleared(tile.tileX, tile.tileY)) {
    return false;
  }

  const targetPoint = resolvingGrassTileCenter(tile.tileX, tile.tileY);
  const distance = Math.hypot(
    consumerPosition.x - targetPoint.x,
    consumerPosition.y - targetPoint.y
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return false;
  }

  markingWildlifeGroundGrassOptimisticCleared(tile.tileX, tile.tileY);

  const consumed =
    managingWildlifeGroundGrassBridge?.consumeGroundGrass(
      tile.tileX,
      tile.tileY,
      consumerPosition
    ) ?? false;

  if (!consumed) {
    const next = new Set(wildlifeOptimisticClearedLongGrassTileKeys);
    next.delete(
      formattingWorldPlazaClearedLongGrassTileKey(tile.tileX, tile.tileY)
    );
    wildlifeOptimisticClearedLongGrassTileKeys = next;
  }

  return consumed;
}
