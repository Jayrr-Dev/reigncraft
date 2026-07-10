import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN,
  type DefiningWorldPlazaAvatarSkinId,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { gettingWorldPlazaSelectedAvatarSkinId } from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';

/**
 * True when the given skin id is the girl-sample avatar.
 */
export function checkingWorldPlazaGirlSampleAvatarSkinId(
  skinId: DefiningWorldPlazaAvatarSkinId
): boolean {
  return skinId === DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE;
}

/**
 * True when the locally selected avatar skin is girl-sample.
 */
export function checkingWorldPlazaGirlSampleAvatarSkinActive(): boolean {
  return checkingWorldPlazaGirlSampleAvatarSkinId(
    gettingWorldPlazaSelectedAvatarSkinId()
  );
}
