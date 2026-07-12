import {
  checkingWorldBuildingPlacedBlockIsPassableTile,
  clampingWorldBuildingBlockHeight,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_METADATA_KEY,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
  DEFINING_WORLD_PLAZA_PLAYER_WALK_COLLISION_HEIGHT_WORLD_LAYERS,
  type DefiningWorldBuildingWorldLayerBand,
} from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  clampingWorldBuildingWorldLayer,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
} from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';

/**
 * Layer bands for placed blocks and the player avatar.
 *
 * @module components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand
 */

/**
 * Returns the inclusive world-layer band occupied by a placed block column.
 *
 * @param topWorldLayer - Top anchor layer (L) of the block.
 * @param blockHeightLayers - Downward extrusion height (H) in layers.
 */
export function computingWorldBuildingPlacedBlockOccupiedLayerBand(
  topWorldLayer: number,
  blockHeightLayers: number
): DefiningWorldBuildingWorldLayerBand {
  const topLayer = clampingWorldBuildingWorldLayer(topWorldLayer);
  const blockHeight = clampingWorldBuildingBlockHeight(
    blockHeightLayers,
    topLayer
  );

  if (checkingWorldBuildingPlacedBlockIsPassableTile(blockHeight)) {
    return {
      bottomLayer: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      topLayer: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE - 1,
    };
  }

  return {
    bottomLayer: topLayer - blockHeight + 1,
    topLayer,
  };
}

/**
 * Returns true when block extrusion (H) fits within the top anchor layer (L)
 * without extending below ground.
 *
 * Passable tiles (0H) always fit. Extruded blocks require
 * {@code bottomLayer >= ground} which is equivalent to {@code H <= L}.
 *
 * @param topWorldLayer - Top anchor layer (L).
 * @param blockHeightLayers - Downward extrusion height (H).
 */
export function checkingWorldBuildingBlockPlacementExtrusionFitsTopLayer(
  topWorldLayer: number,
  blockHeightLayers: number
): boolean {
  if (checkingWorldBuildingPlacedBlockIsPassableTile(blockHeightLayers)) {
    return true;
  }

  const topLayer = clampingWorldBuildingWorldLayer(topWorldLayer);
  const requestedHeight = Math.floor(blockHeightLayers);

  if (requestedHeight < 1) {
    return false;
  }

  if (requestedHeight > topLayer) {
    return false;
  }

  const occupiedBand = computingWorldBuildingPlacedBlockOccupiedLayerBand(
    topLayer,
    requestedHeight
  );

  return occupiedBand.bottomLayer >= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
}

/**
 * Resolves the lowest world layer reached by one extruded block column.
 *
 * @param topWorldLayer - Top anchor layer (L).
 * @param blockHeightLayers - Downward extrusion height (H).
 */
export function resolvingWorldBuildingPlacedBlockExtrusionBottomLayer(
  topWorldLayer: number,
  blockHeightLayers: number
): number {
  return computingWorldBuildingPlacedBlockOccupiedLayerBand(
    topWorldLayer,
    blockHeightLayers
  ).bottomLayer;
}

/**
 * Returns the highest world layer occupied by one placed block column.
 *
 * Uses the top-anchor band when the stored height fits the anchor layer. When
 * metadata height exceeds the anchor (legacy bottom-anchor rows), the occupied
 * top is computed as anchor + height - 1.
 *
 * @param block - Placed block entity.
 */
export function resolvingWorldBuildingPlacedBlockTopWorldLayer(
  block: DefiningWorldBuildingPlacedBlock
): number {
  const topWorldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const metadataBlockHeight =
    block.metadata[DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_METADATA_KEY];
  const requestedBlockHeight =
    typeof metadataBlockHeight === 'number'
      ? Math.floor(metadataBlockHeight)
      : block.blockHeight;

  if (checkingWorldBuildingPlacedBlockIsPassableTile(requestedBlockHeight)) {
    return topWorldLayer;
  }

  if (requestedBlockHeight > 1 && requestedBlockHeight > topWorldLayer) {
    return clampingWorldBuildingWorldLayer(
      topWorldLayer + requestedBlockHeight - 1
    );
  }

  return computingWorldBuildingPlacedBlockOccupiedLayerBand(
    topWorldLayer,
    requestedBlockHeight
  ).topLayer;
}

