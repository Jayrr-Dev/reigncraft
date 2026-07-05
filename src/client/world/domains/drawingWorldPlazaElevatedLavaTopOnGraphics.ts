import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { drawingWorldPlazaLavaCrustDetailsOnGraphics } from '@/components/world/domains/drawingWorldPlazaLavaCrustDetailsOnGraphics';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import type { Graphics } from 'pixi.js';

/**
 * Paints a molten lava top cap directly into a terrain elevation column.
 *
 * Elevated lava draws inside the column's own graphics (instead of a separate
 * overlay) so it depth-sorts pixel-perfectly against avatars and neighboring
 * columns with zero extra display objects or masks.
 *
 * @module components/world/domains/drawingWorldPlazaElevatedLavaTopOnGraphics
 */

/** Base molten fill for the elevated lava surface. */
export const DRAWING_WORLD_PLAZA_ELEVATED_LAVA_TOP_BASE_COLOR = 0xe2601a;

/** Seeded bright patch palette (cooler to hotter). */
const DRAWING_WORLD_PLAZA_ELEVATED_LAVA_TOP_PATCH_COLORS = [
  0xf2913b, 0xf7b24e, 0xc94c12,
] as const;

/** Patches drawn per tile. */
const DRAWING_WORLD_PLAZA_ELEVATED_LAVA_TOP_PATCH_COUNT = 3;

/** Seed salts for patch placement. */
const DRAWING_WORLD_PLAZA_ELEVATED_LAVA_TOP_PATCH_SEED_SALT = 7717;

function listingWorldPlazaElevatedLavaDiamondPolygon(
  centerX: number,
  centerY: number,
  scale: number
): number[] {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX * scale;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX * scale;

  return [
    centerX,
    centerY - halfHeight,
    centerX + halfWidth,
    centerY,
    centerX,
    centerY + halfHeight,
    centerX - halfWidth,
    centerY,
  ];
}

/**
 * Draws the molten top cap plus crust edging for one elevated lava tile.
 *
 * @param graphics - The column's graphics instance (draw after the top cap).
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - Column surface layer (> 1).
 */
export function drawingWorldPlazaElevatedLavaTopOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  surfaceLayer: number
): void {
  const groundCenter = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const offsetY = computingWorldBuildingWorldLayerScreenOffsetPx(surfaceLayer);
  const centerX = groundCenter.x;
  const centerY = groundCenter.y + offsetY;

  graphics
    .poly(listingWorldPlazaElevatedLavaDiamondPolygon(centerX, centerY, 1))
    .fill({ color: DRAWING_WORLD_PLAZA_ELEVATED_LAVA_TOP_BASE_COLOR });

  for (
    let patchIndex = 0;
    patchIndex < DRAWING_WORLD_PLAZA_ELEVATED_LAVA_TOP_PATCH_COUNT;
    patchIndex += 1
  ) {
    const salt =
      DRAWING_WORLD_PLAZA_ELEVATED_LAVA_TOP_PATCH_SEED_SALT + patchIndex * 13;
    const patchOffsetX = mappingWorldPlazaGrassSeededUnitToFloatRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(tileX, tileY, salt),
      -0.4,
      0.4
    );
    const patchOffsetY = mappingWorldPlazaGrassSeededUnitToFloatRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(tileX, tileY, salt + 1),
      -0.4,
      0.4
    );
    const patchScale = mappingWorldPlazaGrassSeededUnitToFloatRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(tileX, tileY, salt + 2),
      0.18,
      0.38
    );
    const colorIndex = Math.min(
      DRAWING_WORLD_PLAZA_ELEVATED_LAVA_TOP_PATCH_COLORS.length - 1,
      Math.floor(
        seedingWorldPlazaGrassTileDecorationFromTileIndex(
          tileX,
          tileY,
          salt + 3
        ) * DRAWING_WORLD_PLAZA_ELEVATED_LAVA_TOP_PATCH_COLORS.length
      )
    );

    graphics
      .poly(
        listingWorldPlazaElevatedLavaDiamondPolygon(
          centerX +
            patchOffsetX * DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
          centerY +
            patchOffsetY * DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
          patchScale
        )
      )
      .fill({
        color: DRAWING_WORLD_PLAZA_ELEVATED_LAVA_TOP_PATCH_COLORS[colorIndex],
        alpha: 0.85,
      });
  }

  // strokesInsideLava keeps every band within this tile's diamond: this cap
  // is baked into a per-tile column graphics, so anything drawn outside the
  // diamond would be painted over by south/east neighbor columns that render
  // later in depth order (which showed up as a "cut" crust).
  drawingWorldPlazaLavaCrustDetailsOnGraphics(graphics, [{ tileX, tileY }], {
    offsetY,
    strokesInsideLava: true,
    checkingTileIsConnected: (neighborTileX, neighborTileY) =>
      checkingWorldPlazaLavaAtTileIndex(neighborTileX, neighborTileY) &&
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
        neighborTileX,
        neighborTileY
      ) === surfaceLayer,
  });
}
