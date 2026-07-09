/**
 * Demotes docile aggression one step after a player hit (less friendly).
 *
 * @module components/world/wildlife/domains/applyingWildlifeDocileAggressionLoss
 */

import type { DefiningWildlifeAggressionLevel } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const DEFINING_WILDLIFE_DOCILE_AGGRESSION_DEMOTE: Record<
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeAggressionLevel
> = {
  tame: 'normal',
  normal: 'aggressive',
  aggressive: 'aggressive',
};

/**
 * One hit: tame → normal → aggressive (floor).
 */
export function applyingWildlifeDocileAggressionLoss(
  aggressionLevel: DefiningWildlifeAggressionLevel
): DefiningWildlifeAggressionLevel {
  return DEFINING_WILDLIFE_DOCILE_AGGRESSION_DEMOTE[aggressionLevel];
}
