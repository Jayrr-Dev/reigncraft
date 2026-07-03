/**
 * Visual tuning for the isometric plaza click destination marker.
 *
 * @module components/world/domains/definingWorldPlazaClickArrowEffectConstants
 */

/** How long the click marker stays visible (ms). */
export const DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_DURATION_MS = 650;

/** Base circle radius before scale animation (pixels). */
export const DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_CIRCLE_RADIUS_PX = 10;

/** Scale at the start of the shrink animation. */
export const DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_CIRCLE_START_SCALE = 1.15;

/** Scale at the end of the shrink animation. */
export const DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_CIRCLE_END_SCALE = 0.06;

/** Fill color for the shrinking circle. */
export const DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_FILL_COLOR = 0x38bdf8;

/** Fill alpha for the shrinking circle. */
export const DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_FILL_ALPHA = 0.28;

/** Stroke color outlining the shrinking circle. */
export const DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_STROKE_COLOR = 0x7dd3fc;

/** Stroke width for the circle outline (pixels). */
export const DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_STROKE_WIDTH_PX = 1;

/** z-index offset within the effects sub-layer so the marker sorts above tile depth. */
export const DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_Z_INDEX_OFFSET = 1;
