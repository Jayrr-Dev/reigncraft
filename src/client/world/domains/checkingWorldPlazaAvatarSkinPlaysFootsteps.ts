/**
 * True when the selected avatar skin should play plaza footstep SFX.
 *
 * @module components/world/domains/checkingWorldPlazaAvatarSkinPlaysFootsteps
 */

import { checkingWorldPlazaGirlSampleAvatarSkinActive } from '@/components/world/domains/checkingWorldPlazaGirlSampleAvatarSkinActive';
import { checkingWorldPlazaAnimalPlayableAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import { gettingWorldPlazaSelectedAvatarSkinId } from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';

/** True when local skin is girl-sample or a playable animal. */
export function checkingWorldPlazaAvatarSkinPlaysFootsteps(): boolean {
  if (checkingWorldPlazaGirlSampleAvatarSkinActive()) {
    return true;
  }

  return checkingWorldPlazaAnimalPlayableAvatarSkinId(
    gettingWorldPlazaSelectedAvatarSkinId()
  );
}
