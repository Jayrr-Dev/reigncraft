/**
 * Lightmap darkness engine tuning.
 *
 * The engine renders one screen-space darkness texture per frame and erases
 * soft radial holes at each light source, the same approach 2D games like
 * Terraria and Don't Starve use for dynamic lighting.
 *
 * @module components/world/lighting/domains/definingWorldPlazaLightingEngineConstants
 */

/** Darkness tint color (deep night blue). */
export const DEFINING_WORLD_PLAZA_LIGHTING_DARKNESS_COLOR = 0x0a1226;

/** Peak darkness alpha at deepest midnight. */
export const DEFINING_WORLD_PLAZA_LIGHTING_DARKNESS_MAX_ALPHA = 0.84;

/** Lightmap render scale; holes are soft so half resolution is invisible. */
export const DEFINING_WORLD_PLAZA_LIGHTING_LIGHTMAP_RESOLUTION_SCALE = 0.5;

/** Baked radial light texture size in pixels. */
export const DEFINING_WORLD_PLAZA_LIGHTING_RADIAL_TEXTURE_SIZE_PX = 256;

/** Base light hole radius in world-local pixels at radiusScale = 1. */
export const DEFINING_WORLD_PLAZA_LIGHTING_BASE_HOLE_RADIUS_PX = 96;

/** Player torch light footprint relative to the base hole radius. */
export const DEFINING_WORLD_PLAZA_LIGHTING_PLAYER_TORCH_RADIUS_SCALE = 0.58;

/** Stage z-index for the darkness overlay (above the camera rig). */
export const DEFINING_WORLD_PLAZA_LIGHTING_OVERLAY_STAGE_Z_INDEX = 1000;
