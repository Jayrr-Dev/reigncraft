/**
 * Session-scoped flag for the Random Animal single-player load.
 *
 * When enabled: study-gated animal skins stay equipped, and boot rolls a
 * random playable form if none is stored for the slot owner.
 *
 * @module components/world/domains/managingWorldPlazaRandomAnimalLoadStore
 */

/** Mutable Random Animal load state shared across plaza systems. */
const managingWorldPlazaRandomAnimalLoadState: {
  isEnabled: boolean;
} = {
  isEnabled: false,
};

/** React subscribers notified when Random Animal load toggles. */
const managingWorldPlazaRandomAnimalLoadSubscribers = new Set<() => void>();

function notifyingWorldPlazaRandomAnimalLoadSubscribers(): void {
  for (const subscriber of managingWorldPlazaRandomAnimalLoadSubscribers) {
    subscriber();
  }
}

/**
 * Returns true when the Random Animal load profile is active.
 */
export function checkingWorldPlazaRandomAnimalLoadEnabled(): boolean {
  return managingWorldPlazaRandomAnimalLoadState.isEnabled;
}

/**
 * Enables Random Animal mode for the current session.
 */
export function enablingWorldPlazaRandomAnimalLoad(): void {
  if (managingWorldPlazaRandomAnimalLoadState.isEnabled) {
    return;
  }

  managingWorldPlazaRandomAnimalLoadState.isEnabled = true;
  notifyingWorldPlazaRandomAnimalLoadSubscribers();
}

/**
 * Disables Random Animal mode for the current session.
 */
export function disablingWorldPlazaRandomAnimalLoad(): void {
  if (!managingWorldPlazaRandomAnimalLoadState.isEnabled) {
    return;
  }

  managingWorldPlazaRandomAnimalLoadState.isEnabled = false;
  notifyingWorldPlazaRandomAnimalLoadSubscribers();
}

/**
 * Subscribes to Random Animal load enable/disable changes.
 *
 * @param subscriber - Callback invoked on each toggle.
 * @returns Unsubscribe function.
 */
export function subscribingWorldPlazaRandomAnimalLoad(
  subscriber: () => void
): () => void {
  managingWorldPlazaRandomAnimalLoadSubscribers.add(subscriber);

  return () => {
    managingWorldPlazaRandomAnimalLoadSubscribers.delete(subscriber);
  };
}
