/**
 * Thematic Iconify glyphs for each wildlife raw/cooked meat inventory item.
 *
 * Uses Microsoft Fluent Emoji (MIT licensed) for full-color item art: raw
 * cuts show the source animal; cooked cuts show a prepared dish. Every icon
 * here must also be registered in `registeringBundledIconifyIcons.ts`
 * (Devvit blocks Iconify CDN fetches).
 *
 * @module components/world/wildlife/domains/definingWildlifeMeatInventoryIconConstants
 */

import { DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID } from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';

export type DefiningWildlifeMeatInventoryIconEntry = {
  readonly rawIconifyIcon: string;
  readonly cookedIconifyIcon: string;
};

/** Generic fallback pair for meats without a bespoke icon assignment. */
export const DEFINING_WILDLIFE_MEAT_INVENTORY_ICON_FALLBACK: DefiningWildlifeMeatInventoryIconEntry =
  {
    rawIconifyIcon: 'fluent-emoji:cut-of-meat',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  };

/** Per-meat icon pairs keyed by the catalog entry's raw item type id. */
export const DEFINING_WILDLIFE_MEAT_INVENTORY_ICONS_BY_RAW_ITEM_TYPE_ID: Record<
  string,
  DefiningWildlifeMeatInventoryIconEntry
