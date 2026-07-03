/**
 * Sandy shoreline blocks where land meets open ocean.
 *
 * @module components/world/domains/definingWorldPlazaOceanShoreConstants
 */

/** Maximum Chebyshev distance searched for nearby ocean tiles. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_SEARCH_RADIUS_BLOCKS = 12;

/** Minimum sandy beach width in tiles along the ocean edge. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_MIN_WIDTH_BLOCKS = 4;

/** Maximum sandy beach width in tiles along the ocean edge. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_MAX_WIDTH_BLOCKS = 12;

/** Seed for low-frequency beach-width variation around each coastline. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_WIDTH_NOISE_SEED = 7411;

/** Frequency for beach-width noise; lower values yield longer sandy runs. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_WIDTH_NOISE_FREQUENCY = 1 / 18;

/** Octaves for beach-width noise. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_WIDTH_NOISE_OCTAVES = 2;

/** Wet sand directly beside open ocean water. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_WET_SAND_FILL_COLOR = 0xe8d89a;

/** Dry beach sand one step back from the waterline. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_SAND_FILL_COLOR = 0xf2e9a7;

/** Sandy clay transition tone. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_SANDY_CLAY_FILL_COLOR = 0xd4c47a;

/** Compact clay a few blocks inland. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_CLAY_FILL_COLOR = 0xc4a878;

/** Darker clay pebble accent on outer beach tiles. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_CLAY_ACCENT_COLOR = 0xb8956a;

/** Speck color for subtle sandy texture on beach blocks. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_SPECK_COLOR = 0xe6d88a;

/** Modulus for beach speck placement. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_SPECK_TILE_MODULUS = 5;

/** Highlight on the sun-facing top of beach blocks. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_BLOCK_HIGHLIGHT_COLOR = 0xfaf3c0;

/** Modulus for beach block face highlights. */
export const DEFINING_WORLD_PLAZA_OCEAN_SHORE_BLOCK_HIGHLIGHT_TILE_MODULUS = 4;
