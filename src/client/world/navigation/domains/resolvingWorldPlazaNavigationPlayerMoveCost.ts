/**
 * Player move-cost resolver for grid A*.
 *
 * @module components/world/navigation/domains/resolvingWorldPlazaNavigationPlayerMoveCost
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { checkingWorldPlazaNavigationGridNodeWalkableForPlayer } from '@/components/world/navigation/domains/checkingWorldPlazaNavigationGridNodeWalkableForPlayer';
import {
  checkingWorldPlazaNavigationGridNodeInsideSearchBounds,
  type DefiningWorldPlazaNavigationSearchBounds,
} from '@/components/world/navigation/domains/resolvingWorldPlazaNavigationSearchBounds';
import {
  DEFINING_NAVIGATION_CARDINAL_MOVE_COST,
  DEFINING_NAVIGATION_DIAGONAL_MOVE_COST,
} from '@/lib/navigation/definingNavigationAStarConstants';
import type {
  DefiningNavigationGridNode,
  DefiningNavigationMoveCostResolver,
} from '@/lib/navigation/definingNavigationGridTypes';

export type ResolvingWorldPlazaNavigationPlayerMoveCostParams = {
  readonly playerLayer: number;
  readonly searchBounds: DefiningWorldPlazaNavigationSearchBounds;
  readonly placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  readonly playerRadiusGrid?: number;
  readonly playerHeightWorldLayers?: number;
};

function resolvingWorldPlazaNavigationPlayerEdgeMoveCost(
  from: DefiningNavigationGridNode,
  to: DefiningNavigationGridNode
): number | null {
  const deltaX = Math.abs(to.x - from.x);
  const deltaY = Math.abs(to.y - from.y);

  if (deltaX > 1 || deltaY > 1 || deltaX + deltaY === 0) {
    return null;
  }

  return deltaX !== 0 && deltaY !== 0
    ? DEFINING_NAVIGATION_DIAGONAL_MOVE_COST
    : DEFINING_NAVIGATION_CARDINAL_MOVE_COST;
}

/**
 * Builds a move-cost resolver for player navigation on a fixed layer grid.
 */
export function resolvingWorldPlazaNavigationPlayerMoveCost({
  playerLayer,
  searchBounds,
  placedBlocks = [],
  placedBlocksByTile,
  playerRadiusGrid,
  playerHeightWorldLayers,
}: ResolvingWorldPlazaNavigationPlayerMoveCostParams): DefiningNavigationMoveCostResolver {
  return (from, to) => {
    if ((from.layer ?? playerLayer) !== (to.layer ?? playerLayer)) {
      return null;
    }

    if (!checkingWorldPlazaNavigationGridNodeInsideSearchBounds(to, searchBounds)) {
      return null;
    }

    const edgeCost = resolvingWorldPlazaNavigationPlayerEdgeMoveCost(from, to);

    if (edgeCost === null) {
      return null;
    }

    const isWalkable = checkingWorldPlazaNavigationGridNodeWalkableForPlayer({
      node: to,
      playerLayer,
      placedBlocks,
      placedBlocksByTile,
      playerRadiusGrid,
      playerHeightWorldLayers,
    });

    return isWalkable ? edgeCost : null;
  };
}
