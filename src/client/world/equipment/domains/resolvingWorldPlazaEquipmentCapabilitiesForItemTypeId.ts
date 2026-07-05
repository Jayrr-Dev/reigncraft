import type {
  DefiningWorldPlazaEquipmentItemCapabilities,
  DefiningWorldPlazaEquipmentToolKind,
} from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

const DEFINING_WORLD_PLAZA_EQUIPMENT_CAPABILITIES_BY_ITEM_TYPE: Readonly<
  Record<string, DefiningWorldPlazaEquipmentItemCapabilities>
> = {
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE]: {
    toolKinds: ['axe'],
    harvestSpeedMultiplier: 1,
  },
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL]: {
    toolKinds: ['build'],
    harvestSpeedMultiplier: 1,
  },
  [DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT]: {
    toolKinds: ['ignite'],
    harvestSpeedMultiplier: 1,
  },
};

/**
 * Resolves equipment capabilities for an inventory item type id.
 */
export function resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId(
  itemTypeId: string
): DefiningWorldPlazaEquipmentItemCapabilities | null {
  return (
    DEFINING_WORLD_PLAZA_EQUIPMENT_CAPABILITIES_BY_ITEM_TYPE[itemTypeId] ?? null
  );
}

/**
 * Returns true when an item type grants the requested tool kind.
 */
export function checkingWorldPlazaItemTypeHasEquipmentToolKind(
  itemTypeId: string,
  toolKind: DefiningWorldPlazaEquipmentToolKind
): boolean {
  const capabilities =
    resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId(itemTypeId);

  if (!capabilities) {
    return false;
  }

  return capabilities.toolKinds.includes(toolKind);
}
