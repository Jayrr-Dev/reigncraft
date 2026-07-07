/**
 * Pack-wide flee-or-enrage roll after player damage during stalk shadowing.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPackDamageResponse
 */

import { computingWildlifeInstanceSeedFraction } from '@/components/world/wildlife/domains/computingWildlifeInstanceSeedFraction';
import { DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_CHANCE } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeStalkPackResponseKind,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Stable pack roll salt for flee-vs-enrage decisions. */
export const RESOLVING_WILDLIFE_STALK_PACK_DAMAGE_RESPONSE_SALT = 911;

/**
 * Picks flee or enrage for a stalk pack that was hit during shadowing.
 */
export function resolvingWildlifeStalkPackDamageResponse(
  packmates: readonly DefiningWildlifeInstance[]
): DefiningWildlifeStalkPackResponseKind {
  const sortedPackmates = [...packmates].sort((left, right) =>
    left.instanceId.localeCompare(right.instanceId)
  );
  const rollAnchor = sortedPackmates[0]?.instanceId ?? 'stalk-pack';
  const roll = computingWildlifeInstanceSeedFraction(
    rollAnchor,
    RESOLVING_WILDLIFE_STALK_PACK_DAMAGE_RESPONSE_SALT
  );

  return roll < DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_CHANCE ? 'flee' : 'enrage';
}
