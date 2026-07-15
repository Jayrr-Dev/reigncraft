/**
 * Declarative item description corpus for world plaza inventory.
 *
 * Add flavor copy here instead of inline `tooltip` fields on item definitions.
 * Shared templates cover families (raw meat, bags, etc.); static entries cover
 * one-off items keyed by type id.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryItemDescriptionCorpus
 */

import { DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_DESCRIPTION_ENTRIES } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagItemDescriptionCorpus';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BOWL_OF_PORRIDGE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_COFFEE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_COCONUT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOWL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CROCK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SMOKE_OIL_CROCK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOWL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CROCK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_DESCRIPTION_ENTRIES } from '@/components/world/inventory/domains/definingWorldPlazaInventoryResourceItemDescriptionCorpus';
import { DEFINING_WORLD_PLAZA_TALL_GRASS_INVENTORY_ITEM_SEEDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryTallGrassItemCatalog';
import { DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import { DEFINING_WILDLIFE_FISH_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeFishMeatCatalog';
import { resolvingWildlifeMeatItemDescriptionEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatItemDescriptionCorpus';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeSpecialtyLootItemCatalog';
import { resolvingWildlifeVariantMeatItemDescriptionEntry } from '@/components/world/wildlife/domains/definingWildlifeVariantMeatItemDescriptionCorpus';
import { DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeVariantMeatRegistry';

/** Fallback copy when a catalog species has no authored meat description yet. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES = {
  rawWildlifeMeat: 'Double-click to eat: risky when raw. Cook at a campfire.',
  cookedWildlifeMeat: 'Double-click to eat: restores hunger safely.',
  rawMushroomGood:
    'Foraged cap. Double-click to eat raw, or roast at a campfire.',
  rawMushroomBad:
    'Look-alike cap. Eating raw is risky; cooking may only soften the odds.',
  cookedMushroomGood: 'Double-click to eat: roasted forage, fuller than raw.',
  cookedMushroomBad:
    'Double-click to eat: heat dulled some toxins, not all. Still a gamble.',
} as const;

/** One explicit description keyed by inventory item type id. */
export type DefiningWorldPlazaInventoryItemDescriptionEntry = {
  readonly typeId: string;
  readonly description: string;
};

/** Hand-authored descriptions for items not covered by family corpora. */
const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_STATIC_ENTRIES: readonly DefiningWorldPlazaInventoryItemDescriptionEntry[] =
  [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
      description: 'Building tool',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
      description: 'Chop trees for wood',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
      description: 'Double-click to eat: restores a little hunger',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
      description: 'Double-click to eat: restores hunger',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
      description:
        'Knocked from a palm. Double-click to eat, or roast at a campfire.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COOKED_COCONUT,
      description: 'Double-click to eat: warm coconut meat, fuller than raw.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
      description: 'Condensed soul energy',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
      description:
        'A ripe red coffee cherry from a forest shrub. Tart flesh, light buzz, soft crash.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
      description: 'A cool blue berry. Sweet enough to stash a handful.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
      description: 'A rare golden berry. Soft glow, soft hunger.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
      description:
        'Dried leaves from berry shrubs. No brew yet, but chewing them eases a hard run.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CHEST_KEY,
      description:
        'Opens a locked treasure chest. Keys turn up where something was guarding the hoard.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
      description:
        'Roasted beans pulled from coffee cherries. Ready for a clay-cup brew.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_COFFEE,
      description:
        'Dark brew in a clay teacup. Hot, bitter, fast, then a hard crash.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CUP,
      description:
        'A small handmade clay teacup. Ready for the next pour of coffee.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CUP,
      description:
        'Soft unfired clay shaped into a cup. Fire it in a kiln with coal before it holds drink.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_TEAPOT,
      description:
        'Unfired clay teapot, still damp from the shore. Needs kiln heat and coal before it pours.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_TEAPOT,
      description:
        'Fired terracotta teapot. Add water near a shore, load herbs, then brew it over a campfire.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT,
      description:
        'A teapot filled with water. Open it to load flowers, berries, or leaves, then brew at a campfire.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BREWED_CLAY_TEAPOT,
      description:
        'Hot steep finished at the campfire. Pour into an empty clay cup to serve.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CUP_OF_TEA,
      description:
        'A poured clay cup of tea. Drink to take the steeped traits at full strength.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOTTLE,
      description:
        'Unfired clay bottle pulled from wet clay. Fire it in a kiln with coal before it can hold drink.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOTTLE,
      description:
        'Fired terracotta bottle. Fill it at a shore, drink on the trail, then fill again.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_BOTTLE,
      description:
        'Shore water corked in clay. Drink for a light fill and a rinse against food sickness. Bottle returns empty.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_BOWL,
      description:
        'Unfired clay bowl. Fire it in a kiln with coal before it can hold porridge.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_BOWL,
      description:
        'Fired terracotta bowl. Cook berry porridge at a campfire, then eat and keep the bowl.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BOWL_OF_PORRIDGE,
      description:
        'Warm berry mash cooked in clay at a campfire. Better trail food than raw berries. Bowl returns empty.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY_CROCK,
      description:
        'Unfired lidded crock. Fire it in a kiln with coal before sealing smoke-oil inside.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EMPTY_CLAY_CROCK,
      description:
        'Fired terracotta crock. Render pig fat with niter at a campfire into warming smoke-oil.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SMOKE_OIL_CROCK,
      description:
        'Rendered fat and niter sealed in clay. Taste for cold resistance. Crock returns empty.',
    },
  ];

function listingWildlifeMeatDescriptionEntries(): DefiningWorldPlazaInventoryItemDescriptionEntry[] {
  const entries: DefiningWorldPlazaInventoryItemDescriptionEntry[] = [];

  for (const meatEntry of [
    ...DEFINING_WILDLIFE_MEAT_CATALOG,
    ...DEFINING_WILDLIFE_FISH_MEAT_CATALOG,
  ]) {
    const meatDescription = resolvingWildlifeMeatItemDescriptionEntry(
      meatEntry.speciesId
    );

    entries.push({
      typeId: meatEntry.rawItemTypeId,
      description:
        meatDescription?.rawDescription ??
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES.rawWildlifeMeat,
    });
    entries.push({
      typeId: meatEntry.cookedItemTypeId,
      description:
        meatDescription?.cookedDescription ??
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES.cookedWildlifeMeat,
    });
  }

  return entries;
}

function listingWildlifeVariantMeatDescriptionEntries(): DefiningWorldPlazaInventoryItemDescriptionEntry[] {
  const entries: DefiningWorldPlazaInventoryItemDescriptionEntry[] = [];

  for (const meatEntry of DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG) {
    const meatDescription = resolvingWildlifeVariantMeatItemDescriptionEntry(
      meatEntry.rawItemTypeId
    );

    entries.push({
      typeId: meatEntry.rawItemTypeId,
      description:
        meatDescription?.rawDescription ??
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES.rawWildlifeMeat,
    });
    entries.push({
      typeId: meatEntry.cookedItemTypeId,
      description:
        meatDescription?.cookedDescription ??
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES.cookedWildlifeMeat,
    });
  }

  return entries;
}

function listingMushroomDescriptionEntries(): DefiningWorldPlazaInventoryItemDescriptionEntry[] {
  const entries: DefiningWorldPlazaInventoryItemDescriptionEntry[] = [];

  for (const mushroom of DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG) {
    const isGood = mushroom.polarity === 'good';

    entries.push({
      typeId: mushroom.rawItemTypeId,
      description: isGood
        ? DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES.rawMushroomGood
        : DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES.rawMushroomBad,
    });
    entries.push({
      typeId: mushroom.cookedItemTypeId,
      description: isGood
        ? DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES.cookedMushroomGood
        : DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES.cookedMushroomBad,
    });
  }

  return entries;
}

function listingWildlifeSpecialtyLootDescriptionEntries(): DefiningWorldPlazaInventoryItemDescriptionEntry[] {
  return DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG.map((entry) => ({
    typeId: entry.itemTypeId,
    description: entry.description,
  }));
}

function listingTallGrassDescriptionEntries(): DefiningWorldPlazaInventoryItemDescriptionEntry[] {
  return DEFINING_WORLD_PLAZA_TALL_GRASS_INVENTORY_ITEM_SEEDS.map((seed) => ({
    typeId: seed.typeId,
    description: seed.description,
  }));
}

function buildingWorldPlazaInventoryItemDescriptionCorpus(): Readonly<
  Record<string, string>
> {
  const corpus: Record<string, string> = {};

  for (const entry of DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_STATIC_ENTRIES) {
    corpus[entry.typeId] = entry.description;
  }

  for (const entry of DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_DESCRIPTION_ENTRIES) {
    corpus[entry.typeId] = entry.description;
  }

  for (const entry of DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_DESCRIPTION_ENTRIES) {
    corpus[entry.typeId] = entry.description;
  }

  for (const entry of listingWildlifeMeatDescriptionEntries()) {
    corpus[entry.typeId] = entry.description;
  }

  for (const entry of listingWildlifeVariantMeatDescriptionEntries()) {
    corpus[entry.typeId] = entry.description;
  }

  for (const entry of listingMushroomDescriptionEntries()) {
    corpus[entry.typeId] = entry.description;
  }

  for (const entry of listingWildlifeSpecialtyLootDescriptionEntries()) {
    corpus[entry.typeId] = entry.description;
  }

  for (const entry of listingTallGrassDescriptionEntries()) {
    corpus[entry.typeId] = entry.description;
  }

  return corpus;
}

/** Lookup table: item type id → info-dialog / hover description. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_CORPUS: Readonly<
  Record<string, string>
> = buildingWorldPlazaInventoryItemDescriptionCorpus();
