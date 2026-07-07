import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_BASE_DIAMOND_COLLISION_CENTER_SOUTH_OFFSET_HEIGHT_FRACTION,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_BASE_DIAMOND_COLLISION_HEIGHT_SCALE,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_BASE_DIAMOND_COLLISION_PADDING_SCALE,
  listingWorldPlazaTerrainRockChunkSpecsForShapeVariant,
} from '@/components/world/domains/definingWorldPlazaTerrainRockConstants';
import { resolvingWorldPlazaColumnRockCollisionCenterGridPointFromMetadata } from '@/components/world/domains/resolvingWorldPlazaColumnRockCollisionRadiusGridFromMetadata';
import type { DefiningWorldPlazaColumnRockMetadata } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';

/**
 * Diamond collider sizing for procedural column-rock mega-boulders.
 *
 * The drawn boulder rests on a screen-axis-aligned diamond base whose horizontal
 * half-width scales independently from its vertical half-height. A single circle
 * cannot follow that footprint, so collision and the debug overlay use a diamond
 * sized to the same scales the renderer uses (single source of truth with the
 * silhouette). All math stays in grid space: the screen tile half-extents cancel
 * because both axes derive from the same isometric projection.
 *
 * @module components/world/domains/resolvingWorldPlazaColumnRockBaseDiamondFromMetadata
 */

/** Below this gradient magnitude the diamond push direction is degenerate. */
const RESOLVING_WORLD_PLAZA_COLUMN_ROCK_BASE_DIAMOND_MIN_GRADIENT_MAGNITUDE_SQUARED = 1e-8;

/**
 * Converts a grid-distance player radius into diagonal axis (u/v) scale units.
 *
 * The diamond half-extents measure the |dx - dy| and |dx + dy| diagonals, whose
 * unit step covers 1/sqrt(2) of a grid tile. Multiplying the radius by sqrt(2)
 * inflates each face by exactly the player radius in real grid distance.
 */
const RESOLVING_WORLD_PLAZA_COLUMN_ROCK_BASE_DIAMOND_DIAGONAL_AXIS_SCALE =
  Math.SQRT2;

/**
 * Grid-space diamond matching the drawn boulder base.
 *
 * {@link scaleWidth}/{@link scaleHeight} are the renderer's chunk half-extent
 * scales (1.0 = one full tile half-diamond on the matching screen axis). A grid
 * point is inside when {@code |dx - dy| / scaleWidth + |dx + dy| / scaleHeight}
 * stays within 1 relative to the diamond center.
 */
export interface DefiningWorldPlazaColumnRockBaseDiamond {
  /** Diamond center X in grid space (footprint center). */
  readonly centerGridX: number;
  /** Diamond center Y in grid space (footprint center). */
  readonly centerGridY: number;
  /** Half-extent scale along the screen-X grid diagonal (dx - dy axis). */
  readonly scaleWidth: number;
  /** Half-extent scale along the screen-Y grid diagonal (dx + dy axis). */
  readonly scaleHeight: number;
}

/**
 * Returns the grid-space diamond matching one boulder's drawn base footprint.
 *
 * Uses the same shape-variant chunk scales as the renderer, trimmed to the south
 * ground contact (west, south, and east silhouette base). The full renderer base
 * facet diamond includes a north half with no front-facing rock volume.
 *
 * @param metadata - Anchor column-rock metadata.
 */
export function resolvingWorldPlazaColumnRockBaseDiamondFromMetadata(
  metadata: DefiningWorldPlazaColumnRockMetadata
): DefiningWorldPlazaColumnRockBaseDiamond {
  const colliderCenter =
    resolvingWorldPlazaColumnRockCollisionCenterGridPointFromMetadata(metadata);
  const chunkSpecs = listingWorldPlazaTerrainRockChunkSpecsForShapeVariant(
    metadata.shapeVariantIndex,
    metadata.surfaceWorldLayer,
    metadata.footprintTileWidth,
    metadata.footprintTileHeight
  );

  let visualScaleWidth = 0;
  let visualScaleHeight = 0;

  for (const chunkSpec of chunkSpecs) {
    visualScaleWidth = Math.max(visualScaleWidth, chunkSpec.halfWidthScale);
    visualScaleHeight = Math.max(visualScaleHeight, chunkSpec.halfHeightScale);
  }

  const paddingScale =
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_BASE_DIAMOND_COLLISION_PADDING_SCALE;
  const scaleWidth = visualScaleWidth + paddingScale;
  const scaleHeight =
    (visualScaleHeight + paddingScale) *
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_BASE_DIAMOND_COLLISION_HEIGHT_SCALE;
  const southOffsetGrid =
    visualScaleHeight *
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_BASE_DIAMOND_COLLISION_CENTER_SOUTH_OFFSET_HEIGHT_FRACTION;

  return {
    centerGridX: colliderCenter.x + southOffsetGrid,
    centerGridY: colliderCenter.y + southOffsetGrid,
    scaleWidth,
    scaleHeight,
  };
}

