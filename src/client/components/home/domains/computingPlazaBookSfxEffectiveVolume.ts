import {
  DEFINING_PLAZA_BOOK_SFX_TARGET_VOLUME_BY_ACTION,
  type DefiningPlazaBookSfxActionId,
} from '@/components/home/domains/definingPlazaBookSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

/**
 * Resolves book UI clip volume after applying the SFX volume slider.
 */
export function computingPlazaBookSfxEffectiveVolume(
  actionId: DefiningPlazaBookSfxActionId
): number {
  return (
    DEFINING_PLAZA_BOOK_SFX_TARGET_VOLUME_BY_ACTION[actionId] *
    gettingWorldPlazaSfxVolume()
  );
}