/** Extrusion draw params normalized from a placed block row. */
export interface ResolvingWorldBuildingPlacedBlockExtrusionRenderParams {
  readonly topWorldLayer: number;
  readonly blockHeightLayers: number;
}

/**
 * Resolves the anchor layer and height used when drawing an extruded column.
 *
 * @param block - Placed block entity.
 */
export function resolvingWorldBuildingPlacedBlockExtrusionRenderParams(
  block: DefiningWorldBuildingPlacedBlock
): ResolvingWorldBuildingPlacedBlockExtrusionRenderParams {
  const anchorWorldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const metadataBlockHeight =
    block.metadata[DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_METADATA_KEY];
  const requestedBlockHeight =
    typeof metadataBlockHeight === 'number'
      ? Math.floor(metadataBlockHeight)
      : block.blockHeight;

  if (checkingWorldBuildingPlacedBlockIsPassableTile(requestedBlockHeight)) {
    return {
      topWorldLayer: anchorWorldLayer,
      blockHeightLayers: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
    };
  }

  if (requestedBlockHeight > 1 && requestedBlockHeight > anchorWorldLayer) {
    return {
      topWorldLayer: clampingWorldBuildingWorldLayer(
        anchorWorldLayer + requestedBlockHeight - 1
      ),
      blockHeightLayers: requestedBlockHeight,
    };
  }

  return {
    topWorldLayer: anchorWorldLayer,
    blockHeightLayers: resolvingWorldBuildingPlacedBlockBlockHeight(block),
  };
}

/**
 * Returns the inclusive world-layer band used for walk collision at one foot
 * layer. Intentionally feet-only so roofs above the standing tile do not block.
 *
 * @param feetWorldLayer - Layer the player is standing on.
 */
export function computingWorldBuildingPlayerOccupiedLayerBand(
  feetWorldLayer: number
): DefiningWorldBuildingWorldLayerBand {
  const feetLayer = clampingWorldBuildingWorldLayer(feetWorldLayer);

  return {
    bottomLayer: feetLayer,
    topLayer:
      feetLayer +
      DEFINING_WORLD_PLAZA_PLAYER_WALK_COLLISION_HEIGHT_WORLD_LAYERS -
      1,
  };
}

/**
 * Returns true when two inclusive layer bands overlap.
 *
 * @param leftBand - First occupied band.
 * @param rightBand - Second occupied band.
 */
export function checkingWorldBuildingWorldLayerBandsOverlap(
  leftBand: DefiningWorldBuildingWorldLayerBand,
  rightBand: DefiningWorldBuildingWorldLayerBand
): boolean {
  return (
    leftBand.bottomLayer <= rightBand.topLayer &&
    rightBand.bottomLayer <= leftBand.topLayer
  );
}

/**
 * Returns true when a player at the given foot layer collides vertically with a
 * placed block column.
 *
 * @param feetWorldLayer - Player standing layer.
 * @param blockTopWorldLayer - Block top anchor layer (L).
 * @param blockHeightLayers - Block extrusion height (H).
 */
export function checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock(
  feetWorldLayer: number,
  blockTopWorldLayer: number,
  blockHeightLayers: number
): boolean {
  if (checkingWorldBuildingPlacedBlockIsPassableTile(blockHeightLayers)) {
    return false;
  }

  return checkingWorldBuildingWorldLayerBandsOverlap(
    computingWorldBuildingPlayerOccupiedLayerBand(feetWorldLayer),
    computingWorldBuildingPlacedBlockOccupiedLayerBand(
      blockTopWorldLayer,
      blockHeightLayers
    )
  );
}
