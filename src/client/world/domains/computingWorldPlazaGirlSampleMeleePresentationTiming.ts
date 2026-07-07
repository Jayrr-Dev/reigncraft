import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_MOTION_SHEET_LAYOUT,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';

/** Minimum attack-speed multiplier so melee timing stays finite. */
export const COMPUTING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ATTACK_SPEED_MIN = 0.25;

export type ComputingWorldPlazaGirlSampleMeleePresentationTiming = {
  readonly animationFps: number;
  readonly durationMs: number;
};

/**
 * Derives GirlSample melee strip fps and one-shot duration from attack speed.
 *
 * Attack speed 1 plays the baseline strip length. Higher values finish faster.
 */
export function computingWorldPlazaGirlSampleMeleePresentationTiming(
  attackSpeed: number
): ComputingWorldPlazaGirlSampleMeleePresentationTiming {
  const normalizedAttackSpeed = Math.max(
    COMPUTING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ATTACK_SPEED_MIN,
    attackSpeed
  );
  const animationFps =
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ANIMATION_FPS *
    normalizedAttackSpeed;
  const durationMs =
    (DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_MOTION_SHEET_LAYOUT.frameCount /
      animationFps) *
    1000;

  return {
    animationFps,
    durationMs,
  };
}
