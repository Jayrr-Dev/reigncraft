import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_END_RATIO,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_START_RATIO,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';

/**
 * Returns true while roll progress sits inside the active dodge window.
 */
export function checkingWorldPlazaGirlSampleRollDodgeWindowIsActive(
  rollProgress: number
): boolean {
  return (
    rollProgress >= DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_START_RATIO &&
    rollProgress <= DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_END_RATIO
  );
}
