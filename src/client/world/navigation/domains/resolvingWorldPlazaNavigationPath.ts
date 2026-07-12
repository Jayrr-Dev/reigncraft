/**
 * End-to-end plaza navigation path resolver.
 *
 * @module components/world/navigation/domains/resolvingWorldPlazaNavigationPath
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWorldPlazaNavigationPathSmoother } from '@/components/world/navigation/domains/computingWorldPlazaNavigationPathSmoother';
import type { DefiningWorldPlazaNavigationCostProfileId } from '@/components/world/navigation/domains/definingWorldPlazaNavigationCostProfiles';
import { DEFINING_WORLD_PLAZA_NAVIGATION_COST_PROFILE_REGISTRY } from '@/components/world/navigation/domains/definingWorldPlazaNavigationCostProfiles';
import { resolvingWorldPlazaNavigationGridNodeFromWorldPoint } from '@/components/world/navigation/domains/resolvingWorldPlazaNavigationGridNodeFromWorldPoint';
import { resolvingWorldPlazaNavigationPlayerMoveCost } from '@/components/world/navigation/domains/resolvingWorldPlazaNavigationPlayerMoveCost';
import { resolvingWorldPlazaNavigationSearchBoundsFromEndpoints } from '@/components/world/navigation/domains/resolvingWorldPlazaNavigationSearchBounds';
import { resolvingWorldPlazaNavigationWorldPointFromGridNode } from '@/components/world/navigation/domains/resolvingWorldPlazaNavigationWorldPointFromGridNode';
import { computingNavigationAStarPath } from '@/lib/navigation/computingNavigationAStarPath';
import type { DefiningNavigationAStarStatus } from '@/lib/navigation/definingNavigationGridTypes';

export type ResolvingWorldPlazaNavigationPathParams = {
  readonly start: DefiningWorldPlazaWorldPoint;
  readonly goal: DefiningWorldPlazaWorldPoint;
  readonly costProfileId?: DefiningWorldPlazaNavigationCostProfileId;
  readonly placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  readonly playerRadiusGrid?: number;
  readonly playerHeightWorldLayers?: number;
  readonly maxNodeExpansions?: number;
};

export type ResolvingWorldPlazaNavigationPathResult = {
  readonly status: DefiningNavigationAStarStatus;
  readonly path: readonly DefiningWorldPlazaWorldPoint[];
  readonly totalCost: number;
  readonly nodesExpanded: number;
};

/**
 * Plans a player path from start to goal using A* and line-of-sight smoothing.
 */
export function resolvingWorldPlazaNavigationPath({
  start,
  goal,
  costProfileId = 'player.default',
  placedBlocks = [],
  placedBlocksByTile,
  playerRadiusGrid,
  playerHeightWorldLayers,
  maxNodeExpansions,
}: ResolvingWorldPlazaNavigationPathParams): ResolvingWorldPlazaNavigationPathResult {
  const profile =
    DEFINING_WORLD_PLAZA_NAVIGATION_COST_PROFILE_REGISTRY[costProfileId];
  const playerLayer = resolvingWorldPlazaPlayerWorldLayer(start);
  const startNode = resolvingWorldPlazaNavigationGridNodeFromWorldPoint({
    ...start,
    layer: playerLayer,
  });
  const goalNode = resolvingWorldPlazaNavigationGridNodeFromWorldPoint({
    ...goal,
    layer: playerLayer,
  });
  const searchBounds = resolvingWorldPlazaNavigationSearchBoundsFromEndpoints(
    startNode,
    goalNode
  );
  const resolveMoveCost = resolvingWorldPlazaNavigationPlayerMoveCost({
    playerLayer,
    searchBounds,
    placedBlocks,
    placedBlocksByTile,
    playerRadiusGrid,
    playerHeightWorldLayers,
  });
  const searchResult = computingNavigationAStarPath({
    start: startNode,
    goal: goalNode,
    resolveMoveCost,
    movementModeId: profile.movementModeId,
    heuristicId: profile.heuristicId,
    preventCornerCutting: profile.preventCornerCutting,
    maxNodeExpansions,
  });

  if (searchResult.status !== 'found' && searchResult.status !== 'same_node') {
    return {
      status: searchResult.status,
      path: [],
      totalCost: searchResult.totalCost,
      nodesExpanded: searchResult.nodesExpanded,
    };
  }

  const smoothedNodes = computingWorldPlazaNavigationPathSmoother({
    path: searchResult.path,
    resolveMoveCost,
  });

  return {
    status: searchResult.status,
    path: smoothedNodes.map((node) =>
      resolvingWorldPlazaNavigationWorldPointFromGridNode({
        ...node,
        layer: playerLayer,
      })
    ),
    totalCost: searchResult.totalCost,
    nodesExpanded: searchResult.nodesExpanded,
  };
}