/**
 * Returns the diamond membership value for a grid point.
 *
 * Values at or below 1 lie inside the diamond. Player footprint contact tests
 * inflate the diamond extents first, then compare this value against 1.
 *
 * @param diamond - Boulder base diamond.
 * @param gridX - Grid point X.
 * @param gridY - Grid point Y.
 */
function resolvingWorldPlazaColumnRockBaseDiamondMembershipValue(
  diamond: DefiningWorldPlazaColumnRockBaseDiamond,
  gridX: number,
  gridY: number
): number {
  const deltaX = gridX - diamond.centerGridX;
  const deltaY = gridY - diamond.centerGridY;

  return (
    Math.abs(deltaX - deltaY) / diamond.scaleWidth +
    Math.abs(deltaX + deltaY) / diamond.scaleHeight
  );
}

/**
 * Returns a diamond grown outward by one player footprint radius.
 *
 * Each half-extent gains the radius in real grid distance (converted to the
 * diagonal u/v axis units). Growing the extents directly keeps the contact
 * boundary hugging the rock face on every side, unlike scaling membership which
 * inflates the wide axis by the same factor as the thin axis and pushes the
 * stop line a full rock-width out into the surrounding footprint tiles.
 *
 * @param diamond - Boulder base diamond (rock face).
 * @param playerRadiusGrid - Player footprint radius in grid tiles.
 */
function resolvingWorldPlazaColumnRockBaseDiamondInflatedByPlayerRadius(
  diamond: DefiningWorldPlazaColumnRockBaseDiamond,
  playerRadiusGrid: number
): DefiningWorldPlazaColumnRockBaseDiamond {
  if (playerRadiusGrid <= 0) {
    return diamond;
  }

  const axisInflation =
    playerRadiusGrid *
    RESOLVING_WORLD_PLAZA_COLUMN_ROCK_BASE_DIAMOND_DIAGONAL_AXIS_SCALE;

  return {
    centerGridX: diamond.centerGridX,
    centerGridY: diamond.centerGridY,
    scaleWidth: diamond.scaleWidth + axisInflation,
    scaleHeight: diamond.scaleHeight + axisInflation,
  };
}

/**
 * Returns true when a player footprint overlaps the boulder base diamond.
 *
 * @param diamond - Boulder base diamond.
 * @param gridX - Player footprint center X in grid space.
 * @param gridY - Player footprint center Y in grid space.
 * @param playerRadiusGrid - Player footprint radius in grid tiles.
 */
export function checkingWorldPlazaColumnRockBaseDiamondContainsPlayerFootprint(
  diamond: DefiningWorldPlazaColumnRockBaseDiamond,
  gridX: number,
  gridY: number,
  playerRadiusGrid: number
): boolean {
  const contactDiamond =
    resolvingWorldPlazaColumnRockBaseDiamondInflatedByPlayerRadius(
      diamond,
      playerRadiusGrid
    );

  return (
    resolvingWorldPlazaColumnRockBaseDiamondMembershipValue(
      contactDiamond,
      gridX,
      gridY
    ) <= 1
  );
}

/**
 * Pushes a grid point out to the boulder base diamond's inflated edge.
 *
 * Resolution moves along the diamond edge normal in the diagonal grid metric, so
 * the avatar stops one footprint radius short of the visible rock face. Returns
 * the point unchanged when it already clears the diamond.
 *
 * @param diamond - Boulder base diamond.
 * @param gridX - Current resolved X.
 * @param gridY - Current resolved Y.
 * @param playerRadiusGrid - Player footprint radius in grid tiles.
 */
