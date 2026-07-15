/**
 * Session-scoped flag for the Perma Death single-player load.
 *
 * When enabled: death wipes the save slot and only offers Return Home.
 *
 * @module components/world/domains/managingWorldPlazaPermaDeathLoadStore
 */

/** Mutable Perma Death load state shared across plaza systems. */
const managingWorldPlazaPermaDeathLoadState: {
  isEnabled: boolean;
  pendingStartingAvatarSkinId: string | null;
} = {
  isEnabled: false,
  pendingStartingAvatarSkinId: null,
};

/** React subscribers notified when Perma Death load toggles. */
const managingWorldPlazaPermaDeathLoadSubscribers = new Set<() => void>();

function notifyingWorldPlazaPermaDeathLoadSubscribers(): void {
  for (const subscriber of managingWorldPlazaPermaDeathLoadSubscribers) {
    subscriber();
  }
}

/**
 * Returns true when the Perma Death load profile is active.
 */
export function checkingWorldPlazaPermaDeathLoadEnabled(): boolean {
  return managingWorldPlazaPermaDeathLoadState.isEnabled;
}

/**
 * Returns the avatar skin chosen on the home screen for a new Perma Death run.
 */
export function gettingWorldPlazaPermaDeathPendingStartingAvatarSkinId():
  | string
  | null {
  return managingWorldPlazaPermaDeathLoadState.pendingStartingAvatarSkinId;
}

/**
 * Enables Perma Death mode for the current session.
 *
 * @param startingAvatarSkinId - Skin chosen on the home screen for a new run.
 */
export function enablingWorldPlazaPermaDeathLoad(
  startingAvatarSkinId: string | null = null
): void {
  managingWorldPlazaPermaDeathLoadState.isEnabled = true;
  managingWorldPlazaPermaDeathLoadState.pendingStartingAvatarSkinId =
    startingAvatarSkinId;
  notifyingWorldPlazaPermaDeathLoadSubscribers();
}

/**
 * Disables Perma Death mode for the current session.
 */
export function disablingWorldPlazaPermaDeathLoad(): void {
  if (
    !managingWorldPlazaPermaDeathLoadState.isEnabled &&
    managingWorldPlazaPermaDeathLoadState.pendingStartingAvatarSkinId === null
  ) {
    return;
  }

  managingWorldPlazaPermaDeathLoadState.isEnabled = false;
  managingWorldPlazaPermaDeathLoadState.pendingStartingAvatarSkinId = null;
  notifyingWorldPlazaPermaDeathLoadSubscribers();
}

/**
 * Clears the pending starting skin after it has been applied at boot.
 */
export function clearingWorldPlazaPermaDeathPendingStartingAvatarSkinId(): void {
  if (
    managingWorldPlazaPermaDeathLoadState.pendingStartingAvatarSkinId === null
  ) {
    return;
  }

  managingWorldPlazaPermaDeathLoadState.pendingStartingAvatarSkinId = null;
  notifyingWorldPlazaPermaDeathLoadSubscribers();
}

/**
 * Subscribes to Perma Death load enable/disable changes.
 *
 * @param subscriber - Callback invoked on each toggle.
 * @returns Unsubscribe function.
 */
export function subscribingWorldPlazaPermaDeathLoad(
  subscriber: () => void
): () => void {
  managingWorldPlazaPermaDeathLoadSubscribers.add(subscriber);

  return () => {
    managingWorldPlazaPermaDeathLoadSubscribers.delete(subscriber);
  };
}

/**
 * Resets Perma Death load state for unit tests.
 */
export function resettingWorldPlazaPermaDeathLoadStoreForTests(): void {
  managingWorldPlazaPermaDeathLoadState.isEnabled = false;
  managingWorldPlazaPermaDeathLoadState.pendingStartingAvatarSkinId = null;
  notifyingWorldPlazaPermaDeathLoadSubscribers();
}
