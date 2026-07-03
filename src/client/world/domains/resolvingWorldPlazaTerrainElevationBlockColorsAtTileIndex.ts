import { computingWorldBuildingBlockSideFillColor } from "@/components/world/building/domains/computingWorldBuildingBlockSideFillColor";
import { blendingWorldPlazaRgbColors } from "@/components/world/domains/blendingWorldPlazaRgbColors";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ALPINE_SIDE_FILL_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_HILL_SIDE_FILL_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MOUNTAIN_SIDE_FILL_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_SIDE_FILL_COLOR,
} from "@/components/world/domains/definingWorldPlazaTerrainElevationConstants";
import { resolvingWorldPlazaBiomeAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";
import {
  resolvingWorldPlazaTerrainElevationAtTileIndex,
  type DefiningWorldPlazaTerrainElevationTierKind,
} from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";
import { resolvingWorldPlazaInfiniteTileFillColor } from "@/components/world/domains/resolvingWorldPlazaInfiniteTileFillColor";

/** Blend weight toward the biome dirt or stone accent on cliff sides. */
const RESOLVING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_ACCENT_BLEND = 0.62;

/**
 * Block fill colors for procedural terrain elevation columns.
 *
 * @module components/world/domains/resolvingWorldPlazaTerrainElevationBlockColorsAtTileIndex
 */

/** Drawable colors for one elevation column. */
export interface DefiningWorldPlazaTerrainElevationBlockColors {
  /** Top cap fill on the surface layer. */
  topFillColor: number;
  /** Side face fill for the extruded column. */
  sideFillColor: number;
  /** Edge stroke for caps and vertical faces. */
  strokeColor: number;
}

/**
 * Returns the side fill color for an elevation tier.
 *
 * @param tier - Coarse elevation category.
 */
function resolvingWorldPlazaTerrainElevationSideFillColorForTier(
  tier: DefiningWorldPlazaTerrainElevationTierKind,
): number {
  if (tier === "summit") {
    return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_SIDE_FILL_COLOR;
  }

  if (tier === "alpine") {
    return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ALPINE_SIDE_FILL_COLOR;
  }

  if (tier === "mountain") {
    return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MOUNTAIN_SIDE_FILL_COLOR;
  }

  return DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_HILL_SIDE_FILL_COLOR;
}

/**
 * Resolves terrain-appropriate side fill color without using grass/tree top fill.
 *
 * Uses the tier-based side color blended with biome accent, producing a brown
 * cliff face regardless of the top surface color.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaTerrainElevationTerrainSideFillColorAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const elevation = resolvingWorldPlazaTerrainElevationAtTileIndex(tileX, tileY);
  const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);
  const tierSideFillColor =
    resolvingWorldPlazaTerrainElevationSideFillColorForTier(elevation.tier);

  if (biome.blockAccentColor) {
    return blendingWorldPlazaRgbColors(
      tierSideFillColor,
      biome.blockAccentColor,
      RESOLVING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_ACCENT_BLEND,
    );
  }

  return tierSideFillColor;
}

/**
 * Resolves fill and stroke colors for a procedural elevation column.
 *
 * The top cap reuses the same blended, mottled ground color as flat floor tiles.
 * Side faces mix the biome accent with a darkened sample of that surface so
 * cliffs stay themed and pick up per-tile variation.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaTerrainElevationBlockColorsAtTileIndex(
  tileX: number,
  tileY: number,
): DefiningWorldPlazaTerrainElevationBlockColors {
  const elevation = resolvingWorldPlazaTerrainElevationAtTileIndex(tileX, tileY);
  const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);
  const topFillColor = resolvingWorldPlazaInfiniteTileFillColor(tileX, tileY);
  const darkenedTopFillColor =
    computingWorldBuildingBlockSideFillColor(topFillColor);
  const tierSideFillColor =
    resolvingWorldPlazaTerrainElevationSideFillColorForTier(elevation.tier);
  const sideFillColor = biome.blockAccentColor
    ? blendingWorldPlazaRgbColors(
        darkenedTopFillColor,
        biome.blockAccentColor,
        RESOLVING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_ACCENT_BLEND,
      )
    : blendingWorldPlazaRgbColors(
        darkenedTopFillColor,
        tierSideFillColor,
        0.35,
      );

  return {
    topFillColor,
    sideFillColor,
    strokeColor: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_STROKE_COLOR,
  };
}
