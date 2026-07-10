/**
 * Player short-term run acceleration: fast burst, slow top-end, then
 * stamina exhaustion fade back toward walk.
 *
 * @module components/world/domains/computingWorldPlazaAcceleratedRunSpeed
 */

import {
  DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_RATIO,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_SECONDS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_TOP_SECONDS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_EXHAUSTION_FADE_START_RATIO,
} from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';

function clampingUnitProgress(value: number, durationSeconds: number): number {
  if (durationSeconds <= 0) {
    return 1;
  }

  return Math.min(1, Math.max(0, value / durationSeconds));
}

function computingBurstRunSpeed(
  walkSpeed: number,
  runSpeed: number,
  runningForSeconds: number,
  fastSeconds: number,
  topSeconds: number,
  fastRatio: number
): number {
  if (fastSeconds <= 0 && topSeconds <= 0) {
    return runSpeed;
  }

  const clampedFastRatio = Math.min(1, Math.max(0, fastRatio));
  const speedGap = runSpeed - walkSpeed;
  const midSpeed = walkSpeed + speedGap * clampedFastRatio;

  const fastProgress = clampingUnitProgress(runningForSeconds, fastSeconds);
  if (fastProgress < 1) {
    return walkSpeed + (midSpeed - walkSpeed) * fastProgress;
  }

  if (topSeconds <= 0 || clampedFastRatio >= 1) {
    return runSpeed;
  }

  const topElapsed = Math.max(0, runningForSeconds - Math.max(0, fastSeconds));
  const topProgress = clampingUnitProgress(topElapsed, topSeconds);

  return midSpeed + (runSpeed - midSpeed) * topProgress;
}

/**
 * Resolves current run speed from continuous sprint time and stamina.
 *
 * Phase 1 (0..fastSeconds): lerp walk → walk + fastRatio × (run − walk).
 * Phase 2 (next topSeconds): lerp that mid speed → full run.
 * Exhaustion fade: when stamina ≤ fadeStartRatio, lerp burst speed → walk
 * as stamina falls from fadeStartRatio to 0.
 */
export function computingWorldPlazaAcceleratedRunSpeed(
  walkSpeed: number,
  runSpeed: number,
  runningForSeconds: number,
  staminaRatio: number = 1,
  fastSeconds: number = DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_SECONDS,
  topSeconds: number = DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_TOP_SECONDS,
  fastRatio: number = DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_RATIO,
  exhaustionFadeStartRatio: number = DEFINING_WORLD_PLAZA_RUN_STAMINA_EXHAUSTION_FADE_START_RATIO
): number {
  const burstSpeed = computingBurstRunSpeed(
    walkSpeed,
    runSpeed,
    runningForSeconds,
    fastSeconds,
    topSeconds,
    fastRatio
  );

  if (exhaustionFadeStartRatio <= 0) {
    return burstSpeed;
  }

  const clampedStamina = Math.min(1, Math.max(0, staminaRatio));
  if (clampedStamina >= exhaustionFadeStartRatio) {
    return burstSpeed;
  }

  const fadeProgress = clampedStamina / exhaustionFadeStartRatio;
  return walkSpeed + (burstSpeed - walkSpeed) * fadeProgress;
}
