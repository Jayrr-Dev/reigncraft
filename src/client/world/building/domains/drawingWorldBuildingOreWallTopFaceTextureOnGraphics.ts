/**
 * Procedural top-face overlays for ore wall blocks.
 *
 * Clay: sedimentary horizontal bands. Niter: chalk crystal crust.
 * Coal: dark facet cuts. Metals: colored flecks.
 *
 * @module components/world/building/domains/drawingWorldBuildingOreWallTopFaceTextureOnGraphics
 */

import type { DefiningWorldPlazaOreWallSurfaceEntry } from '@/components/world/building/domains/definingWorldPlazaOreWallSurfaceRegistry';
import { adjustingWorldPlazaRgbColorBrightness } from '@/components/world/domains/blendingWorldPlazaRgbColors';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import type { Graphics } from 'pixi.js';

const DRAWING_WORLD_BUILDING_ORE_WALL_CLAY_BAND_COUNT = 5;
const DRAWING_WORLD_BUILDING_ORE_WALL_NITER_CRYSTAL_COUNT = 14;
const DRAWING_WORLD_BUILDING_ORE_WALL_NITER_SPECK_COUNT = 22;
const DRAWING_WORLD_BUILDING_ORE_WALL_COAL_FACET_COUNT = 5;
const DRAWING_WORLD_BUILDING_ORE_WALL_METAL_FLECK_COUNT = 11;

/**
 * Returns true when a point sits inside the isometric top diamond.
 */
function checkingWorldBuildingOreWallPointInsideTopDiamond(
  offsetX: number,
  offsetY: number,
  halfWidth: number,
  halfHeight: number
): boolean {
  const normalizedX = Math.abs(offsetX) / halfWidth;
  const normalizedY = Math.abs(offsetY) / halfHeight;

  return normalizedX + normalizedY <= 0.92;
}

/**
 * Clay: stacked sedimentary strata across the diamond.
 */
function drawingWorldBuildingOreWallClaySedimentOnGraphics(
  graphics: Graphics,
  centerX: number,
  centerY: number,
  surface: DefiningWorldPlazaOreWallSurfaceEntry
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const usableHalfHeight = halfHeight * 0.9;
  const bandColors = [
    surface.accentColor,
    surface.fillColor,
    surface.secondaryAccentColor,
    surface.fillColor,
    adjustingWorldPlazaRgbColorBrightness(surface.fillColor, -0.12),
  ];

  for (
    let bandIndex = 1;
    bandIndex < DRAWING_WORLD_BUILDING_ORE_WALL_CLAY_BAND_COUNT;
    bandIndex += 1
  ) {
    const rowOffsetY =
      -usableHalfHeight +
      (usableHalfHeight * 2 * bandIndex) /
        DRAWING_WORLD_BUILDING_ORE_WALL_CLAY_BAND_COUNT;
    const normalizedRow = Math.abs(rowOffsetY) / halfHeight;

    if (normalizedRow >= 1) {
      continue;
    }

    const rowHalfWidth = halfWidth * (1 - normalizedRow);
    const bandColor =
      bandColors[bandIndex % bandColors.length] ?? surface.secondaryAccentColor;

    graphics
      .moveTo(centerX - rowHalfWidth, centerY + rowOffsetY)
      .lineTo(centerX + rowHalfWidth, centerY + rowOffsetY)
      .stroke({
        width: bandIndex % 2 === 0 ? 2.4 : 1.6,
        color: bandColor,
        alpha: 0.85,
        cap: 'square',
      });
  }

  // Soft fill bands between grooves so clay reads as stacked earth, not lines only.
  for (
    let bandIndex = 0;
    bandIndex < DRAWING_WORLD_BUILDING_ORE_WALL_CLAY_BAND_COUNT;
    bandIndex += 1
  ) {
    const bandStartY =
      -usableHalfHeight +
      (usableHalfHeight * 2 * bandIndex) /
        DRAWING_WORLD_BUILDING_ORE_WALL_CLAY_BAND_COUNT;
    const bandMidY =
      bandStartY +
      usableHalfHeight / DRAWING_WORLD_BUILDING_ORE_WALL_CLAY_BAND_COUNT;
    const normalizedMid = Math.abs(bandMidY) / halfHeight;

    if (normalizedMid >= 0.95) {
      continue;
    }

    const bandHalfWidth = halfWidth * (1 - normalizedMid) * 0.72;
    const bandColor =
      bandColors[bandIndex % bandColors.length] ?? surface.accentColor;

    graphics
      .rect(
        centerX - bandHalfWidth,
        centerY + bandMidY - 1.1,
        bandHalfWidth * 2,
        2.2
      )
      .fill({ color: bandColor, alpha: 0.35 });
  }
}

/**
 * Niter: chalky white crystal crust over pale stone.
 */
