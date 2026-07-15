/**
 * Maps wildlife Spiritcore payout size to a visual tier (shared stack pool).
 *
 * @module components/world/spritcore/domains/resolvingWorldPlazaSpritcoreDropTier
 */

import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_DROP_TIER_DEFINITIONS,
  type DefiningWorldPlazaSpritcoreDropTierDefinition,
  type DefiningWorldPlazaSpritcoreDropTierId,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreDropTierConstants';

/** Resolves the tier row for one kill payout amount. */
export function resolvingWorldPlazaSpritcoreDropTierDefinition(
  dropAmount: number
): DefiningWorldPlazaSpritcoreDropTierDefinition {
  const normalizedAmount = Math.max(0, Math.floor(dropAmount));

  for (const tierDefinition of DEFINING_WORLD_PLAZA_SPRITCORE_DROP_TIER_DEFINITIONS) {
    if (
      normalizedAmount >= tierDefinition.minDropAmountInclusive &&
      normalizedAmount <= tierDefinition.maxDropAmountInclusive
    ) {
      return tierDefinition;
    }
  }

  return DEFINING_WORLD_PLAZA_SPRITCORE_DROP_TIER_DEFINITIONS[0];
}

/** Resolves the tier id for one kill payout amount. */
export function resolvingWorldPlazaSpritcoreDropTierId(
  dropAmount: number
): DefiningWorldPlazaSpritcoreDropTierId {
  return resolvingWorldPlazaSpritcoreDropTierDefinition(dropAmount).tier;
}

/**
 * Resolves the inventory item type id granted for one kill payout.
 * Always the shared Spritcore pool; art bands by stack quantity.
 */
export function resolvingWorldPlazaSpritcoreDropItemTypeId(
  _dropAmount: number
): string {
  return DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE;
}