> = {
  'world-plaza-raw-chicken-meat': {
    rawIconifyIcon: 'fluent-emoji:chicken',
    cookedIconifyIcon: 'fluent-emoji:poultry-leg',
  },
  'world-plaza-raw-shepherd-dog-meat': {
    rawIconifyIcon: 'fluent-emoji:wolf',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
  'world-plaza-raw-husky-meat': {
    rawIconifyIcon: 'fluent-emoji:dog',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
  'world-plaza-raw-golden-retriever-meat': {
    rawIconifyIcon: 'fluent-emoji:dog-face',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
  'world-plaza-raw-cat-black-meat': {
    rawIconifyIcon: 'fluent-emoji:leopard',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
  'world-plaza-raw-cat-white-meat': {
    rawIconifyIcon: 'fluent-emoji:leopard',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
  'world-plaza-raw-cat-large-meat': {
    rawIconifyIcon: 'fluent-emoji:leopard',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
  'world-plaza-raw-cat-orange-meat': {
    rawIconifyIcon: 'fluent-emoji:cat',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
  'world-plaza-raw-deer-meat': {
    rawIconifyIcon: 'fluent-emoji:deer',
    cookedIconifyIcon: 'fluent-emoji:oden',
  },
  'world-plaza-raw-boar-meat': {
    rawIconifyIcon: 'fluent-emoji:boar',
    cookedIconifyIcon: 'fluent-emoji:bacon',
  },
  'world-plaza-raw-beef': {
    rawIconifyIcon: 'fluent-emoji:cow-face',
    cookedIconifyIcon: 'fluent-emoji:cut-of-meat',
  },
  'world-plaza-raw-brown-beef': {
    rawIconifyIcon: 'fluent-emoji:cow-face',
    cookedIconifyIcon: 'fluent-emoji:cut-of-meat',
  },
  'world-plaza-raw-mutton': {
    rawIconifyIcon: 'fluent-emoji:ewe',
    cookedIconifyIcon: 'fluent-emoji:stuffed-flatbread',
  },
  'world-plaza-raw-zebra-meat': {
    rawIconifyIcon: 'fluent-emoji:zebra',
    cookedIconifyIcon: 'fluent-emoji:shallow-pan-of-food',
  },
  'world-plaza-raw-wolf-meat': {
    rawIconifyIcon: 'fluent-emoji:wolf',
    cookedIconifyIcon: 'fluent-emoji:bowl-with-spoon',
  },
  'world-plaza-raw-omega-wolf-meat': {
    rawIconifyIcon: 'fluent-emoji:wolf',
    cookedIconifyIcon: 'fluent-emoji:bowl-with-spoon',
  },
  'world-plaza-raw-bear-meat': {
    rawIconifyIcon: 'fluent-emoji:bear',
    cookedIconifyIcon: 'fluent-emoji:pot-of-food',
  },
  'world-plaza-raw-grizzly-meat': {
    rawIconifyIcon: 'fluent-emoji:bear',
    cookedIconifyIcon: 'fluent-emoji:pot-of-food',
  },
  'world-plaza-raw-lion-meat': {
    rawIconifyIcon: 'fluent-emoji:lion',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
  'world-plaza-raw-lioness-meat': {
    rawIconifyIcon: 'fluent-emoji:leopard',
    cookedIconifyIcon: 'fluent-emoji:dumpling',
  },
  'world-plaza-raw-crocodile-meat': {
    rawIconifyIcon: 'fluent-emoji:crocodile',
    cookedIconifyIcon: 'fluent-emoji:tamale',
  },
  [DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID]: {
    rawIconifyIcon: 'fluent-emoji:rooster',
    cookedIconifyIcon: 'fluent-emoji:pie',
  },
  'world-plaza-raw-giraffe-meat': {
    rawIconifyIcon: 'fluent-emoji:giraffe',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
  'world-plaza-raw-elephant-meat': {
    rawIconifyIcon: 'fluent-emoji:elephant',
    cookedIconifyIcon: 'fluent-emoji:pot-of-food',
  },
  'world-plaza-raw-elephant-matriarch-meat': {
    rawIconifyIcon: 'fluent-emoji:elephant',
    cookedIconifyIcon: 'fluent-emoji:pot-of-food',
  },
  'world-plaza-raw-rhino-meat': {
    rawIconifyIcon: 'fluent-emoji:rhinoceros',
    cookedIconifyIcon: 'fluent-emoji:cut-of-meat',
  },
  'world-plaza-raw-rhino-cow-meat': {
    rawIconifyIcon: 'fluent-emoji:rhinoceros',
    cookedIconifyIcon: 'fluent-emoji:cut-of-meat',
  },
  'world-plaza-raw-bison-meat': {
    rawIconifyIcon: 'fluent-emoji:bison',
    cookedIconifyIcon: 'fluent-emoji:cut-of-meat',
  },
  'world-plaza-raw-pork': {
    rawIconifyIcon: 'fluent-emoji:pig',
    cookedIconifyIcon: 'fluent-emoji:bacon',
  },
  'world-plaza-raw-bull-beef': {
    rawIconifyIcon: 'fluent-emoji:ox',
    cookedIconifyIcon: 'fluent-emoji:cut-of-meat',
  },
  'world-plaza-raw-stag-venison': {
    rawIconifyIcon: 'fluent-emoji:deer',
    cookedIconifyIcon: 'fluent-emoji:oden',
  },
  'world-plaza-raw-horse-meat': {
    rawIconifyIcon: 'fluent-emoji:horse',
    cookedIconifyIcon: 'fluent-emoji:shallow-pan-of-food',
  },
  'world-plaza-raw-work-horse-meat': {
    rawIconifyIcon: 'fluent-emoji:horse',
    cookedIconifyIcon: 'fluent-emoji:pot-of-food',
  },
  'world-plaza-raw-arabian-horse-meat': {
    rawIconifyIcon: 'fluent-emoji:horse-face',
    cookedIconifyIcon: 'fluent-emoji:shallow-pan-of-food',
  },
  'world-plaza-raw-donkey-meat': {
    rawIconifyIcon: 'fluent-emoji:horse-face',
    cookedIconifyIcon: 'fluent-emoji:bowl-with-spoon',
  },
  'world-plaza-raw-hippo-meat': {
    rawIconifyIcon: 'fluent-emoji:hippopotamus',
    cookedIconifyIcon: 'fluent-emoji:pot-of-food',
  },
  'world-plaza-raw-buffalo-meat': {
    rawIconifyIcon: 'fluent-emoji:water-buffalo',
    cookedIconifyIcon: 'fluent-emoji:cut-of-meat',
  },
  'world-plaza-raw-turtle-meat': {
    rawIconifyIcon: 'fluent-emoji:turtle',
    cookedIconifyIcon: 'fluent-emoji:bowl-with-spoon',
  },
  'world-plaza-raw-tortoise-meat': {
    rawIconifyIcon: 'fluent-emoji:turtle',
    cookedIconifyIcon: 'fluent-emoji:pot-of-food',
  },
  'world-plaza-raw-polar-bear-meat': {
    rawIconifyIcon: 'fluent-emoji:polar-bear',
    cookedIconifyIcon: 'fluent-emoji:pot-of-food',
  },
  'world-plaza-raw-mammoth-meat': {
    rawIconifyIcon: 'fluent-emoji:mammoth',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
  'world-plaza-raw-camel-meat': {
    rawIconifyIcon: 'fluent-emoji:camel',
    cookedIconifyIcon: 'fluent-emoji:stuffed-flatbread',
  },
  'world-plaza-raw-ram-mutton': {
    rawIconifyIcon: 'fluent-emoji:ram',
    cookedIconifyIcon: 'fluent-emoji:stuffed-flatbread',
  },
  'world-plaza-raw-llama-meat': {
    rawIconifyIcon: 'fluent-emoji:llama',
    cookedIconifyIcon: 'fluent-emoji:bowl-with-spoon',
  },
  'world-plaza-raw-alpaca-meat': {
    rawIconifyIcon: 'fluent-emoji:llama',
    cookedIconifyIcon: 'fluent-emoji:dumpling',
  },
  'world-plaza-raw-yak-meat': {
    rawIconifyIcon: 'fluent-emoji:bison',
    cookedIconifyIcon: 'fluent-emoji:pot-of-food',
  },
  'world-plaza-raw-pinguin-meat': {
    rawIconifyIcon: 'fluent-emoji:penguin',
    cookedIconifyIcon: 'fluent-emoji:poultry-leg',
  },
  'world-plaza-raw-fairy-dust': {
    rawIconifyIcon: 'fluent-emoji:sparkles',
    cookedIconifyIcon: 'fluent-emoji:glowing-star',
  },
  'world-plaza-raw-tiger-meat': {
    rawIconifyIcon: 'fluent-emoji:tiger',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
  'world-plaza-raw-jaguar-meat': {
    rawIconifyIcon: 'fluent-emoji:leopard',
    cookedIconifyIcon: 'fluent-emoji:tamale',
  },
  'world-plaza-raw-monkey-meat': {
    rawIconifyIcon: 'fluent-emoji:monkey',
    cookedIconifyIcon: 'fluent-emoji:dumpling',
  },
  'world-plaza-raw-chimp-meat': {
    rawIconifyIcon: 'fluent-emoji:monkey-face',
    cookedIconifyIcon: 'fluent-emoji:bowl-with-spoon',
  },
  'world-plaza-raw-sunhead-meat': {
    rawIconifyIcon: 'solar:fire-bold',
    cookedIconifyIcon: 'fluent-emoji:meat-on-bone',
  },
};

/** Resolves the icon pair for one meat catalog entry, with generic fallback. */
export function resolvingWildlifeMeatInventoryIcons(
  rawItemTypeId: string
): DefiningWildlifeMeatInventoryIconEntry {
  return (
    DEFINING_WILDLIFE_MEAT_INVENTORY_ICONS_BY_RAW_ITEM_TYPE_ID[rawItemTypeId] ??
    DEFINING_WILDLIFE_MEAT_INVENTORY_ICON_FALLBACK
  );
}
