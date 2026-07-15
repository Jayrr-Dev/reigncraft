/**
 * Player-facing copy when block / craft placement is rejected.
 *
 * @module components/world/building/domains/definingWorldBuildingPlacementBlockedMessageConstants
 */

/** Multi-tile footprint overlaps an existing block (bloomery, anvil, wall, …). */
export const LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_OCCUPIED =
  'That 2×2 overlaps another build. Move to empty claimed tiles.' as const;

/** Multi-tile footprint includes tiles the player does not own. */
export const LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_UNCLAIMED =
  'Need a clear 2×2 on land you own.' as const;

/** Multi-tile footprint fails for plot block-cap reasons. */
export const LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_PLOT_LIMIT =
  'That claim is full. Clear a tile or claim more land.' as const;

/** Generic multi-tile rejection. */
export const LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_FOOTPRINT_GENERIC =
  'Need a clear 2×2 pad on your claim for that build.' as const;

/** Single-tile already has a block on the target layer. */
export const LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_OCCUPIED =
  'That tile already has a build.' as const;

/** Single-tile is outside owned claims. */
export const LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_UNCLAIMED =
  'Claim land before building here.' as const;

/** Single-tile plot reached its block cap. */
export const LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_PLOT_LIMIT =
  'This plot has reached its block limit.' as const;

/** Generic single-tile rejection. */
export const LABELING_WORLD_BUILDING_PLACEMENT_BLOCKED_TILE_GENERIC =
  'Cannot place here.' as const;
