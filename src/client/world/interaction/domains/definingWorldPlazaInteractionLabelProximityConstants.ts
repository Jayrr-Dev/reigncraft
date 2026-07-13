/**
 * How close the player must be for interaction labels (Light, Chop, Mine, …)
 * to appear without a prior click.
 *
 * Floor-tile Chebyshev: radius 1 = player tile + 8 neighbors. Measured with
 * floored player coords so the far edge of a neighbor tile still counts.
 */
export const DEFINING_WORLD_PLAZA_INTERACTION_LABEL_PROXIMITY_RADIUS_TILES = 1;
