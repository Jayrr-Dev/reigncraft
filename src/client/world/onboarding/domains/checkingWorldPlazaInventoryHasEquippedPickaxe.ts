import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { checkingWorldPlazaEquippedSlotHasToolKind } from '@/components/world/equipment/domains/checkingWorldPlazaEquippedSlotHasToolKind';
import { DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/**
 * Returns true when the fist slot holds a pickaxe.
 */
export function checkingWorldPlazaInventoryHasEquippedPickaxe(
  inventoryState: DefiningInventoryState
): boolean {
  return checkingWorldPlazaEquippedSlotHasToolKind(
    inventoryState,
    DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX,
    'pickaxe'
  ).hasToolKind;
}
