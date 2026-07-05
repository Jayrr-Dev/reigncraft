import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_DEPTH_ENTITY_Z_INDEX_SCALE } from '@/components/world/depth/domains/definingWorldDepthBiasLadder';

/**
 * Core isometric depth sort key from a grid foot position.
 *
 * @module components/world/depth/domains/computingWorldDepthSortKey
 */

/**
 * Projects a grid foot to the entity-layer z-index sort key.
 *
 * @param gridPoint - Logical grid position (floats allowed).
 */
export function computingWorldDepthSortKey(
  gridPoint: DefiningWorldPlazaWorldPoint
): number {
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint);

  return Math.round(screenPoint.y * DEFINING_WORLD_DEPTH_ENTITY_Z_INDEX_SCALE);
}
