import type { DefiningWorldPlazaStonePalette } from "@/components/world/domains/definingWorldPlazaStoneDecorationConstants";

/**
 * Procedural terrain tuning for the rocky biome.
 *
 * @module components/world/domains/definingWorldPlazaRockyBiomeConstants
 */

/** Stable biome kind id for the rocky biome. */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_KIND = "rocky" as const;

/**
 * Low stone-noise bar so the rocky field reads as a dense boulder garden rather
 * than a few scattered rocks. Most spacing anchors and pebble tiles qualify.
 */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN = 0.4;

/**
 * Flat upward size bias applied everywhere in the rocky biome so even rim rocks
 * skew larger than ordinary scatter stones.
 */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_SIZE_TIER_BASE_BIAS = 0.1;

/**
 * Extra size bias scaled by centrality so center tiles reliably reach the
 * largest mega-boulder tier while the rim keeps smaller, varied rocks.
 */
export const DEFINING_WORLD_PLAZA_ROCKY_BIOME_SIZE_TIER_CENTRALITY_BIAS = 0.55;

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
