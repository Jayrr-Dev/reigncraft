import type { DefiningWorldPlazaBiomeDefinition } from "@/components/world/domains/definingWorldPlazaBiomeConstants";
import { resolvingWorldPlazaBiomeAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";

/**
 * Resolves the biome under a world position using the isometric tile anchor.
 *
 * @param worldPoint - Player or world position in grid space.
 */
export function resolvingWorldPlazaBiomeAtWorldPoint(
  worldPoint: DefiningWorldPlazaWorldPoint,
): DefiningWorldPlazaBiomeDefinition {
  const { tileX, tileY } =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(worldPoint);

  return resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);
}
