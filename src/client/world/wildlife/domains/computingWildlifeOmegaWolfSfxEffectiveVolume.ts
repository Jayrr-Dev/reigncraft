import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_TARGET_VOLUME,
  DEFINING_WILDLIFE_OMEGA_WOLF_CHASE_TERRITORY_SFX_TARGET_VOLUME,
  DEFINING_WILDLIFE_OMEGA_WOLF_HIT_SFX_TARGET_VOLUME,
  DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_TARGET_VOLUME,
  DEFINING_WILDLIFE_OMEGA_WOLF_SFX_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_OMEGA_WOLF_SFX_MAX_AUDIBLE_DISTANCE_GRID,
  type DefiningWildlifeOmegaWolfSfxEventKind,
} from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';

/**
 * Distance falloff multiplier from listener to the Omega Wolf source point.
 */
export function computingWildlifeOmegaWolfSfxDistanceAttenuation(
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  sourcePoint: DefiningWorldPlazaWorldPoint
): number {
  if (!listenerPoint) {
    return 1;
  }

  const distanceGrid = Math.hypot(
    listenerPoint.x - sourcePoint.x,
    listenerPoint.y - sourcePoint.y
  );

  if (
    distanceGrid >= DEFINING_WILDLIFE_OMEGA_WOLF_SFX_MAX_AUDIBLE_DISTANCE_GRID
  ) {
    return 0;
  }

  if (
    distanceGrid <= DEFINING_WILDLIFE_OMEGA_WOLF_SFX_FULL_VOLUME_DISTANCE_GRID
  ) {
    return 1;
  }

  const falloffSpan =
    DEFINING_WILDLIFE_OMEGA_WOLF_SFX_MAX_AUDIBLE_DISTANCE_GRID -
    DEFINING_WILDLIFE_OMEGA_WOLF_SFX_FULL_VOLUME_DISTANCE_GRID;
  const normalized =
    (distanceGrid -
      DEFINING_WILDLIFE_OMEGA_WOLF_SFX_FULL_VOLUME_DISTANCE_GRID) /
    falloffSpan;
  const attenuated = 1 - normalized;

  return attenuated * attenuated;
}

function resolvingWildlifeOmegaWolfSfxBaseTargetVolume(
  eventKind: DefiningWildlifeOmegaWolfSfxEventKind
): number {
  if (eventKind === 'howl') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_TARGET_VOLUME;
  }

  if (eventKind === 'chase_call' || eventKind === 'territory_warn') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_CHASE_TERRITORY_SFX_TARGET_VOLUME;
  }

  if (eventKind === 'hit_taken') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_HIT_SFX_TARGET_VOLUME;
  }

  return DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_TARGET_VOLUME;
}

/**
 * Effective playback volume for one Omega Wolf SFX event at a world point.
 */
export function computingWildlifeOmegaWolfSfxEffectiveVolume(
  eventKind: DefiningWildlifeOmegaWolfSfxEventKind,
  sourcePoint: DefiningWorldPlazaWorldPoint,
  listenerPoint: DefiningWorldPlazaWorldPoint | null
): number {
  const distanceAttenuation = computingWildlifeOmegaWolfSfxDistanceAttenuation(
    listenerPoint,
    sourcePoint
  );

  if (distanceAttenuation <= 0) {
    return 0;
  }

  return (
    resolvingWildlifeOmegaWolfSfxBaseTargetVolume(eventKind) *
    distanceAttenuation *
    gettingWorldPlazaSfxVolume()
  );
}
