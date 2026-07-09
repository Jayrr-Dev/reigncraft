/**
 * Flavor copy for variant wildlife meat items.
 *
 * @module components/world/wildlife/domains/definingWildlifeVariantMeatItemDescriptionCorpus
 */

import {
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_COOKED_MEAT_ITEM_TYPE_ID,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID,
} from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';

export type DefiningWildlifeVariantMeatItemDescriptionEntry = {
  readonly rawItemTypeId: string;
  readonly cookedItemTypeId: string;
  readonly rawDescription: string;
  readonly cookedDescription: string;
};

export const DEFINING_WILDLIFE_VARIANT_MEAT_ITEM_DESCRIPTION_ENTRIES: readonly DefiningWildlifeVariantMeatItemDescriptionEntry[] =
  [
    {
      rawItemTypeId: DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID,
      cookedItemTypeId:
        DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_COOKED_MEAT_ITEM_TYPE_ID,
      rawDescription:
        'Still warm from a bird that hit like a freight train. Eating raw always infects you with Cucco Rage: a manic sprint, wild strikes, then the flock steers your legs.',
      cookedDescription:
        'Charred outside, furious inside. Always grants Cucco Fury, Cucco Chase, and Cucco Vigor: big damage, sprint speed, and stamina regen.',
    },
  ];

const DEFINING_WILDLIFE_VARIANT_MEAT_ITEM_DESCRIPTION_BY_RAW_ITEM_TYPE_ID =
  Object.fromEntries(
    DEFINING_WILDLIFE_VARIANT_MEAT_ITEM_DESCRIPTION_ENTRIES.map((entry) => [
      entry.rawItemTypeId,
      entry,
    ])
  ) as Record<string, DefiningWildlifeVariantMeatItemDescriptionEntry>;

/** Resolves flavor copy for one variant meat item pair. */
export function resolvingWildlifeVariantMeatItemDescriptionEntry(
  itemTypeId: string
): DefiningWildlifeVariantMeatItemDescriptionEntry | null {
  return (
    DEFINING_WILDLIFE_VARIANT_MEAT_ITEM_DESCRIPTION_BY_RAW_ITEM_TYPE_ID[
      itemTypeId
    ] ??
    DEFINING_WILDLIFE_VARIANT_MEAT_ITEM_DESCRIPTION_ENTRIES.find(
      (entry) => entry.cookedItemTypeId === itemTypeId
    ) ??
    null
  );
}
