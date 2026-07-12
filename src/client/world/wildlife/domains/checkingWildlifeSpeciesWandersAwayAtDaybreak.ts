/**
 * True when a night-only species soft-departs at dawn instead of hard despawn.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesWandersAwayAtDaybreak
 */

import { DEFINING_WILDLIFE_FAIRY_SPECIES_ID } from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';

/** Companions like the fairy flee off-screen at sunrise, then despawn. */
export function checkingWildlifeSpeciesWandersAwayAtDaybreak(
  speciesId: string
): boolean {
  return speciesId === DEFINING_WILDLIFE_FAIRY_SPECIES_ID;
}
