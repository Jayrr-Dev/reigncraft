import { DEFINING_WORLD_PLAZA_FROSTSINK_BIOME_KIND } from '@/components/world/domains/definingWorldPlazaFrostsinkBiomeConstants';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';

/**
 * Frostsink biome detection for terrain and prop placement.
 *
 * @module components/world/domains/checkingWorldPlazaTileIsFrostsinkBiomeAtTileIndex
 */

/**
 * Returns true when a tile resolves to the Frostsink biome.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTileIsFrostsinkBiomeAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return (
    resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind ===
    DEFINING_WORLD_PLAZA_FROSTSINK_BIOME_KIND
  );
}
