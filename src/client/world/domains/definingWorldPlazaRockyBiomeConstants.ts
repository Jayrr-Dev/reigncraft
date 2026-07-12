import type { DefiningWorldPlazaStonePalette } from '@/components/world/domains/definingWorldPlazaStoneDecorationConstants';
import {
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_CELL_TILES,
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_NOISE_MIN,
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_COLUMN_CLUSTER_NOISE_MIN,
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_COLUMN_SOLITARY_NOISE_MIN,
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_PEBBLE_CLUSTER_NOISE_MIN,
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_PEBBLE_SOLITARY_NOISE_MIN,
} from '@/components/world/domains/definingWorldPlazaStoneRarityConstants';

/**
 * Procedural terrain tuning for the rocky biome.
 *
 * Stone rarity numbers live in {@link definingWorldPlazaStoneRarityConstants}
 * and are re-exported here for rocky-specific call sites.
 *
 * @module components/world/domains/definingWorldPlazaRockyBiomeConstants
 */

/** Stable biome kind id for the rocky biome. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_KIND = 'rocky' as const;

/** @see DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_COLUMN_CLUSTER_NOISE_MIN */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN_CLUSTER =
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_COLUMN_CLUSTER_NOISE_MIN;

/** @see DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_COLUMN_SOLITARY_NOISE_MIN */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN_SOLITARY =
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_COLUMN_SOLITARY_NOISE_MIN;

/** @see DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_PEBBLE_CLUSTER_NOISE_MIN */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_PEBBLE_STONE_NOISE_MIN_CLUSTER =
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_PEBBLE_CLUSTER_NOISE_MIN;

/** @see DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_PEBBLE_SOLITARY_NOISE_MIN */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_PEBBLE_STONE_NOISE_MIN_SOLITARY =
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_PEBBLE_SOLITARY_NOISE_MIN;

/** Seed for the rare rocky stone-cluster patch field. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_SEED = 7349;

/** @see DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_NOISE_FREQUENCY */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_FREQUENCY =
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_NOISE_FREQUENCY;

/** Octave count for rocky stone clusters. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_OCTAVES = 2;

/** @see DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_NOISE_MIN */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_MIN =
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_NOISE_MIN;

/** @see DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_CELL_TILES */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_CELL_TILES =
  DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_CELL_TILES;

/**
 * Spacing between cluster member anchors. Tighter than mega spacing so a
 * 1-3 group reads as a small clump, not a scattered field.
 */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_SPACING_TILES = 3;

/** Fewest column rocks allowed in an active cluster group. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_ROCK_COUNT_MIN = 1;

/** Most column rocks allowed in an active cluster group. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_ROCK_COUNT_MAX = 3;

/** Seed salt picking how many rocks (1-3) an active cluster gets. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_COUNT_SEED_SALT = 811;

/** Seed salt ranking which cluster spacing slots fill the budget. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_SLOT_SEED_SALT = 823;

/**
 * Footprint tile span for rocky pebble-field medium boulders (jumpable rocks
 * mixed among floor pebbles; some large-tier anchors still roll mega footprints).
 */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_FOOTPRINT_TILE_SPAN = 1;

/**
 * Share of large-tier rocky anchors that still become 1-tile field boulders
 * instead of mega footprints. Higher = more jumpable 1-block rocks in the field.
 */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_LARGE_TIER_OVERRIDE_UNIT_MAX = 0.72;

/**
 * Lowest absolute surface world layer for rocky 1-tile field boulders (3-layer).
 */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_SURFACE_WORLD_LAYER_MIN = 3;

/**
 * Highest absolute surface world layer for rocky 1-tile field boulders (4-layer).
 */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_SURFACE_WORLD_LAYER_MAX = 4;

/** Seed salt choosing whether a large-tier rocky anchor demotes to a field boulder. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_OVERRIDE_SEED_SALT = 503;

/**
 * Flat upward size bias applied everywhere in the rocky biome so even rim rocks
 * skew larger than ordinary scatter stones.
 */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_SIZE_TIER_BASE_BIAS = 0.1;

/**
 * Extra size bias scaled by centrality so center tiles still reach mega tier
 * often, without wiping out the compact 1-tile field boulders.
 */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_SIZE_TIER_CENTRALITY_BIAS = 0.38;

/** Flat upward footprint bias applied everywhere in the rocky biome. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_FOOTPRINT_BASE_BIAS = 0.05;

/** Extra footprint bias scaled by centrality so center boulders span widest. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_FOOTPRINT_CENTRALITY_BIAS = 0.6;

/** Extra column-height bias scaled by centrality so center boulders rise tallest. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_HEIGHT_CENTRALITY_BIAS = 0.65;

/** Grey stone palettes for pebbles and column rocks in the rocky biome. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_PALETTES: readonly DefiningWorldPlazaStonePalette[] =
  [
    { bodyColor: 0x8e949c, highlightColor: 0xb4bac2 },
    { bodyColor: 0x767d87, highlightColor: 0x9ea5af },
    { bodyColor: 0x6a7078, highlightColor: 0x939aa4 },
    { bodyColor: 0x989086, highlightColor: 0xbcb4a8 },
    { bodyColor: 0x5d636b, highlightColor: 0x878d95 },
  ];

/**
 * Grey floor shades ordered dark to light. A coherent noise field interpolates
 * across this ramp so the stone floor drifts smoothly instead of flickering
 * tile to tile. The range is intentionally gentle to avoid harsh patches.
 */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_FILL_COLORS: readonly number[] =
  [0x7f858e, 0x888e96, 0x9399a1, 0x9ea4ac, 0xa8adb5];

/** Seed for the coherent rocky floor shade noise field. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_NOISE_SEED = 9217;

/** Frequency for the rocky floor shade noise (smaller is broader patches). */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_NOISE_FREQUENCY = 1 / 12;

/** Octave count for the rocky floor shade noise. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_NOISE_OCTAVES = 3;

/** Blend toward the coherent grey shade; lower keeps more border blending. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_FLOOR_BORDER_BLEND = 0.32;
