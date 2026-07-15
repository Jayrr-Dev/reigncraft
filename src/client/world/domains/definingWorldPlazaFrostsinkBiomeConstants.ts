import {
  definingWorldPlazaBiomeWorldNoiseFrequency,
  scalingWorldPlazaBiomeWorldFeatureSpanTiles,
} from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Procedural Frostsink legendary ice-disc sites, rings, Cryocore, and ambient °C.
 *
 * Disc is scaled up vs the original 30-tile prototype so it reads against
 * climate biomes (hundreds of tiles across). Active sites only spawn in the
 * ~3k–10k discovery ring from origin. Elevation rises to a Cryocore peak;
 * radial crevasses stay open-ended so players are never trapped.
 *
 * @module components/world/domains/definingWorldPlazaFrostsinkBiomeConstants
 */

/** Stable biome kind id for Frostsink. */
export const DEFINING_WORLD_PLAZA_FROSTSINK_BIOME_KIND =
  'frostsink' as const satisfies DefiningWorldPlazaBiomeKind;

/**
 * Multiplier on the original 3/6/9/12/15 ring radii.
 * 8 → outer diameter 240 tiles (~π·120² area), still smaller than typical climate biomes.
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_DISC_LINEAR_SCALE = 8;

/**
 * Inner edge of the Frostsink discovery ring (tiles from world origin).
 * Sites closer than this never activate (keeps spawn safe).
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_SPAWN_CLEARING_RADIUS_GRID =
  scalingWorldPlazaBiomeWorldFeatureSpanTiles(750);

/** Squared spawn clearing radius (avoids sqrt in the hot path). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_SPAWN_CLEARING_RADIUS_SQUARED =
  DEFINING_WORLD_PLAZA_FROSTSINK_SPAWN_CLEARING_RADIUS_GRID *
  DEFINING_WORLD_PLAZA_FROSTSINK_SPAWN_CLEARING_RADIUS_GRID;

/**
 * Outer edge of the Frostsink discovery ring (tiles from world origin).
 * Every active Cryocore sits in [clearing, this] so first finds stay ~20–90 min
 * walk/sprint, not multi-hour deep-world trips.
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_DISCOVERY_MAX_RADIUS_GRID = 10_000;

/** Squared discovery-ring outer radius. */
export const DEFINING_WORLD_PLAZA_FROSTSINK_DISCOVERY_MAX_RADIUS_SQUARED =
  DEFINING_WORLD_PLAZA_FROSTSINK_DISCOVERY_MAX_RADIUS_GRID *
  DEFINING_WORLD_PLAZA_FROSTSINK_DISCOVERY_MAX_RADIUS_GRID;

/**
 * Coarse site grid size in tiles. One candidate Cryocore center per cell.
 * Sized so large discs stay legendary-rare and rarely overlap.
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_CELL_TILES =
  scalingWorldPlazaBiomeWorldFeatureSpanTiles(500);

/** Anchor column/row within each site spacing cell (0-based). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_SITE_SPACING_ANCHOR_TILE =
  scalingWorldPlazaBiomeWorldFeatureSpanTiles(250);

/** Base ring outer radii before disc linear scale (original prototype). */
const DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES_BASE = [
  3, 6, 9, 12, 15,
] as const;

/** Ring outer radii (tiles from Cryocore) after disc scale. */
export const DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES = [
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES_BASE[0] *
    DEFINING_WORLD_PLAZA_FROSTSINK_DISC_LINEAR_SCALE,
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES_BASE[1] *
    DEFINING_WORLD_PLAZA_FROSTSINK_DISC_LINEAR_SCALE,
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES_BASE[2] *
    DEFINING_WORLD_PLAZA_FROSTSINK_DISC_LINEAR_SCALE,
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES_BASE[3] *
    DEFINING_WORLD_PLAZA_FROSTSINK_DISC_LINEAR_SCALE,
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES_BASE[4] *
    DEFINING_WORLD_PLAZA_FROSTSINK_DISC_LINEAR_SCALE,
] as const;

/** Outer disc radius in tiles (diameter = 2 × this). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES =
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES[4];

/** Squared outer disc radius. */
export const DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_SQUARED =
  DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES *
  DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES;

/** Frostsink ring ids from center outward. */
export type DefiningWorldPlazaFrostsinkRingId =
  | 'oxygen_lake'
  | 'cryogenic_basin'
  | 'frozen_tundra'
  | 'snow_forest_inner'
  | 'snow_forest_outer';

/** Ring id by ascending outer-radius index. */
export const DEFINING_WORLD_PLAZA_FROSTSINK_RING_IDS: readonly DefiningWorldPlazaFrostsinkRingId[] =
  [
    'oxygen_lake',
    'cryogenic_basin',
    'frozen_tundra',
    'snow_forest_inner',
    'snow_forest_outer',
  ] as const;

