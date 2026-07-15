import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import { DEFINING_WORLD_PLAZA_DEATH_SFX_TARGET_VOLUME } from '@/components/world/audio/lifecycle/definingWorldPlazaDeathSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves player-death volume after applying the SFX volume slider.
 */
export function computingWorldPlazaDeathSfxEffectiveVolume(
  clipVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume: DEFINING_WORLD_PLAZA_DEATH_SFX_TARGET_VOLUME,
    multipliers: [clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
