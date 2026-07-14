/**
 * Public collision-engine API for movement blocking and spatial queries.
 *
 * @module components/world/collision
 */

export { checkingWorldCollisionVerticalColumnBlocksPlayer } from '@/components/world/collision/domains/checkingWorldCollisionVerticalColumnRule';
export type { CheckingWorldCollisionVerticalColumnRuleInput } from '@/components/world/collision/domains/checkingWorldCollisionVerticalColumnRule';
export {
  checkingWorldCollisionCircleOverlapsAxisAlignedGridSquare,
  checkingWorldCollisionCircleOverlapsCircle,
  computingWorldCollisionClosestPointOnAxisAlignedGridSquare,
  pushingWorldCollisionCircleOutsideAxisAlignedGridSquare,
  pushingWorldCollisionPointOutsideBaseDiamond,
  pushingWorldCollisionPointOutsideCircularCollider,
} from '@/components/world/collision/domains/computingWorldCollisionShapeGeometry';
export type { DefiningWorldCollisionContext } from '@/components/world/collision/domains/definingWorldCollisionContext';
export type {
  DefiningWorldCollisionProvider,
  DefiningWorldCollisionProviderId,
} from '@/components/world/collision/domains/definingWorldCollisionProvider';
export type {
  DefiningWorldCollisionProviderDebugStroke,
  DefiningWorldCollisionProviderDebugStrokeKind,
} from '@/components/world/collision/domains/definingWorldCollisionProviderDebugStroke';
export {
  DEFINING_WORLD_COLLISION_DEBUG_STATIC_PROVIDER_ORDER,
  DEFINING_WORLD_COLLISION_PROVIDERS,
  DEFINING_WORLD_COLLISION_PUSH_OUT_PROVIDER_ORDER,
  DEFINING_WORLD_COLLISION_TILE_GRID_BLOCK_PROVIDER_ORDER,
  findingWorldCollisionProviderById,
  listingWorldCollisionProvidersForDebugStaticOverlay,
} from '@/components/world/collision/domains/definingWorldCollisionProviderRegistry';
export type {
  DefiningWorldCollisionBaseDiamondShape,
  DefiningWorldCollisionCircleShape,
  DefiningWorldCollisionCutSubSquaresShape,
  DefiningWorldCollisionPlayerFootprint,
  DefiningWorldCollisionShape,
  DefiningWorldCollisionTileSquareShape,
} from '@/components/world/collision/domains/definingWorldCollisionShape';
export { drawingWorldCollisionPlacedBlockProviderDebugOnGraphics } from '@/components/world/collision/domains/drawingWorldCollisionPlacedBlockProviderDebugOnGraphics';
export {
  drawingWorldCollisionProviderDebugStaticTileRowsOnGraphics,
  drawingWorldCollisionProviderDebugStaticTilesOnGraphics,
} from '@/components/world/collision/domains/drawingWorldCollisionProviderDebugOnGraphics';
export { findingWorldCollisionBlockerAtPoint } from '@/components/world/collision/domains/findingWorldCollisionBlockerAtPoint';
export {
  checkingWorldCollisionBlockedAtPoint,
  creatingWorldCollisionCircleQueryShape,
  listingWorldCollisionTileIndicesOverlappingShape,
} from '@/components/world/collision/domains/queryingWorldCollisionSpatialOverlaps';
export {
  clampingWorldCollisionPointBeforeGridPointPredicate,
  clampingWorldCollisionWalkTargetToWalkableGridPoint,
  resolvingWorldCollisionBlockedWorldPoint,
  resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint,
  resolvingWorldCollisionSlidingPlayerFromBlockedWorldPoint,
} from '@/components/world/collision/domains/resolvingWorldCollisionBlockedPoint';
export type { DefiningWorldCollisionOptions } from '@/components/world/collision/domains/resolvingWorldCollisionBlockedPoint';
