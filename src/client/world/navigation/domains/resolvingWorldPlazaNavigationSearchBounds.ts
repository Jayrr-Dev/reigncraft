/**
 * Search bounds for plaza navigation queries.
 *
 * @module components/world/navigation/domains/resolvingWorldPlazaNavigationSearchBounds
 */

import { DEFINING_WORLD_PLAZA_NAVIGATION_SEARCH_RADIUS_GRID } from '@/components/world/navigation/domains/definingWorldPlazaNavigationConstants';
import type { DefiningNavigationGridNode } from '@/lib/navigation/definingNavigationGridTypes';

export type DefiningWorldPlazaNavigationSearchBounds = {
  readonly minTileX: number;
  readonly maxTileX: number;
  readonly minTileY: number;
  readonly maxTileY: number;
};

/**
 * Builds a square tile search box around start and goal endpoints.
 */
export function resolvingWorldPlazaNavigationSearchBoundsFromEndpoints(
  start: DefiningNavigationGridNode,
  goal: DefiningNavigationGridNode,
  radiusGrid: number = DEFINING_WORLD_PLAZA_NAVIGATION_SEARCH_RADIUS_GRID
): DefiningWorldPlazaNavigationSearchBounds {
  const centerMinX = Math.min(start.x, goal.x);
  const centerMaxX = Math.max(start.x, goal.x);
  const centerMinY = Math.min(start.y, goal.y);
  const centerMaxY = Math.max(start.y, goal.y);

  return {
    minTileX: centerMinX - radiusGrid,
    maxTileX: centerMaxX + radiusGrid,
    minTileY: centerMinY - radiusGrid,
    maxTileY: centerMaxY + radiusGrid,
  };
}

/**
 * Returns true when a navigation node lies inside search bounds.
 */
export function checkingWorldPlazaNavigationGridNodeInsideSearchBounds(
  node: DefiningNavigationGridNode,
  bounds: DefiningWorldPlazaNavigationSearchBounds
): boolean {
  return (
    node.x >= bounds.minTileX &&
    node.x <= bounds.maxTileX &&
    node.y >= bounds.minTileY &&
    node.y <= bounds.maxTileY
  );
}
