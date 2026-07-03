import {
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_DEPTH_MAX_BLOCKS,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_SURFACE_LAYER_ALPHA,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_SURFACE_LAYER_ALPHA_MIN,
  DEFINING_WORLD_PLAZA_WATER_LAKE_INFLOW_MOUTH_SURFACE_MAX_MIX,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_EDGE_SURFACE_HIGHLIGHT_COLOR,
  DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_EDGE_SURFACE_HIGHLIGHT_MIX,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
} from "@/components/world/domains/definingWorldPlazaWaterKind";
import {
  clampingWorldPlazaWaterUnitFloat,
  mappingWorldPlazaWaterUnitFloatToRange,
  mixingWorldPlazaWaterRgbColors,
} from "@/components/world/domains/mixingWorldPlazaWaterRgbColors";
import { resolvingWorldPlazaBiomeWaterPaletteAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaBiomeWaterPaletteAtTileIndex";
import { resolvingWorldPlazaLakeInflowSourceCardinalDeltaAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaLakeInflowDirectionAtTileIndex";
import { resolvingWorldPlazaWaterAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex";

/**
 * Resolves shallow-water depth bands for lake tiles near the shore.
 *
 * Depth 1 touches the bank; deeper bands sit further into open water. Tiles
 * beyond the shallow band read as the deep lake center.
 *
 * @module components/world/domains/resolvingWorldPlazaLakeWaterDepthAtTileIndex
 */

/** Safety cap when searching for the nearest non-lake tile in open water. */
const RESOLVING_WORLD_PLAZA_LAKE_WATER_SHORE_DISTANCE_SEARCH_MAX_BLOCKS = 128;

/** Lake surface tint and opacity for one draw pass. */
export interface ResolvingWorldPlazaLakeSurfaceAppearance {
  /** Surface tint color. */
  color: number;
  /** Surface tint opacity. */
  alpha: number;
}

/**
 * Returns true when the tile holds lake surface water.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaLakeWaterTileAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

  return waterTile?.kind === DEFINING_WORLD_PLAZA_WATER_KIND_LAKE;
}

/**
 * Returns Chebyshev distance from a lake tile to the nearest non-lake tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function findingWorldPlazaLakeWaterShoreDistanceBlocksAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  if (!checkingWorldPlazaLakeWaterTileAtTileIndex(tileX, tileY)) {
    return null;
  }

  for (
    let band = 1;
    band <= RESOLVING_WORLD_PLAZA_LAKE_WATER_SHORE_DISTANCE_SEARCH_MAX_BLOCKS;
    band += 1
  ) {
    for (let deltaY = -band; deltaY <= band; deltaY += 1) {
      for (let deltaX = -band; deltaX <= band; deltaX += 1) {
        const isOnRingEdge =
          Math.max(Math.abs(deltaX), Math.abs(deltaY)) === band;

        if (!isOnRingEdge) {
          continue;
        }

        if (
          !checkingWorldPlazaLakeWaterTileAtTileIndex(
            tileX + deltaX,
            tileY + deltaY,
          )
        ) {
          return band;
        }
      }
    }
  }

  return null;
}

/**
 * Maps a shallow band index to a [0, 1] mix toward the deep lake tone.
 *
 * @param shallowDepthBand - Shore-distance band from
 *   {@link resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex}.
 */
function resolvingWorldPlazaLakeShoreDepthMixUnitFromBand(
  shallowDepthBand: number,
): number {
  const shallowMax = DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_DEPTH_MAX_BLOCKS;

  if (shallowMax <= 1) {
    return 0;
  }

  return clampingWorldPlazaWaterUnitFloat(
    (shallowDepthBand - 1) / (shallowMax - 1),
  );
}

/**
 * Returns the shore-distance band for a lake tile, or null for deep water.
 *
 * Band 1 is adjacent to the bank. Tiles farther than the shallow max return
 * null so the caller renders them as the deep lake center.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  const shoreDistanceBlocks =
    findingWorldPlazaLakeWaterShoreDistanceBlocksAtTileIndex(tileX, tileY);

  if (
    shoreDistanceBlocks === null ||
    shoreDistanceBlocks >
      DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_DEPTH_MAX_BLOCKS
  ) {
    return null;
  }

  return shoreDistanceBlocks;
}

/**
 * Returns the biome lake palette for one tile, or null when missing.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function resolvingWorldPlazaLakeBiomeWaterPaletteAtTileIndex(
  tileX: number,
  tileY: number,
) {
  return resolvingWorldPlazaBiomeWaterPaletteAtTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  );
}

/**
 * Returns the lake floor bed color for a tile, lighter near the shore.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaLakeBedFillColorAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const palette = resolvingWorldPlazaLakeBiomeWaterPaletteAtTileIndex(
    tileX,
    tileY,
  );

  if (!palette) {
    return 0x0e3d5c;
  }

  const shallowBand = resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex(
    tileX,
    tileY,
  );

  if (shallowBand === null) {
    return palette.bedFillColor;
  }

  const shallowBedFillColor =
    palette.lakeShallowBedFillColor ?? palette.bedFillColor;

  return mixingWorldPlazaWaterRgbColors(
    shallowBedFillColor,
    palette.bedFillColor,
    resolvingWorldPlazaLakeShoreDepthMixUnitFromBand(shallowBand),
  );
}

/**
 * Returns the lake surface tint for a shallow band, or null for deep water.
 *
 * @param shallowDepthBand - Shore-distance band from
 *   {@link resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex}.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaLakeShallowSurfaceColorFromBand(
  shallowDepthBand: number | null,
  tileX: number,
  tileY: number,
): number | null {
  if (shallowDepthBand === null) {
    return null;
  }

  const palette = resolvingWorldPlazaLakeBiomeWaterPaletteAtTileIndex(
    tileX,
    tileY,
  );

  if (!palette) {
    return null;
  }

  const depthMix = resolvingWorldPlazaLakeShoreDepthMixUnitFromBand(
    shallowDepthBand,
  );
  const shallowSurfaceColor =
    palette.lakeShallowSurfaceColor ?? palette.surfaceLayerColor;
  const blendedSurfaceColor = mixingWorldPlazaWaterRgbColors(
    shallowSurfaceColor,
    palette.surfaceLayerColor,
    depthMix,
  );

  if (shallowDepthBand === 1) {
    return mixingWorldPlazaWaterRgbColors(
      blendedSurfaceColor,
      DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_EDGE_SURFACE_HIGHLIGHT_COLOR,
      DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_EDGE_SURFACE_HIGHLIGHT_MIX,
    );
  }

  return blendedSurfaceColor;
}

/**
 * Returns lake surface opacity for a shallow band; lighter near the shore.
 *
 * @param shallowDepthBand - Shore-distance band from
 *   {@link resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex}.
 */
export function resolvingWorldPlazaLakeShallowSurfaceAlphaFromBand(
  shallowDepthBand: number,
): number {
  const depthMix = resolvingWorldPlazaLakeShoreDepthMixUnitFromBand(
    shallowDepthBand,
  );

  return mappingWorldPlazaWaterUnitFloatToRange(
    1 - depthMix,
    DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_SURFACE_LAYER_ALPHA_MIN,
    DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_SURFACE_LAYER_ALPHA,
  );
}

/**
 * Returns a mix toward flowing-water tint when a river or stream feeds this lake.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param shallowDepthBand - Shore-distance band from
 *   {@link resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex}.
 */
function resolvingWorldPlazaLakeInflowMouthSurfaceMixAtTileIndex(
  tileX: number,
  tileY: number,
  shallowDepthBand: number,
): number {
  if (shallowDepthBand > DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_DEPTH_MAX_BLOCKS) {
    return 0;
  }

  const sourceDelta = resolvingWorldPlazaLakeInflowSourceCardinalDeltaAtTileIndex(
    tileX,
    tileY,
  );
  const inflowNeighborWaterTile = resolvingWorldPlazaWaterAtTileIndex(
    tileX + sourceDelta.deltaX,
    tileY + sourceDelta.deltaY,
  );

  if (
    inflowNeighborWaterTile?.kind !== DEFINING_WORLD_PLAZA_WATER_KIND_RIVER &&
    inflowNeighborWaterTile?.kind !== DEFINING_WORLD_PLAZA_WATER_KIND_STREAM
  ) {
    return 0;
  }

  const shallowMax = DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_DEPTH_MAX_BLOCKS;
  const shoreProximityUnit = clampingWorldPlazaWaterUnitFloat(
    1 - (shallowDepthBand - 1) / Math.max(1, shallowMax - 1),
  );

  return mappingWorldPlazaWaterUnitFloatToRange(
    shoreProximityUnit,
    0,
    DEFINING_WORLD_PLAZA_WATER_LAKE_INFLOW_MOUTH_SURFACE_MAX_MIX,
  );
}

/**
 * Returns the lake surface tint and opacity for one tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaLakeSurfaceAppearanceAtTileIndex(
  tileX: number,
  tileY: number,
): ResolvingWorldPlazaLakeSurfaceAppearance | null {
  const palette = resolvingWorldPlazaLakeBiomeWaterPaletteAtTileIndex(
    tileX,
    tileY,
  );

  if (!palette) {
    return null;
  }

  const shallowBand = resolvingWorldPlazaLakeWaterShallowDepthAtTileIndex(
    tileX,
    tileY,
  );

  if (shallowBand === null) {
    return {
      color: palette.surfaceLayerColor,
      alpha: palette.surfaceLayerAlpha,
    };
  }

  const shallowSurfaceColor = resolvingWorldPlazaLakeShallowSurfaceColorFromBand(
    shallowBand,
    tileX,
    tileY,
  );

  if (shallowSurfaceColor === null) {
    return null;
  }

  const inflowMouthMix = resolvingWorldPlazaLakeInflowMouthSurfaceMixAtTileIndex(
    tileX,
    tileY,
    shallowBand,
  );

  if (inflowMouthMix <= 0) {
    return {
      color: shallowSurfaceColor,
      alpha: resolvingWorldPlazaLakeShallowSurfaceAlphaFromBand(shallowBand),
    };
  }

  const inflowSourceDelta =
    resolvingWorldPlazaLakeInflowSourceCardinalDeltaAtTileIndex(tileX, tileY);
  const inflowNeighborWaterTile = resolvingWorldPlazaWaterAtTileIndex(
    tileX + inflowSourceDelta.deltaX,
    tileY + inflowSourceDelta.deltaY,
  );
  const flowingPalette =
    inflowNeighborWaterTile?.kind === DEFINING_WORLD_PLAZA_WATER_KIND_RIVER ||
    inflowNeighborWaterTile?.kind === DEFINING_WORLD_PLAZA_WATER_KIND_STREAM
      ? resolvingWorldPlazaBiomeWaterPaletteAtTileIndex(
          tileX + inflowSourceDelta.deltaX,
          tileY + inflowSourceDelta.deltaY,
          inflowNeighborWaterTile.kind,
        )
      : null;

  if (!flowingPalette) {
    return {
      color: shallowSurfaceColor,
      alpha: resolvingWorldPlazaLakeShallowSurfaceAlphaFromBand(shallowBand),
    };
  }

  const shallowAlpha =
    resolvingWorldPlazaLakeShallowSurfaceAlphaFromBand(shallowBand);

  return {
    color: mixingWorldPlazaWaterRgbColors(
      shallowSurfaceColor,
      flowingPalette.surfaceLayerColor,
      inflowMouthMix,
    ),
    alpha:
      shallowAlpha +
      (flowingPalette.surfaceLayerAlpha - shallowAlpha) * inflowMouthMix,
  };
}
