/**
 * Module-level store for plaza gameplay HUD chrome visibility.
 *
 * In-memory only: refresh restores the default (visible). Used for F1
 * screenshot / clean-viewport mode.
 *
 * @module components/world/domains/managingWorldPlazaGameplayHudVisibilityStore
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_DEFAULT_VISIBLE } from '@/components/world/domains/definingWorldPlazaGameplayHudVisibilityConstants';

/** Mutable HUD chrome visibility shared across plaza components. */
const managingWorldPlazaGameplayHudVisibilityState: {
  isVisible: boolean;
} = {
  isVisible: DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_DEFAULT_VISIBLE,
};

/** React subscribers notified when visibility changes. */
const managingWorldPlazaGameplayHudVisibilitySubscribers = new Set<
  () => void
>();

/** Returns true when gameplay HUD chrome should render. */
export function checkingWorldPlazaGameplayHudVisible(): boolean {
  return managingWorldPlazaGameplayHudVisibilityState.isVisible;
}

/**
 * Sets gameplay HUD chrome visibility and notifies subscribers.
 *
 * @param isVisible - True when bars, hotbar, minimap, and related chrome show.
 */
export function settingWorldPlazaGameplayHudVisible(isVisible: boolean): void {
  if (managingWorldPlazaGameplayHudVisibilityState.isVisible === isVisible) {
    return;
  }

  managingWorldPlazaGameplayHudVisibilityState.isVisible = isVisible;
  notifyingWorldPlazaGameplayHudVisibilitySubscribers();
}

/** Flips gameplay HUD chrome visibility. */
export function togglingWorldPlazaGameplayHudVisible(): void {
  settingWorldPlazaGameplayHudVisible(
    !managingWorldPlazaGameplayHudVisibilityState.isVisible
  );
}

/**
 * Subscribes to gameplay HUD chrome visibility changes.
 *
 * @param onStoreChange - Callback invoked when visibility changes.
 */
export function subscribingWorldPlazaGameplayHudVisible(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaGameplayHudVisibilitySubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaGameplayHudVisibilitySubscribers.delete(onStoreChange);
  };
}

function notifyingWorldPlazaGameplayHudVisibilitySubscribers(): void {
  for (const onStoreChange of managingWorldPlazaGameplayHudVisibilitySubscribers) {
    onStoreChange();
  }
}
