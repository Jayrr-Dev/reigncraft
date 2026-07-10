import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { gettingWorldPlazaAmbienceVolume } from '@/components/world/domains/managingWorldPlazaAmbienceVolumeStore';
import {
  DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_TARGET_VOLUME,
} from '@/components/world/fire/domains/definingWorldPlazaCampfireAmbienceConstants';
import { resolvingWorldPlazaCampfireAmbienceSourcePointFromCell } from '@/components/world/fire/domains/resolvingWorldPlazaCampfireAmbienceSourcePointFromCell';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

/**
 * Distance falloff multiplier from listener to one campfire source point.
 */
export function computingWorldPlazaCampfireAmbienceDistanceAttenuation(
  listenerPoint: DefiningWorldPlazaWorldPoint,
  sourcePoint: DefiningWorldPlazaWorldPoint
): number {
  const distanceGrid = Math.hypot(
    listenerPoint.x - sourcePoint.x,
    listenerPoint.y - sourcePoint.y
  );

  if (
    distanceGrid >=
    DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_MAX_AUDIBLE_DISTANCE_GRID
  ) {
    return 0;
  }

  if (
    distanceGrid <=
    DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID
  ) {
    return 1;
  }

  const falloffSpan =
    DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_MAX_AUDIBLE_DISTANCE_GRID -
    DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID;
  const normalized =
    (distanceGrid -
      DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID) /
    falloffSpan;
  const attenuated = 1 - normalized;

  return attenuated * attenuated;
}

/**
 * Effective loop volume from the nearest lit campfire on the listener layer.
 */
export function computingWorldPlazaCampfireAmbienceEffectiveVolume(
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  fireCells: readonly WorldFireDevvitCell[]
): number {
  if (!listenerPoint || fireCells.length === 0) {
    return 0;
  }

  const listenerLayer = resolvingWorldPlazaPlayerWorldLayer(listenerPoint);
  let bestAttenuation = 0;

  for (const cell of fireCells) {
    if (cell.kind !== 'campfire' || cell.fuelRemainingMs <= 0) {
      continue;
    }

    if (cell.worldLayer !== listenerLayer) {
      continue;
    }

    const attenuation = computingWorldPlazaCampfireAmbienceDistanceAttenuation(
      listenerPoint,
      resolvingWorldPlazaCampfireAmbienceSourcePointFromCell(cell)
    );

    if (attenuation > bestAttenuation) {
      bestAttenuation = attenuation;
    }
  }

  if (bestAttenuation <= 0) {
    return 0;
  }

  return (
    DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_TARGET_VOLUME *
    bestAttenuation *
    gettingWorldPlazaAmbienceVolume()
  );
}
