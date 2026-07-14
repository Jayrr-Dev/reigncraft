import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
} from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';

/**
 * Ordered depth-sort biases applied on top of the base grid projection.
 *
 * Invariant ladder (lowest to highest within one tile foot):
 *   shadow (+1) < block terrain clearance (+1) < fire flame above column (+1)
 *   < trunk (+2) < occluder margin (3) < rock column (+5)
 *   < terrain surface-layer step (+4 per layer above ground)
 *   < avatar on-block (+80)
 *
 * Terrain surface-layer bias keeps taller columns strictly above lower caps on
 * the same grid row so front-occluder clamp + hard-floor raise can slot an
 * entity between them. Max layer 32 → 31×4 = 124, under one full grid row (~160).
 *
 * @module components/world/depth/domains/definingWorldDepthBiasLadder
 */

/** Multiplier for screen-Y entity depth sorting within the entity layer. */
export const DEFINING_WORLD_DEPTH_ENTITY_Z_INDEX_SCALE = 10;

/** Entity-layer sort bias for avatar and tree ground shadows at foot depth. */
export const DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS =
  1 as const;

/** Tree ground shadow entity depth bias (matches avatar shadow). */
export const DEFINING_WORLD_DEPTH_TREE_GROUND_SHADOW_ENTITY_DEPTH_BIAS =
  1 as const;

/** Lifts placed block columns above clearable terrain on the same tile. */
export const DEFINING_WORLD_DEPTH_PLACED_BLOCK_COLUMN_TERRAIN_CLEARANCE_DEPTH_BIAS =
  1 as const;

/** Renders tree trunks above procedural terrain columns at the same foot. */
export const DEFINING_WORLD_DEPTH_TREE_TRUNK_TERRAIN_COLUMN_DEPTH_BIAS =
  2 as const;

/**
 * Z-index gap subtracted from a foreground column when clamping the avatar body
 * behind it.
 */
export const DEFINING_WORLD_DEPTH_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN =
  3 as const;

/** Entity-layer depth bias so column rocks sort above avatar shadows. */
export const DEFINING_WORLD_DEPTH_TERRAIN_ROCK_COLUMN_ENTITY_DEPTH_BIAS = 5;

/** Extra bias when the avatar stands on a column rock cap. */
export const DEFINING_WORLD_DEPTH_TERRAIN_ROCK_COLUMN_AVATAR_STANDING_DEPTH_BIAS = 1;

/**
 * Per world-layer depth bias added to a terrain elevation column's sort key
 * for each layer above ground. Separates taller cliffs from lower caps that
 * share the same grid foot row so entities can sort between them.
 */
export const DEFINING_WORLD_DEPTH_TERRAIN_ELEVATION_COLUMN_SURFACE_LAYER_DEPTH_BIAS =
  4 as const;

/** Render-only terrain elevation column bias (canonical sort key stays unbiased). */
export const DEFINING_WORLD_DEPTH_TERRAIN_ELEVATION_COLUMN_RENDER_DEPTH_BIAS =
  0 as const;

/**
 * Depth-sort bias so a grounded avatar renders above its own tile column while
 * staying behind columns one full tile to the south.
 */
export const DEFINING_WORLD_DEPTH_ENTITY_ON_BLOCK_DEPTH_BIAS = Math.round(
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID *
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX *
    DEFINING_WORLD_DEPTH_ENTITY_Z_INDEX_SCALE
);

/** Floor-layer warm glow bias above coplanar floor chunks. */
export const DEFINING_WORLD_DEPTH_LIGHT_GLOW_FLOOR_DEPTH_BIAS = 1 as const;

/** Floor-layer fire glow sort bias above coplanar floor chunks. */
export const DEFINING_WORLD_DEPTH_FIRE_GLOW_FLOOR_DEPTH_BIAS = 2 as const;

/**
 * Entity-layer flame bias above the coplanar placed-block / terrain column.
 *
 * Campfire wood lives on the placed-block column key (including terrain
 * clearance). Flames must track that same key or elevated pits bury the sprite
 * behind the procedural logs.
 */
export const DEFINING_WORLD_DEPTH_FIRE_FLAME_ENTITY_ABOVE_COLUMN_DEPTH_BIAS =
  1 as const;

/** Floor-layer player night-light warm glow bias. */
export const DEFINING_WORLD_DEPTH_PLAYER_NIGHT_LIGHT_FLOOR_WARM_GLOW_DEPTH_BIAS =
  1 as const;

/** Click-arrow effect offset above entity base sort key. */
export const DEFINING_WORLD_DEPTH_CLICK_ARROW_EFFECT_Z_INDEX_OFFSET =
  1 as const;

/** Inventory drop tile outline offset above entity base sort key. */
export const DEFINING_WORLD_DEPTH_INVENTORY_DROP_TILE_OUTLINE_Z_INDEX_OFFSET =
  4 as const;

/** Ground-sorted projectile offset relative to entity base sort key. */
export const DEFINING_WORLD_DEPTH_PROJECTILE_GROUND_SORTED_Z_INDEX_OFFSET =
  3 as const;

/** AoE telegraph ring offset above entity base sort key. */
export const DEFINING_WORLD_DEPTH_PROJECTILE_AOE_TELEGRAPH_Z_INDEX_OFFSET =
  2 as const;

