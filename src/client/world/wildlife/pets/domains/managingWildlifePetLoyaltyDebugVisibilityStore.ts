/**
 * Module-level store for pet loyalty overhead debug visibility.
 *
 * @module components/world/wildlife/pets/domains/managingWildlifePetLoyaltyDebugVisibilityStore
 */

/** Mutable loyalty overlay visibility shared across plaza components. */
const managingWildlifePetLoyaltyDebugVisibilityState: {
  isVisible: boolean;
} = {
  isVisible: false,
};

/** React subscribers notified when visibility changes. */
const managingWildlifePetLoyaltyDebugVisibilitySubscribers = new Set<
  () => void
>();

/**
 * Returns true when pet loyalty should render on wildlife name tags.
 */
export function checkingWildlifePetLoyaltyDebugVisible(): boolean {
  return managingWildlifePetLoyaltyDebugVisibilityState.isVisible;
}

/**
 * Shows or hides pet loyalty overhead labels.
 */
export function settingWildlifePetLoyaltyDebugVisible(
  isVisible: boolean
): void {
  if (managingWildlifePetLoyaltyDebugVisibilityState.isVisible === isVisible) {
    return;
  }

  managingWildlifePetLoyaltyDebugVisibilityState.isVisible = isVisible;
  notifyingWildlifePetLoyaltyDebugVisibilitySubscribers();
}

/**
 * Flips pet loyalty overhead visibility.
 */
export function togglingWildlifePetLoyaltyDebugVisible(): void {
  settingWildlifePetLoyaltyDebugVisible(
    !managingWildlifePetLoyaltyDebugVisibilityState.isVisible
  );
}

/**
 * Subscribes to pet loyalty overhead visibility changes.
 */
export function subscribingWildlifePetLoyaltyDebugVisible(
  onStoreChange: () => void
): () => void {
  managingWildlifePetLoyaltyDebugVisibilitySubscribers.add(onStoreChange);

  return () => {
    managingWildlifePetLoyaltyDebugVisibilitySubscribers.delete(onStoreChange);
  };
}

function notifyingWildlifePetLoyaltyDebugVisibilitySubscribers(): void {
  for (const onStoreChange of managingWildlifePetLoyaltyDebugVisibilitySubscribers) {
    onStoreChange();
  }
}
