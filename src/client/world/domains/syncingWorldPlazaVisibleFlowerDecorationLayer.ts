import { DEFINING_WORLD_DEPTH_FLOWER_DECORATION_LAYER_Z_INDEX } from '@/components/world/depth';
import { checkingWorldPlazaFlowerDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaFlowerDecorationAtTileIndex';
import { computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex } from '@/components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX } from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { listingWorldPlazaTileIndicesInBounds } from '@/components/world/domains/listingWorldPlazaTileIndicesInBounds';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import { checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex';
import { resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex';
import { resolvingWorldPlazaFlowerPetalColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowerPetalColorAtTileIndex';
import { checkingWorldPlazaRuntimeFlowerIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedFlowersLookup';
import type { Container } from 'pixi.js';
import { Graphics } from 'pixi.js';

/**
 * Dedicated flower overlay above every batched floor chunk.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleFlowerDecorationLayer
 */

export type UpdatingWorldPlazaVisibleFlowerDecorationLayerInput = {
  readonly graphics: Graphics;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly burntGrassTileKeys?: ReadonlySet<string>;
};

/** Creates the persistent floor-layer graphics used for visible flowers. */
export function ensuringWorldPlazaVisibleFlowerDecorationLayer(
  parentContainer: Container,
  existingGraphics: Graphics | null
): Graphics {
  if (existingGraphics && !existingGraphics.destroyed) {
    return existingGraphics;
  }

  const graphics = new Graphics();
  graphics.eventMode = 'none';
  graphics.zIndex = DEFINING_WORLD_DEPTH_FLOWER_DECORATION_LAYER_Z_INDEX;
  markingWorldPlazaPixiDisplayObjectCullable(graphics);
  parentContainer.addChild(graphics);

  return graphics;
}

/** Redraws unpicked biome flowers for the current visible floor bounds. */
export function updatingWorldPlazaVisibleFlowerDecorationLayer(
  input: UpdatingWorldPlazaVisibleFlowerDecorationLayerInput
): void {
  input.graphics.clear();

  for (const { tileX, tileY } of listingWorldPlazaTileIndicesInBounds(
    input.bounds
  )) {
    if (
      checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex(
        tileX,
        tileY,
        input.burntGrassTileKeys
      ) ||
      !checkingWorldPlazaFlowerDecorationAtTileIndex(tileX, tileY) ||
      checkingWorldPlazaRuntimeFlowerIsPicked(tileX, tileY)
    ) {
      continue;
    }

    const flowerColor = resolvingWorldPlazaFlowerPetalColorAtTileIndex(
      tileX,
      tileY
    );

    if (flowerColor === null) {
      continue;
    }

    const groundCenter = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: tileX,
      y: tileY,
    });
    const surfaceLiftY =
      computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex(
        tileX,
        tileY
      );

    input.graphics
      .circle(
        groundCenter.x,
        groundCenter.y +
          surfaceLiftY -
          DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX * 0.35,
        resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex(tileX, tileY)
      )
      .fill({ color: flowerColor });
  }
}
