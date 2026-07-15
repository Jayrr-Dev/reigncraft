/**
 * Pure step sizes for companion Spritcore power-ups from natural stats.
 *
 * @module components/world/wildlife/pets/domains/computingWildlifePetSpritcoreUpgradeSteps
 */

import {
  DEFINING_WILDLIFE_PET_SPRITCORE_ATTACK_SPEED_UPGRADE_STEP,
  DEFINING_WILDLIFE_PET_SPRITCORE_DAMAGE_UPGRADE_FRACTION,
  DEFINING_WILDLIFE_PET_SPRITCORE_DEFENSE_MAX_MULTIPLIER,
  DEFINING_WILDLIFE_PET_SPRITCORE_DEFENSE_UPGRADE_FRACTION,
  DEFINING_WILDLIFE_PET_SPRITCORE_HEALTH_UPGRADE_FRACTION,
  DEFINING_WILDLIFE_PET_SPRITCORE_MAX_MOVE_SPEED_GRID_PER_SECOND,
  DEFINING_WILDLIFE_PET_SPRITCORE_MOVE_SPEED_MAX_MULTIPLIER,
  DEFINING_WILDLIFE_PET_SPRITCORE_MOVE_SPEED_UPGRADE_STEP,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetSpritcoreUpgradeConstants';

export type ComputingWildlifePetSpritcoreUpgradeStepsResult = {
  readonly healthStep: number;
  readonly damageStep: number;
  readonly attackSpeedStep: number;
  readonly defenseStep: number;
  readonly moveSpeedStep: number;
};

/** Hard Defense ceiling for one companion (5× natural, at least one step above base). */
export function computingWildlifePetSpritcoreDefenseMaximum(
  naturalDefense: number,
  defenseStep: number
): number {
  if (naturalDefense <= 0) {
    return 0;
  }

  return Math.max(
    naturalDefense + defenseStep,
    naturalDefense * DEFINING_WILDLIFE_PET_SPRITCORE_DEFENSE_MAX_MULTIPLIER
  );
}

/** Hard run-speed ceiling for one companion (2× natural or 8 grid/s, whichever is lower). */
export function computingWildlifePetSpritcoreMoveSpeedMaximum(
  naturalRunSpeed: number
): number {
  if (naturalRunSpeed <= 0) {
    return 0;
  }

  return Math.min(
    naturalRunSpeed * DEFINING_WILDLIFE_PET_SPRITCORE_MOVE_SPEED_MAX_MULTIPLIER,
    DEFINING_WILDLIFE_PET_SPRITCORE_MAX_MOVE_SPEED_GRID_PER_SECOND
  );
}

/**
 * Resolves per-purchase steps from the companion's natural (pre-upgrade) HP,
 * attack EV, and Defense. Floors at 1 so tiny species still gain something.
 */
export function computingWildlifePetSpritcoreUpgradeSteps(
  naturalMaxHealth: number,
  naturalAttackPower: number,
  naturalDefense: number = 0
): ComputingWildlifePetSpritcoreUpgradeStepsResult {
  return {
    healthStep: Math.max(
      1,
      Math.round(
        naturalMaxHealth *
          DEFINING_WILDLIFE_PET_SPRITCORE_HEALTH_UPGRADE_FRACTION
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
    defenseStep:
      naturalDefense > 0
        ? Math.max(
            1,
            Math.round(
              naturalDefense *
                DEFINING_WILDLIFE_PET_SPRITCORE_DEFENSE_UPGRADE_FRACTION
            )
          )
        : 0,
    moveSpeedStep: DEFINING_WILDLIFE_PET_SPRITCORE_MOVE_SPEED_UPGRADE_STEP,
  };
}
