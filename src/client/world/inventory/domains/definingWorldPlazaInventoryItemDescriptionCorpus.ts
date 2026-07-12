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
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOULCORE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_DESCRIPTION_ENTRIES } from '@/components/world/inventory/domains/definingWorldPlazaInventoryResourceItemDescriptionCorpus';
import { resolvingWildlifeMeatItemDescriptionEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatItemDescriptionCorpus';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { resolvingWildlifeVariantMeatItemDescriptionEntry } from '@/components/world/wildlife/domains/definingWildlifeVariantMeatItemDescriptionCorpus';
import { DEFINING_WILDLIFE_VARIANT_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeVariantMeatRegistry';

/** Fallback copy when a catalog species has no authored meat description yet. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES = {
  rawWildlifeMeat: 'Double-click to eat: risky when raw. Cook at a campfire.',
  cookedWildlifeMeat: 'Double-click to eat: restores hunger safely.',
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
      description: 'Equip in the fist slot to build',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CRAFT_TOOL,
      description: 'Equip in the fist slot to craft',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLAIM_TOOL,
      description: 'Equip in the fist slot to claim land',
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
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOULCORE,
      description: 'Condensed soul energy',
    },
  ];

function listingWildlifeMeatDescriptionEntries(): DefiningWorldPlazaInventoryItemDescriptionEntry[] {
  const entries: DefiningWorldPlazaInventoryItemDescriptionEntry[] = [];

  for (const meatEntry of DEFINING_WILDLIFE_MEAT_CATALOG) {
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

  return corpus;
}

/** Lookup table: item type id → info-dialog / hover description. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_CORPUS: Readonly<
  Record<string, string>
> = buildingWorldPlazaInventoryItemDescriptionCorpus();
