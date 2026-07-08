/**
 * Replan triggers for active player navigation paths.
 *
 * @module components/world/navigation/domains/checkingWorldPlazaNavigationPathNeedsReplan
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { snappingWorldBuildingTilePositionFromGridPoint } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_BLOCK_CHANGE_RADIUS_TILES } from '@/components/world/navigation/domains/definingWorldPlazaNavigationConstants';

export type CheckingWorldPlazaNavigationPathNeedsReplanParams = {
  readonly remainingWaypoints: readonly DefiningWorldPlazaWorldPoint[];
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly previousPlacedBlockIds: ReadonlySet<string>;
  readonly stuckFrameCount: number;
  readonly stuckFrameThreshold: number;
};

function listingWorldPlazaNavigationPathTileKeys(
  waypoints: readonly DefiningWorldPlazaWorldPoint[]
): Set<string> {
  const tileKeys = new Set<string>();

  for (const waypoint of waypoints) {
    const tilePosition = snappingWorldBuildingTilePositionFromGridPoint(waypoint);

    for (
      let offsetY = -DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_BLOCK_CHANGE_RADIUS_TILES;
      offsetY <= DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_BLOCK_CHANGE_RADIUS_TILES;
      offsetY += 1
    ) {
      for (
        let offsetX = -DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_BLOCK_CHANGE_RADIUS_TILES;
        offsetX <= DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_BLOCK_CHANGE_RADIUS_TILES;
        offsetX += 1
      ) {
        tileKeys.add(`${tilePosition.tileX + offsetX}:${tilePosition.tileY + offsetY}`);
      }
    }
  }

  return tileKeys;
}

/**
 * Returns true when the active path should be recomputed.
 */
export function checkingWorldPlazaNavigationPathNeedsReplan({
  remainingWaypoints,
  placedBlocks,
  previousPlacedBlockIds,
  stuckFrameCount,
  stuckFrameThreshold,
}: CheckingWorldPlazaNavigationPathNeedsReplanParams): boolean {
  if (remainingWaypoints.length === 0) {
    return false;
  }

  if (stuckFrameCount >= stuckFrameThreshold) {
    return true;
  }

  const pathTileKeys = listingWorldPlazaNavigationPathTileKeys(remainingWaypoints);

  for (const placedBlock of placedBlocks) {
    const blockTileKey = `${placedBlock.tilePosition.tileX}:${placedBlock.tilePosition.tileY}`;

    if (!pathTileKeys.has(blockTileKey)) {
      continue;
    }

    if (!previousPlacedBlockIds.has(placedBlock.blockId)) {
      return true;
    }
  }

  return false;
}
