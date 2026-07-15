/**
 * Pure step sizes for companion Spritcore power-ups from natural stats.
 *
 * @module components/world/wildlife/pets/domains/computingWildlifePetSpritcoreUpgradeSteps
 */

import {
  DEFINING_WILDLIFE_PET_SPRITCORE_ATTACK_SPEED_UPGRADE_STEP,
  DEFINING_WILDLIFE_PET_SPRITCORE_DAMAGE_UPGRADE_FRACTION,
  DEFINING_WILDLIFE_PET_SPRITCORE_HEALTH_UPGRADE_FRACTION,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetSpritcoreUpgradeConstants';

export type ComputingWildlifePetSpritcoreUpgradeStepsResult = {
  readonly healthStep: number;
  readonly damageStep: number;
  readonly attackSpeedStep: number;
};

/**
 * Resolves per-purchase steps from the companion's natural (pre-upgrade) HP
 * and attack EV. Floors at 1 so tiny species still gain something.
 */
export function computingWildlifePetSpritcoreUpgradeSteps(
  naturalMaxHealth: number,
  naturalAttackPower: number
): ComputingWildlifePetSpritcoreUpgradeStepsResult {
  return {
    healthStep: Math.max(
      1,
      Math.round(
        naturalMaxHealth * DEFINING_WILDLIFE_PET_SPRITCORE_HEALTH_UPGRADE_FRACTION
      )
    ),
    damageStep: Math.max(
      1,
      Math.round(
        naturalAttackPower *
          DEFINING_WILDLIFE_PET_SPRITCORE_DAMAGE_UPGRADE_FRACTION
      )
    ),
    attackSpeedStep: DEFINING_WILDLIFE_PET_SPRITCORE_ATTACK_SPEED_UPGRADE_STEP,
  };
}
