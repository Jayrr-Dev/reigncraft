import { resolvingWildlifeSpawnAtTileIndex } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnAtTileIndex';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpawnAnchor,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

function parsingWildlifeProceduralAnchorId(
  anchorId: string
): { tileX: number; tileY: number; packIndex: number } | null {
  const parts = anchorId.split(':');

  if (parts.length !== 4 || parts[0] !== 'wildlife' || parts[1] === 'dev') {
    return null;
  }

  const tileX = Number(parts[1]);
  const tileY = Number(parts[2]);
  const packIndex = Number(parts[3]);

  if (
    !Number.isFinite(tileX) ||
    !Number.isFinite(tileY) ||
    !Number.isFinite(packIndex)
  ) {
    return null;
  }

  return { tileX, tileY, packIndex };
}

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
