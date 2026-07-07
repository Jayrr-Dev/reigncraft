/**
 * Debug overlay tuning for plaza terrain collision visualization.
 *
 * @module components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants
 */

import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID } from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';

/**
 * Dotted collision boxes, standing-tile fill, and grid crosshair.
 *
 * Off by default. Toggle in-world with the left-side Collision button, or set
 * `NEXT_PUBLIC_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG=true` in `.env.local` to
 * start with debug enabled after a dev server restart.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_ENABLED =
  import.meta.env.NEXT_PUBLIC_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG === 'true';

/** Extra tile rings beyond the viewport when drawing debug collision boxes. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_VIEWPORT_PADDING_TILES = 2;

/**
 * Tile width/height of one cached static collision debug chunk.
 *
 * Matches the floor chunk grain so each debug chunk's geometry is built once,
 * cached, and culled off-screen by the CullerPlugin. Walking back over already
 * built ground reuses the cached chunks instead of redrawing the window.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CHUNK_SIZE_TILES = 8;

/**
 * Max new debug chunks built per frame while exploring fresh ground.
 *
 * Keeps the one-time build cost of newly visible chunks under a frame budget;
 * once built, chunks are cached and only rebuilt after they leave the prefetch
 * window, so steady-state movement adds little per-frame cost.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CHUNK_BUILD_BUDGET_PER_FRAME = 2;

/** Dashed stroke length in pixels. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_DASH_LENGTH_PX = 6;

/** Gap length between dashes in pixels. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_GAP_LENGTH_PX = 4;

/** Line width for tile diamond outlines. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STROKE_WIDTH_PX = 1.5;

/** Tile diamond outline for the avatar standing cell. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_STROKE_COLOR = 0x00ffff;

/** Tile diamond outline for fully blocked terrain (water, large rocks). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_BLOCK_TILE_STROKE_COLOR = 0xff3366;

/** Tile diamond outline for jump-over terrain (streams, medium rocks). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_JUMP_TILE_STROKE_COLOR = 0xffcc00;

/** Circular collider outline for trees. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TREE_COLLIDER_STROKE_COLOR = 0x66ff66;

/** Circular collider outline for medium and large pebble rocks. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_ROCK_COLLIDER_STROKE_COLOR = 0xff9900;

/** Circular collider outline for blocking Firelands props. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_FIRELANDS_PROP_COLLIDER_STROKE_COLOR = 0xff5544;

/** Rock face silhouette for column-rock mega-boulders (inner reference). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_FACE_STROKE_COLOR = 0xff9933;

/** Player contact boundary for column rocks (what movement actually resolves). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_PLAYER_CONTACT_STROKE_COLOR = 0xff6600;

/** Grid tiles occupied by a column-rock footprint (walkable at ground level). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_COLUMN_ROCK_FOOTPRINT_TILE_STROKE_COLOR = 0xccaa44;

/** Crosshair at the grid/collision anchor on the avatar. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_COLOR = 0xffffff;

/** Half-length of the debug crosshair arms (pixels). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_MARKER_HALF_LENGTH_PX = 5;

/** Wireframe outline color for the player collision hitbox volume. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_STROKE_COLOR = 0xff44dd;

/** Fill color for the player hitbox top and side faces. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FILL_COLOR = 0xff44dd;

/** Opacity for the player hitbox top face. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_TOP_FILL_ALPHA = 0.22;

/** Opacity for the player hitbox vertical side faces. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_SIDE_FILL_ALPHA = 0.12;

/**
 * Footprint size of the player hitbox relative to one tile diamond.
 *
 * Derived from the real collision radius so the debug box bounds the actual
 * circular footprint resolved by movement collision (single source of truth).
 * The drawn square encloses the circle; corners extend slightly past it.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLAYER_HITBOX_FOOTPRINT_SCALE =
  DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID /
  DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID;

/** Segments used when approximating a grid-space circle on screen. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_CIRCLE_SEGMENT_COUNT = 32;

/** Renders above entities so debug lines stay visible. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_Z_INDEX = 1_000_000;

/** Semi-transparent fill on the standing tile so the crosshair read is obvious. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_FILL_COLOR = 0x00ffff;

/** Opacity for the standing tile fill. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_STANDING_TILE_FILL_ALPHA = 0.18;

/** Tile diamond outline for player-placed blocks that fully block movement. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_TILE_STROKE_COLOR = 0xff66ff;

/** Tile diamond outline for player-placed jump-over blocks (streams, etc.). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_JUMP_TILE_STROKE_COLOR = 0x66ccff;

/** Circular collider outline for player-placed blocks (trees, chests, rocks). */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_CIRCLE_STROKE_COLOR = 0xcc66ff;

/** Renders above static terrain colliders and below the player marker. */
export const DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCKS_Z_INDEX =
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_Z_INDEX + 1;
