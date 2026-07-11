/**
 * Stone (pebble and boulder) ground decoration constants for the plaza floor.
 *
 * Stones are sparse, deterministic floor props rendered alongside flowers and
 * specks. Each stone is an ellipse with a ground shadow and a top highlight so
 * it reads as a small rounded rock on the 2:1 isometric ground.
 *
 * @module components/world/domains/definingWorldPlazaStoneDecorationConstants
 */

/** One stone size tier expressed as ground ellipse half-extents. */
export interface DefiningWorldPlazaStoneSizeTier {
  /** Ellipse half-width in pixels. */
  bodyHalfWidthPx: number;
  /** Ellipse half-height in pixels (flatter than width for ground perspective). */
  bodyHalfHeightPx: number;
}

/** Body color paired with its top highlight color. */
export interface DefiningWorldPlazaStonePalette {
  /** Base stone fill color. */
  bodyColor: number;
  /** Lighter top-face fill color. */
  highlightColor: number;
}

/** Size tiers from tiny pebble to large boulder (index 0 is smallest). */
export const DEFINING_WORLD_PLAZA_STONE_SIZE_TIERS: readonly DefiningWorldPlazaStoneSizeTier[] =
  [
    { bodyHalfWidthPx: 3.5, bodyHalfHeightPx: 2.2 },
    { bodyHalfWidthPx: 6, bodyHalfHeightPx: 3.6 },
    { bodyHalfWidthPx: 9, bodyHalfHeightPx: 5.4 },
    { bodyHalfWidthPx: 13, bodyHalfHeightPx: 7.6 },
  ];

/**
 * Seeded thresholds biasing placement toward smaller stones.
 *
 * A seeded unit float is compared against each threshold; the count of
 * thresholds it meets or exceeds is the size tier index.
 */
export const DEFINING_WORLD_PLAZA_STONE_SIZE_TIER_THRESHOLDS: readonly number[] =
  [0.46, 0.76, 0.93];

/** Stone color palettes (cool gray, warm taupe, slate). */
export const DEFINING_WORLD_PLAZA_STONE_PALETTES: readonly DefiningWorldPlazaStonePalette[] =
  [
    { bodyColor: 0x8b8e93, highlightColor: 0xb9bcc1 },
    { bodyColor: 0x9a9287, highlightColor: 0xc4bcae },
    { bodyColor: 0x7c8088, highlightColor: 0xa6abb3 },
  ];

/** Placement modulus; one tile in this many is eligible for a stone. */
export const DEFINING_WORLD_PLAZA_STONE_TILE_MODULUS = 23;

/** Remainder that marks a tile as receiving a stone. */
export const DEFINING_WORLD_PLAZA_STONE_TILE_REMAINDER = 0;

/**
 * Horizontal placement jitter inside the tile (pixels, +/-).
 * Wide enough to wander across a 64px iso diamond without hugging center.
 */
export const DEFINING_WORLD_PLAZA_STONE_JITTER_X_PX = 20;

/**
 * Vertical placement jitter inside the tile (pixels, +/-).
 * Matches the flatter 32px iso diamond height with a small edge inset.
 */
export const DEFINING_WORLD_PLAZA_STONE_JITTER_Y_PX = 10;

/** Ground shadow fill color. */
export const DEFINING_WORLD_PLAZA_STONE_SHADOW_COLOR = 0x21261f;

/** Ground shadow opacity (kept subtle to sit on the grass). */
export const DEFINING_WORLD_PLAZA_STONE_SHADOW_ALPHA = 0.18;

/** Shadow ellipse width relative to the stone body half-width. */
export const DEFINING_WORLD_PLAZA_STONE_SHADOW_WIDTH_SCALE = 1.2;

/** Shadow ellipse height relative to the stone body half-height. */
export const DEFINING_WORLD_PLAZA_STONE_SHADOW_HEIGHT_SCALE = 0.7;

/** Shadow downward offset relative to the stone body half-height. */
export const DEFINING_WORLD_PLAZA_STONE_SHADOW_OFFSET_Y_SCALE = 0.55;

/** Highlight ellipse width relative to the stone body half-width. */
export const DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_WIDTH_SCALE = 0.45;

/** Highlight ellipse height relative to the stone body half-height. */
export const DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_HEIGHT_SCALE = 0.4;

/** Highlight leftward offset relative to the stone body half-width. */
export const DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_OFFSET_X_SCALE = -0.28;

/** Highlight upward offset relative to the stone body half-height. */
export const DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_OFFSET_Y_SCALE = -0.32;

/** Seed salt selecting the stone size tier. */
export const DEFINING_WORLD_PLAZA_STONE_SEED_SALT_SIZE = 91;

/** Seed salt selecting the stone palette. */
export const DEFINING_WORLD_PLAZA_STONE_SEED_SALT_PALETTE = 137;

/** Seed salt for horizontal placement jitter. */
export const DEFINING_WORLD_PLAZA_STONE_SEED_SALT_JITTER_X = 211;

/** Seed salt for vertical placement jitter. */
export const DEFINING_WORLD_PLAZA_STONE_SEED_SALT_JITTER_Y = 277;

/** Hash multiplier applied to the tile column for placement gating. */
export const DEFINING_WORLD_PLAZA_STONE_PLACEMENT_HASH_X = 41;

/** Hash multiplier applied to the tile row for placement gating. */
export const DEFINING_WORLD_PLAZA_STONE_PLACEMENT_HASH_Y = 59;
