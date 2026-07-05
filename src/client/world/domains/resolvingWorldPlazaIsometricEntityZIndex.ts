import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Depth sort key for isometric entities within the entity layer.
 *
 * @module components/world/domains/resolvingWorldPlazaIsometricEntityZIndex
 */

/**
 * Returns a z-index for a grid foot position.
 *
 * @param gridPoint - Logical grid position.
 */
export function resolvingWorldPlazaIsometricEntityZIndex(
  gridPoint: DefiningWorldPlazaWorldPoint
): number {
  return computingWorldDepthSortKey(gridPoint);
}
