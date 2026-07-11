/**
 * Resolves click-walk targets with optional A* path planning.
 *
 * @module components/world/navigation/domains/resolvingWorldPlazaNavigationWalkPlan
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaNavigationDirectPathBlocked } from '@/components/world/navigation/domains/checkingWorldPlazaNavigationDirectPathBlocked';
import { resolvingWorldPlazaNavigationPath } from '@/components/world/navigation/domains/resolvingWorldPlazaNavigationPath';

export type ResolvingWorldPlazaNavigationWalkPlanParams = {
  readonly start: DefiningWorldPlazaWorldPoint;
  readonly destination: DefiningWorldPlazaWorldPoint;
  readonly placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  readonly isJumping?: boolean;
  readonly playerRadiusGrid?: number;
  readonly maxNodeExpansions?: number;
};

export type ResolvingWorldPlazaNavigationWalkPlanResult = {
  readonly destination: DefiningWorldPlazaWorldPoint;
  readonly path: readonly DefiningWorldPlazaWorldPoint[];
  readonly usedPathfinding: boolean;
  readonly nodesExpanded: number;
};

/**
 * Returns a direct destination or a planned waypoint path when blocked.
 */
export function resolvingWorldPlazaNavigationWalkPlan({
  start,
  destination,
  placedBlocks = [],
  placedBlocksByTile,
  isJumping = false,
  playerRadiusGrid,
  maxNodeExpansions,
}: ResolvingWorldPlazaNavigationWalkPlanParams): ResolvingWorldPlazaNavigationWalkPlanResult {
  const directPathBlocked = checkingWorldPlazaNavigationDirectPathBlocked({
    from: start,
    to: destination,
    placedBlocks,
    isJumping,
  });

  if (!directPathBlocked) {
    return {
      destination,
      path: [start, destination],
      usedPathfinding: false,
      nodesExpanded: 0,
    };
  }

  const plannedPath = resolvingWorldPlazaNavigationPath({
    start,
    goal: destination,
    placedBlocks,
    placedBlocksByTile,
    playerRadiusGrid,
    maxNodeExpansions,
  });

  if (plannedPath.status !== 'found' && plannedPath.status !== 'same_node') {
    return {
      destination,
      path: [start, destination],
      usedPathfinding: false,
      nodesExpanded: plannedPath.nodesExpanded,
    };
  }

  return {
    destination,
    path: plannedPath.path,
    usedPathfinding: true,
    nodesExpanded: plannedPath.nodesExpanded,
  };
}
