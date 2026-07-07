import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpawnAnchor,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { parsingWildlifeProceduralAnchorId } from '@/components/world/wildlife/domains/parsingWildlifeProceduralAnchorId';
import { resolvingWildlifeSpawnAtTileIndex } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnAtTileIndex';

/**
 * Rebuilds the think-schedule anchor for a dead instance awaiting respawn.
 */
export function resolvingWildlifePendingRespawnThinkAnchor(
  instance: DefiningWildlifeInstance
): DefiningWildlifeSpawnAnchor {
  const parsedAnchor = parsingWildlifeProceduralAnchorId(instance.anchorId);

  if (parsedAnchor) {
    const resolvedAnchor = resolvingWildlifeSpawnAtTileIndex(
      parsedAnchor.tileX,
      parsedAnchor.tileY,
      parsedAnchor.packIndex
    );

    if (resolvedAnchor) {
      return resolvedAnchor;
    }
  }

  return {
    anchorId: instance.anchorId,
    tileX: Math.floor(instance.spawnAnchor.x),
    tileY: Math.floor(instance.spawnAnchor.y),
    speciesId: instance.speciesId,
    packIndex: 0,
    packSize: 1,
    seed: instance.diedAtMs ?? 0,
  };
}
