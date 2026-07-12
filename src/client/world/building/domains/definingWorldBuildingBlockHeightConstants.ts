/**
 * Block extrusion height (H) and player vertical clearance constants.
 *
 * Layer (L) is the top anchor of a placed block. Block height (H) is how many
 * world layers the 3D column extends downward from that anchor. H = 0 is a flat
 * passable tile with no vertical collision volume.
 *
 * @module components/world/building/domains/definingWorldBuildingBlockHeightConstants
 */

/** Vertical extent of the player avatar in world layers (visual / lava hide). */
export const DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS = 4;

/**
 * Feet-only vertical band for walk/push collision against placed blocks and
 * terrain columns. Elevated roofs (bottom above the standing layer) stay
 * walkable underneath so players can build ceilings.
 */
export const DEFINING_WORLD_PLAZA_PLAYER_WALK_COLLISION_HEIGHT_WORLD_LAYERS = 1;

/** Flat passable tile height (no extrusion, no collision). */
export const DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE = 0;

/**
 * Sentinel stored while the tower preset is selected. Resolves to the active
 * world layer height at preview and placement time.
 */
export const DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TOWER_RELATIVE = -1;

/** Default block extrusion height when placing new blocks. */
export const DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT = 1;

/** Minimum block extrusion height in layers (0 = passable tile). */
export const DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_MIN =
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE;

/** Maximum block extrusion height in layers. */
export const DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_MAX = 32;

/** Metadata key persisted on placed blocks for extrusion height. */
export const DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_METADATA_KEY =
  'blockHeight' as const;

/** Closed layer band occupied in world layer space. */
export interface DefiningWorldBuildingWorldLayerBand {
  readonly bottomLayer: number;
  readonly topLayer: number;
}

/**
 * Clamps block height into the supported build range.
 *
 * @param candidateBlockHeight - Raw height from UI or persistence.
 * @param topWorldLayer - Optional top anchor used to cap height above ground.
 */
/**
 * Returns true when the stored height is the tower layer-relative sentinel.
 *
 * @param blockHeight - Raw or resolved block height from build mode state.
 */
export function checkingWorldBuildingBlockHeightIsTowerRelative(
  blockHeight: number
): boolean {
  return blockHeight === DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TOWER_RELATIVE;
}

/**
 * Resolves tower-relative height to the active world layer; other heights clamp normally.
 *
 * @param blockHeight - Stored build-mode height, including tower sentinel.
 * @param topWorldLayer - Layer used to resolve tower height (usually sidebar L).
 */
export function resolvingWorldBuildingEffectiveBlockHeight(
  blockHeight: number,
  topWorldLayer: number
): number {
  if (checkingWorldBuildingBlockHeightIsTowerRelative(blockHeight)) {
    return clampingWorldBuildingBlockHeight(topWorldLayer, topWorldLayer);
  }

  return clampingWorldBuildingBlockHeight(blockHeight, topWorldLayer);
}

export function clampingWorldBuildingBlockHeight(
  candidateBlockHeight: number,
  topWorldLayer?: number
): number {
  if (checkingWorldBuildingBlockHeightIsTowerRelative(candidateBlockHeight)) {
    if (topWorldLayer === undefined) {
      return DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TOWER_RELATIVE;
    }

    return clampingWorldBuildingBlockHeight(topWorldLayer, topWorldLayer);
  }

  const clampedHeight = Math.min(
    DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_MAX,
    Math.max(
      DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_MIN,
      Math.floor(candidateBlockHeight)
    )
  );

  if (topWorldLayer === undefined) {
    return clampedHeight;
  }

  if (clampedHeight === DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE) {
    return DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE;
  }

  return Math.min(clampedHeight, Math.max(1, Math.floor(topWorldLayer)));
}

/**
 * Returns true when a placement uses flat tile mode (0H, always passable).
 *
 * @param blockHeightLayers - Block extrusion height (H).
 */
export function checkingWorldBuildingPlacedBlockIsPassableTile(
  blockHeightLayers: number
): boolean {
  return (
    clampingWorldBuildingBlockHeight(blockHeightLayers) ===
    DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE
  );
}

/**
 * Returns true when a placement should block the player vertically.
 *
 * @param blockHeightLayers - Block extrusion height (H).
 */
export function checkingWorldBuildingPlacedBlockBlockHeightBlocksPlayer(
  blockHeightLayers: number
): boolean {
  return !checkingWorldBuildingPlacedBlockIsPassableTile(blockHeightLayers);
}
