import {
  blendingWorldPlazaRgbColors,
  quantizingWorldPlazaRgbColor,
} from "@/components/world/domains/blendingWorldPlazaRgbColors";
import {
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_CLAY_ACCENT_COLOR,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_CLAY_FILL_COLOR,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_SAND_FILL_COLOR,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_SANDY_CLAY_FILL_COLOR,
  DEFINING_WORLD_PLAZA_OCEAN_SHORE_WET_SAND_FILL_COLOR,
} from "@/components/world/domains/definingWorldPlazaOceanShoreConstants";
import { resolvingWorldPlazaBlendedBiomeTileFillColor } from "@/components/world/domains/resolvingWorldPlazaBlendedBiomeTileFillColor";
import { resolvingWorldPlazaOceanShoreDepthAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex";
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from "@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex";

/**
 * Floor fill colors for sandy beach blocks around open ocean shorelines.
 *
 * @module components/world/domains/resolvingWorldPlazaOceanShoreBlockFillColorAtTileIndex
 */

/** Peak blend toward biome grass on the outermost beach ring. */
const RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_BIOME_BLEND = 0.48;

/** Accent patch blend strength on outer beach tiles. */
const RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_ACCENT_BLEND = 0.24;

/** Accent patch threshold on outer beach tiles. */
const RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_ACCENT_THRESHOLD = 0.68;

/** Depth at which beach tiles begin softening into the inland biome. */
const RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_BLEND_START_DEPTH_BLOCKS = 9;

/**
 * Returns the base sandy/clay tone for one beach depth ring.
 *
 * @param shoreDepthBlocks - Distance from the ocean edge in blocks.
 */
function resolvingWorldPlazaOceanShoreBaseFillColorFromDepth(
  shoreDepthBlocks: number,
): number {
  if (shoreDepthBlocks <= 2) {
    return DEFINING_WORLD_PLAZA_OCEAN_SHORE_WET_SAND_FILL_COLOR;
  }

  if (shoreDepthBlocks <= 5) {
    return DEFINING_WORLD_PLAZA_OCEAN_SHORE_SAND_FILL_COLOR;
  }

  if (shoreDepthBlocks <= 8) {
    return DEFINING_WORLD_PLAZA_OCEAN_SHORE_SANDY_CLAY_FILL_COLOR;
  }

  return DEFINING_WORLD_PLAZA_OCEAN_SHORE_CLAY_FILL_COLOR;
}

/**
 * Resolves the floor diamond fill for one ocean beach block.
 *
 * Inner rings read as wet sand and clay. The outer rings soften into the biome
 * so the coastline does not end on a hard square edge.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaOceanShoreBlockFillColorAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  const shoreDepthBlocks = resolvingWorldPlazaOceanShoreDepthAtTileIndex(
    tileX,
    tileY,
  );

  if (shoreDepthBlocks === null) {
    return null;
  }

  let shoreColor = resolvingWorldPlazaOceanShoreBaseFillColorFromDepth(
    shoreDepthBlocks,
  );
  const biomeColor = resolvingWorldPlazaBlendedBiomeTileFillColor(tileX, tileY);

  if (shoreDepthBlocks >= RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_BLEND_START_DEPTH_BLOCKS) {
    const outerBlendStrength =
      (shoreDepthBlocks -
        RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_BLEND_START_DEPTH_BLOCKS +
        1) /
      (12 - RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_BLEND_START_DEPTH_BLOCKS + 1);

    shoreColor = blendingWorldPlazaRgbColors(
      shoreColor,
      biomeColor,
      Math.min(
        1,
        outerBlendStrength * RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_BIOME_BLEND,
      ),
    );
  }

  const accentSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    6187,
  );

  if (
    shoreDepthBlocks >= 8 &&
    accentSeed >= RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_ACCENT_THRESHOLD
  ) {
    const accentBlend =
      ((accentSeed - RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_ACCENT_THRESHOLD) /
        (1 - RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_ACCENT_THRESHOLD)) *
      RESOLVING_WORLD_PLAZA_OCEAN_SHORE_OUTER_ACCENT_BLEND;

    shoreColor = blendingWorldPlazaRgbColors(
      shoreColor,
      DEFINING_WORLD_PLAZA_OCEAN_SHORE_CLAY_ACCENT_COLOR,
      accentBlend,
    );
  }

  return quantizingWorldPlazaRgbColor(shoreColor);
}
