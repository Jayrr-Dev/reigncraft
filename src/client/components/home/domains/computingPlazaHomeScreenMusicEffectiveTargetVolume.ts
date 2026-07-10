import { DEFINING_PLAZA_HOME_SCREEN_MUSIC_TARGET_VOLUME } from '@/components/home/domains/definingPlazaHomeScreenMusicConstants';
import { gettingWorldPlazaMasterVolume } from '@/components/world/domains/managingWorldPlazaMasterVolumeStore';

/**
 * Resolves title screen music volume after applying the music volume slider.
 */
export function computingPlazaHomeScreenMusicEffectiveTargetVolume(): number {
  return (
    DEFINING_PLAZA_HOME_SCREEN_MUSIC_TARGET_VOLUME *
    gettingWorldPlazaMasterVolume()
  );
}