/** Water surface z-index inside the floor layer (above all floor chunks). */
export const DEFINING_WORLD_DEPTH_WATER_SURFACE_LAYER_Z_INDEX = 1_000_000_000;

/** Water shimmer sits just above the water surface. */
export const DEFINING_WORLD_DEPTH_WATER_SHIMMER_LAYER_Z_INDEX =
  DEFINING_WORLD_DEPTH_WATER_SURFACE_LAYER_Z_INDEX + 1;

/** Lava overlay sits just below the water surface layer. */
export const DEFINING_WORLD_DEPTH_LAVA_OVERLAY_LAYER_Z_INDEX =
  DEFINING_WORLD_DEPTH_WATER_SURFACE_LAYER_Z_INDEX - 2;

/** Flower dots sit above all floor chunks, below liquid overlays. */
export const DEFINING_WORLD_DEPTH_FLOWER_DECORATION_LAYER_Z_INDEX =
  DEFINING_WORLD_DEPTH_WATER_SURFACE_LAYER_Z_INDEX - 3;

/** Surface pebbles sit above all floor chunks, below flower dots. */
export const DEFINING_WORLD_DEPTH_STONE_DECORATION_LAYER_Z_INDEX =
  DEFINING_WORLD_DEPTH_WATER_SURFACE_LAYER_Z_INDEX - 4;

/** Claim-mode plot overlay on the floor layer. */
export const DEFINING_WORLD_DEPTH_CLAIM_MODE_PLOT_OVERLAY_FLOOR_Z_INDEX = 1_000_000;

/** Gap below avatar standing depth for claim entity overlays. */
export const DEFINING_WORLD_DEPTH_CLAIM_MODE_PLOT_OVERLAY_ENTITY_Z_INDEX_GAP_BELOW_AVATAR = 2;

/** Build-mode placement preview z-index. */
export const DEFINING_WORLD_DEPTH_BUILD_PLACEMENT_PREVIEW_Z_INDEX = 2_000_000;

/** Collision-debug player marker sorts just above the avatar body at the same foot. */
export const DEFINING_WORLD_DEPTH_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_Z_INDEX_OFFSET =
  2 as const;

/** Build-mode tile overlay offset from entity base sort key. */
export const DEFINING_WORLD_DEPTH_BUILD_TILE_OVERLAY_Z_INDEX_OFFSET = -3;

/** Avatar body sort offset relative to shadow (body draws above shadow). */
export const DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET =
  -1 as const;

/** Tile radius scanned around the avatar foot for body and shadow sort rules. */
export const DEFINING_WORLD_DEPTH_AVATAR_BODY_SORT_FOOTPRINT_TILE_RADIUS =
  2 as const;

/** Tile radius for avatar ground shadow footprint scans. */
export const DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS =
  2 as const;

/** Tile radius for placed-block shadow occlusion (tighter than terrain). */
export const DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_PLACED_BLOCK_OCCLUDER_TILE_RADIUS =
  1 as const;

/** Tile radius for tree ground shadow footprint scans. */
export const DEFINING_WORLD_DEPTH_TREE_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS =
  3 as const;

/**
 * Quantization for cached avatar body sort keys within a tile. Front-occluder
 * and behind-column tests use continuous foot sums, so the cache must refresh
 * when the avatar walks south/north inside the same tile.
 */
export const DEFINING_WORLD_DEPTH_AVATAR_BODY_SORT_CACHE_FOOT_SUM_QUANTIZATION =
  4 as const;

/**
 * Dev assertion: verifies the documented bias ladder ordering holds.
 * Call once at module init in development builds if desired.
 */
export function assertingWorldDepthBiasLadderOrdering(): void {
  const maxTerrainSurfaceLayerBias =
    (32 - 1) *
    DEFINING_WORLD_DEPTH_TERRAIN_ELEVATION_COLUMN_SURFACE_LAYER_DEPTH_BIAS;

  if (
    DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_ENTITY_DEPTH_BIAS >=
      DEFINING_WORLD_DEPTH_TREE_TRUNK_TERRAIN_COLUMN_DEPTH_BIAS ||
    DEFINING_WORLD_DEPTH_TREE_TRUNK_TERRAIN_COLUMN_DEPTH_BIAS >=
      DEFINING_WORLD_DEPTH_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN ||
    DEFINING_WORLD_DEPTH_TERRAIN_ROCK_COLUMN_ENTITY_DEPTH_BIAS >=
      DEFINING_WORLD_DEPTH_ENTITY_ON_BLOCK_DEPTH_BIAS ||
    DEFINING_WORLD_DEPTH_TERRAIN_ELEVATION_COLUMN_SURFACE_LAYER_DEPTH_BIAS <=
      DEFINING_WORLD_DEPTH_AVATAR_BODY_FRONT_OCCLUDER_STANDING_Z_INDEX_MARGIN ||
    maxTerrainSurfaceLayerBias >=
      DEFINING_WORLD_DEPTH_ENTITY_ON_BLOCK_DEPTH_BIAS * 2
  ) {
    throw new Error('World depth bias ladder ordering invariant violated.');
  }
}
