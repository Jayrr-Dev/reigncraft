import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import {
  resolvingWorldDepthAvatarBodyHardFloorSortKeyFromFootReachingColumns,
  resolvingWorldDepthAvatarBodyMinStandingSortKeyCapFromFrontOccluders,
} from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Lowest allowed avatar body z-index when tucked behind nearby foreground columns.
 *
 * @module components/world/domains/resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontOccluders
 */

/**
 * Returns the strictest body z-index cap imposed by nearby foreground columns.
 */
export function resolvingWorldPlazaAvatarBodyMinStandingZIndexCapFromFrontOccluders(
  gridPoint: DefiningWorldPlazaWorldPoint,
  centerTileX: number,
  centerTileY: number,
  standingLayer: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  return resolvingWorldDepthAvatarBodyMinStandingSortKeyCapFromFrontOccluders(
    gridPoint,
    centerTileX,
    centerTileY,
    standingLayer,
    { placedBlocks, placedBlocksByTile }
  );
}

/**
 * Returns the highest sort key among foot-reaching floor columns.
 */
export function resolvingWorldPlazaAvatarBodyHardFloorEntityZIndexFromFootReachingColumns(
  gridPoint: DefiningWorldPlazaWorldPoint,
  centerTileX: number,
  centerTileY: number,
  standingLayer: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  return resolvingWorldDepthAvatarBodyHardFloorSortKeyFromFootReachingColumns(
    gridPoint,
    centerTileX,
    centerTileY,
    standingLayer,
    { placedBlocks, placedBlocksByTile }
  );
}
