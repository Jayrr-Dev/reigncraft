/**
 * Whether the action-bar transform control should render.
 *
 * Hidden until the girl unlocks at least one animal form via bestiary mastery.
 * Stays visible while already transformed so the player can switch back.
 *
 * @module components/world/domains/checkingWorldPlazaAvatarTransformControlVisible
 */

import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN,
  type DefiningWorldPlazaAvatarSkinId,
  type DefiningWorldPlazaAvatarSkinOption,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';

/**
 * True when transform has a useful target beyond the default girl form.
 */
export function checkingWorldPlazaAvatarTransformControlVisible(
  unlockedSkinOptions: readonly DefiningWorldPlazaAvatarSkinOption[],
  selectedAvatarSkinId: DefiningWorldPlazaAvatarSkinId
): boolean {
  if (selectedAvatarSkinId !== DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE) {
    return true;
  }

  return unlockedSkinOptions.some(
    (skinOption) =>
      skinOption.skinId !== DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
  );
}
