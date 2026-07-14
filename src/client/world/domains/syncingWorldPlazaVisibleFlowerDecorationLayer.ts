import { DEFINING_WORLD_DEPTH_FLOWER_DECORATION_LAYER_Z_INDEX } from '@/components/world/depth';
import { checkingWorldPlazaFlowerDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaFlowerDecorationAtTileIndex';
import { computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex } from '@/components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_BIOME_BLOCK_HIGHLIGHT_DOT_RADIUS_PX,
  DEFINING_WORLD_PLAZA_BIOME_SPECK_DOT_RADIUS_PX,
} from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX } from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { listingWorldPlazaTileIndicesInBounds } from '@/components/world/domains/listingWorldPlazaTileIndicesInBounds';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import {
  checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex,
  resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex';
import { resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex';
import { resolvingWorldPlazaFlowerPetalColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowerPetalColorAtTileIndex';
import { resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex';
import { checkingWorldPlazaRuntimeFlowerIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedFlowersLookup';
import type { Container } from 'pixi.js';
import { Graphics } from 'pixi.js';

/**
 * Dedicated flower overlay above every batched floor chunk.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleFlowerDecorationLayer
 */

/** Extra px so grass covers still hide floor speck / highlight under the petal slot. */
const SYNCING_WORLD_PLAZA_PICKED_FLOWER_SURFACE_COVER_PADDING_PX = 0.75;

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

/**
 * Masks floor speck / block-highlight dots that can sit under a picked petal.
 *
 * Flowers live on this overlay; grass flecks bake into floor chunks. When the
 * petal is removed, those flecks otherwise read as leftover "green dots".
 */
function drawingWorldPlazaPickedFlowerSurfaceCoverOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
  burntGrassTileKeys: ReadonlySet<string> | undefined
): void {
  const coverColor = resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex(
    {
      tileX,
      tileY,
      baseFillColor: resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex(
        tileX,
        tileY
      ),
      burntGrassTileKeys,
    }
  );
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const coverPadding =
    SYNCING_WORLD_PLAZA_PICKED_FLOWER_SURFACE_COVER_PADDING_PX;

  // Block highlights share the petal Y band (~0.45 vs 0.35 * halfHeight).
  graphics
    .circle(
      centerX,
      centerY - halfHeight * 0.45,
      DEFINING_WORLD_PLAZA_BIOME_BLOCK_HIGHLIGHT_DOT_RADIUS_PX + coverPadding
    )
    .fill({ color: coverColor });

  // Grass specks sit near the tile center with a small deterministic offset.
  graphics
    .circle(
      centerX + (tileX % 3) - 1,
      centerY + (tileY % 3) - 1,
      DEFINING_WORLD_PLAZA_BIOME_SPECK_DOT_RADIUS_PX + coverPadding
    )
    .fill({ color: coverColor });
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
      !checkingWorldPlazaFlowerDecorationAtTileIndex(tileX, tileY)
    ) {
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
    const centerX = groundCenter.x;
    const centerY = groundCenter.y + surfaceLiftY;

    if (checkingWorldPlazaRuntimeFlowerIsPicked(tileX, tileY)) {
      drawingWorldPlazaPickedFlowerSurfaceCoverOnGraphics(
        input.graphics,
        tileX,
        tileY,
        centerX,
        centerY,
        input.burntGrassTileKeys
      );
      continue;
    }

    const flowerColor = resolvingWorldPlazaFlowerPetalColorAtTileIndex(
      tileX,
      tileY
    );

    if (flowerColor === null) {
      continue;
    }

    input.graphics
      .circle(
        centerX,
        centerY - DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX * 0.35,
        resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex(tileX, tileY)
      )
      .fill({ color: flowerColor });
  }
}