/**
 * Mountain peak surface layer at the Cryocore tip (game elevation cap).
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_PEAK_SURFACE_LAYER = 32;

/** Foothill surface layer at the outer rim (still above open plains). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_FOOTHILL_SURFACE_LAYER = 2;

/**
 * Legacy ring shelf labels (center → rim). Kept for docs/tests; live height
 * lerps by radius then snaps to play tiers so the climb stays jump-passable.
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_RING_SURFACE_LAYERS = [
  32, 28, 20, 12, 5,
] as const;

/**
 * Ambient °C at each ring outer edge (and center for index 0).
 * Lerp between previous edge and this edge by radius.
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_TEMPERATURE_CELSIUS = [
  -200, -140, -45, -32.5, -20,
] as const;

/** Ambient °C at the Cryocore center (r = 0). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CENTER_TEMPERATURE_CELSIUS = -220;

/**
 * Minimum Euclidean radius (tiles) where normal wildlife may spawn.
 * Outer two snow-forest rings only (beyond frozen_tundra outer edge).
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_WILDLIFE_MIN_RADIUS_TILES =
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES[2];

/** Half-span of the Cryocore footprint in tiles (8×8 = half-span 4). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_FOOTPRINT_HALF_SPAN_TILES = 4;

/**
 * Walk-block circle radius at the Cryocore anchor (grid units).
 * Large enough to cover the ice pedestal so players cannot walk under the sprite.
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_COLLISION_RADIUS_GRID = 3.2;

/**
 * Visual south bias in grid units for Cryocore sprite placement.
 * Positive Y shifts the drawn prop south so the sapphire orb lines up with the peak.
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_VISUAL_SOUTH_GRID_OFFSET = 3.65;

/** Extra screen-Y pixels (down) after iso project; fine-tunes south align. */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_VISUAL_SOUTH_OFFSET_Y_PX = 18;

/** Display scale for Cryocore sprites (matches Firelands volcano). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_DISPLAY_SCALE = 2;

/** Expected world coverage band for Frostsink discs (percent). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_COVERAGE_PERCENT_MIN = 0.15;

/** Expected world coverage band for Frostsink discs (percent). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_COVERAGE_PERCENT_MAX = 1.5;

/** Seed for optional soft edge noise (almost-circular). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_EDGE_NOISE_SEED = 9147;

/** Soft edge jitter amplitude in tiles (±). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_EDGE_SOFT_JITTER_TILES =
  0.75 * DEFINING_WORLD_PLAZA_FROSTSINK_DISC_LINEAR_SCALE;

/** Frequency for soft edge jitter. */
export const DEFINING_WORLD_PLAZA_FROSTSINK_EDGE_NOISE_FREQUENCY =
  definingWorldPlazaBiomeWorldNoiseFrequency(40);

/** How many open radial crevasse spokes cut the mountain. */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_SPOKE_COUNT = 6;

/**
 * Crevasse half-width in tiles. Wide enough to walk the trench; jump/climb out at exits.
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_HALF_WIDTH_TILES = 2;

/**
 * Fraction of each spoke sector that stays solid ground (exit / walk-around).
 * Spokes occupy the remaining wedge so corridors never form a closed ring.
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_SOLID_SECTOR_FRACTION = 0.52;

/** Inner radius where crevasses begin (outside Cryocore / oxygen lake core). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_MIN_RADIUS_TILES =
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES[0];

/** Outer radius where crevasses end (open onto foothills — the escape). */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_MAX_RADIUS_TILES =
  DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES - 2;

/**
 * Crevasse floor is always this layer. Mid/high mountain shelves are L13+ so a
 * fall into the trench is ≥12 layers (lethal EV per fall retune). Outer end
 * meets foothills (~L2) so walking the spoke out is a safe exit.
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_FLOOR_SURFACE_LAYER = 1;

/** Absolute minimum crevasse floor layer. */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_FLOOR_SURFACE_LAYER_MIN = 1;

/**
 * Layer drop that reaches ~100% max-HP EV with current fall curve
 * (base 0.025, growth 1.7). Used for tests / docs; floor is fixed at L1.
 */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_LETHAL_FALL_LAYER_DELTA = 12;

/** Seed for mild crevasse edge wobble. */
export const DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_EDGE_NOISE_SEED = 5521;

/** Minimap color for Cryocore prop tiles. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_FROSTSINK_CRYOCORE_TILE_COLOR =
  '#7ec8e8';

/** Grey-cyan floor shades ordered dark to light. */
export const DEFINING_WORLD_PLAZA_FROSTSINK_FLOOR_FILL_COLORS: readonly number[] =
  [0xb8d4e0, 0xc8e0ec, 0xd4e8f0, 0xe0f0f6, 0xe8f4fa];
