import type { DefiningWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Returns true when local temperature sits outside the entity comfort band.
 */
export function checkingWorldPlazaOnboardingTemperatureOutsideComfort(
  localTemperatureCelsius: number | null,
  comfortBand: DefiningWorldPlazaEntityTemperatureComfortBand | null
): boolean {
  if (localTemperatureCelsius === null || comfortBand === null) {
    return false;
  }

  return (
    localTemperatureCelsius < comfortBand.comfortLowCelsius ||
    localTemperatureCelsius > comfortBand.comfortHighCelsius
  );
}
