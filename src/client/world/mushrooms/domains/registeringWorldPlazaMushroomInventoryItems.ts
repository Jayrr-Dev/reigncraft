/**
 * Builds inventory item definitions for all raw/cooked mushrooms.
 *
 * @module components/world/mushrooms/domains/registeringWorldPlazaMushroomInventoryItems
 */

import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG,
  type DefiningWorldPlazaMushroomCatalogEntry,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import {
  resolvingWorldPlazaInventoryCookedMushroomSpriteSheetIcon,
  resolvingWorldPlazaInventoryRawMushroomSpriteSheetIcon,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpriteSheetConstants';

function registeringWorldPlazaMushroomInventoryItemDefinitions(
  entry: DefiningWorldPlazaMushroomCatalogEntry
): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  const rawSpriteSheet =
    resolvingWorldPlazaInventoryRawMushroomSpriteSheetIcon(entry.rawItemTypeId);
  const cookedSpriteSheet =
    resolvingWorldPlazaInventoryCookedMushroomSpriteSheetIcon(
      entry.cookedItemTypeId
    );

  return [
    {
      typeId: entry.rawItemTypeId,
      name: entry.rawDisplayName,
      rarity: entry.polarity === 'good' ? 'common' : 'uncommon',
      iconEmoji: '🍄',
      iconSpriteSheet: rawSpriteSheet ?? undefined,
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
        rawDiseaseId: entry.rawDiseaseId,
        rawDiseaseChance: entry.rawDiseaseChance,
        rawPoisonFlatEv: entry.rawPoisonFlatEv,
        rawPoisonDurationMs: entry.rawPoisonDurationMs,
      },
    },
    {
      typeId: entry.cookedItemTypeId,
      name: entry.cookedDisplayName,
      rarity: entry.polarity === 'good' ? 'uncommon' : 'common',
      iconEmoji: '🍄',
      iconSpriteSheet: cookedSpriteSheet ?? undefined,
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
        cookedWellFedBuffId: entry.cookedWellFedBuffId,
        cookedWellFedChance: entry.cookedWellFedChance,
        cookedResidualDiseaseId: entry.cookedResidualDiseaseId,
        cookedResidualDiseaseChance: entry.cookedResidualDiseaseChance,
      },
    },
  ];
}

/** Inventory definitions for every raw and cooked mushroom. */
export function registeringWorldPlazaMushroomInventoryItems(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  const definitions: DefiningWorldPlazaInventoryItemTypeDefinition[] = [];

  for (const entry of DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG) {
    definitions.push(
      ...registeringWorldPlazaMushroomInventoryItemDefinitions(entry)
    );
  }

  return definitions;
}
