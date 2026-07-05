import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import {
  resolvingWorldDepthAvatarBodySortKey,
  resolvingWorldDepthAvatarShadowSortKey,
} from '@/components/world/depth';
import { DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS } from '@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Entity-layer depth sort key for avatar ground shadows and body.
 *
 * @module components/world/domains/resolvingWorldPlazaAvatarGroundShadowEntityZIndex
 */

export { DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS };

/**
 * Returns the z-index for an avatar shadow on the entity layer.
 */
export function resolvingWorldPlazaAvatarGroundShadowEntityZIndex(
  gridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = []
): number {
  return resolvingWorldDepthAvatarShadowSortKey(gridPoint, { placedBlocks });
}

/**
 * Returns the avatar body entity-layer z-index for the same grid foot.
 */
export function resolvingWorldPlazaAvatarBodyEntityZIndex(
  gridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  return resolvingWorldDepthAvatarBodySortKey(gridPoint, {
    placedBlocks,
    placedBlocksByTile,
  });
}
