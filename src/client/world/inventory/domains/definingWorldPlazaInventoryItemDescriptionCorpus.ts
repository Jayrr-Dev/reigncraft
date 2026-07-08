/**
 * Declarative item description corpus for world plaza inventory.
 *
 * Add flavor copy here instead of inline `tooltip` fields on item definitions.
 * Shared templates cover families (raw meat, bags, etc.); static entries cover
 * one-off items keyed by type id.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryItemDescriptionCorpus
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_APPLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRIES,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOULCORE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';

/** Reusable description copy for item families. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES = {
  rawWildlifeMeat: 'Double-click to eat: risky when raw. Cook at a campfire.',
  cookedWildlifeMeat: 'Double-click to eat: restores hunger safely.',
} as const;

/** One explicit description keyed by inventory item type id. */
export type DefiningWorldPlazaInventoryItemDescriptionEntry = {
  readonly typeId: string;
  readonly description: string;
};

/** Hand-authored descriptions for non-generated item types. */
const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_STATIC_ENTRIES: readonly DefiningWorldPlazaInventoryItemDescriptionEntry[] =
  [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      description: 'Wood resource',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
      description: 'Stone resource',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
      description: 'Ignite flammable blocks',
    },
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
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SOULCORE,
      description: 'Condensed soul energy',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
      description: 'Tiny starter bag. Click to open extra storage (2x2).',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
      description: 'Small adventurer bag. Click to open extra storage (3x3).',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
      description: 'Standard travel bag. Click to open extra storage (3x4).',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
      description: 'Larger utility bag. Click to open extra storage (3x5).',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
      description: 'Big serious bag. Click to open extra storage (3x6).',
    },
  ];

function listingWildlifeMeatDescriptionEntries(): DefiningWorldPlazaInventoryItemDescriptionEntry[] {
  const entries: DefiningWorldPlazaInventoryItemDescriptionEntry[] = [];

  for (const meatEntry of DEFINING_WILDLIFE_MEAT_CATALOG) {
    entries.push({
      typeId: meatEntry.rawItemTypeId,
      description:
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_TEMPLATES.rawWildlifeMeat,
    });
    entries.push({
      typeId: meatEntry.cookedItemTypeId,
      description:
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

  for (const entry of listingWildlifeMeatDescriptionEntries()) {
    corpus[entry.typeId] = entry.description;
  }

  return corpus;
}

/** Lookup table: item type id → info-dialog / hover description. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_CORPUS: Readonly<
  Record<string, string>
> = buildingWorldPlazaInventoryItemDescriptionCorpus();
