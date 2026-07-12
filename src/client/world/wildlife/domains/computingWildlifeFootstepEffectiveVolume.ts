import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import { DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_TARGET_VOLUME } from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_VOLUME_SCALE,
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_VOLUME_RELATIVE_TO_AVATAR,
  type DefiningFilmcowFootstepWildlifeSizeTier,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { computingWildlifeFootstepDistanceAttenuation } from '@/components/world/wildlife/domains/computingWildlifeFootstepDistanceAttenuation';
import {
  DEFINING_WILDLIFE_FOOTSTEP_DISTANCE_FALLOFF_EXPONENT,
  DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID,
  DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeFootstepSfxConstants';

/**
 * Effective playback volume when caller already computed listener distance.
 * Avoids a second `Math.hypot` in the wildlife audio polling hot path.
 */
export function computingWildlifeFootstepEffectiveVolumeAtDistance(
  sizeTier: DefiningFilmcowFootstepWildlifeSizeTier,
  distanceGrid: number,
  clipVolumeMultiplier = 1
): number {
  if (distanceGrid >= DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID) {
    return 0;
  }

  const distanceAttenuation =
    distanceGrid <= DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID
      ? 1
      : (1 -
          (distanceGrid -
            DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID) /
            (DEFINING_WILDLIFE_FOOTSTEP_MAX_AUDIBLE_DISTANCE_GRID -
              DEFINING_WILDLIFE_FOOTSTEP_FULL_VOLUME_DISTANCE_GRID)) **
        DEFINING_WILDLIFE_FOOTSTEP_DISTANCE_FALLOFF_EXPONENT;

  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_TARGET_VOLUME *
      DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_VOLUME_RELATIVE_TO_AVATAR *
      DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_VOLUME_SCALE[sizeTier],
    multipliers: [distanceAttenuation, clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}

/**
 * Effective playback volume for one wildlife footstep at a world point.
 *
 * Medium wildlife steps sit at 1/3 avatar footstep loudness before distance
 * falloff; other size tiers scale around that anchor.
 */
export function computingWildlifeFootstepEffectiveVolume(
  sizeTier: DefiningFilmcowFootstepWildlifeSizeTier,
  sourcePoint: DefiningWorldPlazaWorldPoint,
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  clipVolumeMultiplier = 1
): number {
  const distanceAttenuation = computingWildlifeFootstepDistanceAttenuation(
    listenerPoint,
    sourcePoint
  );

  if (distanceAttenuation <= 0) {
    return 0;
  }

  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_TARGET_VOLUME *
      DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_VOLUME_RELATIVE_TO_AVATAR *
      DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_VOLUME_SCALE[sizeTier],
    multipliers: [distanceAttenuation, clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
