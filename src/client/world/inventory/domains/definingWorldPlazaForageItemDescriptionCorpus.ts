/**
 * Flavor descriptions for extended shrub forage items.
 *
 * @module components/world/inventory/domains/definingWorldPlazaForageItemDescriptionCorpus
 */

import type { DefiningWorldPlazaInventoryItemDescriptionEntry } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDescriptionCorpus';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BILBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLACKBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_CRANBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_JUNIPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_LOTUS_FRUIT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RASPBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_SEA_BUCKTHORN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_WOLFBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_YEW_ARIL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_BAY_LAUREL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_HOLLY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_LEMON_BALM,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MISTLETOE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MOLY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MUGWORT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_NETTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_OLIVE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_SAGE,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export const DEFINING_WORLD_PLAZA_FORAGE_ITEM_DESCRIPTION_ENTRIES: readonly DefiningWorldPlazaInventoryItemDescriptionEntry[] =
  [
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_CRANBERRY,
      description:
        'Tart red cranberries from a wet shrub. Folk on Corpus chew them against bad water.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLACKBERRY,
      description:
        'Dark clustered berries with hooked thorns still on the stem. Dense and filling.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RASPBERRY,
      description:
        'Soft red drupelets that fall apart in the hand. Quick sugar.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BILBERRY,
      description:
        'Near-black berries stained on the fingers. Night walkers swear by them.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_JUNIPER,
      description:
        'Waxy blue cones that read as berries on the branch. Resinous bite, cold comfort.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_SEA_BUCKTHORN,
      description:
        'Orange oily berries from a harsh coast shrub. Heat seems to slide off after a handful.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_YEW_ARIL,
      description:
        'Bright red cup around a poison seed. Sweet flesh, bitter finish. Do not swallow the pit.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_WOLFBERRY,
      description:
        'Dried red wolfberries, wrinkled and sharp. Predator blood in a pinch.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_LOTUS_FRUIT,
      description:
        'Pale lotus fruit with a sleepy perfume. One bite and the trail feels far away.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_NETTLE,
      description:
        'Stinging nettle leaves, dried on the shrub. Brew or chew with care.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_LEMON_BALM,
      description: 'Crushed lemon balm smells like clean soap and honey.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_SAGE,
      description: 'Grey-green sage leaves, bitter and warm on the tongue.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MUGWORT,
      description:
        'Silver mugwort leaves with a dusty dream smell. Campfire brew brings heavy lids.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_BAY_LAUREL,
      description:
        'Waxy bay leaves, stiff and aromatic. Chewed fresh they steady a shaky guard.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_HOLLY,
      description: 'Spined holly leaves, dark green and winter-hard.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MISTLETOE,
      description:
        'Pale mistletoe sprigs. Kissing sweetness, parasitic sting in the same cup.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_OLIVE,
      description:
        'Silver olive leaves from a rare shrub. Heat and cold both feel farther off.',
    },
    {
      typeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MOLY,
      description:
        'Black-rooted moly with white bloom. Old poisoners hate this leaf in the pot.',
    },
  ];
