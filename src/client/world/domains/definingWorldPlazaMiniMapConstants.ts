/**
 * Layout and palette for the plaza minimap overlay.
 *
 * @module components/world/domains/definingWorldPlazaMiniMapConstants
 */

/** Embedded minimap canvas width and height in CSS pixels. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_EMBEDDED_CANVAS_SIZE_PX = 96;

/** Embedded minimap canvas size on mobile (2/3 of desktop embedded size). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_MOBILE_EMBEDDED_CANVAS_SIZE_PX = 64;

/** Fullscreen minimap canvas width and height in CSS pixels. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_FULLSCREEN_CANVAS_SIZE_PX = 160;

/**
 * Half-width of the visible tile window around the player on desktop.
 *
 * Zoomed in from 22 to 20 (~17% fewer terrain tiles per rebuild) so each tile
 * reads larger on the 96px canvas and minimap rebuilds cost less.
 */
export const DEFINING_WORLD_PLAZA_MINI_MAP_VIEW_RADIUS_TILES = 20;

/**
 * Half-width of the visible tile window on mobile (more zoomed out).
 *
 * Scaled down with desktop so mobile keeps a similar zoom level vs the smaller
 * 64px canvas while still trimming rebuild tile count.
 */
export const DEFINING_WORLD_PLAZA_MINI_MAP_MOBILE_VIEW_RADIUS_TILES = 38;

/** Pixels per grid tile on the embedded minimap canvas. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_EMBEDDED_PIXELS_PER_TILE =
  DEFINING_WORLD_PLAZA_MINI_MAP_EMBEDDED_CANVAS_SIZE_PX /
  (DEFINING_WORLD_PLAZA_MINI_MAP_VIEW_RADIUS_TILES * 2 + 1);

/** How often the minimap redraws when the player stays on the same tile (ms). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_IDLE_REDRAW_INTERVAL_MS = 400;

/** Legacy alias kept for callers polling on a fixed timer. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_REDRAW_INTERVAL_MS =
  DEFINING_WORLD_PLAZA_MINI_MAP_IDLE_REDRAW_INTERVAL_MS;

/** Minimap backdrop is transparent outside the square panel. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_BACKGROUND_IS_TRANSPARENT = true as const;

/** Frosted fill for the square minimap panel behind terrain tiles. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_SQUARE_PANEL_FILL_COLOR =
  "rgba(10, 14, 18, 0.58)";

/** Corner radius for the minimap square panel at the embedded canvas size (CSS px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_SQUARE_PANEL_CORNER_RADIUS_PX = 6;

/** Tree tiles on the minimap. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_TREE_TILE_COLOR = "#2d4a22";

/** Short column-rock fill at medium height (world layer 4). Pixi 0xRRGGBB. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_BOULDER_SHORT_FILL_COLOR = 0xa8a29e;

/** Tall column-rock fill at max mega-boulder height (world layer 16). Pixi 0xRRGGBB. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_BOULDER_TALL_FILL_COLOR = 0x44403c;

/** Outline for multi-tile boulder footprints on the minimap. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_BOULDER_FOOTPRINT_BORDER_COLOR = "#1f2937";

/** Medium and large pebble rocks that are not extruded column boulders. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_PEBBLE_ROCK_TILE_COLOR = "#78716c";

/** Local player marker fill. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LOCAL_PLAYER_FILL_COLOR = "#f4d35e";

/** Local player marker outline. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LOCAL_PLAYER_STROKE_COLOR = "#1b263b";

/** Remote player marker fill. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_REMOTE_PLAYER_FILL_COLOR = "#3b82f6";

/** Remote player marker outline. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_REMOTE_PLAYER_STROKE_COLOR = "#1e3a8a";

/** Radius of player dots on the minimap (CSS px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_PLAYER_DOT_RADIUS_PX = 2;

/** Player dot outline width (CSS px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_PLAYER_DOT_STROKE_WIDTH_PX = 0.75;

/** Center reticle ring stroke for orientation. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_CENTER_RETICLE_STROKE_COLOR =
  "rgba(255,255,255,0.35)";

/** Center reticle ring radius (CSS px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_CENTER_RETICLE_RADIUS_PX = 2.5;

/** Height of the top label block drawn on the minimap. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_OVERLAY_HEIGHT_PX = 24;

/** Baseline for the biome label at the top of the minimap (CSS px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_BIOME_BASELINE_Y_PX = 11;

/** Baseline for the coordinate label below the biome (CSS px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_COORDINATES_BASELINE_Y_PX = 22;

/** Minimap status label color. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_COLOR = "#ffffff";

/** Debug label color on the minimap. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_DEBUG_TEXT_COLOR =
  "rgba(255,255,255,0.82)";

/** Drop shadow color behind minimap labels. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_COLOR =
  "rgba(0,0,0,0.88)";

/** Drop shadow blur behind minimap labels (CSS px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_BLUR_PX = 3;

/** Drop shadow horizontal offset (CSS px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_OFFSET_X_PX = 0;

/** Drop shadow vertical offset (CSS px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_SHADOW_OFFSET_Y_PX = 1;

/** Canvas font for the minimap status label. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_FONT =
  '600 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/** Left padding for label text (CSS px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_PADDING_X_PX = 5;

/** Extra label strip height when terrain collision debug is enabled. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_DEBUG_EXTRA_HEIGHT_PX = 18;

/** Border color around the minimap canvas container. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_BORDER_COLOR = "rgba(255,255,255,0.28)";

/** Border width around the minimap canvas container (CSS px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_BORDER_WIDTH_PX = 1;
