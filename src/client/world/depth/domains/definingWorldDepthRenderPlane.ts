/**
 * Pixi render-plane z-index constants for the isometric plaza scene.
 *
 * @module components/world/depth/domains/definingWorldDepthRenderPlane
 */

/** Base z-index for the floor layer container. */
export const DEFINING_WORLD_DEPTH_RENDER_PLANE_FLOOR_Z_INDEX = 0;

/** z-index for the entity layer container (always above floor). */
export const DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_LAYER_Z_INDEX = 1;

/** Sub-layer z-index for avatars and interactables inside the entity layer. */
export const DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_AVATAR_SUB_LAYER_Z_INDEX = 0;

/** Sub-layer z-index so tree canopies always render above avatars. */
export const DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_CANOPY_SUB_LAYER_Z_INDEX = 1;

/** Sub-layer z-index for transient world feedback above canopies. */
export const DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_EFFECTS_SUB_LAYER_Z_INDEX = 2;
