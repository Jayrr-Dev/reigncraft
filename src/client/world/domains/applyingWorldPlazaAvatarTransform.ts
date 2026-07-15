/**
 * Applies a player-facing avatar transform with cooldown + Spritcore swap.
 *
 * @module components/world/domains/applyingWorldPlazaAvatarTransform
 */

import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { LABELING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_TOAST } from '@/components/world/domains/definingWorldPlazaAvatarTransformConstants';
import {
  checkingWorldPlazaAvatarTransformIsOnCooldown,
  startingWorldPlazaAvatarTransformCooldown,
} from '@/components/world/domains/managingWorldPlazaAvatarTransformCooldownStore';
import {
  gettingWorldPlazaSelectedAvatarSkinId,
  settingWorldPlazaSelectedAvatarSkin,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import { showingReigncraftToast } from '@/components/ui/domains/showingReigncraftToast';

export type ApplyingWorldPlazaAvatarTransformResult =
  | 'applied'
  | 'unchanged'
  | 'cooldown';

/**
 * Selects a new avatar form when transform is ready.
 *
 * Same-form picks are no-ops. Locked picks toast and leave the form alone.
 * Successful switches stamp the 1-day cooldown; Spritcore rehydrates via the
 * skin-selection subscriber in the plaza scene.
 */
export function applyingWorldPlazaAvatarTransform(
  skinId: DefiningWorldPlazaAvatarSkinId,
  nowMs: number = Date.now()
): ApplyingWorldPlazaAvatarTransformResult {
  if (gettingWorldPlazaSelectedAvatarSkinId() === skinId) {
    return 'unchanged';
  }

  if (checkingWorldPlazaAvatarTransformIsOnCooldown(nowMs)) {
    showingReigncraftToast(LABELING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_TOAST);
    return 'cooldown';
  }

  settingWorldPlazaSelectedAvatarSkin(skinId);
  startingWorldPlazaAvatarTransformCooldown(nowMs);

  return 'applied';
}
