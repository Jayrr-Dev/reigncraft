/**
 * Declarative tunables for avatar transform cooldown and persistence.
 *
 * @module components/world/domains/definingWorldPlazaAvatarTransformConstants
 */

import { computingWorldPlazaInGameDaysToRealMs } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';

/** Real ms locked after a successful transform (1 in-game day). */
export const DEFINING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_MS =
  computingWorldPlazaInGameDaysToRealMs(1);

/** localStorage key prefix for transform cooldown ready-at stamps. */
export const DEFINING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_STORAGE_KEY_PREFIX =
  'world-plaza-avatar-transform-cooldown' as const;

/** localStorage key prefix for the persisted selected avatar skin. */
export const DEFINING_WORLD_PLAZA_SELECTED_AVATAR_SKIN_STORAGE_KEY_PREFIX =
  'world-plaza-selected-avatar-skin' as const;

/** Toast when the player tries to transform while locked. */
export const LABELING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_TOAST =
  'Form locked. Wait 1 day before transforming again.' as const;

/**
 * Resolves the localStorage key for transform cooldown.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaAvatarTransformCooldownStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_STORAGE_KEY_PREFIX;
}

/**
 * Resolves the localStorage key for the selected avatar skin.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaSelectedAvatarSkinStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_SELECTED_AVATAR_SKIN_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_SELECTED_AVATAR_SKIN_STORAGE_KEY_PREFIX;
}
