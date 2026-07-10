/**
 * Pure run-speed ramp: walk → base run (burst), then base run → momentum peak.
 *
 * @module components/world/wildlife/domains/computingWildlifeAcceleratedRunSpeed
 */

import type { DefiningWildlifeSpeciesAccelerationConfig } from '@/components/world/wildlife/domains/definingWildlifeSpeciesAccelerationRegistry';

function clampingUnitProgress(value: number, durationSeconds: number): number {
  if (durationSeconds <= 0) {
    return 1;
  }

  return Math.min(1, Math.max(0, value / durationSeconds));
}

/**
 * Resolves current run speed from continuous running time and acceleration config.
 *
 * Phase 1 (0..burstRampSeconds): lerp walk speed to base run speed.
 * Phase 2 (through momentumRampSeconds of continuous run): lerp base run to
 * run × (1 + momentumBonusMultiplier).
 */
export function computingWildlifeAcceleratedRunSpeed(
  walkSpeedGridPerSecond: number,
  runSpeedGridPerSecond: number,
  runningForSeconds: number,
  config: DefiningWildlifeSpeciesAccelerationConfig
): number {
  const burstProgress = clampingUnitProgress(
    runningForSeconds,
    config.burstRampSeconds
  );
  const burstSpeed =
    walkSpeedGridPerSecond +
    (runSpeedGridPerSecond - walkSpeedGridPerSecond) * burstProgress;

  if (burstProgress < 1) {
    return burstSpeed;
  }

  if (
    config.momentumBonusMultiplier <= 0 ||
    config.momentumRampSeconds <= 0
  ) {
    return runSpeedGridPerSecond;
  }

  const momentumElapsed = Math.max(
    0,
    runningForSeconds - config.burstRampSeconds
  );
  const momentumProgress = clampingUnitProgress(
    momentumElapsed,
    config.momentumRampSeconds
  );
  const peakSpeed =
    runSpeedGridPerSecond * (1 + config.momentumBonusMultiplier);

  return (
    runSpeedGridPerSecond +
    (peakSpeed - runSpeedGridPerSecond) * momentumProgress
  );
}
