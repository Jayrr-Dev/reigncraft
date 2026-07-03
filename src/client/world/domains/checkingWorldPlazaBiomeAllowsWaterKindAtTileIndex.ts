import { DEFINING_WORLD_PLAZA_BIOME_ALLOWED_WATER_KINDS } from "@/components/world/domains/definingWorldPlazaBiomeWaterPlacementConstants";
import type { DefiningWorldPlazaWaterKind } from "@/components/world/domains/definingWorldPlazaWaterKind";
import { resolvingWorldPlazaBiomeAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";

/**
 * Biome gates for procedural surface water placement.
 *
 * @module components/world/domains/checkingWorldPlazaBiomeAllowsWaterKindAtTileIndex
 */

/**
 * Returns true when the tile's biome may host the given water kind.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param waterKind - Lake, river, stream, pond, or swamp pond variant.
 */
export function checkingWorldPlazaBiomeAllowsWaterKindAtTileIndex(
  tileX: number,
  tileY: number,
  waterKind: DefiningWorldPlazaWaterKind,
): boolean {
  const biomeKind = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind;
  const allowedWaterKinds =
    DEFINING_WORLD_PLAZA_BIOME_ALLOWED_WATER_KINDS[biomeKind];

  return allowedWaterKinds.includes(waterKind);
}
