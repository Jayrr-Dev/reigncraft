/**
 * Applies a player-facing avatar transform with cooldown + Spritcore swap.
 *
 * @module components/world/domains/applyingWorldPlazaAvatarTransform
 */

import { showingReigncraftToast } from '@/components/ui/domains/showingReigncraftToast';
import { checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked } from '@/components/world/domains/checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked';
import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
  type DefiningWorldPlazaAvatarSkinId,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import {
  LABELING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_TOAST,
  LABELING_WORLD_PLAZA_AVATAR_TRANSFORM_STUDY_LOCKED_TOAST,
} from '@/components/world/domains/definingWorldPlazaAvatarTransformConstants';
import { gettingWorldPlazaBestiaryStudyCountsSnapshot } from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import {
  gettingWorldPlazaSelectedAvatarSkinId,
  settingWorldPlazaSelectedAvatarSkin,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import {
  checkingWorldPlazaAvatarTransformIsOnCooldown,
  startingWorldPlazaAvatarTransformCooldown,
} from '@/components/world/domains/managingWorldPlazaAvatarTransformCooldownStore';

export type ApplyingWorldPlazaAvatarTransformResult =
  | 'applied'
  | 'unchanged'
  | 'cooldown'
  | 'study-locked';

/**
 * Selects a new avatar form when transform is ready.
 *
 * Same-form picks are no-ops. Locked picks toast and leave the form alone.
 * Animal forms need bestiary mastery. Successful switches stamp the 1-day
 * cooldown; Spritcore rehydrates via the skin-selection subscriber in the
 * plaza scene.
 */
export function applyingWorldPlazaAvatarTransform(
  skinId: DefiningWorldPlazaAvatarSkinId,
  nowMs: number = Date.now()
): ApplyingWorldPlazaAvatarTransformResult {
  if (gettingWorldPlazaSelectedAvatarSkinId() === skinId) {
    return 'unchanged';
  }

  if (
    !checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked(
      skinId,
      gettingWorldPlazaBestiaryStudyCountsSnapshot()
    )
  ) {
    showingReigncraftToast(
      LABELING_WORLD_PLAZA_AVATAR_TRANSFORM_STUDY_LOCKED_TOAST
    );
    return 'study-locked';
  }

  if (checkingWorldPlazaAvatarTransformIsOnCooldown(nowMs)) {
    showingReigncraftToast(
      LABELING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_TOAST
    );
    return 'cooldown';
  }

  settingWorldPlazaSelectedAvatarSkin(skinId);
  startingWorldPlazaAvatarTransformCooldown(nowMs);

  return 'applied';
}

/**
 * Forces the default Girl form on death. Does not stamp transform cooldown.
 */
export function applyingWorldPlazaAvatarTransformDeathReset(): boolean {
  if (
    gettingWorldPlazaSelectedAvatarSkinId() ===
    DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT
  ) {
    return false;
  }

  settingWorldPlazaSelectedAvatarSkin(DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT);
  return true;
}
