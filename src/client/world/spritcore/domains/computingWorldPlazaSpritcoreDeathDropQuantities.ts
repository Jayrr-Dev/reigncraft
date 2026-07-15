/**
 * Pure death-penalty Spritcore quantity math.
 *
 * @module components/world/spritcore/domains/computingWorldPlazaSpritcoreDeathDropQuantities
 */

import {
  DEFINING_WORLD_PLAZA_SPRITCORE_DEATH_CARRIED_DROP_FRACTION,
  DEFINING_WORLD_PLAZA_SPRITCORE_DEATH_COMMITTED_DROP_FRACTION,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreDeathDropConstants';

export type ComputingWorldPlazaSpritcoreDeathDropQuantitiesResult = {
  readonly carriedDropQuantity: number;
  readonly committedDropQuantity: number;
  readonly totalDropQuantity: number;
};

/**
 * Floors carried and committed death spills from current balances.
 */
export function computingWorldPlazaSpritcoreDeathDropQuantities(
  carriedQuantity: number,
  committedQuantity: number
): ComputingWorldPlazaSpritcoreDeathDropQuantitiesResult {
  const safeCarried =
    Number.isFinite(carriedQuantity) && carriedQuantity > 0
      ? Math.floor(carriedQuantity)
      : 0;
  const safeCommitted =
    Number.isFinite(committedQuantity) && committedQuantity > 0
      ? Math.floor(committedQuantity)
      : 0;

  const carriedDropQuantity = Math.floor(
    safeCarried * DEFINING_WORLD_PLAZA_SPRITCORE_DEATH_CARRIED_DROP_FRACTION
  );
  const committedDropQuantity = Math.floor(
    safeCommitted * DEFINING_WORLD_PLAZA_SPRITCORE_DEATH_COMMITTED_DROP_FRACTION
  );

  return {
    carriedDropQuantity,
    committedDropQuantity,
    totalDropQuantity: carriedDropQuantity + committedDropQuantity,
  };
}
