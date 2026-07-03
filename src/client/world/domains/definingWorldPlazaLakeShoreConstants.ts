/**
 * Sandy and clay shoreline blocks around lake bodies.
 *
 * @module components/world/domains/definingWorldPlazaLakeShoreConstants
 */

/** Maximum Chebyshev distance searched for nearby lake tiles. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_SEARCH_RADIUS_BLOCKS = 5;

/** Minimum shore ring width in tiles (touching the lake). */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_MIN_WIDTH_BLOCKS = 1;

/** When false, land beside lakes keeps normal biome grass. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_ENABLED = false;

/** Maximum shore ring width in tiles along the lake edge. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_MAX_WIDTH_BLOCKS = 5;

/** Seed for low-frequency shore-width variation around each lake. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_WIDTH_NOISE_SEED = 6311;

/** Frequency for shore-width variation; lower values yield longer sandy runs. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_WIDTH_NOISE_FREQUENCY = 1 / 14;

/** Octaves for shore-width noise. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_WIDTH_NOISE_OCTAVES = 2;

/** Wet sand directly beside open water. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_WET_SAND_FILL_COLOR = 0xe8d89a;

/** Dry beach sand one step back from the waterline. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_SAND_FILL_COLOR = 0xf2e9a7;

/** Sandy clay transition tone. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_SANDY_CLAY_FILL_COLOR = 0xd4c47a;

/** Compact clay a few blocks inland. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_CLAY_FILL_COLOR = 0xc4a878;

/** Darker clay pebble accent on outer shore tiles. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_CLAY_ACCENT_COLOR = 0xb8956a;

/** Speck color for subtle sandy texture on shore blocks. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_SPECK_COLOR = 0xe6d88a;

/** Modulus for shore speck placement. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_SPECK_TILE_MODULUS = 5;

/** Highlight on the sun-facing top of shore blocks. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_BLOCK_HIGHLIGHT_COLOR = 0xfaf3c0;

/** Modulus for shore block face highlights. */
export const DEFINING_WORLD_PLAZA_LAKE_SHORE_BLOCK_HIGHLIGHT_TILE_MODULUS = 4;

/**
 * Pond shores are a thin 0-1 block sand or dirt ring. A seeded coverage gate
 * leaves some pond edges bare so the border averages under one tile deep.
 */
export const DEFINING_WORLD_PLAZA_POND_SHORE_ENABLED = false;

/** Chebyshev search radius for adjacent pond tiles when resolving shore blocks. */
export const DEFINING_WORLD_PLAZA_POND_SHORE_SEARCH_RADIUS_BLOCKS = 1;

/** Seed salt for the per-tile pond shore coverage gate. */
export const DEFINING_WORLD_PLAZA_POND_SHORE_COVERAGE_SEED_SALT = 4517;

/** Seeded unit at or above which a pond-edge tile becomes a shore block. */
export const DEFINING_WORLD_PLAZA_POND_SHORE_COVERAGE_THRESHOLD = 0.5;

/** Sandy dirt tone for the thin ring around a normal pond. */
export const DEFINING_WORLD_PLAZA_POND_SHORE_SAND_FILL_COLOR = 0xcdb988;

/** Muddy dirt tone for the thin ring around a swamp pond. */
export const DEFINING_WORLD_PLAZA_SWAMP_POND_SHORE_MUD_FILL_COLOR = 0x5a5238;
