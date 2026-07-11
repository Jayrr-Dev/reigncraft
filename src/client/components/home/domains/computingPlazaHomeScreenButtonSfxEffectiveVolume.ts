import { DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_TARGET_VOLUME } from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';
import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves home screen button clip volume after applying the SFX volume slider.
 */
export function computingPlazaHomeScreenButtonSfxEffectiveVolume(
  clipVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume: DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_TARGET_VOLUME,
    multipliers: [clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
