import type { DefiningWorldCollisionProvider } from '@/components/world/collision/domains/definingWorldCollisionProvider';
import { DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND } from '@/components/world/domains/definingWorldPlazaTerrainCollisionBlockerKind';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_BLOCK_TILE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_FACE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_FOOTPRINT_TILE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_PLAYER_CONTACT_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_FIRELANDS_PROP_COLLIDER_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_FROSTSINK_PROP_COLLIDER_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_JUMP_TILE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_CIRCLE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_JUMP_TILE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_TILE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_ROCK_COLLIDER_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TREE_COLLIDER_STROKE_COLOR,
} from '@/components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants';

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
  'frostsinkPropCircle',
  'chestPropCircle',
  'pebbleRockCircle',
  'waterTileSquare',
] as const;

/** Tile-grid block predicate order (after rock footprint bypass). */
export const DEFINING_WORLD_COLLISION_TILE_GRID_BLOCK_PROVIDER_ORDER = [
  'placedBlockColumn',
  'terrainElevationColumn',
  'waterTileSquare',
] as const;

/** Static terrain debug overlay draw order (column rocks claim tiles first). */
export const DEFINING_WORLD_COLLISION_DEBUG_STATIC_PROVIDER_ORDER = [
  'columnRockDiamond',
  'waterTileSquare',
  'terrainElevationColumn',
  'pebbleRockCircle',
  'treeTrunkCircle',
  'firelandsPropCircle',
  'frostsinkPropCircle',
  'chestPropCircle',
] as const;

/** Registered collision providers (metadata for debug + future declarative hooks). */
export const DEFINING_WORLD_COLLISION_PROVIDERS: readonly DefiningWorldCollisionProvider[] =
  [
    {
      id: 'placedBlockColumn',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PLACED_BLOCK,
      label: 'Placed block',
      debugStroke: {
        kind: 'isometricTileDiamond',
        strokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_TILE_STROKE_COLOR,
        secondaryStrokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_JUMP_TILE_STROKE_COLOR,
        footprintStrokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_CIRCLE_STROKE_COLOR,
      },
    },
    {
      id: 'columnRockDiamond',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.COLUMN_ROCK_DIAMOND,
      label: 'Column rock diamond',
      debugStroke: {
        kind: 'columnRockBundle',
        strokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_FACE_STROKE_COLOR,
        secondaryStrokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_PLAYER_CONTACT_STROKE_COLOR,
        footprintStrokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_FOOTPRINT_TILE_STROKE_COLOR,
      },
    },
    {
      id: 'treeTrunkCircle',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TREE_CIRCLE,
      label: 'Tree trunk',
      debugStroke: {
        kind: 'gridCircle',
        strokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TREE_COLLIDER_STROKE_COLOR,
      },
    },
    {
      id: 'firelandsPropCircle',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PEBBLE_ROCK_CIRCLE,
      label: 'Firelands prop',
      debugStroke: {
        kind: 'gridCircle',
        strokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_FIRELANDS_PROP_COLLIDER_STROKE_COLOR,
      },
    },
    {
      id: 'frostsinkPropCircle',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PEBBLE_ROCK_CIRCLE,
      label: 'Frostsink Cryocore',
      debugStroke: {
        kind: 'gridCircle',
        strokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_FROSTSINK_PROP_COLLIDER_STROKE_COLOR,
      },
    },
    {
      id: 'chestPropCircle',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PEBBLE_ROCK_CIRCLE,
      label: 'Chest prop',
      debugStroke: {
        kind: 'gridCircle',
        strokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_CIRCLE_STROKE_COLOR,
      },
    },
    {
      id: 'pebbleRockCircle',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PEBBLE_ROCK_CIRCLE,
      label: 'Pebble rock',
      debugStroke: {
        kind: 'gridCircle',
        strokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_ROCK_COLLIDER_STROKE_COLOR,
      },
    },
    {
      id: 'waterTileSquare',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_TILE_JUMP_OVER,
      label: 'Water tile',
      debugStroke: {
        kind: 'isometricTileDiamond',
        strokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_JUMP_TILE_STROKE_COLOR,
        secondaryStrokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_BLOCK_TILE_STROKE_COLOR,
      },
    },
    {
      id: 'terrainElevationColumn',
      blockerKind:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_ELEVATION,
      label: 'Terrain elevation',
      debugStroke: {
        kind: 'isometricTileDiamond',
        strokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_BLOCK_TILE_STROKE_COLOR,
        secondaryStrokeColor:
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_JUMP_TILE_STROKE_COLOR,
      },
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

/**
 * Returns providers in static debug overlay draw order.
 */
export function listingWorldCollisionProvidersForDebugStaticOverlay(): readonly DefiningWorldCollisionProvider[] {
  return DEFINING_WORLD_COLLISION_DEBUG_STATIC_PROVIDER_ORDER.map(
    (providerId) => {
      const provider = findingWorldCollisionProviderById(providerId);

      if (!provider) {
        throw new Error(
          `Missing collision provider for debug overlay: ${providerId}`
        );
      }

      return provider;
    }
  );
}
