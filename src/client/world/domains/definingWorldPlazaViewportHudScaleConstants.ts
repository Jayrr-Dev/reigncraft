/**
 * Reference viewport and clamp bounds for plaza HUD scaling.
 *
 * @module components/world/domains/definingWorldPlazaViewportHudScaleConstants
 */

/** Reference viewport width (px) where HUD controls render at authored base size. */
export const DEFINING_WORLD_PLAZA_VIEWPORT_HUD_REFERENCE_WIDTH_PX = 1280 as const;

/** Reference viewport height (px) where HUD controls render at authored base size. */
export const DEFINING_WORLD_PLAZA_VIEWPORT_HUD_REFERENCE_HEIGHT_PX = 720 as const;

/** Smallest allowed HUD scale on narrow or short viewports. */
export const DEFINING_WORLD_PLAZA_VIEWPORT_HUD_MIN_SCALE = 0.55 as const;

/** Largest allowed HUD scale on large viewports. */
export const DEFINING_WORLD_PLAZA_VIEWPORT_HUD_MAX_SCALE = 1.15 as const;
