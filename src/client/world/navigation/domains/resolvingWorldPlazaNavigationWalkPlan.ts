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
};

export type ResolvingWorldPlazaNavigationWalkPlanResult = {
  readonly destination: DefiningWorldPlazaWorldPoint;
  readonly path: readonly DefiningWorldPlazaWorldPoint[];
  readonly usedPathfinding: boolean;
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
    };
  }

  const plannedPath = resolvingWorldPlazaNavigationPath({
    start,
    goal: destination,
    placedBlocks,
    placedBlocksByTile,
    playerRadiusGrid,
  });

  if (plannedPath.status !== 'found' && plannedPath.status !== 'same_node') {
    return {
      destination,
      path: [start, destination],
      usedPathfinding: false,
    };
  }

  return {
    destination,
    path: plannedPath.path,
    usedPathfinding: true,
  };
}
