import {
  blendingWorldPlazaRgbColors,
  quantizingWorldPlazaRgbColor,
} from "@/components/world/domains/blendingWorldPlazaRgbColors";
import {
  DEFINING_WORLD_PLAZA_LAKE_SHORE_CLAY_ACCENT_COLOR,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_CLAY_FILL_COLOR,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_SAND_FILL_COLOR,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_SANDY_CLAY_FILL_COLOR,
  DEFINING_WORLD_PLAZA_LAKE_SHORE_WET_SAND_FILL_COLOR,
} from "@/components/world/domains/definingWorldPlazaLakeShoreConstants";
import { resolvingWorldPlazaBlendedBiomeTileFillColor } from "@/components/world/domains/resolvingWorldPlazaBlendedBiomeTileFillColor";
import { resolvingWorldPlazaLakeShoreDepthAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex";
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from "@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex";

/**
 * Floor fill colors for sandy/clay blocks around lake shorelines.
 *
 * @module components/world/domains/resolvingWorldPlazaLakeShoreBlockFillColorAtTileIndex
 */

/** Peak blend toward biome grass on the outermost shore ring. */
const RESOLVING_WORLD_PLAZA_LAKE_SHORE_OUTER_BIOME_BLEND = 0.42;

/** Accent patch blend strength on outer shore tiles. */
const RESOLVING_WORLD_PLAZA_LAKE_SHORE_OUTER_ACCENT_BLEND = 0.28;

/** Accent patch threshold on outer shore tiles. */
const RESOLVING_WORLD_PLAZA_LAKE_SHORE_OUTER_ACCENT_THRESHOLD = 0.68;

/**
 * Returns the base sandy/clay tone for one shore depth ring.
 *
 * @param shoreDepthBlocks - Distance from the lake edge in blocks.
 */
function resolvingWorldPlazaLakeShoreBaseFillColorFromDepth(
  shoreDepthBlocks: number,
): number {
  switch (shoreDepthBlocks) {
    case 1:
      return DEFINING_WORLD_PLAZA_LAKE_SHORE_WET_SAND_FILL_COLOR;
    case 2:
      return DEFINING_WORLD_PLAZA_LAKE_SHORE_SAND_FILL_COLOR;
    case 3:
      return DEFINING_WORLD_PLAZA_LAKE_SHORE_SANDY_CLAY_FILL_COLOR;
    case 4:
      return DEFINING_WORLD_PLAZA_LAKE_SHORE_CLAY_FILL_COLOR;
    default:
      return DEFINING_WORLD_PLAZA_LAKE_SHORE_CLAY_FILL_COLOR;
  }
}

/**
 * Resolves the floor diamond fill for one lake shore block.
 *
 * Inner rings read as wet sand and clay. The outer ring softens into the biome
 * so the shoreline does not end on a hard square edge.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaLakeShoreBlockFillColorAtTileIndex(
  tileX: number,
  tileY: number,
): number | null {
  const shoreDepthBlocks = resolvingWorldPlazaLakeShoreDepthAtTileIndex(
    tileX,
    tileY,
  );

  if (shoreDepthBlocks === null) {
    return null;
  }

  let shoreColor = resolvingWorldPlazaLakeShoreBaseFillColorFromDepth(
    shoreDepthBlocks,
  );
  const biomeColor = resolvingWorldPlazaBlendedBiomeTileFillColor(tileX, tileY);

  if (shoreDepthBlocks >= 5) {
    shoreColor = blendingWorldPlazaRgbColors(
      shoreColor,
      biomeColor,
      RESOLVING_WORLD_PLAZA_LAKE_SHORE_OUTER_BIOME_BLEND,
    );
  }

  const accentSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    5123,
  );

  if (
    shoreDepthBlocks >= 4 &&
    accentSeed >= RESOLVING_WORLD_PLAZA_LAKE_SHORE_OUTER_ACCENT_THRESHOLD
  ) {
    const accentBlend =
      ((accentSeed - RESOLVING_WORLD_PLAZA_LAKE_SHORE_OUTER_ACCENT_THRESHOLD) /
        (1 - RESOLVING_WORLD_PLAZA_LAKE_SHORE_OUTER_ACCENT_THRESHOLD)) *
      RESOLVING_WORLD_PLAZA_LAKE_SHORE_OUTER_ACCENT_BLEND;

    shoreColor = blendingWorldPlazaRgbColors(
      shoreColor,
      DEFINING_WORLD_PLAZA_LAKE_SHORE_CLAY_ACCENT_COLOR,
      accentBlend,
    );
  }

  return quantizingWorldPlazaRgbColor(shoreColor);
}
