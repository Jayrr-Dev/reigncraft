import {
  DEFINING_WORLD_PLAZA_BIOME_WATER_PALETTES,
  type DefiningWorldPlazaBiomeWaterPalette,
} from "@/components/world/domains/definingWorldPlazaBiomeWaterPaletteConstants";
import type { DefiningWorldPlazaWaterKind } from "@/components/world/domains/definingWorldPlazaWaterKind";
import { resolvingWorldPlazaBiomeAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";

/**
 * Resolves biome-specific bed and surface colors for surface water tiles.
 *
 * @module components/world/domains/resolvingWorldPlazaBiomeWaterPaletteAtTileIndex
 */

/**
 * Returns the water color palette for one tile and water kind, or null when
 * the biome does not define that kind.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param waterKind - Lake, river, stream, pond, or swamp pond variant.
 */
export function resolvingWorldPlazaBiomeWaterPaletteAtTileIndex(
  tileX: number,
  tileY: number,
  waterKind: DefiningWorldPlazaWaterKind,
): DefiningWorldPlazaBiomeWaterPalette | null {
  const biomeKind = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind;

  return DEFINING_WORLD_PLAZA_BIOME_WATER_PALETTES[biomeKind][waterKind] ?? null;
}

/**
 * Returns the floor bed color for one surface water tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param waterKind - Lake, river, stream, pond, or swamp pond variant.
 */
export function resolvingWorldPlazaBiomeWaterBedFillColorAtTileIndex(
  tileX: number,
  tileY: number,
  waterKind: DefiningWorldPlazaWaterKind,
): number | null {
  const palette = resolvingWorldPlazaBiomeWaterPaletteAtTileIndex(
    tileX,
    tileY,
    waterKind,
  );

  return palette?.bedFillColor ?? null;
}
