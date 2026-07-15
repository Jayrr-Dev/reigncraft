/**
 * True while a fishing cast predator is still in its pre-attack stalk window.
 *
 * @module components/world/wildlife/domains/checkingWildlifeFishingCastEncounterBlocksPlayerDamage
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Returns true when the instance must not deal player damage yet (stalking /
 * not armed / appeased).
 */
export function checkingWildlifeFishingCastEncounterBlocksPlayerDamage(
  instance: Pick<DefiningWildlifeInstance, 'fishingCastEncounter'>,
  nowMs: number
): boolean {
  const encounter = instance.fishingCastEncounter;

  if (!encounter || encounter.kind !== 'predator') {
    return false;
  }

  if (encounter.phase === 'armed') {
    return false;
  }

  if (encounter.phase === 'appeased' || encounter.phase === 'fled') {
    return true;
  }

  // Stalking: block until the arm timer elapses (even if phase lags one tick).
  return nowMs < encounter.armedAtMs;
}
