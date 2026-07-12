/**
 * Detects when a straight click-walk line is blocked.
 *
 * @module components/world/navigation/domains/checkingWorldPlazaNavigationDirectPathBlocked
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { clampingWorldCollisionWalkTargetToWalkableGridPoint } from '@/components/world/collision';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_NAVIGATION_DIRECT_PATH_BLOCKED_EPSILON_GRID } from '@/components/world/navigation/domains/definingWorldPlazaNavigationConstants';

export type CheckingWorldPlazaNavigationDirectPathBlockedParams = {
  readonly from: DefiningWorldPlazaWorldPoint;
  readonly to: DefiningWorldPlazaWorldPoint;
  readonly placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  readonly isJumping?: boolean;
  readonly playerHeightWorldLayers?: number;
};

/**
 * Returns true when collision clamping stops short of the requested destination.
 */
export function checkingWorldPlazaNavigationDirectPathBlocked({
  from,
  to,
  placedBlocks = [],
  isJumping = false,
  playerHeightWorldLayers,
}: CheckingWorldPlazaNavigationDirectPathBlockedParams): boolean {
  const clampedTarget = clampingWorldCollisionWalkTargetToWalkableGridPoint(
    from,
    to,
    isJumping,
    [...placedBlocks],
    playerHeightWorldLayers
  );

  return (
    Math.hypot(to.x - clampedTarget.x, to.y - clampedTarget.y) >
    DEFINING_WORLD_PLAZA_NAVIGATION_DIRECT_PATH_BLOCKED_EPSILON_GRID
  );
}
