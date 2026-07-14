/**
 * Resolves herbarium rarity id + label for one guide entry.
 *
 * Flowers pull rarity from inventory item defs. Trees use the herbarium map.
 *
 * @module components/home/domains/resolvingPlazaHerbariumRarity
 */

import { DEFINING_PLAZA_HERBARIUM_TREE_RARITY_BY_VARIANT } from '@/components/home/domains/definingPlazaHerbariumRarityConstants';
import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_LABELS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import { DEFINING_WORLD_PLAZA_FLOWER_SPECIES_TO_ITEM_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

export type ResolvingPlazaHerbariumRarityEntry =
  | { kind: 'flower'; speciesId: WorldFlowerSpeciesId }
  | { kind: 'tree'; variant: DefiningWorldPlazaTreeVariantKind };

/**
 * Resolves the rarity id for one herbarium guide entry.
 */
export function resolvingPlazaHerbariumEntryRarity(
  entry: ResolvingPlazaHerbariumRarityEntry
): DefiningWorldPlazaInventoryItemRarity {
  if (entry.kind === 'flower') {
    const typeId =
      DEFINING_WORLD_PLAZA_FLOWER_SPECIES_TO_ITEM_TYPE_ID[entry.speciesId];
    const definition = resolvingWorldPlazaInventoryItemTypeDefinition(typeId);

    return definition?.rarity ?? 'basic';
  }

  return DEFINING_PLAZA_HERBARIUM_TREE_RARITY_BY_VARIANT[entry.variant];
}

/**
 * Player-facing rarity label for one herbarium entry.
 */
export function resolvingPlazaHerbariumEntryRarityLabel(
  rarity: DefiningWorldPlazaInventoryItemRarity
): string {
  return DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_LABELS[rarity];
}

/**
 * Inventory detail badge variant for one herbarium rarity.
 */
export function resolvingPlazaHerbariumEntryRarityBadgeVariant(
  rarity: DefiningWorldPlazaInventoryItemRarity
): `rarity-${DefiningWorldPlazaInventoryItemRarity}` {
  return `rarity-${rarity}`;
}
