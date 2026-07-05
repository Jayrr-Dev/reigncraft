/**
 * Legacy shim — import from `@/components/world/collision` for new code.
 *
 * @module components/world/domains/resolvingWorldPlazaBlockedWorldPoint
 */

export type { DefiningWorldCollisionOptions as ResolvingWorldPlazaBlockedWorldPointOptions } from '@/components/world/collision/domains/resolvingWorldCollisionBlockedPoint';
export {
  clampingWorldCollisionPointBeforeGridPointPredicate as clampingWorldPlazaPointBeforeGridPointPredicate,
  clampingWorldCollisionWalkTargetToWalkableGridPoint as clampingWorldPlazaWalkTargetToWalkableGridPoint,
  resolvingWorldCollisionBlockedWorldPoint as resolvingWorldPlazaBlockedWorldPoint,
  resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint as resolvingWorldPlazaEjectingPlayerFromBlockedWorldPoint,
} from '@/components/world/collision/domains/resolvingWorldCollisionBlockedPoint';
