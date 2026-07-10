import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_WILDLIFE_SPECIES_SFX_FARM_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_FARM_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_MAX_AUDIBLE_DISTANCE_GRID,
  DEFINING_WILDLIFE_SPECIES_SFX_TARGET_VOLUME_BY_EVENT,
  type DefiningWildlifeSpeciesSfxSizeClass,
} from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';
import { resolvingWildlifeSpeciesSfxProfile } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry';

function resolvingWildlifeSpeciesSfxDistanceBounds(
  sizeClass: DefiningWildlifeSpeciesSfxSizeClass
): { fullVolumeDistanceGrid: number; maxAudibleDistanceGrid: number } {
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

/**
 * Distance falloff multiplier from listener to a species vocal source point.
 */
export function computingWildlifeSpeciesSfxDistanceAttenuation(
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  sourcePoint: DefiningWorldPlazaWorldPoint,
  sizeClass: DefiningWildlifeSpeciesSfxSizeClass
): number {
  if (!listenerPoint) {
    return 1;
  }

  const { fullVolumeDistanceGrid, maxAudibleDistanceGrid } =
    resolvingWildlifeSpeciesSfxDistanceBounds(sizeClass);

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

  return attenuated * attenuated;
}

/**
 * Effective playback volume for one species vocal event at a world point.
 */
export function computingWildlifeSpeciesSfxEffectiveVolume(
  speciesId: string,
  eventKind: DefiningWildlifeSpeciesSfxEventKind,
  sourcePoint: DefiningWorldPlazaWorldPoint,
  listenerPoint: DefiningWorldPlazaWorldPoint | null
): number {
  const profile = resolvingWildlifeSpeciesSfxProfile(speciesId);

  if (!profile) {
    return 0;
  }

  const distanceAttenuation = computingWildlifeSpeciesSfxDistanceAttenuation(
    listenerPoint,
    sourcePoint,
    profile.sizeClass
  );

  if (distanceAttenuation <= 0) {
    return 0;
  }

  return (
    DEFINING_WILDLIFE_SPECIES_SFX_TARGET_VOLUME_BY_EVENT[eventKind] *
    distanceAttenuation *
    gettingWorldPlazaSfxVolume()
  );
}
