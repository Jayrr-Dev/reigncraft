/**
 * Resolves follow vs flee from docile aggressionLevel and a uniform roll.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeDocileApproachReaction
 */

import { DEFINING_WILDLIFE_DOCILE_FOLLOW_CHANCE_BY_AGGRESSION } from '@/components/world/wildlife/domains/definingWildlifeDocileConstants';
import type { DefiningWildlifeAggressionLevel } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeDocileApproachReaction = 'follow' | 'flee';

export type ResolvingWildlifeDocileApproachReactionParams = {
  aggressionLevel: DefiningWildlifeAggressionLevel;
  /** Uniform in [0, 1). */
  roll: number;
};

/**
 * Follow when roll < follow chance for this aggression tier; otherwise flee.
 */
export function resolvingWildlifeDocileApproachReaction({
  aggressionLevel,
  roll,
}: ResolvingWildlifeDocileApproachReactionParams): ResolvingWildlifeDocileApproachReaction {
  const followChance =
    DEFINING_WILDLIFE_DOCILE_FOLLOW_CHANCE_BY_AGGRESSION[aggressionLevel];

  return roll < followChance ? 'follow' : 'flee';
}
