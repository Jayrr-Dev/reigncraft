/**
 * Applies resolved navigation paths to click-walk refs.
 *
 * @module components/world/navigation/domains/applyingWorldPlazaNavigationWalkTargets
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { RefObject } from 'react';

export type ApplyingWorldPlazaNavigationWalkTargetsParams = {
  readonly walkTargetRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly walkWaypointsRef: RefObject<DefiningWorldPlazaWorldPoint[]>;
  readonly destination: DefiningWorldPlazaWorldPoint;
  readonly path: readonly DefiningWorldPlazaWorldPoint[];
};

/**
 * Writes direct or waypoint-backed walk targets without React re-renders.
 */
export function applyingWorldPlazaNavigationWalkTargets({
  walkTargetRef,
  walkWaypointsRef,
  destination,
  path,
}: ApplyingWorldPlazaNavigationWalkTargetsParams): void {
  if (path.length <= 1) {
    walkWaypointsRef.current = [];
    walkTargetRef.current = destination;
    return;
  }

  walkWaypointsRef.current = path.slice(1);
  walkTargetRef.current = walkWaypointsRef.current[0] ?? destination;
}

/**
 * Clears queued navigation waypoints.
 */
export function clearingWorldPlazaNavigationWalkWaypoints(
  walkWaypointsRef: RefObject<DefiningWorldPlazaWorldPoint[]>
): void {
  walkWaypointsRef.current = [];
}

/**
 * Advances to the next queued waypoint after arrival, or clears when done.
 */
export function advancingWorldPlazaNavigationWalkWaypoint({
  walkTargetRef,
  walkWaypointsRef,
}: {
  readonly walkTargetRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly walkWaypointsRef: RefObject<DefiningWorldPlazaWorldPoint[]>;
}): boolean {
  const remainingWaypoints = walkWaypointsRef.current;

  if (remainingWaypoints.length <= 1) {
    walkWaypointsRef.current = [];
    walkTargetRef.current = null;
    return true;
  }

  const nextWaypoints = remainingWaypoints.slice(1);
  walkWaypointsRef.current = nextWaypoints;
  walkTargetRef.current = nextWaypoints[0] ?? null;

  return false;
}
