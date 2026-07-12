/**
 * Single rarity table for plaza stones (floor pebbles + column rocks).
 *
 * Tune only these numbers when density feels wrong. Resolvers read from here
 * (or from rocky constants that mirror these values) so rates stay coherent.
 *
 * Rough rates assume stone noise is roughly uniform in [0, 1):
 * - pass rate ≈ 1 - noiseMin
 * - column anchors fire once per spacing cell (default 6×6)
 * - pebbles also need the tile modulus gate
 *
 * Target feel: world rocks stay rare finds; rocky biome is a boulder garden
 * (~60% of 6×6 anchors) with optional denser 1–3 clumps on top.
 *
 * @module components/world/domains/definingWorldPlazaStoneRarityConstants
 */

/**
 * World (non-rocky) column-rock noise bar.
 * ~28% of 6×6 anchors when noise is roughly uniform in [0, 1).
 */
export const DEFINING_WORLD_PLAZA_STONE_RARITY_WORLD_COLUMN_NOISE_MIN = 0.72;

/**
 * World (non-rocky) floor-pebble noise bar.
 * Matches the historic shared vegetation stone bar so meadows keep pebbles.
 */
export const DEFINING_WORLD_PLAZA_STONE_RARITY_WORLD_PEBBLE_NOISE_MIN = 0.72;

/**
 * Rocky open-flat column bar. Matches the historic boulder-garden density
 * (~60% of 6×6 mega anchors pass).
 */
export const DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_COLUMN_SOLITARY_NOISE_MIN = 0.4;

/**
 * Rocky cluster interior column bar. Same low bar so budgeted 1–3 slots fill.
 */
export const DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_COLUMN_CLUSTER_NOISE_MIN = 0.4;

/**
 * Rocky open-flat pebble bar (sparser than columns so pebbles sit between rocks).
 */
export const DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_PEBBLE_SOLITARY_NOISE_MIN = 0.78;

/**
 * Rocky cluster pebble bar (a few extra floor stones near denser clumps).
 */
export const DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_PEBBLE_CLUSTER_NOISE_MIN = 0.72;

/**
 * Cluster patch bar. Higher = rarer 1–3 bonus groups on top of the garden.
 * Fractal noise rarely hits the extreme top, so ~0.86 keeps groups uncommon.
 */
export const DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_NOISE_MIN = 0.86;

/**
 * Cluster cell size in tiles. Larger cells = more empty walking between groups.
 */
export const DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_CELL_TILES = 28;

/**
 * Cluster noise frequency (smaller = broader / rarer features).
 */
export const DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_CLUSTER_NOISE_FREQUENCY =
  1 / 64;

/**
 * When true, rocky column rocks spawn only inside active cluster member slots
 * (no solitary 6×6 rocks on open rocky flats). Keep false for the boulder
 * garden; true is a sparse-debug / clump-only mode.
 */
export const DEFINING_WORLD_PLAZA_STONE_RARITY_ROCKY_COLUMN_CLUSTERS_ONLY = false;
