/**
 * Module-level store for the locally selected plaza avatar skin.
 *
 * Mirrors the perf render-layer flag store: a tiny external store that React
 * components subscribe to via `useSyncExternalStore`. The selection lives in
 * memory only and resets to the default on reload.
 *
 * @module components/world/domains/managingWorldPlazaAvatarSkinSelectionStore
 */

import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
  type DefiningWorldPlazaAvatarSkinId,
} from "@/components/world/domains/definingWorldPlazaAvatarSkinConstants";

/** Mutable selection state shared across plaza components. */
const managingWorldPlazaAvatarSkinSelectionState: {
  selectedSkinId: DefiningWorldPlazaAvatarSkinId;
} = {
  selectedSkinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
};

/** React subscribers notified when the selected skin changes. */
const managingWorldPlazaAvatarSkinSelectionSubscribers = new Set<() => void>();

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
  skinId: DefiningWorldPlazaAvatarSkinId,
): void {
  if (managingWorldPlazaAvatarSkinSelectionState.selectedSkinId === skinId) {
    return;
  }

  managingWorldPlazaAvatarSkinSelectionState.selectedSkinId = skinId;
  notifyingWorldPlazaAvatarSkinSelectionSubscribers();
}

/**
 * Subscribes to avatar skin selection changes.
 *
 * @param onStoreChange - Callback invoked when the selection changes.
 */
export function subscribingWorldPlazaSelectedAvatarSkin(
  onStoreChange: () => void,
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
