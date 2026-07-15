/**
 * Builds inventory item definitions for fishing catch (raw/cooked + junk).
 *
 * @module components/world/fishing/domains/registeringWorldPlazaFishingCatchInventoryItems
 */

import {
  DEFINING_WORLD_PLAZA_FISHING_CATCH_CATALOG,
  type DefiningWorldPlazaFishingCatchCatalogEntry,
  type DefiningWorldPlazaFishingCatchCreatureEntry,
  type DefiningWorldPlazaFishingCatchJunkEntry,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';

function registeringCreatureItems(
  entry: DefiningWorldPlazaFishingCatchCreatureEntry
): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return [
    {
      typeId: entry.rawItemTypeId,
      name: entry.rawDisplayName,
      rarity: entry.rarity,
      iconEmoji: entry.rawIconEmoji,
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      food: {
        hungerRestoreRatio: entry.rawHungerRestoreRatio,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: entry.rawHungerRestoreRatio,
          meatKind: 'raw',
        }),
        meatKind: 'raw',
        wildlifeSpeciesId: entry.catchId,
        rawDiseaseId: entry.rawDiseaseId,
        rawDiseaseChance: entry.rawDiseaseChance,
      },
    },
    {
      typeId: entry.cookedItemTypeId,
      name: entry.cookedDisplayName,
      rarity: entry.rarity,
      iconEmoji: entry.cookedIconEmoji,
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      food: {
        hungerRestoreRatio: entry.cookedHungerRestoreRatio,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: entry.cookedHungerRestoreRatio,
          meatKind: 'cooked',
        }),
        meatKind: 'cooked',
        wildlifeSpeciesId: entry.catchId,
        cookedWellFedBuffId: entry.cookedWellFedBuffId,
        cookedWellFedChance: entry.cookedWellFedChance,
      },
    },
  ];
}

function registeringJunkItem(
  entry: DefiningWorldPlazaFishingCatchJunkEntry
): DefiningWorldPlazaInventoryItemTypeDefinition {
  return {
    typeId: entry.itemTypeId,
    name: entry.displayName,
    rarity: entry.rarity,
    iconEmoji: entry.iconEmoji,
    maxStack: 99,
    isDroppable: true,
    isStackable: true,
  };
}

function registeringCatchEntry(
  entry: DefiningWorldPlazaFishingCatchCatalogEntry
): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  if (entry.kind === 'junk') {
    return [registeringJunkItem(entry)];
  }

  return registeringCreatureItems(entry);
}

/** Inventory definitions for every fishing catch item. */
export function registeringWorldPlazaFishingCatchInventoryItems(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  const definitions: DefiningWorldPlazaInventoryItemTypeDefinition[] = [];

  for (const entry of DEFINING_WORLD_PLAZA_FISHING_CATCH_CATALOG) {
    definitions.push(...registeringCatchEntry(entry));
  }

  return definitions;
}
