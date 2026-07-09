/**
 * Scales player run-clip playback to match accelerated / exhaustion speed.
 *
 * @module components/world/domains/resolvingWorldPlazaRunAnimationSpeedScale
 */

import {
  DEFINING_WORLD_PLAZA_RUN_ANIMATION_SPEED_SCALE_MAX,
  DEFINING_WORLD_PLAZA_RUN_ANIMATION_SPEED_SCALE_MIN,
} from '@/components/world/domains/definingWorldPlazaRunAnimationSpeedScaleConstants';

/**
 * Returns a multiplier for `runAnimationFps` from current vs full run speed.
 * At full run speed returns 1. At walk speed returns walk/run (≈ walk fps feel).
 */
export function resolvingWorldPlazaRunAnimationSpeedScale(
  currentRunSpeed: number,
  fullRunSpeed: number
): number {
  if (fullRunSpeed <= 0) {
    return 1;
  }

  const scale = currentRunSpeed / fullRunSpeed;

  return Math.min(
    DEFINING_WORLD_PLAZA_RUN_ANIMATION_SPEED_SCALE_MAX,
    Math.max(DEFINING_WORLD_PLAZA_RUN_ANIMATION_SPEED_SCALE_MIN, scale)
  );
}
