/**
 * Module-level store for terrain collision debug overlay visibility.
 *
 * @module components/world/domains/managingWorldPlazaTerrainCollisionDebugVisibilityStore
 */

import { DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_ENABLED } from '@/components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants';

/** Mutable collision debug visibility shared across plaza components. */
const managingWorldPlazaTerrainCollisionDebugVisibilityState: {
  isVisible: boolean;
} = {
  isVisible: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_ENABLED,
};

/** React subscribers notified when visibility changes. */
const managingWorldPlazaTerrainCollisionDebugVisibilitySubscribers = new Set<
  () => void
>();

/**
 * Returns true when collision debug overlays should draw.
 */
export function checkingWorldPlazaTerrainCollisionDebugVisible(): boolean {
  return managingWorldPlazaTerrainCollisionDebugVisibilityState.isVisible;
}

/**
 * Shows or hides collision debug overlays.
 *
 * @param isVisible - True to draw collision debug overlays.
 */
export function settingWorldPlazaTerrainCollisionDebugVisible(
  isVisible: boolean
): void {
  if (
    managingWorldPlazaTerrainCollisionDebugVisibilityState.isVisible ===
    isVisible
  ) {
    return;
  }

  managingWorldPlazaTerrainCollisionDebugVisibilityState.isVisible = isVisible;
  notifyingWorldPlazaTerrainCollisionDebugVisibilitySubscribers();
}

/**
 * Flips collision debug visibility.
 */
export function togglingWorldPlazaTerrainCollisionDebugVisible(): void {
  settingWorldPlazaTerrainCollisionDebugVisible(
    !managingWorldPlazaTerrainCollisionDebugVisibilityState.isVisible
  );
}

/**
 * Subscribes to collision debug visibility changes.
 *
 * @param onStoreChange - Callback invoked when visibility changes.
 */
export function subscribingWorldPlazaTerrainCollisionDebugVisible(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaTerrainCollisionDebugVisibilitySubscribers.add(
    onStoreChange
  );

  return () => {
    managingWorldPlazaTerrainCollisionDebugVisibilitySubscribers.delete(
      onStoreChange
    );
  };
}

/**
 * Notifies React subscribers that visibility changed.
 */
function notifyingWorldPlazaTerrainCollisionDebugVisibilitySubscribers(): void {
  for (const onStoreChange of managingWorldPlazaTerrainCollisionDebugVisibilitySubscribers) {
    onStoreChange();
  }
}
