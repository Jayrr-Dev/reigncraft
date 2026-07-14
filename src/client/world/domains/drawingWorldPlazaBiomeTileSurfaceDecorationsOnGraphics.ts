import { checkingWorldPlazaFlowerDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaFlowerDecorationAtTileIndex';
import type { CreatingWorldPlazaGrassFloorChunkDrawPassContext } from '@/components/world/domains/creatingWorldPlazaGrassFloorChunkDrawPassContext';
import {
  DEFINING_WORLD_PLAZA_BIOME_BLOCK_HIGHLIGHT_DOT_RADIUS_PX,
  DEFINING_WORLD_PLAZA_BIOME_BLOCK_HIGHLIGHT_TILE_MODULUS,
  DEFINING_WORLD_PLAZA_BIOME_DECORATION_TILE_REMAINDER,
  DEFINING_WORLD_PLAZA_BIOME_SPECK_DOT_RADIUS_PX,
} from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX } from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import {
  DEFINING_WORLD_PLAZA_LAKE_SHORE_BLOCK_HIGHLIGHT_COLOR,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_BLOCK_HIGHLIGHT_TILE_MODULUS,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_SPECK_COLOR,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_SPECK_TILE_MODULUS,
} from '@/components/world/domains/definingWorldPlazaLakeShoreConstants';
import {
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_BLOCK_HIGHLIGHT_COLOR,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_BLOCK_HIGHLIGHT_TILE_MODULUS,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_SPECK_COLOR,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_SPECK_TILE_MODULUS,
} from '@/components/world/domains/definingWorldPlazaOceanShoreConstants';
import { drawingWorldPlazaStoneDecorationsOnGraphics } from '@/components/world/domains/drawingWorldPlazaStoneDecorationsOnGraphics';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex';
import { resolvingWorldPlazaFlowerPetalColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowerPetalColorAtTileIndex';
import { checkingWorldPlazaLakeShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex';
import { checkingWorldPlazaOceanShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex';
import { checkingWorldPlazaPondShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex';
import { resolvingWorldPlazaStoneDecorationAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { checkingWorldPlazaRuntimeFlowerIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedFlowersLookup';
import type { Graphics } from 'pixi.js';

/**
 * Specks, flowers, block highlights, and stones on one tile surface.
 *
 * @module components/world/domains/drawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphics
 */

/** Optional decoration toggles for adaptive performance tiers. */
export interface DrawingWorldPlazaBiomeTileSurfaceDecorationsDrawOptions {
  readonly drawsGrassDecorations?: boolean;
  /** Gameplay flowers remain visible even when cosmetic grass dots are culled. */
  readonly drawsFlowerDecorations?: boolean;
  readonly drawsStoneDecorations?: boolean;
  readonly drawPassContext?: CreatingWorldPlazaGrassFloorChunkDrawPassContext;
}

/** Default decoration flags (full quality). */
const DRAWING_WORLD_PLAZA_BIOME_TILE_SURFACE_DECORATIONS_DEFAULT_DRAW_OPTIONS: Required<
  Omit<
    DrawingWorldPlazaBiomeTileSurfaceDecorationsDrawOptions,
    'drawPassContext'
  >
> = {
  drawsGrassDecorations: true,
  drawsFlowerDecorations: true,
  drawsStoneDecorations: true,
};

/** Input for {@link drawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphics}. */
export interface DrawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphicsInput {
  readonly graphics: Graphics;
  readonly tileX: number;
  readonly tileY: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly drawOptions?: DrawingWorldPlazaBiomeTileSurfaceDecorationsDrawOptions;
}

/**
 * Draws biome decorations at an isometric tile surface center.
 *
 * Used on flat floor tiles and raised terrain column caps so both read the same.
 *
 * @param input - Tile indices, screen center, and decoration toggles.
 */
export function drawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphics(
  input: DrawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphicsInput
): void {
  const drawPassContext = input.drawOptions?.drawPassContext;
  const isWaterTile = Boolean(
    drawPassContext
      ? drawPassContext.resolvingWaterAtTileIndex(input.tileX, input.tileY)
      : resolvingWorldPlazaWaterAtTileIndex(input.tileX, input.tileY)
  );
  const isLakeShoreTile = drawPassContext
    ? drawPassContext.checkingLakeShoreBlockAtTileIndex(
        input.tileX,
        input.tileY
      )
    : checkingWorldPlazaLakeShoreBlockAtTileIndex(input.tileX, input.tileY);
  const isOceanShoreTile = drawPassContext
    ? drawPassContext.checkingOceanShoreBlockAtTileIndex(
        input.tileX,
        input.tileY
      )
    : checkingWorldPlazaOceanShoreBlockAtTileIndex(input.tileX, input.tileY);
  const isPondShoreTile = drawPassContext
    ? drawPassContext.checkingPondShoreBlockAtTileIndex(
        input.tileX,
        input.tileY
      )
    : checkingWorldPlazaPondShoreBlockAtTileIndex(input.tileX, input.tileY);
  const resolvedDrawOptions = {
    drawsGrassDecorations:
      (input.drawOptions?.drawsGrassDecorations ??
        DRAWING_WORLD_PLAZA_BIOME_TILE_SURFACE_DECORATIONS_DEFAULT_DRAW_OPTIONS.drawsGrassDecorations) &&
      !isWaterTile &&
      !isLakeShoreTile &&
      !isOceanShoreTile &&
      !isPondShoreTile,
    drawsFlowerDecorations:
      (input.drawOptions?.drawsFlowerDecorations ??
        DRAWING_WORLD_PLAZA_BIOME_TILE_SURFACE_DECORATIONS_DEFAULT_DRAW_OPTIONS.drawsFlowerDecorations) &&
      !isWaterTile &&
      !isLakeShoreTile &&
      !isOceanShoreTile &&
      !isPondShoreTile,
    drawsStoneDecorations:
      (input.drawOptions?.drawsStoneDecorations ??
        DRAWING_WORLD_PLAZA_BIOME_TILE_SURFACE_DECORATIONS_DEFAULT_DRAW_OPTIONS.drawsStoneDecorations) &&
      !isWaterTile &&
      !isLakeShoreTile &&
      !isOceanShoreTile &&
      !isPondShoreTile,
  };
  const biome = drawPassContext
    ? drawPassContext.resolvingBiomeAtTileIndex(input.tileX, input.tileY)
    : resolvingWorldPlazaBiomeAtTileIndex(input.tileX, input.tileY);
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  if (
    isOceanShoreTile &&
    Math.abs(input.tileX * 11 + input.tileY * 23) %
      DEFINING_WORLD_PLAZA_OCEAN_SHORE_SPECK_TILE_MODULUS ===
      DEFINING_WORLD_PLAZA_BIOME_DECORATION_TILE_REMAINDER
  ) {
    input.graphics
      .circle(
        input.centerX + (input.tileX % 3) - 1,
        input.centerY + (input.tileY % 3) - 1,
        DEFINING_WORLD_PLAZA_BIOME_SPECK_DOT_RADIUS_PX
      )
      .fill({ color: DEFINING_WORLD_PLAZA_OCEAN_SHORE_SPECK_COLOR });
  }

  if (
    isOceanShoreTile &&
    Math.abs(input.tileX * 17 + input.tileY * 5) %
      DEFINING_WORLD_PLAZA_OCEAN_SHORE_BLOCK_HIGHLIGHT_TILE_MODULUS ===
      DEFINING_WORLD_PLAZA_BIOME_DECORATION_TILE_REMAINDER
  ) {
    input.graphics
      .circle(
        input.centerX,
        input.centerY - halfHeight * 0.45,
        DEFINING_WORLD_PLAZA_BIOME_BLOCK_HIGHLIGHT_DOT_RADIUS_PX
      )
      .fill({ color: DEFINING_WORLD_PLAZA_OCEAN_SHORE_BLOCK_HIGHLIGHT_COLOR });
  }

  if (
    isLakeShoreTile &&
    Math.abs(input.tileX * 11 + input.tileY * 23) %
      DEFINING_WORLD_PLAZA_LAKE_SHORE_SPECK_TILE_MODULUS ===
      DEFINING_WORLD_PLAZA_BIOME_DECORATION_TILE_REMAINDER
  ) {
    input.graphics
      .circle(
        input.centerX + (input.tileX % 3) - 1,
        input.centerY + (input.tileY % 3) - 1,
        DEFINING_WORLD_PLAZA_BIOME_SPECK_DOT_RADIUS_PX
      )
      .fill({ color: DEFINING_WORLD_PLAZA_LAKE_SHORE_SPECK_COLOR });
  }

  if (
    isLakeShoreTile &&
    Math.abs(input.tileX * 17 + input.tileY * 5) %
      DEFINING_WORLD_PLAZA_LAKE_SHORE_BLOCK_HIGHLIGHT_TILE_MODULUS ===
      DEFINING_WORLD_PLAZA_BIOME_DECORATION_TILE_REMAINDER
  ) {
    input.graphics
      .circle(
        input.centerX,
        input.centerY - halfHeight * 0.45,
        DEFINING_WORLD_PLAZA_BIOME_BLOCK_HIGHLIGHT_DOT_RADIUS_PX
      )
      .fill({ color: DEFINING_WORLD_PLAZA_LAKE_SHORE_BLOCK_HIGHLIGHT_COLOR });
  }

  if (
    resolvedDrawOptions.drawsGrassDecorations &&
    biome.speckTileModulus !== null &&
    biome.speckColor !== null &&
    Math.abs(input.tileX * 13 + input.tileY * 29) % biome.speckTileModulus ===
      DEFINING_WORLD_PLAZA_BIOME_DECORATION_TILE_REMAINDER
  ) {
    input.graphics
      .circle(
        input.centerX + (input.tileX % 3) - 1,
        input.centerY + (input.tileY % 3) - 1,
        DEFINING_WORLD_PLAZA_BIOME_SPECK_DOT_RADIUS_PX
      )
      .fill({ color: biome.speckColor });
  }

  if (
    resolvedDrawOptions.drawsGrassDecorations &&
    biome.blockHighlightColor !== null &&
    Math.abs(input.tileX * 19 + input.tileY * 7) %
      DEFINING_WORLD_PLAZA_BIOME_BLOCK_HIGHLIGHT_TILE_MODULUS ===
      DEFINING_WORLD_PLAZA_BIOME_DECORATION_TILE_REMAINDER
  ) {
    input.graphics
      .circle(
        input.centerX,
        input.centerY - halfHeight * 0.45,
        DEFINING_WORLD_PLAZA_BIOME_BLOCK_HIGHLIGHT_DOT_RADIUS_PX
      )
      .fill({ color: biome.blockHighlightColor });
  }

  // Flowers last on the tile so local speck/highlight dots cannot cover them.
  if (
    resolvedDrawOptions.drawsFlowerDecorations &&
    biome.flowerTileModulus !== null &&
    biome.flowerColors !== null &&
    checkingWorldPlazaFlowerDecorationAtTileIndex(input.tileX, input.tileY) &&
    !checkingWorldPlazaRuntimeFlowerIsPicked(input.tileX, input.tileY)
  ) {
    const flowerColor = resolvingWorldPlazaFlowerPetalColorAtTileIndex(
      input.tileX,
      input.tileY
    );

    if (flowerColor !== null) {
      input.graphics
        .circle(
          input.centerX,
          input.centerY - halfHeight * 0.35,
          resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex(
            input.tileX,
            input.tileY
          )
        )
        .fill({ color: flowerColor });
    }
  }

  if (!resolvedDrawOptions.drawsStoneDecorations) {
    return;
  }

  const stoneDecoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
    input.tileX,
    input.tileY
  );

  if (stoneDecoration && stoneDecoration.surfaceWorldLayer === null) {
    drawingWorldPlazaStoneDecorationsOnGraphics(input.graphics, [
      {
        centerX: input.centerX,
        centerY: input.centerY,
        decoration: stoneDecoration,
      },
    ]);
  }
}
