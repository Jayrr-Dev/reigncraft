/**
 * Ensures the Random Animal load has a playable animal form selected.
 *
 * @module components/world/domains/ensuringWorldPlazaRandomAnimalAvatarSkin
 */

import {
  gettingWorldPlazaSelectedAvatarSkinId,
  settingWorldPlazaSelectedAvatarSkin,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import {
  checkingWorldPlazaRandomAnimalPlayableAvatarSkinId,
  rollingWorldPlazaRandomAnimalPlayableAvatarSkin,
} from '@/components/world/domains/rollingWorldPlazaRandomAnimalPlayableAvatarSkin';

/**
 * Keeps a stored animal form, or rolls a new one when the slot has none.
 *
 * @returns The skin id that is active after ensuring.
 */
export function ensuringWorldPlazaRandomAnimalAvatarSkin(
  random: () => number = Math.random
): string {
  const selectedSkinId = gettingWorldPlazaSelectedAvatarSkinId();

  if (checkingWorldPlazaRandomAnimalPlayableAvatarSkinId(selectedSkinId)) {
    return selectedSkinId;
  }

  const rolledSkinId = rollingWorldPlazaRandomAnimalPlayableAvatarSkin(random);
  settingWorldPlazaSelectedAvatarSkin(rolledSkinId);
  return rolledSkinId;
}
