import { checkingWorldPlazaOceanBiomeSpawnClearingAtTileIndex } from "@/components/world/domains/checkingWorldPlazaOceanBiomeSpawnClearingAtTileIndex";
import { pickingWorldPlazaBiomeKindFromClimate } from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";
import { resolvingWorldPlazaClimateAtTile } from "@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex";
import { checkingWorldPlazaIslandModeForcesOceanAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaIslandModeZoneAtTileIndex";

/**
 * Ocean biome checks for procedural water and shoreline placement.
 *
 * @module components/world/domains/checkingWorldPlazaOceanBiomeAtTileIndex
 */

/**
 * Returns true when the tile belongs to the open ocean biome.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaOceanBiomeAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (checkingWorldPlazaOceanBiomeSpawnClearingAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (checkingWorldPlazaIslandModeForcesOceanAtTileIndex(tileX, tileY)) {
    return true;
  }

  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);

  return (
    pickingWorldPlazaBiomeKindFromClimate(
      climate.temperature,
      climate.humidity,
      tileX,
      tileY,
    ) === "ocean"
  );
}
