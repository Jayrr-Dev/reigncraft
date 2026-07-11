import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_WILDLIFE_SPECIES_SFX_AMBIENT_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_AMBIENT_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_DISTANCE_FALLOFF_EXPONENT,
  DEFINING_WILDLIFE_SPECIES_SFX_FARM_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_FARM_LONG_CALL_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_FARM_LONG_CALL_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_FARM_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_LONG_CALL_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_LONG_CALL_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_LONG_CALL_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_LONG_CALL_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_TARGET_VOLUME_BY_EVENT,
  type DefiningWildlifeSpeciesSfxSizeClass,
} from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import type {
  DefiningWildlifeSpeciesSfxClipId,
  DefiningWildlifeSpeciesSfxPoolId,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';
import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';
import { resolvingWildlifeSpeciesSfxProfile } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry';
import { resolvingWildlifeSpeciesSfxClipVolumeMultiplier } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxClipVolumeMultiplier';
import { resolvingWildlifeSpeciesSfxPoolVolumeMultiplier } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxPoolVolumeMultiplier';

type DefiningWildlifeSpeciesSfxDistanceBounds = {
  fullVolumeDistanceGrid: number;
  maxAudibleDistanceGrid: number;
};

const DEFINING_WILDLIFE_SPECIES_SFX_AMBIENT_EVENT_KINDS = [
  'idle_ambient',
  'idle_eating',
  'sleep',
  'friendly',
  'stalk',
] as const satisfies readonly DefiningWildlifeSpeciesSfxEventKind[];

const DEFINING_WILDLIFE_SPECIES_SFX_LONG_CALL_EVENT_KINDS = [
  'howl',
  'chase_call',
] as const satisfies readonly DefiningWildlifeSpeciesSfxEventKind[];

function checkingWildlifeSpeciesSfxAmbientEventKind(
  eventKind: DefiningWildlifeSpeciesSfxEventKind
): boolean {
  return DEFINING_WILDLIFE_SPECIES_SFX_AMBIENT_EVENT_KINDS.includes(
    eventKind as (typeof DEFINING_WILDLIFE_SPECIES_SFX_AMBIENT_EVENT_KINDS)[number]
  );
}

function checkingWildlifeSpeciesSfxLongCallEventKind(
  eventKind: DefiningWildlifeSpeciesSfxEventKind
): boolean {
  return DEFINING_WILDLIFE_SPECIES_SFX_LONG_CALL_EVENT_KINDS.includes(
    eventKind as (typeof DEFINING_WILDLIFE_SPECIES_SFX_LONG_CALL_EVENT_KINDS)[number]
  );
}

function resolvingWildlifeSpeciesSfxSizeClassDistanceBounds(
  sizeClass: DefiningWildlifeSpeciesSfxSizeClass
): DefiningWildlifeSpeciesSfxDistanceBounds {
  if (sizeClass === 'megafauna') {
    return {
      fullVolumeDistanceGrid:
        DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_FULL_VOLUME_DISTANCE_GRID,
      maxAudibleDistanceGrid:
        DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_MAX_AUDIBLE_DISTANCE_GRID,
    };
  }

  if (sizeClass === 'predator') {
    return {
      fullVolumeDistanceGrid:
        DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_FULL_VOLUME_DISTANCE_GRID,
      maxAudibleDistanceGrid:
        DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_MAX_AUDIBLE_DISTANCE_GRID,
    };
  }

  return {
    fullVolumeDistanceGrid:
      DEFINING_WILDLIFE_SPECIES_SFX_FARM_FULL_VOLUME_DISTANCE_GRID,
    maxAudibleDistanceGrid:
      DEFINING_WILDLIFE_SPECIES_SFX_FARM_MAX_AUDIBLE_DISTANCE_GRID,
  };
}

function resolvingWildlifeSpeciesSfxLongCallDistanceBounds(
  sizeClass: DefiningWildlifeSpeciesSfxSizeClass
): DefiningWildlifeSpeciesSfxDistanceBounds {
  if (sizeClass === 'megafauna') {
    return {
      fullVolumeDistanceGrid:
        DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_LONG_CALL_FULL_VOLUME_DISTANCE_GRID,
      maxAudibleDistanceGrid:
        DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_LONG_CALL_MAX_AUDIBLE_DISTANCE_GRID,
    };
  }

  if (sizeClass === 'predator') {
    return {
      fullVolumeDistanceGrid:
        DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_LONG_CALL_FULL_VOLUME_DISTANCE_GRID,
      maxAudibleDistanceGrid:
        DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_LONG_CALL_MAX_AUDIBLE_DISTANCE_GRID,
    };
  }

  return {
    fullVolumeDistanceGrid:
      DEFINING_WILDLIFE_SPECIES_SFX_FARM_LONG_CALL_FULL_VOLUME_DISTANCE_GRID,
    maxAudibleDistanceGrid:
      DEFINING_WILDLIFE_SPECIES_SFX_FARM_LONG_CALL_MAX_AUDIBLE_DISTANCE_GRID,
  };
}

function resolvingWildlifeSpeciesSfxDistanceBounds(
  eventKind: DefiningWildlifeSpeciesSfxEventKind,
  sizeClass: DefiningWildlifeSpeciesSfxSizeClass
): DefiningWildlifeSpeciesSfxDistanceBounds {
  if (checkingWildlifeSpeciesSfxAmbientEventKind(eventKind)) {
    return {
      fullVolumeDistanceGrid:
        DEFINING_WILDLIFE_SPECIES_SFX_AMBIENT_FULL_VOLUME_DISTANCE_GRID,
      maxAudibleDistanceGrid:
        DEFINING_WILDLIFE_SPECIES_SFX_AMBIENT_MAX_AUDIBLE_DISTANCE_GRID,
    };
  }

  if (checkingWildlifeSpeciesSfxLongCallEventKind(eventKind)) {
    return resolvingWildlifeSpeciesSfxLongCallDistanceBounds(sizeClass);
  }

  return resolvingWildlifeSpeciesSfxSizeClassDistanceBounds(sizeClass);
}

/**
 * Distance falloff multiplier from listener to a species vocal source point.
 */
export function computingWildlifeSpeciesSfxDistanceAttenuation(
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  sourcePoint: DefiningWorldPlazaWorldPoint,
  eventKind: DefiningWildlifeSpeciesSfxEventKind,
  sizeClass: DefiningWildlifeSpeciesSfxSizeClass
): number {
  if (!listenerPoint) {
    return 0;
  }

  const { fullVolumeDistanceGrid, maxAudibleDistanceGrid } =
    resolvingWildlifeSpeciesSfxDistanceBounds(eventKind, sizeClass);

  const distanceGrid = Math.hypot(
    listenerPoint.x - sourcePoint.x,
    listenerPoint.y - sourcePoint.y
  );

  if (distanceGrid >= maxAudibleDistanceGrid) {
    return 0;
  }

  if (distanceGrid <= fullVolumeDistanceGrid) {
    return 1;
  }

  const falloffSpan = maxAudibleDistanceGrid - fullVolumeDistanceGrid;
  const normalized = (distanceGrid - fullVolumeDistanceGrid) / falloffSpan;
  const attenuated = 1 - normalized;

  return attenuated ** DEFINING_WILDLIFE_SPECIES_SFX_DISTANCE_FALLOFF_EXPONENT;
}

/**
 * Effective playback volume for one species vocal event at a world point.
 *
 * Pass the resolved playback pool and clip so secondary pools and hot variants
 * pick up the right gain trims instead of always using the primary pool.
 */
export function computingWildlifeSpeciesSfxEffectiveVolume(
  speciesId: string,
  eventKind: DefiningWildlifeSpeciesSfxEventKind,
  sourcePoint: DefiningWorldPlazaWorldPoint,
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  playbackPoolId?: DefiningWildlifeSpeciesSfxPoolId,
  clipId?: DefiningWildlifeSpeciesSfxClipId
): number {
  const profile = resolvingWildlifeSpeciesSfxProfile(speciesId);

  if (!profile) {
    return 0;
  }

  const distanceAttenuation = computingWildlifeSpeciesSfxDistanceAttenuation(
    listenerPoint,
    sourcePoint,
    eventKind,
    profile.sizeClass
  );

  if (distanceAttenuation <= 0) {
    return 0;
  }

  const poolVolumeMultiplier = resolvingWildlifeSpeciesSfxPoolVolumeMultiplier(
    playbackPoolId ?? profile.poolId
  );
  const clipVolumeMultiplier = clipId
    ? resolvingWildlifeSpeciesSfxClipVolumeMultiplier(clipId)
    : 1;

  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WILDLIFE_SPECIES_SFX_TARGET_VOLUME_BY_EVENT[eventKind],
    multipliers: [
      poolVolumeMultiplier,
      clipVolumeMultiplier,
      distanceAttenuation,
    ],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
