/**
 * Species-specific raw and cooked meat catalog for wildlife loot and cooking.
 *
 * @module components/world/wildlife/domains/definingWildlifeMeatRegistry
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Shared raw-meat poison tuning (flat EV over duration). */
export const DEFINING_WILDLIFE_RAW_MEAT_POISON_FLAT_EV = 5;

/** Raw meat poison duration (ms). */
export const DEFINING_WILDLIFE_RAW_MEAT_POISON_DURATION_MS = 60_000;

/** Chance raw meat applies food sickness on eat. */
export const DEFINING_WILDLIFE_RAW_MEAT_SICKNESS_CHANCE = 0.35;

/** Hunger restore multiplier while food-sickness debuff is active. */
export const DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER = 0.5;

export type DefiningWildlifeMeatCatalogEntry = {
  speciesId: DefiningWildlifeSpeciesId;
  rawItemTypeId: string;
  cookedItemTypeId: string;
  rawDisplayName: string;
  cookedDisplayName: string;
  rawHungerRestoreRatio: number;
  cookedHungerRestoreRatio: number;
  lootQuantity: number;
  /** Campfire cook channel duration for this raw cut (ms). */
  cookDurationMs: number;
};

export const DEFINING_WILDLIFE_MEAT_CATALOG: readonly DefiningWildlifeMeatCatalogEntry[] =
  [
    {
      speciesId: 'chicken',
      rawItemTypeId: 'world-plaza-raw-chicken-meat',
      cookedItemTypeId: 'world-plaza-cooked-chicken-meat',
      rawDisplayName: 'Raw Chicken Meat',
      cookedDisplayName: 'Cooked Chicken Meat',
      rawHungerRestoreRatio: 0.12,
      cookedHungerRestoreRatio: 0.3,
      lootQuantity: 1,
      cookDurationMs: 2_500,
    },
    {
      speciesId: 'deer',
      rawItemTypeId: 'world-plaza-raw-deer-meat',
      cookedItemTypeId: 'world-plaza-cooked-deer-meat',
      rawDisplayName: 'Raw Deer Meat',
      cookedDisplayName: 'Cooked Deer Meat',
      rawHungerRestoreRatio: 0.22,
      cookedHungerRestoreRatio: 0.48,
      lootQuantity: 1,
      cookDurationMs: 4_000,
    },
    {
      speciesId: 'boar',
      rawItemTypeId: 'world-plaza-raw-boar-meat',
      cookedItemTypeId: 'world-plaza-cooked-boar-meat',
      rawDisplayName: 'Raw Boar Meat',
      cookedDisplayName: 'Cooked Boar Meat',
      rawHungerRestoreRatio: 0.28,
      cookedHungerRestoreRatio: 0.55,
      lootQuantity: 1,
      cookDurationMs: 6_500,
    },
    {
      speciesId: 'cow',
      rawItemTypeId: 'world-plaza-raw-beef',
      cookedItemTypeId: 'world-plaza-cooked-beef',
      rawDisplayName: 'Raw Beef',
      cookedDisplayName: 'Cooked Beef',
      rawHungerRestoreRatio: 0.32,
      cookedHungerRestoreRatio: 0.62,
      lootQuantity: 1,
      cookDurationMs: 8_000,
    },
    {
      speciesId: 'sheep',
      rawItemTypeId: 'world-plaza-raw-mutton',
      cookedItemTypeId: 'world-plaza-cooked-mutton',
      rawDisplayName: 'Raw Mutton',
      cookedDisplayName: 'Cooked Mutton',
      rawHungerRestoreRatio: 0.24,
      cookedHungerRestoreRatio: 0.46,
      lootQuantity: 1,
      cookDurationMs: 5_000,
    },
    {
      speciesId: 'zebra',
      rawItemTypeId: 'world-plaza-raw-zebra-meat',
      cookedItemTypeId: 'world-plaza-cooked-zebra-meat',
      rawDisplayName: 'Raw Zebra Meat',
      cookedDisplayName: 'Cooked Zebra Meat',
      rawHungerRestoreRatio: 0.26,
      cookedHungerRestoreRatio: 0.5,
      lootQuantity: 1,
      cookDurationMs: 5_500,
    },
    {
      speciesId: 'grey-wolf',
      rawItemTypeId: 'world-plaza-raw-wolf-meat',
      cookedItemTypeId: 'world-plaza-cooked-wolf-meat',
      rawDisplayName: 'Raw Wolf Meat',
      cookedDisplayName: 'Cooked Wolf Meat',
      rawHungerRestoreRatio: 0.2,
      cookedHungerRestoreRatio: 0.42,
      lootQuantity: 1,
      cookDurationMs: 4_500,
    },
    {
      speciesId: 'brown-bear',
      rawItemTypeId: 'world-plaza-raw-bear-meat',
      cookedItemTypeId: 'world-plaza-cooked-bear-meat',
      rawDisplayName: 'Raw Bear Meat',
      cookedDisplayName: 'Cooked Bear Meat',
      rawHungerRestoreRatio: 0.38,
      cookedHungerRestoreRatio: 0.68,
      lootQuantity: 1,
      cookDurationMs: 10_000,
    },
    {
      speciesId: 'lion',
      rawItemTypeId: 'world-plaza-raw-lion-meat',
      cookedItemTypeId: 'world-plaza-cooked-lion-meat',
      rawDisplayName: 'Raw Lion Meat',
      cookedDisplayName: 'Cooked Lion Meat',
      rawHungerRestoreRatio: 0.3,
      cookedHungerRestoreRatio: 0.58,
      lootQuantity: 1,
      cookDurationMs: 7_500,
    },
    {
      speciesId: 'lioness',
      rawItemTypeId: 'world-plaza-raw-lioness-meat',
      cookedItemTypeId: 'world-plaza-cooked-lioness-meat',
      rawDisplayName: 'Raw Lioness Meat',
      cookedDisplayName: 'Cooked Lioness Meat',
      rawHungerRestoreRatio: 0.28,
      cookedHungerRestoreRatio: 0.56,
      lootQuantity: 1,
      cookDurationMs: 7_000,
    },
    {
      speciesId: 'crocodile',
      rawItemTypeId: 'world-plaza-raw-crocodile-meat',
      cookedItemTypeId: 'world-plaza-cooked-crocodile-meat',
      rawDisplayName: 'Raw Crocodile Meat',
      cookedDisplayName: 'Cooked Crocodile Meat',
      rawHungerRestoreRatio: 0.25,
      cookedHungerRestoreRatio: 0.52,
      lootQuantity: 1,
      cookDurationMs: 6_000,
    },
  ];

