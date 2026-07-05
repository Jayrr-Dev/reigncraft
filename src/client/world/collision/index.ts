/**
 * Public collision-engine API for movement blocking and spatial queries.
 *
 * @module components/world/collision
 */

export {
  checkingWorldCollisionCircleOverlapsAxisAlignedGridSquare,
  checkingWorldCollisionCircleOverlapsCircle,
  computingWorldCollisionClosestPointOnAxisAlignedGridSquare,
  pushingWorldCollisionCircleOutsideAxisAlignedGridSquare,
  pushingWorldCollisionPointOutsideBaseDiamond,
  pushingWorldCollisionPointOutsideCircularCollider,
} from '@/components/world/collision/domains/computingWorldCollisionShapeGeometry';
export { checkingWorldCollisionVerticalColumnBlocksPlayer } from '@/components/world/collision/domains/checkingWorldCollisionVerticalColumnRule';
export type { CheckingWorldCollisionVerticalColumnRuleInput } from '@/components/world/collision/domains/checkingWorldCollisionVerticalColumnRule';
export type { DefiningWorldCollisionContext } from '@/components/world/collision/domains/definingWorldCollisionContext';
export type {
  DefiningWorldCollisionBaseDiamondShape,
  DefiningWorldCollisionCircleShape,
  DefiningWorldCollisionCutSubSquaresShape,
  DefiningWorldCollisionPlayerFootprint,
  DefiningWorldCollisionShape,
  DefiningWorldCollisionTileSquareShape,
} from '@/components/world/collision/domains/definingWorldCollisionShape';
export type {
  DefiningWorldCollisionProvider,
  DefiningWorldCollisionProviderId,
} from '@/components/world/collision/domains/definingWorldCollisionProvider';
export {
  DEFINING_WORLD_COLLISION_PROVIDERS,
  DEFINING_WORLD_COLLISION_PUSH_OUT_PROVIDER_ORDER,
  DEFINING_WORLD_COLLISION_TILE_GRID_BLOCK_PROVIDER_ORDER,
  findingWorldCollisionProviderById,
} from '@/components/world/collision/domains/definingWorldCollisionProviderRegistry';
export {
  clampingWorldCollisionPointBeforeGridPointPredicate,
  clampingWorldCollisionWalkTargetToWalkableGridPoint,
  resolvingWorldCollisionBlockedWorldPoint,
  resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint,
} from '@/components/world/collision/domains/resolvingWorldCollisionBlockedPoint';
export type { DefiningWorldCollisionOptions } from '@/components/world/collision/domains/resolvingWorldCollisionBlockedPoint';
export { findingWorldCollisionBlockerAtPoint } from '@/components/world/collision/domains/findingWorldCollisionBlockerAtPoint';
export {
  checkingWorldCollisionBlockedAtPoint,
  creatingWorldCollisionCircleQueryShape,
  listingWorldCollisionTileIndicesOverlappingShape,
} from '@/components/world/collision/domains/queryingWorldCollisionSpatialOverlaps';
