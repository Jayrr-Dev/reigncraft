/**
 * Updates a wildlife instance's player-assigned display name.
 *
 * @module components/world/wildlife/domains/renamingWildlifeInstanceDisplayName
 */

import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

/** Sets or clears a custom name tag label on one live wildlife instance. */
export function renamingWildlifeInstanceDisplayName(
  store: ManagingWildlifeInstanceStore,
  instanceId: string,
  customDisplayName: string | null
): boolean {
  const instance = store.instances.get(instanceId);

  if (!instance || instance.isDead) {
    return false;
  }

  const normalizedName =
    customDisplayName === null ? null : customDisplayName.trim() || null;

  if (instance.customDisplayName === normalizedName) {
    return true;
  }

  store.instances.set(instanceId, {
    ...instance,
    customDisplayName: normalizedName,
  });

  return true;
}
