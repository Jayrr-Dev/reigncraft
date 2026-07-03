/**
 * Player collision footprint tuning for plaza movement.
 *
 * The avatar is modeled as an upright cylinder: a circular footprint in the
 * ground plane (this radius) extruded across its world-layer height band. All
 * horizontal collision (walls, trees, rocks, chests) resolves against this
 * single radius so the debug hitbox and the physics agree.
 *
 * @module components/world/domains/definingWorldPlazaPlayerCollisionConstants
 */

/**
 * Player footprint radius in grid tiles (1 tile = 1 grid unit).
 *
 * Set to 0 to restore legacy point collision. A quarter tile keeps the avatar
 * clear of walls and obstacles while still fitting one-tile-wide gaps.
 */
export const DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID = 0.25;
