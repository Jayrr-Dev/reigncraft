/**
 * Legacy shim — import from `@/components/world/collision` for new code.
 *
 * @module components/world/domains/findingWorldPlazaBlockedWorldPointBlockerAtGridPoint
 */

export type { FindingWorldPlazaBlockedWorldPointBlockerAtGridPointOptions } from '@/components/world/collision/domains/findingWorldCollisionBlockerAtPoint';
export {
  findingWorldCollisionBlockerAtPoint as findingWorldPlazaBlockedWorldPointBlockerAtGridPoint,
} from '@/components/world/collision/domains/findingWorldCollisionBlockerAtPoint';
