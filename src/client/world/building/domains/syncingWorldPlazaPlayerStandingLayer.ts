import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import {
  checkingWorldBuildingPlacedBlockIsWalkableStep,
  findingWorldBuildingPlacedBlockAtTileLayerIndex,
  resolvingWorldBuildingSurfaceLayerAtTileIndex,
} from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import {
  resolvingWorldPlazaSurfaceLayerAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';

/**
 * Keeps the player standing layer aligned with nearby build surfaces.
 *
 * @module components/world/building/domains/syncingWorldPlazaPlayerStandingLayer
 */

/**
 * Updates a world point layer from the surface under its tile when allowed.
 *
 * @param worldPoint - Mutable player position.
 * @param placedBlocks - Blocks near the player.
 * @param isJumping - True while a jump animation is active.
 */
export function syncingWorldPlazaPlayerStandingLayer(
  worldPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  isJumping: boolean,
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): void {
  if (isJumping) {
    return;
  }

  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(worldPoint);
  const surfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
    standingTile.tileX,
    standingTile.tileY,
    placedBlocks,
    placedBlocksByTile
  );
  const placedSurfaceLayer = resolvingWorldBuildingSurfaceLayerAtTileIndex(
    standingTile.tileX,
    standingTile.tileY,
    placedBlocks,
    placedBlocksByTile
  );
  const currentLayer = resolvingWorldPlazaPlayerWorldLayer(worldPoint);

  // Stepping down only when the tile no longer supports the current layer.
  // Prevents snapping to ground on an adjacent tile right after landing on a
  // raised platform.
  if (surfaceLayer < currentLayer) {
    const blockAtCurrentLayer = findingWorldBuildingPlacedBlockAtTileLayerIndex(
      standingTile.tileX,
      standingTile.tileY,
      currentLayer,
      placedBlocks,
      placedBlocksByTile
    );

    if (blockAtCurrentLayer !== null) {
      return;
    }

    worldPoint.layer = surfaceLayer;
    return;
  }

  if (surfaceLayer === currentLayer) {
    return;
  }

  const surfaceBlock = findingWorldBuildingPlacedBlockAtTileLayerIndex(
    standingTile.tileX,
    standingTile.tileY,
    placedSurfaceLayer,
    placedBlocks,
    placedBlocksByTile
  );

  // Placed blocks only raise the player through a walkable stair. Procedural
  // terrain is a solid ground-to-surface column, so a player already centered
  // on one must snap to its top. This repairs stale saved layers and missed jump
  // landing layers without making cliff faces walkable; collision prevents the
  // player center from entering an unreachable terrain tile.
  const canWalkUpPlacedStep =
    surfaceBlock !== null &&
    checkingWorldBuildingPlacedBlockIsWalkableStep(surfaceBlock, currentLayer);
  const terrainSurfaceLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
      standingTile.tileX,
      standingTile.tileY
    );
  const isPlayerBelowProceduralTerrainSurface =
    terrainSurfaceLayer > currentLayer;

  if (canWalkUpPlacedStep || isPlayerBelowProceduralTerrainSurface) {
    worldPoint.layer = surfaceLayer;
  }
}
