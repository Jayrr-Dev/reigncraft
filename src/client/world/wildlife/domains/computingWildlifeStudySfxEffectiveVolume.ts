import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME_BY_SECTION,
  type DefiningWildlifeStudySfxSectionId,
} from '@/components/world/wildlife/domains/definingWildlifeStudySfxConstants';

/**
 * Resolves study / reward volume after applying the SFX volume slider.
 */
export function computingWildlifeStudySfxEffectiveVolume(
  sectionId: DefiningWildlifeStudySfxSectionId = 'study',
  clipVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME_BY_SECTION[sectionId],
    multipliers: [clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
