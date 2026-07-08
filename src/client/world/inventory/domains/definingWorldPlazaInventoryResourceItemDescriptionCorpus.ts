/**
 * Player-facing flavor copy for plaza inventory resource items.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryResourceItemDescriptionCorpus
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export type DefiningWorldPlazaInventoryResourceItemDescriptionEntry = {
  readonly typeId: string;
  readonly description: string;
};

/** Per-resource item info-dialog descriptions. */
export const DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_DESCRIPTION_ENTRIES: readonly DefiningWorldPlazaInventoryResourceItemDescriptionEntry[] =
  [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      description:
        'Splintered timber from plaza trees. Stack it for building, crafting, and fueling campfires.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
      description:
        'Heavy chunks chipped from river rock and quarry faces. The backbone of walls and sturdy builds.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
      description:
        'A sharp-edged stone that throws sparks when struck. Equip it to ignite flammable blocks.',
    },
  ];

const DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_DESCRIPTION_BY_TYPE_ID =
  Object.fromEntries(
    DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_DESCRIPTION_ENTRIES.map(
      (entry) => [entry.typeId, entry]
    )
  ) as Record<string, DefiningWorldPlazaInventoryResourceItemDescriptionEntry>;

/** Resolves flavor copy for one resource item type. */
export function resolvingWorldPlazaInventoryResourceItemDescriptionEntry(
  typeId: string
): DefiningWorldPlazaInventoryResourceItemDescriptionEntry | null {
  return (
    DEFINING_WORLD_PLAZA_INVENTORY_RESOURCE_ITEM_DESCRIPTION_BY_TYPE_ID[
      typeId
    ] ?? null
  );
}
