/**
 * Flee intent used while a fairy soft-departs after sunrise.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeFairyDaybreakWanderAwayIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeFleeFromThreatPointIntent } from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

const DEFINING_WILDLIFE_FAIRY_DAYBREAK_FLEE_DISTANCE_GRID = 10;

export type ResolvingWildlifeFairyDaybreakWanderAwayIntentParams = {
  position: DefiningWorldPlazaWorldPoint;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
};

/**
 * Runs away from the player (or wanders when no player) so dawn departure
 * reads as floating off rather than popping out.
 */
export function resolvingWildlifeFairyDaybreakWanderAwayIntent({
  position,
  playerPosition,
  species,
  hazardSampling,
}: ResolvingWildlifeFairyDaybreakWanderAwayIntentParams): DefiningWildlifeBehaviorIntent {
  if (!playerPosition) {
    return { mode: 'wander' };
  }

  return resolvingWildlifeFleeFromThreatPointIntent({
    position,
    threatPoint: playerPosition,
    fleeDistanceGrid: DEFINING_WILDLIFE_FAIRY_DAYBREAK_FLEE_DISTANCE_GRID,
    species,
    hazardSampling,
  });
}
