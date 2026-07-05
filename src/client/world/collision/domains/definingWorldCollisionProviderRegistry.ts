import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND,
} from '@/components/world/domains/definingWorldPlazaTerrainCollisionBlockerKind';
import type { DefiningWorldCollisionProvider } from '@/components/world/collision/domains/definingWorldCollisionProvider';

/**
 * Ordered collision provider registry.
 *
 * Order matches push-out and block-test resolution in
 * {@link resolvingWorldCollisionBlockedPoint}.
 *
 * @module components/world/collision/domains/definingWorldCollisionProviderRegistry
 */

/** Push-out phase: placed blocks first. */
export const DEFINING_WORLD_COLLISION_PUSH_OUT_PROVIDER_ORDER = [
  'placedBlockColumn',
  'columnRockDiamond',
  'treeTrunkCircle',
  'firelandsPropCircle',
  'pebbleRockCircle',
  'waterTileSquare',
] as const;

/** Tile-grid block predicate order (after rock footprint bypass). */
export const DEFINING_WORLD_COLLISION_TILE_GRID_BLOCK_PROVIDER_ORDER = [
  'placedBlockColumn',
  'terrainElevationColumn',
  'waterTileSquare',
] as const;

/** Registered collision providers (metadata for debug + future declarative hooks). */
export const DEFINING_WORLD_COLLISION_PROVIDERS: readonly DefiningWorldCollisionProvider[] =
  [
    {
      id: 'placedBlockColumn',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PLACED_BLOCK,
      label: 'Placed block',
    },
    {
      id: 'columnRockDiamond',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.COLUMN_ROCK_DIAMOND,
      label: 'Column rock diamond',
    },
    {
      id: 'treeTrunkCircle',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TREE_CIRCLE,
      label: 'Tree trunk',
    },
    {
      id: 'firelandsPropCircle',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PEBBLE_ROCK_CIRCLE,
      label: 'Firelands prop',
    },
    {
      id: 'pebbleRockCircle',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PEBBLE_ROCK_CIRCLE,
      label: 'Pebble rock',
    },
    {
      id: 'waterTileSquare',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_TILE_JUMP_OVER,
      label: 'Water tile',
    },
    {
      id: 'terrainElevationColumn',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_ELEVATION,
      label: 'Terrain elevation',
    },
  ];

/**
 * Finds a provider descriptor by id.
 */
export function findingWorldCollisionProviderById(
  providerId: DefiningWorldCollisionProvider['id']
): DefiningWorldCollisionProvider | undefined {
  return DEFINING_WORLD_COLLISION_PROVIDERS.find(
    (provider) => provider.id === providerId
  );
}
