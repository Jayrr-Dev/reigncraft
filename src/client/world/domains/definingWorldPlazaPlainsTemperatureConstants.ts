/**
 * Temperate ambient ceiling for plains.
 *
 * Plains is the climate fallback: warm mid-humidity tiles can sit near climate
 * noise 1 (48°C) without becoming desert or savanna. A soft max keeps daytime
 * ambient in a mild grassland range (below comfort high heat DoT).
 *
 * @module components/world/domains/definingWorldPlazaPlainsTemperatureConstants
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/** Soft daytime ambient ceiling for plains (°C). */
export const DEFINING_WORLD_PLAZA_PLAINS_AMBIENT_MAX_CELSIUS = 34;

/**
 * Caps ambient for plains into a mild grassland band.
 *
 * Idempotent ceiling only (no subtract), so it is safe after neighbor averaging.
 */
export function applyingWorldPlazaPlainsAmbientCelsius(
  ambientCelsius: number,
  biomeKind: DefiningWorldPlazaBiomeKind
): number {
  if (biomeKind === 'plains') {
    return Math.min(
      ambientCelsius,
      DEFINING_WORLD_PLAZA_PLAINS_AMBIENT_MAX_CELSIUS
    );
  }

  return ambientCelsius;
}
