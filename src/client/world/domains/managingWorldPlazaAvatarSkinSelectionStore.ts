/**
 * Module-level store for the locally selected plaza avatar skin.
 *
 * Selection is persisted per session owner so transform form + per-form
 * Spritcore progress survive reload.
 *
 * @module components/world/domains/managingWorldPlazaAvatarSkinSelectionStore
 */

import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
  type DefiningWorldPlazaAvatarSkinId,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { readingWorldPlazaSelectedAvatarSkinFromStorage } from '@/components/world/domains/readingWorldPlazaSelectedAvatarSkinFromStorage';
import { writingWorldPlazaSelectedAvatarSkinToStorage } from '@/components/world/domains/writingWorldPlazaSelectedAvatarSkinToStorage';

/** Mutable selection state shared across plaza components. */
const managingWorldPlazaAvatarSkinSelectionState: {
  storageOwnerId: string | null;
  selectedSkinId: DefiningWorldPlazaAvatarSkinId;
  hasHydratedOwner: boolean;
} = {
  storageOwnerId: null,
  selectedSkinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
  hasHydratedOwner: false,
};

/** React subscribers notified when the selected skin changes. */
const managingWorldPlazaAvatarSkinSelectionSubscribers = new Set<() => void>();

function persistingWorldPlazaSelectedAvatarSkin(): void {
  if (!managingWorldPlazaAvatarSkinSelectionState.hasHydratedOwner) {
    return;
  }

  writingWorldPlazaSelectedAvatarSkinToStorage(
    managingWorldPlazaAvatarSkinSelectionState.storageOwnerId,
    managingWorldPlazaAvatarSkinSelectionState.selectedSkinId
  );
}

/**
 * Hydrates the selected avatar skin from localStorage for one session owner.
 */
export function initializingWorldPlazaAvatarSkinSelectionStore(
  storageOwnerId: string | null
): void {
  if (
    managingWorldPlazaAvatarSkinSelectionState.hasHydratedOwner &&
    managingWorldPlazaAvatarSkinSelectionState.storageOwnerId === storageOwnerId
  ) {
    return;
  }

  managingWorldPlazaAvatarSkinSelectionState.storageOwnerId = storageOwnerId;
  managingWorldPlazaAvatarSkinSelectionState.hasHydratedOwner = true;
  managingWorldPlazaAvatarSkinSelectionState.selectedSkinId =
    readingWorldPlazaSelectedAvatarSkinFromStorage(storageOwnerId);
  notifyingWorldPlazaAvatarSkinSelectionSubscribers();
}

/**
 * Returns the currently selected avatar skin id.
 */
export function gettingWorldPlazaSelectedAvatarSkinId(): DefiningWorldPlazaAvatarSkinId {
  return managingWorldPlazaAvatarSkinSelectionState.selectedSkinId;
}

/**
 * Selects an avatar skin and notifies subscribers when it changes.
 *
 * @param skinId - Skin id to activate for the local avatar.
 */
export function settingWorldPlazaSelectedAvatarSkin(
  skinId: DefiningWorldPlazaAvatarSkinId
): void {
  if (managingWorldPlazaAvatarSkinSelectionState.selectedSkinId === skinId) {
    return;
  }

  managingWorldPlazaAvatarSkinSelectionState.selectedSkinId = skinId;
  persistingWorldPlazaSelectedAvatarSkin();
  notifyingWorldPlazaAvatarSkinSelectionSubscribers();
}

/**
 * Subscribes to avatar skin selection changes.
 *
 * @param onStoreChange - Callback invoked when the selection changes.
 */
export function subscribingWorldPlazaSelectedAvatarSkin(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaAvatarSkinSelectionSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaAvatarSkinSelectionSubscribers.delete(onStoreChange);
  };
}

/**
 * Notifies React subscribers that the selected avatar skin changed.
 */
function notifyingWorldPlazaAvatarSkinSelectionSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaAvatarSkinSelectionSubscribers) {
    onStoreChange();
  }
}

/** Test-only reset helper. */
export function resettingWorldPlazaAvatarSkinSelectionStoreForTests(): void {
  managingWorldPlazaAvatarSkinSelectionState.storageOwnerId = null;
  managingWorldPlazaAvatarSkinSelectionState.selectedSkinId =
    DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT;
  managingWorldPlazaAvatarSkinSelectionState.hasHydratedOwner = false;
  notifyingWorldPlazaAvatarSkinSelectionSubscribers();
}
