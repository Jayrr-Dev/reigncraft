/**
 * Attack-power multiplier from Spritcore quantity gulped by wildlife.
 *
 * @module components/world/wildlife/domains/computingWildlifeSpritcoreFeastAttackPowerMultiplier
 */

import {
  DEFINING_WILDLIFE_SPRITCORE_FEAST_ATTACK_POWER_BONUS_PER_UNIT,
  DEFINING_WILDLIFE_SPRITCORE_FEAST_ATTACK_POWER_MULTIPLIER_CAP,
} from '@/components/world/wildlife/domains/definingWildlifeSpritcoreFeastConstants';

/** Maps gulped SC quantity to a melee damage multiplier (≥ 1). */
export function computingWildlifeSpritcoreFeastAttackPowerMultiplier(
  spritcoreQuantity: number
): number {
  if (spritcoreQuantity <= 0) {
    return 1;
  }

  const uncapped =
    1 +
    spritcoreQuantity *
      DEFINING_WILDLIFE_SPRITCORE_FEAST_ATTACK_POWER_BONUS_PER_UNIT;

  return Math.min(
    DEFINING_WILDLIFE_SPRITCORE_FEAST_ATTACK_POWER_MULTIPLIER_CAP,
    uncapped
  );
}
