import { findingWorldPlazaNearestLakeBasinOccupyingTileNearTileIndex } from "@/components/world/domains/checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex";
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
  type DefiningWorldPlazaWaterKind,
} from "@/components/world/domains/definingWorldPlazaWaterKind";
import {
  DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_TRANSITION_MAX_MIX,
  DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_TRANSITION_RADIUS_BLOCKS,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";
import {
  clampingWorldPlazaWaterUnitFloat,
  mappingWorldPlazaWaterUnitFloatToRange,
  mixingWorldPlazaWaterRgbColors,
} from "@/components/world/domains/mixingWorldPlazaWaterRgbColors";
import { resolvingWorldPlazaBiomeWaterPaletteAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaBiomeWaterPaletteAtTileIndex";
import { checkingWorldPlazaFlowingWaterIsOnLakeInflowSideAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaLakeInflowDirectionAtTileIndex";
import { resolvingWorldPlazaLakeSurfaceAppearanceAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaLakeWaterDepthAtTileIndex";

/**
 * Blends river and stream surface tints toward lake color near inflow mouths.
 *
 * @module components/world/domains/resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex
 */

/** Surface tint and opacity for one water draw pass. */
export interface ResolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearance {
  /** Surface tint color. */
  color: number;
  /** Surface tint opacity. */
  alpha: number;
}

/**
 * Returns the Chebyshev distance between two tile coordinates.
 *
 * @param fromTileX - Origin column index.
 * @param fromTileY - Origin row index.
 * @param toTileX - Target column index.
 * @param toTileY - Target row index.
 */
function resolvingWorldPlazaFlowingWaterLakeTransitionChebyshevDistanceBlocks(
  fromTileX: number,
  fromTileY: number,
  toTileX: number,
  toTileY: number,
): number {
  return Math.max(
    Math.abs(toTileX - fromTileX),
    Math.abs(toTileY - fromTileY),
  );
}

/**
 * Returns a [0, 1] mix toward lake surface based on distance from the mouth.
 *
 * @param distanceBlocks - Chebyshev distance to the nearest lake tile.
 */
function resolvingWorldPlazaFlowingWaterLakeTransitionMixFromDistanceBlocks(
  distanceBlocks: number,
): number {
  const transitionRadiusBlocks =
    DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_TRANSITION_RADIUS_BLOCKS;

  if (transitionRadiusBlocks <= 0) {
    return 0;
  }

  const proximityUnit = clampingWorldPlazaWaterUnitFloat(
    1 - distanceBlocks / transitionRadiusBlocks,
  );

  return mappingWorldPlazaWaterUnitFloatToRange(
    proximityUnit,
    0,
    DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_TRANSITION_MAX_MIX,
  );
}

/**
 * Returns blended river or stream surface tint near a lake inflow mouth.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param waterKind - River or stream variant.
 */
export function resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex(
  tileX: number,
  tileY: number,
  waterKind: DefiningWorldPlazaWaterKind,
): ResolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearance | null {
  if (
    waterKind !== DEFINING_WORLD_PLAZA_WATER_KIND_RIVER &&
    waterKind !== DEFINING_WORLD_PLAZA_WATER_KIND_STREAM
  ) {
    return null;
  }

  const flowingPalette = resolvingWorldPlazaBiomeWaterPaletteAtTileIndex(
    tileX,
    tileY,
    waterKind,
  );

  if (!flowingPalette) {
    return null;
  }

  const nearestLakeTile =
    findingWorldPlazaNearestLakeBasinOccupyingTileNearTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_TRANSITION_RADIUS_BLOCKS,
    );

  if (!nearestLakeTile) {
    return {
      color: flowingPalette.surfaceLayerColor,
      alpha: flowingPalette.surfaceLayerAlpha,
    };
  }

  if (
    !checkingWorldPlazaFlowingWaterIsOnLakeInflowSideAtTileIndex(
      tileX,
      tileY,
      nearestLakeTile.tileX,
      nearestLakeTile.tileY,
    )
  ) {
    return {
      color: flowingPalette.surfaceLayerColor,
      alpha: flowingPalette.surfaceLayerAlpha,
    };
  }

  const distanceBlocks =
    resolvingWorldPlazaFlowingWaterLakeTransitionChebyshevDistanceBlocks(
      tileX,
      tileY,
      nearestLakeTile.tileX,
      nearestLakeTile.tileY,
    );
  const transitionMix =
    resolvingWorldPlazaFlowingWaterLakeTransitionMixFromDistanceBlocks(
      distanceBlocks,
    );

  if (transitionMix <= 0) {
    return {
      color: flowingPalette.surfaceLayerColor,
      alpha: flowingPalette.surfaceLayerAlpha,
    };
  }

  const lakeSurfaceAppearance =
    resolvingWorldPlazaLakeSurfaceAppearanceAtTileIndex(
      nearestLakeTile.tileX,
      nearestLakeTile.tileY,
    );

  if (!lakeSurfaceAppearance) {
    return {
      color: flowingPalette.surfaceLayerColor,
      alpha: flowingPalette.surfaceLayerAlpha,
    };
  }

  return {
    color: mixingWorldPlazaWaterRgbColors(
      flowingPalette.surfaceLayerColor,
      lakeSurfaceAppearance.color,
      transitionMix,
    ),
    alpha:
      flowingPalette.surfaceLayerAlpha +
      (lakeSurfaceAppearance.alpha - flowingPalette.surfaceLayerAlpha) *
        transitionMix,
  };
}
