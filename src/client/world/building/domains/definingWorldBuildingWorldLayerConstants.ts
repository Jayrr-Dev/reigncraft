/**
 * Vertical world layers for 3D-ish plaza building.
 *
 * Layer numbers are absolute heights on each tile (1 = ground, up to 32 in build
 * mode). Movement and collision rules compare those heights **relative to the
 * player's current layer**:
 *
 * - Walk up one layer (+1)
 * - Jump up to four layers (+1 through +4)
 * - Horizontal block when a collider is two or more layers above the player
 *
 * @module components/world/building/domains/definingWorldBuildingWorldLayerConstants
 */

/** Screen pixels added per world layer above ground. */
export const DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX = 8;

/** Ground layer; default walkable floor height. */
export const DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND = 1;

/** Layer delta the player can walk up in one step from their current layer. */
export const DEFINING_WORLD_BUILDING_WORLD_LAYER_WALK_STEP_LAYER_DELTA = 1;

/** Maximum layer delta the player can ascend in a single jump. */
export const DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX = 4;

/**
 * Minimum layer delta above the player before a block uses wall-style
 * horizontal collision instead of a single walk step.
 */
export const DEFINING_WORLD_BUILDING_WORLD_LAYER_WALL_COLLISION_MIN_LAYER_DELTA = 2;

/** Minimum selectable build layer in the UI. Same as ground. */
export const DEFINING_WORLD_BUILDING_WORLD_LAYER_MIN = 1;

/** Maximum selectable build layer in the UI. */
export const DEFINING_WORLD_BUILDING_WORLD_LAYER_MAX = 32;

/** Default layer selected when build mode opens. */
export const DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT =
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;

/** Metadata key persisted on placed blocks before `world_layer` column backfill. */
export const DEFINING_WORLD_BUILDING_WORLD_LAYER_METADATA_KEY = "worldLayer" as const;

/** One-based world layer index stored on placed blocks. */
export type DefiningWorldBuildingWorldLayer = number;

/**
 * Clamps a candidate layer into the supported build range.
 *
 * @param candidateLayer - Raw layer value from UI or persistence.
 */
export function clampingWorldBuildingWorldLayer(
  candidateLayer: number,
): DefiningWorldBuildingWorldLayer {
  return Math.min(
    DEFINING_WORLD_BUILDING_WORLD_LAYER_MAX,
    Math.max(DEFINING_WORLD_BUILDING_WORLD_LAYER_MIN, Math.floor(candidateLayer)),
  );
}

/**
 * Returns true when the destination is exactly one walk step above the player.
 *
 * @param fromLayer - Current standing layer.
 * @param toLayer - Destination surface layer.
 */
export function checkingWorldBuildingWorldLayerIsOneWalkStepAbovePlayer(
  fromLayer: number,
  toLayer: number,
): boolean {
  return (
    toLayer - fromLayer ===
    DEFINING_WORLD_BUILDING_WORLD_LAYER_WALK_STEP_LAYER_DELTA
  );
}

/**
 * Returns true when an upward layer change is within a single jump's reach.
 *
 * @param fromLayer - Current standing layer.
 * @param toLayer - Destination surface layer.
 */
export function checkingWorldBuildingWorldLayerIsWithinJumpHeight(
  fromLayer: number,
  toLayer: number,
): boolean {
  const layerDelta = toLayer - fromLayer;

  return (
    layerDelta > 0 &&
    layerDelta <= DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX
  );
}

/**
 * Returns true when a block should use wall-style horizontal collision for the
 * player based on height above the player's current layer.
 *
 * @param blockLayer - Block world layer.
 * @param playerLayer - Current player standing layer.
 */
export function checkingWorldBuildingWorldLayerActsAsWallForPlayer(
  blockLayer: number,
  playerLayer: number,
): boolean {
  return (
    blockLayer - playerLayer >=
    DEFINING_WORLD_BUILDING_WORLD_LAYER_WALL_COLLISION_MIN_LAYER_DELTA
  );
}
