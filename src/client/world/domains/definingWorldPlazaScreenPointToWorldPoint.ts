/**
 * World coordinates for the infinite plaza map.
 *
 * @module components/world/domains/definingWorldPlazaScreenPointToWorldPoint
 */

/** World point in unbounded plaza grid coordinates (tile units). */
export interface DefiningWorldPlazaWorldPoint {
  x: number;
  y: number;
  /** One-based vertical layer the player is standing on. Defaults to ground. */
  layer?: number;
}

/** Default ground layer when a world point omits `layer`. */
export const DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER = 1 as const;

/**
 * Resolves the standing layer for a plaza world point.
 *
 * @param worldPoint - Player or target position.
 */
export function resolvingWorldPlazaPlayerWorldLayer(
  worldPoint: DefiningWorldPlazaWorldPoint,
): number {
  return worldPoint.layer ?? DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER;
}
