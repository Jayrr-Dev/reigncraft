/**
 * Shared roam anchor for one spawn-pack tile group.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpawnPackRoamAnchor
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { parsingWildlifeProceduralAnchorId } from '@/components/world/wildlife/domains/parsingWildlifeProceduralAnchorId';

/** Returns the tile-center roam anchor for one spawn-pack group. */
export function resolvingWildlifeSpawnPackRoamAnchor(
  instance: DefiningWildlifeInstance
): DefiningWorldPlazaWorldPoint {
  const parsedAnchor = parsingWildlifeProceduralAnchorId(instance.anchorId);

  if (!parsedAnchor) {
    return instance.spawnAnchor;
  }

  return {
    x: parsedAnchor.tileX + 0.5,
    y: parsedAnchor.tileY + 0.5,
    layer: instance.spawnAnchor.layer,
  };
}
