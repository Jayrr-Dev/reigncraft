/**
 * Optional bonus ground drops when chopping a tree layer, keyed by canopy variant.
 *
 * @module components/world/harvest/domains/definingWorldPlazaTreeChopBonusDropConstants
 */

import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export type DefiningWorldPlazaTreeChopBonusDrop = {
  readonly itemTypeId: string;
  readonly chance: number;
  readonly quantity: number;
};

/** Palm chops can knock loose a coconut. */
export const DEFINING_WORLD_PLAZA_TREE_CHOP_BONUS_DROP_BY_VARIANT: Partial<
  Record<DefiningWorldPlazaTreeVariantKind, DefiningWorldPlazaTreeChopBonusDrop>
> = {
  palm: {
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
    chance: 0.3,
    quantity: 1,
  },
};
