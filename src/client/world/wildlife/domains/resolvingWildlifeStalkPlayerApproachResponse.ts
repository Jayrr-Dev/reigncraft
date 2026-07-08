/**
 * Pack-wide flee, enrage, or regroup roll when the player rushes a shadowing stalker.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPlayerApproachResponse
 */

import { computingWildlifeInstanceSeedFraction } from '@/components/world/wildlife/domains/computingWildlifeInstanceSeedFraction';
import {
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_ENRAGE_CHANCE,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_FLEE_CHANCE,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeStalkPackResponseKind,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Stable pack roll salt for player-approach reactions. */
export const RESOLVING_WILDLIFE_STALK_PLAYER_APPROACH_RESPONSE_SALT = 1207;

/**
 * Picks flee, enrage, or regroup for a stalk pack the player rushed during shadowing.
 */
export function resolvingWildlifeStalkPlayerApproachResponse(
  packmates: readonly DefiningWildlifeInstance[]
): DefiningWildlifeStalkPackResponseKind {
  const sortedPackmates = [...packmates].sort((left, right) =>
    left.instanceId.localeCompare(right.instanceId)
  );
  const rollAnchor = sortedPackmates[0]?.instanceId ?? 'stalk-approach-pack';
  const roll = computingWildlifeInstanceSeedFraction(
    rollAnchor,
    RESOLVING_WILDLIFE_STALK_PLAYER_APPROACH_RESPONSE_SALT
  );

  if (roll < DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_FLEE_CHANCE) {
    return 'flee';
  }

  if (
    roll <
    DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_FLEE_CHANCE +
      DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_ENRAGE_CHANCE
  ) {
    return 'enrage';
  }

  return 'regroup';
}
