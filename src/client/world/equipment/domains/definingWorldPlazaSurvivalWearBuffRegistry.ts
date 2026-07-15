/**
 * Declarative worn temperature bonuses for survival trail gear.
 *
 * @module components/world/equipment/domains/definingWorldPlazaSurvivalWearBuffRegistry
 */

import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';

/** Temperature bonus applied while one survival wear piece is equipped. */
export type DefiningWorldPlazaSurvivalWearTemperatureBonus = {
  readonly heatComfortBonusCelsius: number;
  readonly coldComfortBonusCelsius: number;
  readonly heatResistance: number;
  readonly coldResistance: number;
};

/** One survival wear catalog row keyed by inventory item type id. */
export type DefiningWorldPlazaSurvivalWearCatalogEntry = {
  readonly itemTypeId: string;
  readonly slotId: DefiningWorldPlazaArmorSlotId;
  readonly temperatureBonus: DefiningWorldPlazaSurvivalWearTemperatureBonus;
};

const MILD_COLD: DefiningWorldPlazaSurvivalWearTemperatureBonus = {
  heatComfortBonusCelsius: 0,
  coldComfortBonusCelsius: 4,
  heatResistance: 0,
  coldResistance: 0,
};

const STANDARD_COLD: DefiningWorldPlazaSurvivalWearTemperatureBonus = {
  heatComfortBonusCelsius: 0,
  coldComfortBonusCelsius: 8,
  heatResistance: 0,
  coldResistance: 0,
};

const STRONG_COLD: DefiningWorldPlazaSurvivalWearTemperatureBonus = {
  heatComfortBonusCelsius: 0,
  coldComfortBonusCelsius: 12,
  heatResistance: 0,
  coldResistance: 0,
};

const MILD_HEAT: DefiningWorldPlazaSurvivalWearTemperatureBonus = {
  heatComfortBonusCelsius: 6,
  coldComfortBonusCelsius: 0,
  heatResistance: 0,
  coldResistance: 0,
};

const STANDARD_HEAT: DefiningWorldPlazaSurvivalWearTemperatureBonus = {
  heatComfortBonusCelsius: 10,
  coldComfortBonusCelsius: 0,
  heatResistance: 0,
  coldResistance: 0,
};

const FROST_RESIST: DefiningWorldPlazaSurvivalWearTemperatureBonus = {
  heatComfortBonusCelsius: 0,
  coldComfortBonusCelsius: 2,
  heatResistance: 0,
  coldResistance: 0.1,
};

/** Survival wear rows in sprite-sheet order. */
export const DEFINING_WORLD_PLAZA_SURVIVAL_WEAR_CATALOG: readonly DefiningWorldPlazaSurvivalWearCatalogEntry[] =
  [
    {
      itemTypeId: 'world-plaza-survival-straw-sun-hat',
      slotId: 'helm',
      temperatureBonus: STANDARD_HEAT,
    },
    {
      itemTypeId: 'world-plaza-survival-wool-neck-wrap',
      slotId: 'helm',
      temperatureBonus: STANDARD_COLD,
    },
    {
      itemTypeId: 'world-plaza-survival-frost-glare-lenses',
      slotId: 'helm',
      temperatureBonus: FROST_RESIST,
    },
    {
      itemTypeId: 'world-plaza-survival-swamp-mesh-veil',
      slotId: 'helm',
      temperatureBonus: MILD_HEAT,
    },
    {
      itemTypeId: 'world-plaza-survival-hide-trail-vest',
      slotId: 'body',
      temperatureBonus: STANDARD_COLD,
    },
    {
      itemTypeId: 'world-plaza-survival-fur-shoulder-cape',
      slotId: 'body',
      temperatureBonus: STRONG_COLD,
    },
    {
      itemTypeId: 'world-plaza-survival-palm-leaf-poncho',
      slotId: 'body',
      temperatureBonus: STANDARD_HEAT,
    },
    {
      itemTypeId: 'world-plaza-survival-bark-bracers',
      slotId: 'arm',
      temperatureBonus: MILD_COLD,
    },
    {
      itemTypeId: 'world-plaza-survival-fingerless-work-mitts',
      slotId: 'arm',
      temperatureBonus: MILD_COLD,
    },
    {
      itemTypeId: 'world-plaza-survival-cloth-leg-wraps',
      slotId: 'leg',
      temperatureBonus: STANDARD_COLD,
    },
    {
      itemTypeId: 'world-plaza-survival-hide-trail-boots',
      slotId: 'foot',
      temperatureBonus: STANDARD_COLD,
    },
  ] as const;

const DEFINING_WORLD_PLAZA_SURVIVAL_WEAR_BY_ITEM_TYPE_ID = new Map(
  DEFINING_WORLD_PLAZA_SURVIVAL_WEAR_CATALOG.map((entry) => [
    entry.itemTypeId,
    entry,
  ])
);

export function resolvingWorldPlazaSurvivalWearCatalogEntry(
  itemTypeId: string
): DefiningWorldPlazaSurvivalWearCatalogEntry | null {
  return DEFINING_WORLD_PLAZA_SURVIVAL_WEAR_BY_ITEM_TYPE_ID.get(itemTypeId) ?? null;
}

export function checkingWorldPlazaInventoryItemIsSurvivalWear(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_SURVIVAL_WEAR_BY_ITEM_TYPE_ID.has(itemTypeId);
}

/** Modifier id prefix for armor-driven timed temperature rows. */
export const DEFINING_WORLD_PLAZA_SURVIVAL_ARMOR_TEMPERATURE_MODIFIER_ID_PREFIX =
  'survival-armor-' as const;

export function formattingWorldPlazaSurvivalArmorTemperatureModifierId(
  slotId: DefiningWorldPlazaArmorSlotId
): string {
  return `${DEFINING_WORLD_PLAZA_SURVIVAL_ARMOR_TEMPERATURE_MODIFIER_ID_PREFIX}${slotId}`;
}
