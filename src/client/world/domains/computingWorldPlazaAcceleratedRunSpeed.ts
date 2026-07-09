/**
 * Player short-term run acceleration: lerp walk speed to full run speed.
 *
 * @module components/world/domains/computingWorldPlazaAcceleratedRunSpeed
 */

import { DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';

/**
 * Resolves current run speed from continuous sprint time.
 * At 0s returns walk speed; at {@link DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS}
 * and beyond returns full run speed. No long-term momentum (player-only burst).
 */
export function computingWorldPlazaAcceleratedRunSpeed(
  walkSpeed: number,
  runSpeed: number,
  runningForSeconds: number,
  burstRampSeconds: number = DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS
): number {
  if (burstRampSeconds <= 0) {
    return runSpeed;
  }

  const progress = Math.min(
    1,
    Math.max(0, runningForSeconds / burstRampSeconds)
  );

  return walkSpeed + (runSpeed - walkSpeed) * progress;
}
