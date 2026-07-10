import { DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_TARGET_VOLUME } from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves home screen button clip volume after applying the SFX volume slider.
 */
export function computingPlazaHomeScreenButtonSfxEffectiveVolume(): number {
  return (
    DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_TARGET_VOLUME *
    gettingWorldPlazaSfxVolume()
  );
}
