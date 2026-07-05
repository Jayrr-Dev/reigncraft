import { DEFINING_WORLD_PLAZA_TEMPERATURE_SMOOTHING_RATE_PER_SECOND } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

export type AdvancingWorldPlazaEnvironmentalTemperatureCelsiusParams = {
  currentCelsius: number;
  targetCelsius: number;
  deltaMs: number;
  smoothingRatePerSecond?: number;
};

/**
 * Eases local temperature toward a new sampled target (°C).
 *
 * Uses frame-rate-independent exponential smoothing so the readout and
 * environmental damage glide between tiles, including large jumps like lava.
 */
export function advancingWorldPlazaEnvironmentalTemperatureCelsius({
  currentCelsius,
  targetCelsius,
  deltaMs,
  smoothingRatePerSecond = DEFINING_WORLD_PLAZA_TEMPERATURE_SMOOTHING_RATE_PER_SECOND,
}: AdvancingWorldPlazaEnvironmentalTemperatureCelsiusParams): number {
  const deltaCelsius = targetCelsius - currentCelsius;

  if (deltaMs <= 0 || deltaCelsius === 0) {
    return currentCelsius;
  }

  const smoothingAlpha =
    1 - Math.exp(-smoothingRatePerSecond * (deltaMs / 1000));

  return currentCelsius + deltaCelsius * smoothingAlpha;
}
