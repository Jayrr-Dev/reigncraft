import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_CHAIN_EXTRA_DELAY_MS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_CHAIN_START_RATIO,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DURATION_MS,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';

/** Absolute time when the next roll may start after a roll began at `rollStartedAtMs`. */
export function computingWorldPlazaGirlSampleRollChainUnlockAtMs(
  rollStartedAtMs: number
): number {
  return (
    rollStartedAtMs +
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DURATION_MS *
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_CHAIN_START_RATIO +
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_CHAIN_EXTRA_DELAY_MS
  );
}
