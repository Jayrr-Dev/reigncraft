import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { DEFINING_WORLD_DEPTH_FIRE_FLAME_ENTITY_ABOVE_COLUMN_DEPTH_BIAS } from '@/components/world/depth/domains/definingWorldDepthBiasLadder';

/**
 * Entity-layer depth sort key for animated fire / campfire flame sprites.
 *
 * @module components/world/fire/domains/resolvingWorldPlazaFireFlameEntityZIndex
 */

/**
 * Returns the z-index for a flame sprite so it paints above the coplanar
 * placed-block column (campfire wood, burning floors) on the entity trunk layer.
 *
 * Anchors to {@link resolvingWorldBuildingPlacedBlockColumnEntityZIndex} instead
 * of raw grid depth: elevated campfires inherit terrain clearance on that key,
 * and a fixed floor-layer bias alone cannot clear those logs.
 *
 * @param tileX - Fire cell tile column.
 * @param tileY - Fire cell tile row.
 * @param worldLayer - Fire cell world layer (matches the burning block / surface).
 */
export function resolvingWorldPlazaFireFlameEntityZIndex(
  tileX: number,
  tileY: number,
  worldLayer: number
): number {
  return (
    resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      tileX,
      tileY,
      worldLayer
    ) + DEFINING_WORLD_DEPTH_FIRE_FLAME_ENTITY_ABOVE_COLUMN_DEPTH_BIAS
  );
}
