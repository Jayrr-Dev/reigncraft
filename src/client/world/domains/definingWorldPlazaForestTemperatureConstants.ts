/**
 * Temperate ambient ceilings for forest, flower forest, and jungle.
 *
 * Climate noise can place humid woodland tiles on a warm band. A soft max
 * keeps daytime ambient in a temperate range (unlike Firelands’ heat floor).
 *
 * @module components/world/domains/definingWorldPlazaForestTemperatureConstants
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/** Biome kinds that get a temperate ambient ceiling. */
export const DEFINING_WORLD_PLAZA_FOREST_SHADE_BIOME_KINDS = [
  'forest',
  'flower_forest',
  'jungle',
] as const satisfies readonly DefiningWorldPlazaBiomeKind[];

/** Soft daytime ambient ceiling for closed forest (°C). */
export const DEFINING_WORLD_PLAZA_FOREST_AMBIENT_MAX_CELSIUS = 24;

/** Soft daytime ambient ceiling for flower forest (°C). */
export const DEFINING_WORLD_PLAZA_FLOWER_FOREST_AMBIENT_MAX_CELSIUS = 27;

/** Soft daytime ambient ceiling for jungle (°C). */
export const DEFINING_WORLD_PLAZA_JUNGLE_AMBIENT_MAX_CELSIUS = 30;

/**
 * Caps ambient for forest / flower forest / jungle into a temperate band.
 *
 * Idempotent ceiling only (no subtract), so it is safe after neighbor averaging.
 */
export function applyingWorldPlazaForestCanopyAmbientCelsius(
  ambientCelsius: number,
  biomeKind: DefiningWorldPlazaBiomeKind
): number {
  if (biomeKind === 'forest') {
    return Math.min(
      ambientCelsius,
      DEFINING_WORLD_PLAZA_FOREST_AMBIENT_MAX_CELSIUS
    );
  }

  if (biomeKind === 'flower_forest') {
    return Math.min(
      ambientCelsius,
      DEFINING_WORLD_PLAZA_FLOWER_FOREST_AMBIENT_MAX_CELSIUS
    );
  }

  if (biomeKind === 'jungle') {
    return Math.min(
      ambientCelsius,
      DEFINING_WORLD_PLAZA_JUNGLE_AMBIENT_MAX_CELSIUS
    );
  }

  return ambientCelsius;
}
