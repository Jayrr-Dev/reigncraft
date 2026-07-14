import { DEFINING_WORLD_DEPTH_STONE_DECORATION_LAYER_Z_INDEX } from '@/components/world/depth';
import { computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex } from '@/components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import {
  drawingWorldPlazaStoneDecorationsOnGraphics,
  type DrawingWorldPlazaStoneInstance,
} from '@/components/world/domains/drawingWorldPlazaStoneDecorationsOnGraphics';
import { listingWorldPlazaTileIndicesInBounds } from '@/components/world/domains/listingWorldPlazaTileIndicesInBounds';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex';
import { resolvingWorldPlazaStoneDecorationAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';
import type { Container } from 'pixi.js';
import { Graphics } from 'pixi.js';

/**
 * Dedicated surface-pebble overlay above every batched floor chunk.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleStoneDecorationLayer
 */

export type UpdatingWorldPlazaVisibleStoneDecorationLayerInput = {
  readonly graphics: Graphics;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly burntGrassTileKeys?: ReadonlySet<string>;
};

type WorldPlazaVisibleStoneDrawEntry = DrawingWorldPlazaStoneInstance & {
  readonly tileX: number;
  readonly tileY: number;
};

/** Creates the persistent floor-layer graphics used for surface pebbles. */
export function ensuringWorldPlazaVisibleStoneDecorationLayer(
  parentContainer: Container,
  existingGraphics: Graphics | null
): Graphics {
  if (existingGraphics && !existingGraphics.destroyed) {
    return existingGraphics;
  }

  const graphics = new Graphics();
  graphics.eventMode = 'none';
  graphics.zIndex = DEFINING_WORLD_DEPTH_STONE_DECORATION_LAYER_Z_INDEX;
  markingWorldPlazaPixiDisplayObjectCullable(graphics);
  parentContainer.addChild(graphics);

  return graphics;
}

/** Redraws unpicked surface pebbles for the current visible floor bounds. */
export function updatingWorldPlazaVisibleStoneDecorationLayer(
  input: UpdatingWorldPlazaVisibleStoneDecorationLayerInput
): void {
  input.graphics.clear();
  const stoneEntries: WorldPlazaVisibleStoneDrawEntry[] = [];

  for (const { tileX, tileY } of listingWorldPlazaTileIndicesInBounds(
    input.bounds
  )) {
    if (
      checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex(
        tileX,
        tileY,
        input.burntGrassTileKeys
      )
    ) {
      continue;
    }

    const decoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
      tileX,
      tileY
    );

    if (!decoration || decoration.surfaceWorldLayer !== null) {
      continue;
    }

    const groundCenter = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: tileX,
      y: tileY,
    });

    stoneEntries.push({
      tileX,
      tileY,
      centerX: groundCenter.x,
      centerY:
        groundCenter.y +
        computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex(
          tileX,
          tileY
        ),
      decoration,
    });
  }

  stoneEntries.sort(
    (entryA, entryB) =>
      entryA.tileX + entryA.tileY - (entryB.tileX + entryB.tileY) ||
      entryA.tileX - entryB.tileX
  );
  drawingWorldPlazaStoneDecorationsOnGraphics(input.graphics, stoneEntries);
}
