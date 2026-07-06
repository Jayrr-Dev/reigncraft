import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import { DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_BREAK_CHANCE_AT_ZERO } from '@/components/world/inventory/domains/definingWorldPlazaInventoryDurabilityConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_EQUIPMENT_TOOL_KIND_BADGE_LABELS,
  type DefiningWorldPlazaInventoryItemDetailBadge,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { formattingWorldPlazaInventoryItemDurabilityLabel } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryItemDurabilityLabel';
import { resolvingWorldPlazaInventoryItemDurability } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDurability';
import { checkingWorldPlazaInventoryItemIsFood } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';
import { resolvingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStackQuantityLabel';
import {
  partitioningWorldPlazaInventoryItemEnchantmentRows,
  resolvingWorldPlazaInventoryItemEnchantmentRows,
  type ResolvingWorldPlazaInventoryItemEnchantmentRow,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemEnchantments';

export type ResolvingWorldPlazaInventoryItemDetailPopoverModel = {
  readonly name: string;
  readonly description: string;
  readonly durabilityLabel: string | null;
  readonly durabilityRatio: number | null;
  readonly badges: readonly DefiningWorldPlazaInventoryItemDetailBadge[];
  readonly passiveEnchantments: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[];
  readonly activeEnchantments: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[];
  readonly canEat: boolean;
};

function listingWorldPlazaInventoryItemDetailBadges(
  item: DefiningInventoryItem,
  definition: DefiningWorldPlazaInventoryItemTypeDefinition,
  options: { readonly isEquipped: boolean }
): DefiningWorldPlazaInventoryItemDetailBadge[] {
  const badges: DefiningWorldPlazaInventoryItemDetailBadge[] = [];

  if (options.isEquipped) {
    badges.push({
      id: 'equipped',
      label: 'Equipped',
      variant: 'positive',
    });
  }

  if (definition.food) {
    badges.push({
      id: 'food',
      label: `Restores ${Math.round(definition.food.hungerRestoreRatio * 100)}% hunger`,
      variant: 'food',
    });
  }

  if (definition.equipment) {
    for (const toolKind of definition.equipment.toolKinds) {
      badges.push({
        id: `tool-${toolKind}`,
        label:
          DEFINING_WORLD_PLAZA_INVENTORY_EQUIPMENT_TOOL_KIND_BADGE_LABELS[
            toolKind
          ],
        variant: 'tool',
      });
    }

    if (definition.equipment.harvestSpeedMultiplier > 1) {
      badges.push({
        id: 'harvest-speed',
        label: `${definition.equipment.harvestSpeedMultiplier}x harvest speed`,
        variant: 'positive',
      });
    }
  }

  const durabilitySnapshot = resolvingWorldPlazaInventoryItemDurability(item);

  if (durabilitySnapshot) {
    if (durabilitySnapshot.remaining <= 0) {
      const breakChancePercent = Math.round(
        (definition.durability?.breakChanceAtZero ??
          DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_BREAK_CHANCE_AT_ZERO) *
          100
      );
      badges.push({
        id: 'durability-worn',
        label: `May break (${breakChancePercent}% per use)`,
        variant: 'warning',
      });
    }
  }

  if (item.quantity > 1) {
    badges.push({
      id: 'stack',
      label: `Stack ${resolvingWorldPlazaInventoryStackQuantityLabel(
        item.itemTypeId,
        item.quantity
      )}`,
      variant: 'neutral',
    });
  }

  if (!definition.isDroppable) {
    badges.push({
      id: 'bound',
      label: 'Cannot drop',
      variant: 'neutral',
    });
  }

  if (definition.isStackable && definition.maxStack > 1) {
    badges.push({
      id: 'stackable',
      label: `Stacks to ${definition.maxStack}`,
      variant: 'neutral',
    });
  }

  return badges;
}

/**
 * Resolves popover copy and badges for one hotbar item instance.
 */
export function resolvingWorldPlazaInventoryItemDetailPopoverModel(
  item: DefiningInventoryItem,
  options: { readonly isEquipped: boolean; readonly nowMs?: number }
): ResolvingWorldPlazaInventoryItemDetailPopoverModel | null {
  const definition = resolvingWorldPlazaInventoryItemTypeDefinition(
    item.itemTypeId
  );

  if (!definition) {
    return null;
  }

  const durabilitySnapshot = resolvingWorldPlazaInventoryItemDurability(item);
  const enchantmentRows = resolvingWorldPlazaInventoryItemEnchantmentRows(
    item,
    options.nowMs ?? Date.now()
  );
  const { passiveEnchantments, activeEnchantments } =
    partitioningWorldPlazaInventoryItemEnchantmentRows(enchantmentRows);

  return {
    name: definition.name,
    description: definition.tooltip ?? definition.name,
    durabilityLabel: formattingWorldPlazaInventoryItemDurabilityLabel(item),
    durabilityRatio: durabilitySnapshot?.ratio ?? null,
    badges: listingWorldPlazaInventoryItemDetailBadges(
      item,
      definition,
      options
    ),
    passiveEnchantments,
    activeEnchantments,
    canEat: checkingWorldPlazaInventoryItemIsFood(item.itemTypeId),
  };
}
