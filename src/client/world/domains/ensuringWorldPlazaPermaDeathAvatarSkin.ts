/**
 * Applies the Perma Death starting avatar skin chosen on the home screen.
 *
 * @module components/world/domains/ensuringWorldPlazaPermaDeathAvatarSkin
 */

import {
  gettingWorldPlazaSelectedAvatarSkinId,
  settingWorldPlazaSelectedAvatarSkin,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import {
  clearingWorldPlazaPermaDeathPendingStartingAvatarSkinId,
  gettingWorldPlazaPermaDeathPendingStartingAvatarSkinId,
} from '@/components/world/domains/managingWorldPlazaPermaDeathLoadStore';

/**
 * Applies the pending home-screen skin for a new Perma Death run.
 *
 * @returns The skin id that is active after ensuring.
 */
export function ensuringWorldPlazaPermaDeathAvatarSkin(): string {
  const pendingStartingAvatarSkinId =
    gettingWorldPlazaPermaDeathPendingStartingAvatarSkinId();

  if (pendingStartingAvatarSkinId) {
    settingWorldPlazaSelectedAvatarSkin(pendingStartingAvatarSkinId);
    clearingWorldPlazaPermaDeathPendingStartingAvatarSkinId();
    return pendingStartingAvatarSkinId;
  }

  return gettingWorldPlazaSelectedAvatarSkinId();
}