export function resolvingWorldPlazaPointPushedOutsideColumnRockBaseDiamond(
  diamond: DefiningWorldPlazaColumnRockBaseDiamond,
  gridX: number,
  gridY: number,
  playerRadiusGrid: number
): DefiningWorldPlazaWorldPoint {
  const contactDiamond =
    resolvingWorldPlazaColumnRockBaseDiamondInflatedByPlayerRadius(
      diamond,
      playerRadiusGrid
    );
  const deltaX = gridX - contactDiamond.centerGridX;
  const deltaY = gridY - contactDiamond.centerGridY;
  const diagonalU = deltaX - deltaY;
  const diagonalV = deltaX + deltaY;
  const membership =
    Math.abs(diagonalU) / contactDiamond.scaleWidth +
    Math.abs(diagonalV) / contactDiamond.scaleHeight;

  if (membership >= 1) {
    return { x: gridX, y: gridY };
  }

  const signU = Math.sign(diagonalU);
  const signV = Math.sign(diagonalV);

  const resolvedSignU = signU === 0 && signV === 0 ? 1 : signU;
  const gradientU = resolvedSignU / contactDiamond.scaleWidth;
  const gradientV = signV / contactDiamond.scaleHeight;
  const gradientMagnitudeSquared =
    gradientU * gradientU + gradientV * gradientV;

  if (
    gradientMagnitudeSquared <
    RESOLVING_WORLD_PLAZA_COLUMN_ROCK_BASE_DIAMOND_MIN_GRADIENT_MAGNITUDE_SQUARED
  ) {
    return { x: gridX, y: gridY };
  }

  const membershipDeficit = 1 - membership;
  const pushedU =
    diagonalU + (gradientU * membershipDeficit) / gradientMagnitudeSquared;
  const pushedV =
    diagonalV + (gradientV * membershipDeficit) / gradientMagnitudeSquared;

  return {
    x: contactDiamond.centerGridX + (pushedU + pushedV) / 2,
    y: contactDiamond.centerGridY + (pushedV - pushedU) / 2,
  };
}

/**
 * Returns the boulder base diamond's screen half-extents in pixels.
 *
 * Mirrors the renderer's chunk sizing so the debug outline overlays the drawn
 * silhouette base exactly.
 *
 * @param diamond - Boulder base diamond.
 * @param halfTileWidthPx - Isometric half tile width in pixels.
 * @param halfTileHeightPx - Isometric half tile height in pixels.
 */
export function resolvingWorldPlazaColumnRockBaseDiamondScreenHalfExtentsPx(
  diamond: DefiningWorldPlazaColumnRockBaseDiamond,
  halfTileWidthPx: number,
  halfTileHeightPx: number
): { readonly halfWidthPx: number; readonly halfHeightPx: number } {
  return {
    halfWidthPx: halfTileWidthPx * diamond.scaleWidth,
    halfHeightPx: halfTileHeightPx * diamond.scaleHeight,
  };
}

/**
 * Returns screen half-extents for the player contact boundary around a boulder.
 *
 * Scales the rock-face diamond by the same membership ceiling used in gameplay so
 * the debug overlay shows where the avatar center stops, not just the rock face.
 *
 * @param diamond - Boulder base diamond.
 * @param halfTileWidthPx - Isometric half tile width in pixels.
 * @param halfTileHeightPx - Isometric half tile height in pixels.
 * @param playerRadiusGrid - Player footprint radius in grid tiles.
 */
export function resolvingWorldPlazaColumnRockBaseDiamondPlayerContactScreenHalfExtentsPx(
  diamond: DefiningWorldPlazaColumnRockBaseDiamond,
  halfTileWidthPx: number,
  halfTileHeightPx: number,
  playerRadiusGrid: number
): { readonly halfWidthPx: number; readonly halfHeightPx: number } {
  const contactDiamond =
    resolvingWorldPlazaColumnRockBaseDiamondInflatedByPlayerRadius(
      diamond,
      playerRadiusGrid
    );

  return resolvingWorldPlazaColumnRockBaseDiamondScreenHalfExtentsPx(
    contactDiamond,
    halfTileWidthPx,
    halfTileHeightPx
  );
}
