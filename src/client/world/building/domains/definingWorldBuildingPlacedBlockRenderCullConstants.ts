/**
 * Render-cull window for player-placed block Graphics columns.
 *
 * Plots load out to {@link DEFINING_WORLD_BUILDING_VIEWPORT_PLOT_SEARCH_TILE_RADIUS};
 * columns outside this smaller Chebyshev radius stay unmounted.
 *
 * @module components/world/building/domains/definingWorldBuildingPlacedBlockRenderCullConstants
 */

/** Chebyshev tile radius around the player for mounted block/shadow columns. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_RENDER_CULL_RADIUS_TILES = 18;

/** Snap step so cull bounds do not churn every avatar step. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCK_RENDER_CULL_SNAP_TILES = 4;
