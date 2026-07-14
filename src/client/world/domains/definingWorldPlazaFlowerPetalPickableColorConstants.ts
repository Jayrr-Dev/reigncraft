/**
 * Tunables for which biome flower petal colors can be picked.
 *
 * Green and low-saturation (grey / white) dots stay decorative only.
 *
 * @module components/world/domains/definingWorldPlazaFlowerPetalPickableColorConstants
 */

/** Minimum HSV saturation for a petal color to count as pickable. */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_MIN_SATURATION = 0.2;

/**
 * Inclusive HSV hue band (degrees 0–360) treated as green foliage, not petals.
 * Yellow sits below this band; teal / blue sit above.
 */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MIN_DEG = 65;

/** Inclusive upper bound of the green foliage hue band. */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_PICKABLE_GREEN_HUE_MAX_DEG = 155;
