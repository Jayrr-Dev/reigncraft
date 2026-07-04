import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';

/** Ground items the local player dropped; manual pickup only. */
const selfDroppedGroundItemIds = new Set<string>();

/** Ground items present on the first successful poll after joining. */
const initialGroundItemSnapshotIds = new Set<string>();

/** Newly appeared ground items that may be auto-picked up. */
const autoPickupEligibleGroundItemIds = new Set<string>();

let hasRecordedInitialGroundItemSnapshot = false;

/**
 * Marks a ground item as self-dropped so auto-pickup never collects it.
 *
 * @param groundItemId - Server id of the newly dropped ground item.
 */
export function registeringWorldPlazaGroundItemSelfDrop(
  groundItemId: string
): void {
  if (groundItemId.length === 0) {
    return;
  }

  selfDroppedGroundItemIds.add(groundItemId);
  autoPickupEligibleGroundItemIds.delete(groundItemId);
}

/**
 * Updates which ground items are eligible for walk-over auto-pickup.
 *
 * Only items that appear after the initial room snapshot (and were not dropped
 * by the local player) become eligible.
 *
 * @param groundItems - Current shared ground item list.
 */
export function syncingWorldPlazaGroundItemAutoPickupEligibility(
  groundItems: readonly DefiningWorldPlazaGroundItem[]
): void {
  const currentGroundItemIds = new Set(
    groundItems.map((groundItem) => groundItem.id)
  );

  if (!hasRecordedInitialGroundItemSnapshot) {
    for (const groundItem of groundItems) {
      initialGroundItemSnapshotIds.add(groundItem.id);
    }

    hasRecordedInitialGroundItemSnapshot = true;
    return;
  }

  for (const groundItem of groundItems) {
    if (
      initialGroundItemSnapshotIds.has(groundItem.id) ||
      selfDroppedGroundItemIds.has(groundItem.id)
    ) {
      continue;
    }

    autoPickupEligibleGroundItemIds.add(groundItem.id);
  }

  for (const groundItemId of autoPickupEligibleGroundItemIds) {
    if (!currentGroundItemIds.has(groundItemId)) {
      autoPickupEligibleGroundItemIds.delete(groundItemId);
    }
  }

  for (const groundItemId of selfDroppedGroundItemIds) {
    if (!currentGroundItemIds.has(groundItemId)) {
      selfDroppedGroundItemIds.delete(groundItemId);
    }
  }
}

/**
 * Returns true when a ground item may be collected via walk-over auto-pickup.
 *
 * @param groundItemId - Ground item id to check.
 */
export function checkingWorldPlazaGroundItemAutoPickupEligible(
  groundItemId: string
): boolean {
  return autoPickupEligibleGroundItemIds.has(groundItemId);
}
