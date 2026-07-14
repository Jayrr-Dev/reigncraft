/**
 * Tunables for which biome flower petal colors can be picked.
 *
 * Green foliage tones stay decorative only. White / near-white petals are pickable.
 * Dull mid-greys are not.
 *
 * @module components/world/domains/definingWorldPlazaFlowerPetalPickableColorConstants
 */

/** Minimum HSV saturation for chromatic petals (non-white). */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_MIN_SATURATION = 0.2;

/**
 * Brightness (HSV value) at or above which low-saturation petals count as white
 * and stay pickable.
 */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_WHITE_MIN_VALUE = 0.82;

/**
 * Inclusive HSV hue band (degrees 0–360) treated as green foliage, not petals.
 * Yellow sits below this band; teal / blue sit above.
 */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MIN_DEG = 65;

/** Inclusive upper bound of the green foliage hue band. */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MAX_DEG = 155;

/** Petal fill radius on the tile surface (px). Larger than grass specks. */
export const DEFINING_WORLD_PLAZA_FLOWER_SURFACE_DOT_RADIUS_PX = 3.6;

/** Dark outline radius under petals so colors read on green / sand / snow. */
export const DEFINING_WORLD_PLAZA_FLOWER_SURFACE_OUTLINE_RADIUS_PX = 4.5;

/** Outline fill behind petal dots. */
export const DEFINING_WORLD_PLAZA_FLOWER_SURFACE_OUTLINE_COLOR = 0x1c2a18;
