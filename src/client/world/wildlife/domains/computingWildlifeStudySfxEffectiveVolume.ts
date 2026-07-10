import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import { DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME } from '@/components/world/wildlife/domains/definingWildlifeStudySfxConstants';

/**
 * Resolves study-complete volume after applying the SFX volume slider.
 */
export function computingWildlifeStudySfxEffectiveVolume(): number {
  return (
    DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME * gettingWorldPlazaSfxVolume()
  );
}
