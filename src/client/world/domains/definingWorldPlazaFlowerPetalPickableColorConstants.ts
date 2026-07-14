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
