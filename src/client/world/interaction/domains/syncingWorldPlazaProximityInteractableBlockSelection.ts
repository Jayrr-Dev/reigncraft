import type { ListingWorldPlazaInteractableSelectionKeysInPlayerProximityParams } from '@/components/world/interaction/domains/listingWorldPlazaInteractableSelectionKeysInPlayerProximity';
import { listingWorldPlazaInteractableSelectionKeysInPlayerProximity } from '@/components/world/interaction/domains/listingWorldPlazaInteractableSelectionKeysInPlayerProximity';

/**
 * Replaces the interactable selection set with proximity keys when the set of
 * keys changed. Returns true when the selection mutated.
 */
export function syncingWorldPlazaProximityInteractableBlockSelection(
  selectedBlockKeys: Set<string>,
  params: ListingWorldPlazaInteractableSelectionKeysInPlayerProximityParams
): boolean {
  const nextKeys =
    listingWorldPlazaInteractableSelectionKeysInPlayerProximity(params);

  if (selectedBlockKeys.size === nextKeys.size) {
    let isUnchanged = true;

    for (const key of nextKeys) {
      if (!selectedBlockKeys.has(key)) {
        isUnchanged = false;
        break;
      }
    }

    if (isUnchanged) {
      return false;
    }
  }

  selectedBlockKeys.clear();

  for (const key of nextKeys) {
    selectedBlockKeys.add(key);
  }

  return true;
}
