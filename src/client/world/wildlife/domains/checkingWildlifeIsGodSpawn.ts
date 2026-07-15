/**
 * Predicate for distance-scaled god-spawn elite wildlife.
 *
 * @module components/world/wildlife/domains/checkingWildlifeIsGodSpawn
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Returns true when this instance is a god spawn. */
export function checkingWildlifeIsGodSpawn(
  instance: Pick<DefiningWildlifeInstance, 'isGodSpawn'>
): boolean {
  return instance.isGodSpawn === true;
}
