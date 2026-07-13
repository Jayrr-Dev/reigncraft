/**
 * Shared gate for pack_hunter and solo stalker temperaments.
 *
 * @module components/world/wildlife/domains/checkingWildlifeIsStalkHuntTemperament
 */

import type { DefiningWildlifeTemperamentId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** True for temperaments that use the stalk shadow → rush pipeline. */
export function checkingWildlifeIsStalkHuntTemperament(
  temperamentId: DefiningWildlifeTemperamentId
): boolean {
  return temperamentId === 'pack_hunter' || temperamentId === 'stalker';
}
