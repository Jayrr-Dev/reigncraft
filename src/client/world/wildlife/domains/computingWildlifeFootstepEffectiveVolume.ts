import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_TARGET_VOLUME,
  type DefiningFilmcowFootstepWildlifeSizeTier,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { computingWildlifeFootstepDistanceAttenuation } from '@/components/world/wildlife/domains/computingWildlifeFootstepDistanceAttenuation';

/**
 * Effective playback volume for one wildlife footstep at a world point.
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
      DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_TARGET_VOLUME[sizeTier],
    multipliers: [distanceAttenuation, clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
