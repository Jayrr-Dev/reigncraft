import { DEFINING_WORLD_PLAZA_BIOME_MUSIC_TARGET_VOLUME } from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';
import { gettingWorldPlazaMasterVolume } from '@/components/world/domains/managingWorldPlazaMasterVolumeStore';

/**
 * Resolves biome music loop volume after applying the music volume slider.
 */
export function computingWorldPlazaBiomeMusicEffectiveTargetVolume(): number {
  return (
    DEFINING_WORLD_PLAZA_BIOME_MUSIC_TARGET_VOLUME *
    gettingWorldPlazaMasterVolume()
  );
}
