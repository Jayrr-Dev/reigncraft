import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';

/**
 * Floor-layer depth sort key for player torch graphics.
 *
 * @module components/world/domains/resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex
 */

/**
 * Returns the z-index for a torch sprite inside the floor layer.
 *
 * Sorts with floor chunks at the foot tile so raised caps on the same tile
 * still paint above the pool via the entity layer.
 *
 * @param gridPoint - Player grid position.
 * @param depthBias - Pass bias for darkness vs warm glow ordering.
 */
export function resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex(
  gridPoint: DefiningWorldPlazaWorldPoint,
  depthBias: number
): number {
  return computingWorldDepthSortKey(gridPoint) + depthBias;
}
