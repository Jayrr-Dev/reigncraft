import {
  DEFINING_PLAZA_BOOK_SFX_TARGET_VOLUME_BY_ACTION,
  type DefiningPlazaBookSfxActionId,
} from '@/components/home/domains/definingPlazaBookSfxConstants';
import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves book UI clip volume after applying the SFX volume slider.
 */
export function computingPlazaBookSfxEffectiveVolume(
  actionId: DefiningPlazaBookSfxActionId,
  clipVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume: DEFINING_PLAZA_BOOK_SFX_TARGET_VOLUME_BY_ACTION[actionId],
    multipliers: [clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
