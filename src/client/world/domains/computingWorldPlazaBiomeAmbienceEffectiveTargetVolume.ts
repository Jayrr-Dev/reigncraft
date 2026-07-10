import { DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_TARGET_VOLUME } from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves biome ambience loop volume after applying the SFX volume slider.
 */
export function computingWorldPlazaBiomeAmbienceEffectiveTargetVolume(): number {
  return (
    DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_TARGET_VOLUME *
    gettingWorldPlazaSfxVolume()
  );
}
