/**
 * Player ejection tuning when avatars overlap solid blocks.
 *
 * @module components/world/domains/definingWorldPlazaPlayerBlockEjectConstants
 */

/** Max Chebyshev tile rings searched for a walkable eject point. */
export const DEFINING_WORLD_PLAZA_PLAYER_BLOCK_EJECT_TILE_SEARCH_MAX_RADIUS = 8;

/** Grid-space push past a tile diamond edge after overlap resolution. */
export const DEFINING_WORLD_PLAZA_PLAYER_BLOCK_EJECT_TILE_EDGE_EXIT_EPSILON = 0.04;
