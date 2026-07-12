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

export type ComputingWorldPlazaGirlSampleMeleePresentationTimingOptions = {
  readonly frameCount?: number;
  readonly baselineAnimationFps?: number;
};

/**
 * Derives melee strip fps and one-shot duration from attack speed.
 *
 * Attack speed 1 plays the baseline strip length. Higher values finish faster.
 * Optional frameCount / baselineAnimationFps override GirlSample defaults so
 * animal skins (15-frame sheets) keep correct timing.
 */
export function computingWorldPlazaGirlSampleMeleePresentationTiming(
  attackSpeed: number,
  options: ComputingWorldPlazaGirlSampleMeleePresentationTimingOptions = {}
): ComputingWorldPlazaGirlSampleMeleePresentationTiming {
  const frameCount =
    options.frameCount ??
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_MOTION_SHEET_LAYOUT.frameCount;
  const baselineAnimationFps =
    options.baselineAnimationFps ??
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ANIMATION_FPS;
  const normalizedAttackSpeed = Math.max(
    COMPUTING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ATTACK_SPEED_MIN,
    attackSpeed
  );
  const animationFps = baselineAnimationFps * normalizedAttackSpeed;
  const durationMs = (frameCount / animationFps) * 1000;

  return {
    animationFps,
    durationMs,
  };
}
