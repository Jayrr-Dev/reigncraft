/**
 * Player-facing flavor copy for plaza inventory bag items.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBagItemDescriptionCorpus
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export type DefiningWorldPlazaInventoryBagItemDescriptionEntry = {
  readonly typeId: string;
  readonly description: string;
};

/** Per-bag item info-dialog descriptions. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_DESCRIPTION_ENTRIES: readonly DefiningWorldPlazaInventoryBagItemDescriptionEntry[] =
  [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
      description:
        'A scrap of stitched leather with barely enough room for odds and ends. Click to open a 2×2 pocket of extra storage.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
      description:
        'Worn canvas slung at the hip, sized for a short run into the wilds. Click to open 3×3 storage.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_PACK,
      description:
        'A proper travel pack with straps that stay put. Click to open 3×4 storage for longer trips.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_RUCKSACK,
      description:
        'Bulging frame pack built for hauling gear over rough ground. Click to open 3×5 storage.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_EXPEDITION_BAG,
      description:
        'Oversized expedition loadout with room for serious hauling. Click to open 3×6 storage.',
    },
  ];

const DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_DESCRIPTION_BY_TYPE_ID =
  Object.fromEntries(
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_DESCRIPTION_ENTRIES.map((entry) => [
      entry.typeId,
      entry,
    ])
  ) as Record<string, DefiningWorldPlazaInventoryBagItemDescriptionEntry>;

/** Resolves flavor copy for one bag item type. */
export function resolvingWorldPlazaInventoryBagItemDescriptionEntry(
  typeId: string
): DefiningWorldPlazaInventoryBagItemDescriptionEntry | null {
  return (
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_ITEM_DESCRIPTION_BY_TYPE_ID[typeId] ??
    null
  );
}
