import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentConstants';
import {
  readingWorldPlazaInventoryItemEnchantmentStateMap,
  listingWorldPlazaInventoryItemEnchantmentIds,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentState';
import { resolvingWorldPlazaInventoryEnchantmentDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentRegistry';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

/**
 * Computes harvest speed multiplier from passive and armed enchantments on an item.
 */
export function computingWorldPlazaInventoryItemEnchantmentHarvestSpeedMultiplier(
  item: DefiningInventoryItem,
  nowMs: number = Date.now()
): number {
  const itemDefinition = resolvingWorldPlazaInventoryItemTypeDefinition(
    item.itemTypeId
  );
  const enchantmentIds = listingWorldPlazaInventoryItemEnchantmentIds(
    item,
    itemDefinition?.defaultEnchantments ?? []
  );
  const enchantmentState = readingWorldPlazaInventoryItemEnchantmentStateMap(
    item.metadata
  );

  let multiplier = 1;

  for (const enchantmentId of enchantmentIds) {
    const definition =
      resolvingWorldPlazaInventoryEnchantmentDefinition(enchantmentId);

    if (!definition) {
      continue;
    }

    if (definition.passiveHarvestSpeedMultiplier) {
      multiplier *= definition.passiveHarvestSpeedMultiplier;
    }

    const runtimeState = enchantmentState[enchantmentId];

    if (
      runtimeState?.armed &&
      definition.armedHarvestSpeedMultiplier
    ) {
      multiplier *= definition.armedHarvestSpeedMultiplier;
    }
  }

  return multiplier;
}

/**
 * Disarms a one-shot enchantment after its effect is consumed.
 */
export function disarmingWorldPlazaInventoryItemEnchantment(
  item: DefiningInventoryItem,
  enchantmentId: string
): DefiningInventoryItem {
  const enchantmentState = readingWorldPlazaInventoryItemEnchantmentStateMap(
    item.metadata
  );
  const runtimeState = enchantmentState[enchantmentId];

  if (!runtimeState?.armed) {
    return item;
  }

  return {
    ...item,
    metadata: {
      ...item.metadata,
      [DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY]: {
        ...enchantmentState,
        [enchantmentId]: {
          ...runtimeState,
          armed: false,
        },
      },
    },
  };
}
