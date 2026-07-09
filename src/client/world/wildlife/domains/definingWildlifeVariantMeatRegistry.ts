/**
 * Wildlife meat variants keyed by spawn modifiers (aggression, etc.).
 *
 * @module components/world/wildlife/domains/definingWildlifeVariantMeatRegistry
 */

import {
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_COOKED_MEAT_ITEM_TYPE_ID,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID,
} from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';
import type { DefiningWildlifeMeatCatalogEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';

export type DefiningWildlifeVariantMeatCatalogEntry =
  DefiningWildlifeMeatCatalogEntry & {
    readonly variantId: string;
    readonly cookedWellFedBuffIds?: readonly string[];
  };

export const DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG: readonly DefiningWildlifeVariantMeatCatalogEntry[] =
  [
    {
      variantId: 'aggressive-chicken',
      speciesId: 'chicken',
      rawItemTypeId: DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID,
      cookedItemTypeId:
        DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_COOKED_MEAT_ITEM_TYPE_ID,
      rawDisplayName: 'Crazy Chicken Meat',
      cookedDisplayName: 'Cooked Crazy Chicken Meat',
      rawHungerRestoreRatio: 0.18,
      cookedHungerRestoreRatio: 0.48,
      lootQuantity: 1,
      cookDurationMs: 5_000,
      rawDiseaseId: 'cucco-rage',
      rawDiseaseChance: 1,
      cookedWellFedBuffId: 'well-fed-cucco-fury-buff',
      cookedWellFedBuffIds: [
        'well-fed-cucco-fury-buff',
        'well-fed-cucco-chase-buff',
        'well-fed-cucco-vigor-buff',
      ],
      cookedWellFedChance: 1,
    },
  ];

const DEFINING_WILDLIFE_VARIANT_MEAT_BY_ID = Object.fromEntries(
  DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG.map((entry) => [
    entry.variantId,
    entry,
  ])
) as Record<string, DefiningWildlifeVariantMeatCatalogEntry>;

const DEFINING_WILDLIFE_VARIANT_MEAT_BY_RAW_ITEM_TYPE_ID = Object.fromEntries(
  DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG.map((entry) => [
    entry.rawItemTypeId,
    entry,
  ])
) as Record<string, DefiningWildlifeVariantMeatCatalogEntry>;

const DEFINING_WILDLIFE_VARIANT_MEAT_BY_COOKED_ITEM_TYPE_ID =
  Object.fromEntries(
    DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG.map((entry) => [
      entry.cookedItemTypeId,
      entry,
    ])
  ) as Record<string, DefiningWildlifeVariantMeatCatalogEntry>;

/** Resolves a variant meat entry by stable variant id. */
export function resolvingWildlifeVariantMeatCatalogEntry(
  variantId: string
): DefiningWildlifeVariantMeatCatalogEntry | null {
  return DEFINING_WILDLIFE_VARIANT_MEAT_BY_ID[variantId] ?? null;
}

/** Resolves variant meat from a raw or cooked item type id. */
export function resolvingWildlifeVariantMeatCatalogEntryByItemTypeId(
  itemTypeId: string
): DefiningWildlifeVariantMeatCatalogEntry | null {
  return (
    DEFINING_WILDLIFE_VARIANT_MEAT_BY_RAW_ITEM_TYPE_ID[itemTypeId] ??
    DEFINING_WILDLIFE_VARIANT_MEAT_BY_COOKED_ITEM_TYPE_ID[itemTypeId] ??
    null
  );
}
