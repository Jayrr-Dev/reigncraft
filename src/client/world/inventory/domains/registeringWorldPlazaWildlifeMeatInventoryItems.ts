/**
 * Builds inventory item definitions for all wildlife raw/cooked meats.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaWildlifeMeatInventoryItems
 */

import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';
import { resolvingWildlifeMeatInventoryIcons } from '@/components/world/wildlife/domains/definingWildlifeMeatInventoryIconConstants';
import { resolvingWildlifeMeatInventorySpriteSheetIcon } from '@/components/world/wildlife/domains/definingWildlifeMeatInventorySpriteSheetConstants';
import type { DefiningWildlifeMeatCatalogEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeVariantMeatRegistry';
import { resolvingWildlifeMeatRawDiseaseIntensity } from '@/components/world/wildlife/domains/resolvingWildlifeMeatRawDiseaseIntensity';

function registeringWorldPlazaWildlifeMeatInventoryItemDefinitions(
  entry: DefiningWildlifeMeatCatalogEntry
): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  const icons = resolvingWildlifeMeatInventoryIcons(entry.rawItemTypeId);
  const rawSpriteSheetIcon = resolvingWildlifeMeatInventorySpriteSheetIcon(
    entry.rawItemTypeId,
    'raw'
  );
  const cookedSpriteSheetIcon = resolvingWildlifeMeatInventorySpriteSheetIcon(
    entry.rawItemTypeId,
    'cooked'
  );
  const rawDiseaseIntensity = resolvingWildlifeMeatRawDiseaseIntensity(entry);

  return [
    {
      typeId: entry.rawItemTypeId,
      name: entry.rawDisplayName,
      rarity: 'common',
      iconEmoji: '🥩',
      iconSpriteSheet: rawSpriteSheetIcon ?? undefined,
      iconifyIcon: icons.rawIconifyIcon,
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
        wildlifeSpeciesId: entry.speciesId,
        rawDiseaseId: entry.rawDiseaseId,
        rawDiseaseChance: entry.rawDiseaseChance,
        rawSymptomIntensity: rawDiseaseIntensity.symptomIntensity,
        rawDurationIntensity: rawDiseaseIntensity.durationIntensity,
      },
    },
    {
      typeId: entry.cookedItemTypeId,
      name: entry.cookedDisplayName,
      rarity: 'uncommon',
      iconEmoji: '🍖',
      iconSpriteSheet: cookedSpriteSheetIcon ?? undefined,
      iconifyIcon: icons.cookedIconifyIcon,
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
        wildlifeSpeciesId: entry.speciesId,
        cookedWellFedBuffId: entry.cookedWellFedBuffId,
        cookedWellFedBuffIds: entry.cookedWellFedBuffIds,
        cookedWellFedChance: entry.cookedWellFedChance,
        cookedResidualDiseaseId: entry.cookedResidualDiseaseId,
        cookedResidualDiseaseChance: entry.cookedResidualDiseaseChance,
      },
    },
  ];
}

/** Inventory definitions for every wildlife raw and cooked meat item. */
export function registeringWorldPlazaWildlifeMeatInventoryItems(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  const definitions: DefiningWorldPlazaInventoryItemTypeDefinition[] = [];

  for (const entry of [
    ...DEFINING_WILDLIFE_MEAT_CATALOG,
    ...DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG,
  ]) {
    definitions.push(
      ...registeringWorldPlazaWildlifeMeatInventoryItemDefinitions(entry)
    );
  }

  return definitions;
}
