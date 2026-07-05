import { DEFINING_WORLD_PLAZA_FIRELANDS_BIOME_KIND } from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';

/**
 * Firelands biome detection for terrain, lava, and prop placement.
 *
 * @module components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex
 */

/**
 * Returns true when a tile resolves to the Firelands biome.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return (
    resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind ===
    DEFINING_WORLD_PLAZA_FIRELANDS_BIOME_KIND
  );
}
