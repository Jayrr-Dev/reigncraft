/**
 * Resolves herbarium rarity id + label for one guide entry.
 *
 * Flowers pull rarity from inventory item defs. Trees use the herbarium map.
 *
 * @module components/home/domains/resolvingPlazaHerbariumRarity
 */

import { DEFINING_PLAZA_HERBARIUM_TREE_RARITY_BY_VARIANT } from '@/components/home/domains/definingPlazaHerbariumRarityConstants';
import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import { DEFINING_WORLD_PLAZA_BERRY_LOOT_KIND_TO_ITEM_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBerrySpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_CLOVER_LOOT_KIND_TO_ITEM_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_FLOWER_SPECIES_TO_ITEM_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_LABELS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';
import { resolvingWorldPlazaMushroomCatalogEntryBySpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import type { WorldCloverSearchLootKind } from '../../../../shared/worldCloverSearchLoot';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';
import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';

export type ResolvingPlazaHerbariumRarityEntry =
  | { kind: 'flower'; speciesId: WorldFlowerSpeciesId }
  | { kind: 'tree'; variant: DefiningWorldPlazaTreeVariantKind }
  | { kind: 'clover'; cloverKind: WorldCloverSearchLootKind }
  | { kind: 'berry'; berryLootKind: WorldShrubBerryLootKind }
  | { kind: 'mushroom'; speciesId: DefiningWorldPlazaMushroomSpeciesId };

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

  if (entry.kind === 'clover') {
    const typeId =
      DEFINING_WORLD_PLAZA_CLOVER_LOOT_KIND_TO_ITEM_TYPE_ID[entry.cloverKind];
    const definition = resolvingWorldPlazaInventoryItemTypeDefinition(typeId);

    return definition?.rarity ?? 'basic';
  }

  if (entry.kind === 'berry') {
    const typeId =
      DEFINING_WORLD_PLAZA_BERRY_LOOT_KIND_TO_ITEM_TYPE_ID[
        entry.berryLootKind
      ];
    const definition = resolvingWorldPlazaInventoryItemTypeDefinition(typeId);

    return definition?.rarity ?? 'basic';
  }

  if (entry.kind === 'mushroom') {
    return resolvingWorldPlazaMushroomCatalogEntryBySpeciesId(entry.speciesId)
      .rarity;
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
