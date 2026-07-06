import type {
  DefiningWorldPlazaEquipmentItemCapabilities,
  DefiningWorldPlazaEquipmentToolKind,
} from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

/**
 * Resolves equipment capabilities for an inventory item type id.
 */
export function resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId(
  itemTypeId: string
): DefiningWorldPlazaEquipmentItemCapabilities | null {
  return (
    resolvingWorldPlazaInventoryItemTypeDefinition(itemTypeId)?.equipment ??
    null
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
