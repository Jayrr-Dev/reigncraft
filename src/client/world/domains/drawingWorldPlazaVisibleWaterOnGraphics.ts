import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaWaterShoreDetailsOnGraphics } from '@/components/world/domains/drawingWorldPlazaWaterTileOnGraphics';
import {
  resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex,
  type ResolvingWorldPlazaWaterSurfaceTileDrawMetadata,
} from '@/components/world/domains/resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex';
import type { Graphics } from 'pixi.js';

/**
 * Draws the translucent water surface for the visible tile window.
 *
 * Every visible water diamond is added to one path and filled once, so the
 * surface is a single translucent shape with no per-tile or per-chunk seams.
 * The textured ground baked into the floor chunks shows through, and shore foam
 * is layered on top only where water meets land.
 *
 * @module components/world/domains/drawingWorldPlazaVisibleWaterOnGraphics
 */

/** One batched surface fill keyed by color and opacity. */
type DrawingWorldPlazaWaterSurfaceBatch =
  ResolvingWorldPlazaWaterSurfaceTileDrawMetadata[];

/**
 * Adds one tile's diamond outline to the current graphics path.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function addingWorldPlazaWaterTileDiamondPath(
  graphics: Graphics,
  tileX: number,
  tileY: number
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  graphics.poly([
    center.x,
    center.y - halfHeight,
    center.x + halfWidth,
    center.y,
    center.x,
    center.y + halfHeight,
    center.x - halfWidth,
    center.y,
  ]);
}

/**
 * Fills one batch of water tiles that share the same surface tint.
 *
 * @param graphics - Pixi graphics instance.
 * @param batch - Tiles and shared surface tint.
 */
function fillingWorldPlazaWaterSurfaceBatchOnGraphics(
  graphics: Graphics,
  batch: DrawingWorldPlazaWaterSurfaceBatch
): void {
  for (const tile of batch) {
    addingWorldPlazaWaterTileDiamondPath(graphics, tile.tileX, tile.tileY);
  }

  const surfaceAppearance = batch[0]?.surfaceAppearance;

  if (!surfaceAppearance) {
    return;
  }

  graphics.fill({
    color: surfaceAppearance.color,
    alpha: surfaceAppearance.alpha,
  });
}

/**
 * Appends one tile into the color/alpha batch map used for merged fills.
 */
function appendingWorldPlazaWaterSurfaceBatchTile(
  batchesByKey: Map<string, DrawingWorldPlazaWaterSurfaceBatch>,
  metadata: ResolvingWorldPlazaWaterSurfaceTileDrawMetadata
): void {
  if (!metadata.surfaceAppearance) {
    return;
  }

  const existingBatch = batchesByKey.get(metadata.surfaceAppearance.batchKey);

  if (existingBatch) {
    existingBatch.push(metadata);
    return;
  }

  batchesByKey.set(metadata.surfaceAppearance.batchKey, [metadata]);
}

/**
 * Draws visible lake, river, and stream surfaces beneath biome decorations.
 *
 * One bounds pass collects every water tile into color batches and shore work,
 * instead of rescanning the full window once per water kind.
 *
 * @param graphics - Pixi graphics instance (caller clears before calling).
 * @param bounds - Visible tile index range.
 * @returns Count of water tiles drawn, for the perf water tile gauge.
 */
export function drawingWorldPlazaVisibleWaterOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds
): number {
  const isDaytime = computingWorldPlazaDayNightSunState().isDaytime;
  const batchesByKey = new Map<string, DrawingWorldPlazaWaterSurfaceBatch>();
  const shoreTiles: ResolvingWorldPlazaWaterSurfaceTileDrawMetadata[] = [];
  let waterTileCount = 0;

  for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      const metadata =
        resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(
          tileX,
          tileY,
          isDaytime
        );

      if (!metadata) {
        continue;
      }

      waterTileCount += 1;
      appendingWorldPlazaWaterSurfaceBatchTile(batchesByKey, metadata);

      if (metadata.drawsShoreDetails) {
        shoreTiles.push(metadata);
      }
    }
  }

  for (const batch of batchesByKey.values()) {
    fillingWorldPlazaWaterSurfaceBatchOnGraphics(graphics, batch);
  }

  for (const shoreTile of shoreTiles) {
    drawingWorldPlazaWaterShoreDetailsOnGraphics(
      graphics,
      shoreTile.tileX,
      shoreTile.tileY
    );
  }

  return waterTileCount;
}
