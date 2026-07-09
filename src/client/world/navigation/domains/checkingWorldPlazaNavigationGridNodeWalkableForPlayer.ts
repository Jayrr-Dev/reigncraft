/**
 * Player walkability checks for navigation grid nodes.
 *
 * @module components/world/navigation/domains/checkingWorldPlazaNavigationGridNodeWalkableForPlayer
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { checkingWorldCollisionBlockedAtPoint } from '@/components/world/collision';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { resolvingWorldPlazaNavigationWorldPointFromGridNode } from '@/components/world/navigation/domains/resolvingWorldPlazaNavigationWorldPointFromGridNode';
import type { DefiningNavigationGridNode } from '@/lib/navigation/definingNavigationGridTypes';

export type CheckingWorldPlazaNavigationGridNodeWalkableForPlayerParams = {
  readonly node: DefiningNavigationGridNode;
  readonly playerLayer: number;
  readonly placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  readonly playerRadiusGrid?: number;
};

/**
 * Returns true when the player can stand on a navigation node at the given layer.
 */
export function checkingWorldPlazaNavigationGridNodeWalkableForPlayer({
  node,
  playerLayer,
  placedBlocks = [],
  placedBlocksByTile,
  playerRadiusGrid = DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
}: CheckingWorldPlazaNavigationGridNodeWalkableForPlayerParams): boolean {
  if (checkingWorldPlazaLavaAtTileIndex(node.x, node.y)) {
    return false;
  }

  if (resolvingWorldPlazaWaterAtTileIndex(node.x, node.y)) {
    return false;
  }

  const worldPoint = resolvingWorldPlazaNavigationWorldPointFromGridNode({
    x: node.x,
    y: node.y,
    layer: playerLayer,
  });

  return !checkingWorldCollisionBlockedAtPoint(worldPoint, {
    applyBlockCollision: true,
    isJumping: false,
    placedBlocks,
    placedBlocksByTile,
    playerLayer,
    playerRadiusGrid,
  });
}
