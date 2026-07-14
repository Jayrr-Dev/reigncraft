import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import { resolvingWorldPlazaInventoryDropLocationFromOverId } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryDropLocationFromOverId';

/**
 * Resolves a bag's hotbar slot index when a drag is over that bag slot.
 *
 * Used to open bag popovers only while hovering during DnD (not on drag start).
 *
 * @param overId - dnd-kit collision id
 * @param state - Current hotbar inventory state
 * @param registry - Item type registry
 */
export function resolvingWorldPlazaInventoryBagHotbarSlotIndexFromOverId(
  overId: string,
  state: DefiningInventoryState,
  registry: DefiningInventoryItemRegistry
): number | null {
  const location = resolvingWorldPlazaInventoryDropLocationFromOverId(
    overId,
    state,
    registry
  );

  if (location?.kind !== 'hotbar') {
    return null;
  }

  const slotItem = state.slots[location.slotIndex];

  if (
    !slotItem ||
    !checkingWorldPlazaInventoryItemIsBag(slotItem.itemTypeId)
  ) {
    return null;
  }

  return location.slotIndex;
}
