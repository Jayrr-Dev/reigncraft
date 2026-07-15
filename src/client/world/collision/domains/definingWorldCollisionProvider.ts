import type { DefiningWorldCollisionProviderDebugStroke } from '@/components/world/collision/domains/definingWorldCollisionProviderDebugStroke';
import type { DefiningWorldPlazaTerrainCollisionBlockerKind } from '@/components/world/domains/definingWorldPlazaTerrainCollisionBlockerKind';

/**
 * Declarative collision provider descriptor.
 *
 * @module components/world/collision/domains/definingWorldCollisionProvider
 */

/** Stable provider identifiers matching resolver push-out order. */
export type DefiningWorldCollisionProviderId =
  | 'placedBlockColumn'
  | 'columnRockDiamond'
  | 'treeTrunkCircle'
  | 'firelandsPropCircle'
  | 'frostsinkPropCircle'
  | 'chestPropCircle'
  | 'pebbleRockCircle'
  | 'waterTileSquare'
  | 'terrainElevationColumn';

/** One registered obstacle type in the collision engine. */
export type DefiningWorldCollisionProvider = {
  readonly id: DefiningWorldCollisionProviderId;
  /** Debug overlay blocker kind when this provider wins. */
  readonly blockerKind: DefiningWorldPlazaTerrainCollisionBlockerKind;
  /** Human-readable label for debug UI. */
  readonly label: string;
  /** Debug overlay stroke definition for this provider. */
  readonly debugStroke: DefiningWorldCollisionProviderDebugStroke;
};