function drawingWorldBuildingOreWallNiterCrustOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
  surface: DefiningWorldPlazaOreWallSurfaceEntry
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  for (
    let crystalIndex = 0;
    crystalIndex < DRAWING_WORLD_BUILDING_ORE_WALL_NITER_CRYSTAL_COUNT;
    crystalIndex += 1
  ) {
    const unitX = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      2401 + crystalIndex * 13
    );
    const unitY = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      2503 + crystalIndex * 17
    );
    const offsetX = (unitX - 0.5) * halfWidth * 1.55;
    const offsetY = (unitY - 0.5) * halfHeight * 1.55;

    if (
      !checkingWorldBuildingOreWallPointInsideTopDiamond(
        offsetX,
        offsetY,
        halfWidth,
        halfHeight
      )
    ) {
      continue;
    }

    const sizePx = mappingWorldPlazaGrassSeededUnitToFloatRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        2607 + crystalIndex
      ),
      2.2,
      4.8
    );
    const isBright =
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        2701 + crystalIndex
      ) > 0.45;
    const crystalColor = isBright
      ? surface.accentColor
      : surface.secondaryAccentColor;

    // Angular crystal blob (short diamond).
    graphics
      .poly([
        centerX + offsetX,
        centerY + offsetY - sizePx,
        centerX + offsetX + sizePx * 0.7,
        centerY + offsetY,
        centerX + offsetX,
        centerY + offsetY + sizePx * 0.55,
        centerX + offsetX - sizePx * 0.7,
        centerY + offsetY,
      ])
      .fill({ color: crystalColor, alpha: 0.92 });
  }

  for (
    let speckIndex = 0;
    speckIndex < DRAWING_WORLD_BUILDING_ORE_WALL_NITER_SPECK_COUNT;
    speckIndex += 1
  ) {
    const unitX = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      2803 + speckIndex * 11
    );
    const unitY = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      2909 + speckIndex * 19
    );
    const offsetX = (unitX - 0.5) * halfWidth * 1.6;
    const offsetY = (unitY - 0.5) * halfHeight * 1.6;

    if (
      !checkingWorldBuildingOreWallPointInsideTopDiamond(
        offsetX,
        offsetY,
        halfWidth,
        halfHeight
      )
    ) {
      continue;
    }

    graphics.circle(centerX + offsetX, centerY + offsetY, 1.1).fill({
      color: surface.accentColor,
      alpha: 0.75,
    });
  }
}

/**
 * Coal: dark glossy facet cuts.
 */
function drawingWorldBuildingOreWallCoalFacetOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
  surface: DefiningWorldPlazaOreWallSurfaceEntry
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  for (
    let facetIndex = 0;
    facetIndex < DRAWING_WORLD_BUILDING_ORE_WALL_COAL_FACET_COUNT;
    facetIndex += 1
  ) {
    const startMix = mappingWorldPlazaGrassSeededUnitToFloatRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        3101 + facetIndex * 7
      ),
      0.12,
      0.55
    );
    const endMix = mappingWorldPlazaGrassSeededUnitToFloatRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        3203 + facetIndex * 11
      ),
      0.45,
      0.88
    );
    const yMix = mappingWorldPlazaGrassSeededUnitToFloatRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        3307 + facetIndex * 13
      ),
      -0.7,
      0.7
    );
    const rowOffsetY = yMix * halfHeight * 0.85;
    const normalizedRow = Math.abs(rowOffsetY) / halfHeight;
    const rowHalfWidth = halfWidth * (1 - normalizedRow) * 0.9;
    const startX = centerX - rowHalfWidth + rowHalfWidth * 2 * startMix;
    const endX = centerX - rowHalfWidth + rowHalfWidth * 2 * endMix;
    const isHighlight =
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        3401 + facetIndex
      ) > 0.5;

    graphics
      .moveTo(startX, centerY + rowOffsetY)
      .lineTo(endX, centerY + rowOffsetY + (isHighlight ? -1.2 : 1.2))
      .stroke({
        width: 1.5,
        color: isHighlight ? surface.accentColor : surface.secondaryAccentColor,
        alpha: 0.7,
        cap: 'square',
      });
  }
}

/**
 * Metal ores: colored flecks / mineral patches on stone.
 */
function drawingWorldBuildingOreWallMetalFlecksOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
  surface: DefiningWorldPlazaOreWallSurfaceEntry
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  for (
    let fleckIndex = 0;
    fleckIndex < DRAWING_WORLD_BUILDING_ORE_WALL_METAL_FLECK_COUNT;
    fleckIndex += 1
  ) {
    const unitX = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      3503 + fleckIndex * 15
    );
    const unitY = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      3607 + fleckIndex * 21
    );
    const offsetX = (unitX - 0.5) * halfWidth * 1.5;
    const offsetY = (unitY - 0.5) * halfHeight * 1.5;

    if (
      !checkingWorldBuildingOreWallPointInsideTopDiamond(
        offsetX,
        offsetY,
        halfWidth,
        halfHeight
      )
    ) {
      continue;
    }

    const sizePx = mappingWorldPlazaGrassSeededUnitToFloatRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        3701 + fleckIndex
      ),
      1.4,
      3.6
    );
    const usePrimary =
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        3803 + fleckIndex
      ) > 0.38;
    const fleckColor = usePrimary
      ? surface.accentColor
      : surface.secondaryAccentColor;

    graphics
      .ellipse(centerX + offsetX, centerY + offsetY, sizePx, sizePx * 0.55)
      .fill({ color: fleckColor, alpha: 0.88 });
  }
}

/**
 * Draws the ore-specific top-face overlay for one placed ore wall.
 */
export function drawingWorldBuildingOreWallTopFaceTextureOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
  surface: DefiningWorldPlazaOreWallSurfaceEntry
): void {
  switch (surface.pattern) {
    case 'claySediment':
      drawingWorldBuildingOreWallClaySedimentOnGraphics(
        graphics,
        centerX,
        centerY,
        surface
      );
      return;
    case 'niterCrust':
      drawingWorldBuildingOreWallNiterCrustOnGraphics(
        graphics,
        tileX,
        tileY,
        centerX,
        centerY,
        surface
      );
      return;
    case 'coalFacet':
      drawingWorldBuildingOreWallCoalFacetOnGraphics(
        graphics,
        tileX,
        tileY,
        centerX,
        centerY,
        surface
      );
      return;
    case 'metalFlecks':
      drawingWorldBuildingOreWallMetalFlecksOnGraphics(
        graphics,
        tileX,
        tileY,
        centerX,
        centerY,
        surface
      );
      return;
  }
}
