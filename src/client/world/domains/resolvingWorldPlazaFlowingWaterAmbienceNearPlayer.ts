import {
  DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_SCAN_RADIUS_TILES,
  type DefiningWorldPlazaBiomeAmbienceClipId,
} from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
  type DefiningWorldPlazaWaterKind,
} from '@/components/world/domains/definingWorldPlazaWaterKind';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';

export type ResolvingWorldPlazaFlowingWaterAmbienceNearPlayerResult = {
  readonly clipId: DefiningWorldPlazaBiomeAmbienceClipId;
  readonly attenuation: number;
};

/**
 * Distance falloff from listener to one flowing-water tile center.
 */
export function computingWorldPlazaFlowingWaterAmbienceDistanceAttenuation(
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
    DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_MAX_AUDIBLE_DISTANCE_GRID
  ) {
    return 0;
  }

  if (
    distanceGrid <=
    DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_FULL_VOLUME_DISTANCE_GRID
  ) {
    return 1;
  }

  const falloffSpan =
    DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_MAX_AUDIBLE_DISTANCE_GRID -
    DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_FULL_VOLUME_DISTANCE_GRID;
  const normalized =
    (distanceGrid -
      DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_FULL_VOLUME_DISTANCE_GRID) /
    falloffSpan;
  const attenuated = 1 - normalized;

  return attenuated * attenuated;
}

function resolvingWorldPlazaFlowingWaterAmbienceClipIdForKind(
  waterKind: DefiningWorldPlazaWaterKind
): DefiningWorldPlazaBiomeAmbienceClipId | null {
  if (waterKind === DEFINING_WORLD_PLAZA_WATER_KIND_STREAM) {
    return 'stream_light';
  }

  if (waterKind === DEFINING_WORLD_PLAZA_WATER_KIND_RIVER) {
    return 'river_moderate';
  }

  return null;
}

/**
 * Picks the nearest procedural stream or river ambience bed around the player.
 */
export function resolvingWorldPlazaFlowingWaterAmbienceNearPlayer(
  listenerPoint: DefiningWorldPlazaWorldPoint | null
): ResolvingWorldPlazaFlowingWaterAmbienceNearPlayerResult | null {
  if (!listenerPoint) {
    return null;
  }

  const centerTileX = Math.floor(listenerPoint.x);
  const centerTileY = Math.floor(listenerPoint.y);
  const scanRadius =
    DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_SCAN_RADIUS_TILES;

  let bestResult: ResolvingWorldPlazaFlowingWaterAmbienceNearPlayerResult | null =
    null;

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
      const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

      if (!waterTile) {
        continue;
      }

      const clipId = resolvingWorldPlazaFlowingWaterAmbienceClipIdForKind(
        waterTile.kind
      );

      if (!clipId) {
        continue;
      }

      const attenuation =
        computingWorldPlazaFlowingWaterAmbienceDistanceAttenuation(
          listenerPoint,
          tileX,
          tileY
        );

      if (attenuation <= 0) {
        continue;
      }

      if (
        !bestResult ||
        attenuation > bestResult.attenuation ||
        (attenuation === bestResult.attenuation &&
          waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_RIVER)
      ) {
        bestResult = { clipId, attenuation };
      }
    }
  }

  return bestResult;
}
