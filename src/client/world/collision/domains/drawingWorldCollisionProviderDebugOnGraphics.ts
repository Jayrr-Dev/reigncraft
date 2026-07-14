import type { DefiningWorldCollisionProvider } from '@/components/world/collision/domains/definingWorldCollisionProvider';
import { findingWorldCollisionProviderById } from '@/components/world/collision/domains/definingWorldCollisionProviderRegistry';
import { listingWorldPlazaChestInstances } from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER,
} from '@/components/world/domains/definingWorldPlazaTerrainObstacleConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics } from '@/components/world/domains/drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics';
import { drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics } from '@/components/world/domains/drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics';
import { drawingWorldPlazaDashedScreenDiamondColliderStrokeOnGraphics } from '@/components/world/domains/drawingWorldPlazaDashedScreenDiamondColliderStrokeOnGraphics';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex } from '@/components/world/domains/listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex';
import {
  resolvingWorldPlazaColumnRockBaseDiamondFromMetadata,
  resolvingWorldPlazaColumnRockBaseDiamondPlayerContactScreenHalfExtentsPx,
  resolvingWorldPlazaColumnRockBaseDiamondScreenHalfExtentsPx,
} from '@/components/world/domains/resolvingWorldPlazaColumnRockBaseDiamondFromMetadata';
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex';
import { resolvingWorldPlazaFirelandsBlockingPropAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFirelandsPropAtTileIndex';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import {
  resolvingWorldPlazaRockCollisionRadiusGridAtTileIndex,
  resolvingWorldPlazaTerrainObstacleKindAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature';
import { resolvingWorldPlazaTreeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { resolvingWorldPlazaTreeCollisionRadiusGridFromInstance } from '@/components/world/domains/resolvingWorldPlazaTreeCollisionRadiusGridFromInstance';
import type { Graphics } from 'pixi.js';

/**
 * Registry-driven procedural terrain collision debug overlay strokes.
 *
 * @module components/world/collision/domains/drawingWorldCollisionProviderDebugOnGraphics
 */

function drawingWorldCollisionColumnRockDiamondProviderDebugOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  tileX: number,
  tileY: number,
  seenColumnRockAnchorKeys: Set<string>,
  provider: DefiningWorldCollisionProvider
): boolean {
  const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
    tileX,
    tileY
  );

  if (!columnRockMetadata) {
    return false;
  }

  const anchorKey = formattingWorldPlazaTileIndexCacheKey(
    columnRockMetadata.anchorTileX,
    columnRockMetadata.anchorTileY
  );

  if (!seenColumnRockAnchorKeys.has(anchorKey)) {
    seenColumnRockAnchorKeys.add(anchorKey);

    const footprintStrokeColor = provider.debugStroke.footprintStrokeColor;

    if (footprintStrokeColor !== undefined) {
      for (const footprintTile of listingWorldPlazaColumnRockFootprintTileIndicesAtAnchorTileIndex(
        columnRockMetadata.anchorTileX,
        columnRockMetadata.anchorTileY
      )) {
        if (
          footprintTile.tileX < bounds.minTileX ||
          footprintTile.tileX > bounds.maxTileX ||
          footprintTile.tileY < bounds.minTileY ||
          footprintTile.tileY > bounds.maxTileY
        ) {
          continue;
        }

        drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics(
          graphics,
          footprintTile.tileX,
          footprintTile.tileY,
          footprintStrokeColor
        );
      }
    }

    const columnRockBaseDiamond =
      resolvingWorldPlazaColumnRockBaseDiamondFromMetadata(columnRockMetadata);
    const columnRockFaceHalfExtents =
      resolvingWorldPlazaColumnRockBaseDiamondScreenHalfExtentsPx(
        columnRockBaseDiamond,
        DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
        DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX
      );
    const columnRockPlayerContactHalfExtents =
      resolvingWorldPlazaColumnRockBaseDiamondPlayerContactScreenHalfExtentsPx(
        columnRockBaseDiamond,
        DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
        DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
        DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID
      );

    drawingWorldPlazaDashedScreenDiamondColliderStrokeOnGraphics(
      graphics,
      columnRockBaseDiamond.centerGridX,
      columnRockBaseDiamond.centerGridY,
      columnRockFaceHalfExtents.halfWidthPx,
      columnRockFaceHalfExtents.halfHeightPx,
      provider.debugStroke.strokeColor
    );

    if (provider.debugStroke.secondaryStrokeColor !== undefined) {
      drawingWorldPlazaDashedScreenDiamondColliderStrokeOnGraphics(
        graphics,
        columnRockBaseDiamond.centerGridX,
        columnRockBaseDiamond.centerGridY,
        columnRockPlayerContactHalfExtents.halfWidthPx,
        columnRockPlayerContactHalfExtents.halfHeightPx,
        provider.debugStroke.secondaryStrokeColor
      );
    }
  }

  return true;
}

function drawingWorldCollisionProceduralTileObstacleDebugOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number
): void {
  const obstacleKind = resolvingWorldPlazaTerrainObstacleKindAtTileIndex(
    tileX,
    tileY
  );

  if (obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK) {
    const terrainProvider = findingWorldCollisionProviderById(
      'terrainElevationColumn'
    );

    if (!terrainProvider) {
      return;
    }

    drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics(
      graphics,
      tileX,
      tileY,
      terrainProvider.debugStroke.strokeColor,
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY)
    );
    return;
  }

  if (obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER) {
    const waterProvider = findingWorldCollisionProviderById('waterTileSquare');

    if (!waterProvider) {
      return;
    }

    const strokeColor =
      waterProvider.debugStroke.strokeColor ??
      waterProvider.debugStroke.secondaryStrokeColor;

    if (strokeColor === undefined) {
      return;
    }

    drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics(
      graphics,
      tileX,
      tileY,
      strokeColor,
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY)
    );
  }
}