const DEFINING_WILDLIFE_MEAT_BY_SPECIES = Object.fromEntries(
  DEFINING_WILDLIFE_MEAT_CATALOG.map((entry) => [entry.speciesId, entry])
) as Record<DefiningWildlifeSpeciesId, DefiningWildlifeMeatCatalogEntry>;

const DEFINING_WILDLIFE_RAW_MEAT_ITEM_TYPE_IDS = new Set(
  DEFINING_WILDLIFE_MEAT_CATALOG.map((entry) => entry.rawItemTypeId)
);

/** Resolves meat catalog entry for one species. */
export function resolvingWildlifeMeatCatalogEntry(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeMeatCatalogEntry | null {
  return DEFINING_WILDLIFE_MEAT_BY_SPECIES[speciesId] ?? null;
}

/** Whether an inventory item type id is any wildlife raw meat. */
export function checkingWildlifeRawMeatItemTypeId(itemTypeId: string): boolean {
  return DEFINING_WILDLIFE_RAW_MEAT_ITEM_TYPE_IDS.has(itemTypeId);
}

/** Lists raw meat item type ids present in an inventory slot list. */
export function listingWildlifeRawMeatItemTypeIdsInInventory(
  slots: readonly { itemTypeId: string; quantity: number }[]
): readonly string[] {
  const found: string[] = [];

  for (const slot of slots) {
    if (
      slot.quantity > 0 &&
      checkingWildlifeRawMeatItemTypeId(slot.itemTypeId)
    ) {
      found.push(slot.itemTypeId);
    }
  }

  return found;
}
