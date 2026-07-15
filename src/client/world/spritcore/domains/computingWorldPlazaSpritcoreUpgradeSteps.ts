/**
 * Pure step sizes and hard caps for player Spritcore defense / move-speed lanes.
 *
 * @module components/world/spritcore/domains/computingWorldPlazaSpritcoreUpgradeSteps
 */

import {
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DEFENSE_MAX_MULTIPLIER,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DEFENSE_UPGRADE_FRACTION,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_MOVE_SPEED_GRID_PER_SECOND,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MOVE_SPEED_MAX_MULTIPLIER,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MOVE_SPEED_UPGRADE_STEP,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';

export type ComputingWorldPlazaSpritcoreUpgradeStepsResult = {
  readonly defenseStep: number;
  readonly moveSpeedStep: number;
};

/** Hard Defense ceiling for one avatar form (5× natural, at least one step above base). */
export function computingWorldPlazaSpritcoreDefenseMaximum(
  naturalDefense: number,
  defenseStep: number
): number {
  if (naturalDefense <= 0) {
    return 0;
  }

  return Math.max(
    naturalDefense + defenseStep,
    naturalDefense *
      DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DEFENSE_MAX_MULTIPLIER
  );
}

/** Hard run-speed ceiling for one avatar form (2× natural or 8 grid/s, whichever is lower). */
export function computingWorldPlazaSpritcoreMoveSpeedMaximum(
  naturalRunSpeed: number
): number {
  if (naturalRunSpeed <= 0) {
    return 0;
  }

  return Math.min(
    naturalRunSpeed *
      DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MOVE_SPEED_MAX_MULTIPLIER,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_MOVE_SPEED_GRID_PER_SECOND
  );
}

/** Resolves defense / move-speed step sizes from natural (pre-upgrade) stats. */
export function computingWorldPlazaSpritcoreUpgradeSteps(
  naturalDefense: number
): ComputingWorldPlazaSpritcoreUpgradeStepsResult {
  return {
    defenseStep:
      naturalDefense > 0
        ? Math.max(
            1,
            Math.round(
              naturalDefense *
                DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DEFENSE_UPGRADE_FRACTION
            )
          )
        : 0,
    moveSpeedStep:
      DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MOVE_SPEED_UPGRADE_STEP,
  };
}
