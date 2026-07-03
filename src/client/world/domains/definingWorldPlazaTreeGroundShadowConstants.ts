/**
 * Ground shadow styling for procedural plaza trees.
 *
 * @module components/world/domains/definingWorldPlazaTreeGroundShadowConstants
 */

/** Warm dark tint that reads on grass tiles. */
export const DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_FILL_COLOR = 0x1f3514;

/** Horizontal core radius before per-tree scale (px). */
export const DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_CORE_RADIUS_X_PX = 20;

/** Vertical core radius before per-tree scale (px); flattened for isometric ground. */
export const DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_CORE_RADIUS_Y_PX = 9;

/** Peak opacity for the innermost tree shadow layer. */
export const DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_BASE_ALPHA = 0.13;

/** Soft halo layers drawn largest first for a round contact shadow. */
export const DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_SOFT_LAYERS = [
  { radiusScale: 1.32, alphaScale: 0.24 },
  { radiusScale: 1.12, alphaScale: 0.52 },
  { radiusScale: 1, alphaScale: 1 },
] as const;

/**
 * Tile radius checked around the tree foot when sorting raised shadows above
 * coplanar terrain caps.
 */
export const DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS = 2;

/**
 * Entity-layer sort bias so the shadow draws above terrain columns on coplanar
 * tiles, but below the trunk.
 */
export const DEFINING_WORLD_PLAZA_TREE_GROUND_SHADOW_ENTITY_DEPTH_BIAS = 1 as const;
