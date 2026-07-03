import { DEFINING_WORLD_PLAZA_ROCKY_BIOME_KIND } from "@/components/world/domains/definingWorldPlazaRockyBiomeConstants";
import { resolvingWorldPlazaBiomeAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";

/**
 * Rocky biome detection for terrain, stones, and water placement.
 *
 * @module components/world/domains/checkingWorldPlazaTileIsRockyBiomeAtTileIndex
 */

/**
 * Returns true when a tile resolves to the rocky biome.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTileIsRockyBiomeAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return (
    resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind ===
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_KIND
  );
}
