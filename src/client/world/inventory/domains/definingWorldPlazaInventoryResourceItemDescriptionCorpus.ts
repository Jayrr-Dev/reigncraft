/**
 * Player-facing flavor copy for plaza inventory resource items.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryResourceItemDescriptionCorpus
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_NITER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SULFUR,
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
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_CLAY,
      description:
        'Dense terracotta earth chipped from soft veins. Good for bricks and kiln work.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WET_CLAY,
      description:
        'Clay soaked at the shore. Soft enough to mold; dry it and it holds shape.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_IRON,
      description:
        'Rusty stone with dark metal grit. Smelts into the bones of tools and nails.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SILVER,
      description:
        'Cool grey rock shot with pale metal. Bright under hammer and fire.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_GOLD,
      description:
        'Heavy stone with warm yellow flecks. Soft metal for wealth and fine work.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COPPER,
      description:
        'Green-stained rock with orange metal. Early alloys and wire start here.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_COAL,
      description:
        'Black seam stone that burns hot. Fuel for forges and long camp nights.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_NITER,
      description:
        'Chalky white saltpeter crust on grey rock. Sparks and powder recipes need it.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SCARLET,
      description:
        'Cinnabar-red mineral in dark stone. Bright pigment and strange chemistry.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_LEAD,
      description:
        'Galena cubes in heavy rock. Soft grey metal for weights and seals.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ORE_SULFUR,
      description:
        'Bright yellow crystals in volcanic stone. Firelands stink and forge reagents.',
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
