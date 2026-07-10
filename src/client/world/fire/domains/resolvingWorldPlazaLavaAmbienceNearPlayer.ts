import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SCAN_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_MAX_AUDIBLE_DISTANCE_GRID,
} from '@/components/world/fire/domains/definingWorldPlazaLavaAmbienceConstants';

export type ResolvingWorldPlazaLavaAmbienceNearPlayerResult = {
  readonly attenuation: number;
};

/**
 * Distance falloff from listener to one lava tile center.
 */
export function computingWorldPlazaLavaAmbienceDistanceAttenuation(
  listenerPoint: DefiningWorldPlazaWorldPoint,
  sourceTileX: number,
  sourceTileY: number
): number {
  const distanceGrid = Math.hypot(
    listenerPoint.x - (sourceTileX + 0.5),
    listenerPoint.y - (sourceTileY + 0.5)
  );

  if (
    distanceGrid >=
    DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_MAX_AUDIBLE_DISTANCE_GRID
  ) {
    return 0;
  }

  if (
    distanceGrid <=
    DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID
  ) {
    return 1;
  }

  const falloffSpan =
    DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_MAX_AUDIBLE_DISTANCE_GRID -
    DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID;
  const normalized =
    (distanceGrid -
      DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID) /
    falloffSpan;
  const attenuated = 1 - normalized;

  return attenuated * attenuated;
}

/**
 * Returns the strongest lava fire ambience attenuation around the player.
 */
export function resolvingWorldPlazaLavaAmbienceNearPlayer(
  listenerPoint: DefiningWorldPlazaWorldPoint | null
): ResolvingWorldPlazaLavaAmbienceNearPlayerResult | null {
  if (!listenerPoint) {
    return null;
  }

  const centerTileX = Math.floor(listenerPoint.x);
  const centerTileY = Math.floor(listenerPoint.y);
  const scanRadius = DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SCAN_RADIUS_TILES;

  let bestAttenuation = 0;

  for (
    let tileX = centerTileX - scanRadius;
    tileX <= centerTileX + scanRadius;
    tileX += 1
  ) {
    for (
      let tileY = centerTileY - scanRadius;
      tileY <= centerTileY + scanRadius;
      tileY += 1
    ) {
      if (!checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
        continue;
      }

      const attenuation = computingWorldPlazaLavaAmbienceDistanceAttenuation(
        listenerPoint,
        tileX,
        tileY
      );

      if (attenuation > bestAttenuation) {
        bestAttenuation = attenuation;

        if (bestAttenuation >= 1) {
          return { attenuation: bestAttenuation };
        }
      }
    }
  }

  if (bestAttenuation <= 0) {
    return null;
  }

  return { attenuation: bestAttenuation };
}
