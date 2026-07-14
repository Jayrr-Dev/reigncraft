/**
 * Rolls whether a tree chop yields a bonus ground item.
 *
 * @module components/world/harvest/domains/resolvingWorldPlazaTreeChopBonusDrop
 */

import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import {
  DEFINING_WORLD_PLAZA_TREE_CHOP_BONUS_DROP_BY_VARIANT,
  type DefiningWorldPlazaTreeChopBonusDrop,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopBonusDropConstants';

export type ResolvingWorldPlazaTreeChopBonusDropResult = {
  readonly itemTypeId: string;
  readonly quantity: number;
};

/**
 * Returns a bonus drop when the variant table hits and the chance roll succeeds.
 */
export function resolvingWorldPlazaTreeChopBonusDrop(
  variant: DefiningWorldPlazaTreeVariantKind,
  randomUnitInterval: () => number = Math.random
): ResolvingWorldPlazaTreeChopBonusDropResult | null {
  const bonusDrop: DefiningWorldPlazaTreeChopBonusDrop | undefined =
    DEFINING_WORLD_PLAZA_TREE_CHOP_BONUS_DROP_BY_VARIANT[variant];

  if (!bonusDrop || bonusDrop.quantity <= 0 || bonusDrop.chance <= 0) {
    return null;
  }

  if (randomUnitInterval() >= bonusDrop.chance) {
    return null;
  }

  return {
    itemTypeId: bonusDrop.itemTypeId,
    quantity: bonusDrop.quantity,
  };
}
