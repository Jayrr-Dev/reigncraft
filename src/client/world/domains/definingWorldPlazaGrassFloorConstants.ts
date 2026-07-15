/**
 * Grass floor rendering constants.
 *
 * @module components/world/domains/definingWorldPlazaGrassFloorConstants
 */

/**
 * Extra screen-space reach for floor fills.
 *
 * Adjacent diamonds can land on different device-pixel boundaries after camera
 * scaling, especially when they belong to separate chunk Graphics objects.
 * Slight overlap keeps the transparent canvas from showing the biome backdrop
 * as dotted diagonal seams.
 */
export const DEFINING_WORLD_PLAZA_GRASS_FLOOR_FILL_BLEED_PX = 0.75;

/** Primary plains grass color (matches {@link definingWorldPlazaBiomeConstants}.plains). */
export const DEFINING_WORLD_PLAZA_GRASS_TILE_COLOR_A = 0x7cba3d;

/** Secondary plains grass color (uniform biomes no longer alternate tiles). */
export const DEFINING_WORLD_PLAZA_GRASS_TILE_COLOR_B = 0x7cba3d;

/** Legacy accent color; biomes now use uniform fills. */
export const DEFINING_WORLD_PLAZA_GRASS_TILE_COLOR_ACCENT = 0x7cba3d;

/** Legacy accent modulus; unused by biome floor rendering. */
export const DEFINING_WORLD_PLAZA_GRASS_TILE_ACCENT_MODULUS = 7;