function drawingWorldCollisionPebbleRockProviderDebugOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  provider: DefiningWorldCollisionProvider
): void {
  const rockRadiusGrid = resolvingWorldPlazaRockCollisionRadiusGridAtTileIndex(
    tileX,
    tileY
  );

  if (rockRadiusGrid === null) {
    return;
  }

  drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics(
    graphics,
    tileX,
    tileY,
    rockRadiusGrid,
    provider.debugStroke.strokeColor
  );
}

function drawingWorldCollisionTreeTrunkProviderDebugOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  provider: DefiningWorldCollisionProvider
): void {
  const tree = resolvingWorldPlazaTreeAtTileIndex(tileX, tileY);

  if (!tree) {
    return;
  }

  drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics(
    graphics,
    tree.tileX,
    tree.tileY,
    resolvingWorldPlazaTreeCollisionRadiusGridFromInstance(tree),
    provider.debugStroke.strokeColor
  );
}

function drawingWorldCollisionFirelandsPropProviderDebugOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  seenFirelandsPropAnchorKeys: Set<string>,
  provider: DefiningWorldCollisionProvider
): void {
  const firelandsProp = resolvingWorldPlazaFirelandsBlockingPropAtTileIndex(
    tileX,
    tileY
  );

  if (!firelandsProp || firelandsProp.collisionRadiusGrid <= 0) {
    return;
  }

  const anchorKey = formattingWorldPlazaTileIndexCacheKey(
    firelandsProp.anchorTileX,
    firelandsProp.anchorTileY
  );

  if (seenFirelandsPropAnchorKeys.has(anchorKey)) {
    return;
  }

  seenFirelandsPropAnchorKeys.add(anchorKey);

  drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics(
    graphics,
    firelandsProp.anchorTileX,
    firelandsProp.anchorTileY,
    firelandsProp.collisionRadiusGrid,
    provider.debugStroke.strokeColor
  );
}

/**
 * Draws procedural terrain colliders for one tile using provider debug strokes.
 */
function drawingWorldCollisionProviderDebugCollidersAtTileOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  tileX: number,
  tileY: number,
  seenColumnRockAnchorKeys: Set<string>,
  seenFirelandsPropAnchorKeys: Set<string>
): void {
  const columnRockProvider =
    findingWorldCollisionProviderById('columnRockDiamond');

  if (
    columnRockProvider &&
    drawingWorldCollisionColumnRockDiamondProviderDebugOnGraphics(
      graphics,
      bounds,
      tileX,
      tileY,
      seenColumnRockAnchorKeys,
      columnRockProvider
    )
  ) {
    return;
  }

  drawingWorldCollisionProceduralTileObstacleDebugOnGraphics(
    graphics,
    tileX,
    tileY
  );

  const pebbleProvider = findingWorldCollisionProviderById('pebbleRockCircle');

  if (pebbleProvider) {
    drawingWorldCollisionPebbleRockProviderDebugOnGraphics(
      graphics,
      tileX,
      tileY,
      pebbleProvider
    );
  }

  const treeProvider = findingWorldCollisionProviderById('treeTrunkCircle');

  if (treeProvider) {
    drawingWorldCollisionTreeTrunkProviderDebugOnGraphics(
      graphics,
      tileX,
      tileY,
      treeProvider
    );
  }

  const firelandsProvider = findingWorldCollisionProviderById(
    'firelandsPropCircle'
  );

  if (firelandsProvider) {
    drawingWorldCollisionFirelandsPropProviderDebugOnGraphics(
      graphics,
      tileX,
      tileY,
      seenFirelandsPropAnchorKeys,
      firelandsProvider
    );
  }
}

/**
 * Draws obstacle colliders for a horizontal band of visible tile rows.
 */
export function drawingWorldCollisionProviderDebugStaticTileRowsOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  fromTileY: number,
  toTileY: number,
  seenColumnRockAnchorKeys: Set<string>,
  seenFirelandsPropAnchorKeys: Set<string>
): void {
  for (let tileY = fromTileY; tileY <= toTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      drawingWorldCollisionProviderDebugCollidersAtTileOnGraphics(
        graphics,
        bounds,
        tileX,
        tileY,
        seenColumnRockAnchorKeys,
        seenFirelandsPropAnchorKeys
      );
    }
  }
}

/**
 * Draws obstacle colliders for all visible tiles in a single pass.
 */
export function drawingWorldCollisionProviderDebugStaticTilesOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds
): void {
  drawingWorldCollisionProviderDebugStaticTileRowsOnGraphics(
    graphics,
    bounds,
    bounds.minTileY,
    bounds.maxTileY,
    new Set<string>(),
    new Set<string>()
  );

  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.CHESTS
    )
  ) {
    return;
  }

  const chestProvider = findingWorldCollisionProviderById('chestPropCircle');

  if (!chestProvider || chestProvider.debugStroke.kind !== 'gridCircle') {
    return;
  }

  for (const chest of listingWorldPlazaChestInstances()) {
    if (chest.collisionRadiusGrid <= 0) {
      continue;
    }

    const tileX = Math.floor(chest.position.x);
    const tileY = Math.floor(chest.position.y);

    if (
      tileX < bounds.minTileX ||
      tileX > bounds.maxTileX ||
      tileY < bounds.minTileY ||
      tileY > bounds.maxTileY
    ) {
      continue;
    }

    drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics(
      graphics,
      chest.position.x,
      chest.position.y,
      chest.collisionRadiusGrid,
      chestProvider.debugStroke.strokeColor
    );
  }
}
