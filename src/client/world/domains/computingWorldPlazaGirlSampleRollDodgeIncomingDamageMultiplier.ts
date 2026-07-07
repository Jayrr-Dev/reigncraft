import { checkingWorldPlazaGirlSampleRollDodgeWindowIsActive } from '@/components/world/domains/checkingWorldPlazaGirlSampleRollDodgeWindowIsActive';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_END_RATIO,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MAX_DAMAGE_REDUCTION_RATIO,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MIN_DAMAGE_REDUCTION_RATIO,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_START_RATIO,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';

/**
 * Maps roll animation progress to dodge damage reduction (75%..95% across the window).
 * Returns null outside the active dodge window.
 */
export function computingWorldPlazaGirlSampleRollDodgeDamageReductionRatio(
  rollProgress: number
): number | null {
  if (!checkingWorldPlazaGirlSampleRollDodgeWindowIsActive(rollProgress)) {
    return null;
  }

  const dodgeWindowSpan =
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_END_RATIO -
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_START_RATIO;
  const windowProgress =
    (rollProgress - DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_START_RATIO) /
    dodgeWindowSpan;
  const peakDistance = Math.abs(windowProgress - 0.5) * 2;

  return (
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MAX_DAMAGE_REDUCTION_RATIO -
    peakDistance *
      (DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MAX_DAMAGE_REDUCTION_RATIO -
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MIN_DAMAGE_REDUCTION_RATIO)
  );
}

/**
 * Incoming damage multiplier for one roll-dodge sample, or null when inactive.
 */
export function computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier(
  rollProgress: number
): number | null {
  const damageReductionRatio =
    computingWorldPlazaGirlSampleRollDodgeDamageReductionRatio(rollProgress);

  if (damageReductionRatio === null) {
    return null;
  }

  return 1 - damageReductionRatio;
}
