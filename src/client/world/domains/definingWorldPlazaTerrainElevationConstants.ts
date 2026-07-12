/**
 * Procedural terrain elevation tuning for hills and mountains.
 *
 * @module components/world/domains/definingWorldPlazaTerrainElevationConstants
 */

import { DEFINING_WORLD_BUILDING_WORLD_LAYER_MAX } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { definingWorldPlazaBiomeWorldNoiseFrequency } from '@/components/world/domains/definingWorldPlazaBiomeConstants';

/** When false, every tile stays flat at layer 1 (ground floor only). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED =
  true as const;

/** Minimum surface layer (flat ground). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER = 1 as const;

/** Maximum surface layer; matches the build-mode world layer cap (32H). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MAX_LAYER =
  DEFINING_WORLD_BUILDING_WORLD_LAYER_MAX;

/** Spawn clearing radius around origin; keeps new players on flat ground. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SPAWN_CLEARING_RADIUS_GRID =
  8 as const;

/** Squared spawn clearing radius (avoids sqrt in the hot path). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SPAWN_CLEARING_RADIUS_SQUARED =
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SPAWN_CLEARING_RADIUS_GRID *
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SPAWN_CLEARING_RADIUS_GRID;

/** Surface layer at or above this reads as rolling hills. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_HILL_SURFACE_LAYER_MIN =
  3 as const;

/** Surface layer at or above this reads as rocky mountains. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MOUNTAIN_SURFACE_LAYER_MIN =
  8 as const;

/** Surface layer at or above this reads as alpine peaks. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ALPINE_SURFACE_LAYER_MIN =
  16 as const;

/** Surface layer at or above this reads as rare summit spires (near 32H cap). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_SURFACE_LAYER_MIN =
  24 as const;

/** Seed for large-scale continental height (mountain ranges). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_NOISE_SEED =
  4507 as const;

/** Frequency for continental height; smaller features span more tiles. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_NOISE_FREQUENCY =
  definingWorldPlazaBiomeWorldNoiseFrequency(180);

/** Octaves for continental height. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_NOISE_OCTAVES =
  3 as const;

/** Seed for regional hill rolls within a range. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_NOISE_SEED =
  8821 as const;

/** Frequency for regional hill rolls. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_NOISE_FREQUENCY =
  definingWorldPlazaBiomeWorldNoiseFrequency(55);

/** Octaves for regional height. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_NOISE_OCTAVES =
  4 as const;

/** Seed for local bumps and cliff detail. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_NOISE_SEED =
  3349 as const;

/** Frequency for local elevation detail. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_NOISE_FREQUENCY =
  definingWorldPlazaBiomeWorldNoiseFrequency(18);

/** Octaves for detail height. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_NOISE_OCTAVES =
  3 as const;

/** Seed for ridge sharpening on peaks. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_NOISE_SEED =
  6103 as const;

/** Frequency for ridge sharpening. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_NOISE_FREQUENCY =
  definingWorldPlazaBiomeWorldNoiseFrequency(90);

/** Octaves for ridge noise. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_NOISE_OCTAVES =
  2 as const;

/** Continental noise below this stays flat. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_FLAT_MAX =
  0.42 as const;

/** Weight of continental noise in the final height blend. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_BLEND_WEIGHT =
  0.55 as const;

/** Weight of regional noise in the final height blend. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_BLEND_WEIGHT =
  0.28 as const;

/** Weight of detail noise in the final height blend. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_BLEND_WEIGHT =
  0.12 as const;

/** Weight of ridge noise in the final height blend. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_BLEND_WEIGHT =
  0.05 as const;

/** Exponent below 1 pushes more tiles into mid/high elevation (wider vertical spread). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_HEIGHT_CURVE_EXPONENT =
  0.72 as const;

/** Continental noise above this may receive extra peak boost. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_CONTINENTAL_MIN =
  0.68 as const;

/** Seed for peak boost noise (sparse ultra-high mountain cores). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_NOISE_SEED =
  5183 as const;

/** Frequency for peak boost (large mountain massifs). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_NOISE_FREQUENCY =
  definingWorldPlazaBiomeWorldNoiseFrequency(120);

/** Octaves for peak boost noise. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_NOISE_OCTAVES =
  2 as const;

/** Peak boost weight applied on top of the base blend inside high continents. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_BLEND_WEIGHT =
  0.38 as const;

/**
 * Quantized surface layers used after sculpting (creates sharp walk/jump steps).
 * Low tiers: 2 = 1H step, 3 = 2H jump, 5 = 4H max jump.
 * High tiers step by 4H so chained jumps can climb toward the 32H cap.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PLAY_TIER_SURFACE_LAYERS = [
  1, 2, 3, 5, 8, 12, 16, 20, 24, 28, 32,
] as const;

/** Surface layer for a 2H jump obstacle from flat ground (layer 1). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_JUMP_TWO_BLOCK_SURFACE_LAYER =
  3 as const;

/** Surface layer for a 4H max-jump ledge from flat ground (layer 1). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_JUMP_FOUR_BLOCK_SURFACE_LAYER =
  5 as const;

/** Step-bump noise only applies on tiles at or below this layer. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_MAX_BASE_LAYER =
  2 as const;

/** Seed for scattered 2H jump bump features. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_SEED =
  7711 as const;

/** Frequency for 2H jump bumps (small localized pillars). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_FREQUENCY =
  1 / 14;

/** Octaves for step-bump noise. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_OCTAVES =
  2 as const;

/** Step-bump noise above this spawns a 2H jump block. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_STEP_BUMP_NOISE_THRESHOLD =
  0.82 as const;

/** Seed for 4H max-jump ledge shelves. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_SEED =
  6199 as const;

/** Frequency for jump ledges (mesas and cliff bands). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_FREQUENCY =
  1 / 38;

/** Octaves for ledge noise. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_OCTAVES =
  3 as const;

/** Ledge noise above this snaps mid tiles to the 4H jump layer. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_LEDGE_NOISE_THRESHOLD =
  0.76 as const;

/**
 * Surface layers for impassable barriers from flat ground (L1).
 * L5 is max-jump only; L6–L8 block direct passage and require a detour.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_SURFACE_LAYERS =
  [5, 6, 7, 8] as const;

/** Impasse barriers only replace tiles at or below this base layer. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_MAX_BASE_LAYER =
  3 as const;

/** Seed for long impassable cliff bands and ring walls. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_SEED =
  3847 as const;

/** Frequency for impassable barrier ridges (wide wall lines). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_FREQUENCY =
  1 / 34;

/** Octaves for impassable barrier noise. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_OCTAVES =
  3 as const;

/** Barrier noise above this raises low tiles into L5–L8 walls. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BARRIER_NOISE_THRESHOLD =
  0.79 as const;

/** Seed for rare breach gaps through impassable barrier lines. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_SEED =
  2953 as const;

/** Frequency for barrier breach gaps (small doorways). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_FREQUENCY =
  1 / 11;

/** Octaves for breach gap noise. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_OCTAVES =
  2 as const;

/** Breach noise above this keeps a barrier tile at walkable height (L2). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_NOISE_THRESHOLD =
  0.91 as const;

/** Walkable layer carved into a barrier line when a breach gap spawns. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_IMPASSE_BREACH_SURFACE_LAYER =
  2 as const;

/** Seed for enclosed pocket regions surrounded by impassable walls. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_SEED =
  6731 as const;

/** Frequency for enclave pocket blobs. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_FREQUENCY =
  1 / 52;

/** Octaves for enclave pocket noise. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_OCTAVES =
  3 as const;

/** Enclave noise above this starts a walled pocket feature. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_NOISE_THRESHOLD =
  0.71 as const;

/** Inner enclave core above this becomes a walkable mesa (L3). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_INTERIOR_NOISE_MIN =
  0.86 as const;

/** Enclave rim above this but below interior becomes a max-jump entry shelf (L5). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_RIM_NOISE_MIN =
  0.78 as const;

/** Walkable mesa height inside a walled enclave. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_INTERIOR_SURFACE_LAYER =
  3 as const;

/** Entry shelf around an enclave interior (requires max jump from outside). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ENCLAVE_RIM_SURFACE_LAYER =
  5 as const;

/** Seed for chasm trenches carved through plateaus. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_SEED =
  9029 as const;

/** Frequency for chasm trenches (narrow bands for run jumps). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_FREQUENCY =
  1 / 24;

/** Octaves for chasm noise. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_OCTAVES =
  2 as const;

/** Chasm noise above this drops a high tile to ground (run-jump gap). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_NOISE_THRESHOLD =
  0.8 as const;

/** Only plateau tiles at or above this layer can be carved into chasms. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CHASM_MIN_PLATEAU_LAYER =
  8 as const;

/** Summit sculpt only applies on tiles already at or above this layer. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_MIN_BASE_LAYER =
  10 as const;

/** Seed for summit spire sculpting (rare 24H–32H pillars). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_SEED =
  4411 as const;

/** Frequency for summit spires (localized ultra-high peaks). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_FREQUENCY =
  1 / 48;

/** Octaves for summit noise. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_OCTAVES =
  3 as const;

/** Summit noise above this pushes terrain into the high play tiers (16H+). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_NOISE_THRESHOLD =
  0.74 as const;

/** High summit tiers assigned from strongest summit noise samples. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_HIGH_TIER_SURFACE_LAYERS =
  [16, 20, 24, 28, 32] as const;

/** Altitude factor required before step bumps and jump ledges may spawn. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_OBSTACLE_MIN_ALTITUDE_FACTOR =
  0.22 as const;

/** Altitude factor required before impassable walls and enclave pockets spawn. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_BARRIER_MIN_ALTITUDE_FACTOR =
  0.32 as const;

/** Altitude factor required before summit spire sculpting runs. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_SUMMIT_MIN_ALTITUDE_FACTOR =
  0.42 as const;

/** Raises step-bump and ledge thresholds in low-altitude biomes to keep ground flat. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SCULPT_OBSTACLE_THRESHOLD_ALTITUDE_DAMPING =
  0.2 as const;

/**
 * Extra tile ring kept around the visible nearest-N set before a built column
 * is destroyed.
 *
 * Directional prefetch wobbles the bounds window by several tiles as the
 * smoothed movement direction changes. Combined with the profile
 * `maxVisibleElevationColumns` cap, this small hysteresis avoids destroy/rebuild
 * thrash at the sliding edge of the nearest-N set while walking.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_RETENTION_MARGIN_TILES =
  8 as const;

/** Max stale elevation columns destroyed per sync call (spreads GC load). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_PRUNE_BUDGET_PER_CALL =
  24 as const;

/**
 * Default nearest-player elevation column cap when a profile omits one.
 * Dense hills can expose 1000+ raised tiles in the isometric window.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_MAX_VISIBLE_DEFAULT =
  320 as const;

/** Side fill color for dirt strata on hills. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_HILL_SIDE_FILL_COLOR =
  0x7a6844 as const;

/** Side fill color for stone strata on mountains. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MOUNTAIN_SIDE_FILL_COLOR =
  0x5a6068 as const;

/** Side fill color for alpine strata. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ALPINE_SIDE_FILL_COLOR =
  0x8a9aaa as const;

/** Side fill color for summit spires (lighter snow-rock). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_SIDE_FILL_COLOR =
  0xb8c4d0 as const;

/** Side brightness adjustment on the lowest procedural columns (layer 2). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_BRIGHTNESS_ADJUSTMENT_AT_MIN_ELEVATION =
  -0.16 as const;

/** Side brightness adjustment on the tallest columns (32H cap). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_BRIGHTNESS_ADJUSTMENT_AT_MAX_ELEVATION =
  0.22 as const;

/** Weight of within-column height when blending side brightness (base = darker). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_COLUMN_DEPTH_BLEND_WEIGHT =
  0.62 as const;

/** Weight of absolute surface layer when blending side brightness (summits = brighter). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_ABSOLUTE_ELEVATION_BLEND_WEIGHT =
  0.38 as const;

/** Max vertical bands drawn on one terrain column for a depth gradient. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_DEPTH_BAND_MAX_COUNT =
  6 as const;

/** Target world layers per side depth band before capping at max band count. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_DEPTH_BAND_LAYER_SPAN =
  4 as const;

/** Side face fill alpha for procedural terrain columns. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_SIDE_FILL_ALPHA =
  1 as const;

/** Thin black outline on exposed cliff rims and vertical drops. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_EXPOSED_CLIFF_EDGE_STROKE_COLOR =
  0x000000 as const;

/** Stroke width for exposed cliff edge outlines. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_EXPOSED_CLIFF_EDGE_STROKE_WIDTH_PX =
  1 as const;

/** Stroke alpha for exposed cliff edge outlines. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_EXPOSED_CLIFF_EDGE_STROKE_ALPHA =
  1 as const;

/** Stroke color for elevation column edges (unused while alpha is 0). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_STROKE_COLOR =
  0x2a2418 as const;

/** Procedural terrain skips full cap strokes; exposed cliff edges draw separately. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_STROKE_ALPHA =
  0 as const;

/**
 * Render-only depth-sort bias added to a terrain column's entity z-index.
 *
 * Negative values let the drawn column yield so entities sitting just north of
 * it stop getting clipped by its silhouette. This is applied ONLY to the column
 * graphics layer, not to the avatar ground-shadow occluder query, so shadow
 * occlusion stays stable while this value is tuned. One full tile row south is
 * roughly +160 z and the avatar's own-tile bias is +80, so keep nudges small
 * (single or low double digits). Start at 0, then try -8 or -16 if needed.
 */
export { DEFINING_WORLD_DEPTH_TERRAIN_ELEVATION_COLUMN_RENDER_DEPTH_BIAS as DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_RENDER_DEPTH_BIAS } from '@/components/world/depth';
