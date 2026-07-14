/**
 * Constants for fleeing environmental heat toward cooler ground.
 *
 * @module components/world/wildlife/domains/definingWildlifeHeatFleeConstants
 */

/** How far heat-flee legs prefer to run (grid). */
export const DEFINING_WILDLIFE_HEAT_FLEE_DISTANCE_GRID = 8;

/** Directions sampled when scoring cooler headings. */
export const DEFINING_WILDLIFE_HEAT_FLEE_DIRECTION_COUNT = 16;

/** Step size when probing cooler tiles along a heading (grid). */
export const DEFINING_WILDLIFE_HEAT_FLEE_SCAN_STEP_GRID = 1;

/**
 * Keep a heat flee going until temperature drops this many °C below the
 * species comfort high, so animals do not stop on the damage edge.
 */
export const DEFINING_WILDLIFE_HEAT_FLEE_EXIT_MARGIN_CELSIUS = 2;

/** Minimum °C drop vs current tile to count a candidate as cooler. */
export const DEFINING_WILDLIFE_HEAT_FLEE_MIN_COOLER_DELTA_CELSIUS = 0.5;
