/**
 * Builds inventory item definitions for all wildlife raw/cooked meats.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaWildlifeMeatInventoryItems
 */

import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';

/** Inventory definitions for every wildlife raw and cooked meat item. */
export function registeringWorldPlazaWildlifeMeatInventoryItems(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  const definitions: DefiningWorldPlazaInventoryItemTypeDefinition[] = [];

  for (const entry of DEFINING_WILDLIFE_MEAT_CATALOG) {
    definitions.push({
      typeId: entry.rawItemTypeId,
      name: entry.rawDisplayName,
      iconEmoji: '🥩',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      food: {
        hungerRestoreRatio: entry.rawHungerRestoreRatio,
        meatKind: 'raw',
        wildlifeSpeciesId: entry.speciesId,
        rawDiseaseId: entry.rawDiseaseId,
        rawDiseaseChance: entry.rawDiseaseChance,
      },
    });

    definitions.push({
      typeId: entry.cookedItemTypeId,
      name: entry.cookedDisplayName,
      iconEmoji: '🍖',
      maxStack: 99,
      isDroppable: true,
      isStackable: true,
      food: {
        hungerRestoreRatio: entry.cookedHungerRestoreRatio,
        meatKind: 'cooked',
        wildlifeSpeciesId: entry.speciesId,
        cookedWellFedBuffId: entry.cookedWellFedBuffId,
        cookedWellFedChance: entry.cookedWellFedChance,
        cookedResidualDiseaseId: entry.cookedResidualDiseaseId,
        cookedResidualDiseaseChance: entry.cookedResidualDiseaseChance,
      },
    });
  }

  return definitions;
}
