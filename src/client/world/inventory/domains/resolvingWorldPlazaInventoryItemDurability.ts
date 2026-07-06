import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import { DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_METADATA_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryDurabilityConstants';
import type { DefiningWorldPlazaInventoryItemDurabilityBehavior } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

export type ResolvingWorldPlazaInventoryItemDurabilitySnapshot = {
  readonly max: number;
  readonly remaining: number;
  readonly ratio: number;
};

function parsingWorldPlazaInventoryItemDurabilityMetadata(
  metadata: DefiningInventoryItem['metadata']
): number | null {
  const rawValue = metadata?.[DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_METADATA_KEY];

  if (typeof rawValue !== 'number' || !Number.isFinite(rawValue)) {
    return null;
  }

  return Math.max(0, Math.floor(rawValue));
}

/**
 * Resolves durability config for an item type id, if the item supports wear.
 */
export function resolvingWorldPlazaInventoryItemDurabilityBehavior(
  itemTypeId: string
): DefiningWorldPlazaInventoryItemDurabilityBehavior | null {
  return (
    resolvingWorldPlazaInventoryItemTypeDefinition(itemTypeId)?.durability ??
    null
  );
}

/**
 * Whether an item type uses the durability wear-and-break system.
 */
export function checkingWorldPlazaInventoryItemHasDurability(
  itemTypeId: string
): boolean {
  return resolvingWorldPlazaInventoryItemDurabilityBehavior(itemTypeId) !== null;
}

/**
 * Resolves remaining/max durability for one inventory item instance.
 */
export function resolvingWorldPlazaInventoryItemDurability(
  item: DefiningInventoryItem
): ResolvingWorldPlazaInventoryItemDurabilitySnapshot | null {
  const durabilityBehavior = resolvingWorldPlazaInventoryItemDurabilityBehavior(
    item.itemTypeId
  );

  if (!durabilityBehavior) {
    return null;
  }

  const max = Math.max(1, Math.floor(durabilityBehavior.max));
  const storedRemaining = parsingWorldPlazaInventoryItemDurabilityMetadata(
    item.metadata
  );
  const remaining = Math.min(
    max,
    storedRemaining ?? max
  );
  const ratio = remaining / max;

  return {
    max,
    remaining,
    ratio,
  };
}
