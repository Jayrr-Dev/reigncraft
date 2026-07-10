import { checkingWorldPlazaMovementDirectionIsActive } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import type { DefiningWorldPlazaMovementDirection } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

export type CheckingWorldPlazaInventoryFoodEatShouldContinueParams = {
  readonly damageBaselineMs: number | null;
  readonly lastDamagedAtMs: number | null;
  readonly keyboardDirection: DefiningWorldPlazaMovementDirection | null;
  readonly walkTarget: DefiningWorldPlazaWorldPoint | null;
  readonly jumpRequested: boolean;
  readonly rollRequested: boolean;
};

/**
 * Eat channel continues only while undamaged and without new locomotion intent.
 */
export function checkingWorldPlazaInventoryFoodEatShouldContinue({
  damageBaselineMs,
  lastDamagedAtMs,
  keyboardDirection,
  walkTarget,
  jumpRequested,
  rollRequested,
}: CheckingWorldPlazaInventoryFoodEatShouldContinueParams): boolean {
  if (
    lastDamagedAtMs !== null &&
    (damageBaselineMs === null || lastDamagedAtMs > damageBaselineMs)
  ) {
    return false;
  }

  if (
    keyboardDirection !== null &&
    checkingWorldPlazaMovementDirectionIsActive(keyboardDirection)
  ) {
    return false;
  }

  if (walkTarget !== null) {
    return false;
  }

  if (jumpRequested || rollRequested) {
    return false;
  }

  return true;
}
