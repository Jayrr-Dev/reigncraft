import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Procedural Firelands biome thresholds, floor ramp, and prop placement tuning.
 *
 * @module components/world/domains/definingWorldPlazaFirelandsBiomeConstants
 */

/** Stable biome kind id for the Firelands biome. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_BIOME_KIND =
  'firelands' as const satisfies DefiningWorldPlazaBiomeKind;

/** Euclidean tile radius around spawn where Firelands cannot appear. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID = 2000;

/** Squared spawn clearing radius (avoids sqrt in the hot path). */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_SQUARED =
  DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID *
  DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID;

/** Minimum temperature for Firelands climate pre-filter. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_TEMPERATURE_MIN = 0.7;

/** Maximum humidity for Firelands climate pre-filter. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_HUMIDITY_MAX = 0.4;

/** Seed for the low-frequency Firelands body field. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_SEED = 6283;

/** Frequency for Firelands body noise; lower values yield larger volcanic regions. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_FREQUENCY = 1 / 260;

/** Octaves for Firelands body noise. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_OCTAVES = 3;

/** Unit noise at or above which a hot-dry tile becomes Firelands. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_THRESHOLD = 0.65;

/** Ambient air temperature (°C) across the Firelands biome. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_AMBIENT_TEMPERATURE_CELSIUS = 62;

/** Lava placement noise threshold inside Firelands (much denser than global lava). */
export const DEFINING_WORLD_PLAZA_FIRELANDS_LAVA_TILE_NOISE_THRESHOLD = 0.72;

/** Coarse structure grid size in tiles (volcano + ruin anchors). */
export const DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_CELL_TILES = 48;

/** Anchor column within each structure spacing cell (0-based). */
export const DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_ANCHOR_TILE = 24;

/** Minimum centrality for a volcano centerpiece at a structure anchor. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_VOLCANO_CENTRALITY_MIN = 0.8;

/** Minimum centrality for a ruin cluster anchor. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CENTRALITY_MIN = 0.45;

/** Maximum centrality for a ruin cluster anchor (below volcano band). */
export const DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CENTRALITY_MAX = 0.75;

/** Half-width of the volcano collision footprint in tiles from anchor. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_VOLCANO_FOOTPRINT_HALF_SPAN_TILES = 4;

/** Spacing cell for small scatter props (plants, rocks). */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_SMALL_SPACING_CELL_TILES = 3;

/** Anchor within each small scatter cell. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_SMALL_ANCHOR_TILE = 1;

/** Spacing cell for large scatter props (trees, mini-volcanoes). */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_LARGE_SPACING_CELL_TILES = 4;

/** Anchor within each large scatter cell. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_LARGE_ANCHOR_TILE = 2;

/** Minimum patch noise for scatter props inside Firelands. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_PATCH_NOISE_MIN = 0.42;

/** Minimum detail noise for a scatter prop candidate. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_DETAIL_NOISE_MIN = 0.58;

/** Seed for Firelands scatter patch noise. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_PATCH_NOISE_SEED = 4519;

/** Seed for Firelands scatter detail noise. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_DETAIL_NOISE_SEED = 8831;

/** Frequency for Firelands scatter patch noise. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_PATCH_NOISE_FREQUENCY =
  1 / 28;

/** Frequency for Firelands scatter detail noise. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_DETAIL_NOISE_FREQUENCY =
  1 / 11;

/** Grey-basalt floor shades ordered dark to light. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_FILL_COLORS: readonly number[] =
  [0x2a1a18, 0x3a2420, 0x4a2e28, 0x5a3830, 0x6a4238];

/** Seed for the coherent Firelands floor shade noise field. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_NOISE_SEED = 5197;

/** Frequency for the Firelands floor shade noise. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_NOISE_FREQUENCY = 1 / 14;

/** Octave count for the Firelands floor shade noise. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_NOISE_OCTAVES = 3;

/** Blend toward the coherent basalt shade; lower keeps more border blending. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_FLOOR_BORDER_BLEND = 0.36;

/** Minimap color for Firelands props. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_FIRELANDS_PROP_TILE_COLOR =
  '#8b2500';

/** Minimap color for Firelands lava tiles. */
export const DEFINING_WORLD_PLAZA_MINI_MAP_FIRELANDS_LAVA_TILE_COLOR =
  '#ff6a1a';
