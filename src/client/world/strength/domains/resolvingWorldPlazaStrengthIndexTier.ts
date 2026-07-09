/**
 * Maps a strength index score onto the declarative tier registry.
 *
 * @module components/world/strength/domains/resolvingWorldPlazaStrengthIndexTier
 */

import {
  DEFINING_WORLD_PLAZA_STRENGTH_TIER_REGISTRY,
  type DefiningWorldPlazaStrengthTier,
} from '@/components/world/strength/domains/definingWorldPlazaStrengthIndexConstants';

/** Picks the highest tier whose lower bound fits the given score. */
export function resolvingWorldPlazaStrengthIndexTier(
  strengthIndex: number
): DefiningWorldPlazaStrengthTier {
  const [lowestTier, ...higherTiers] =
    DEFINING_WORLD_PLAZA_STRENGTH_TIER_REGISTRY;

  if (!lowestTier) {
    throw new Error('Strength tier registry must not be empty.');
  }

  return higherTiers.reduce(
    (currentTier, candidate) =>
      strengthIndex >= candidate.minStrengthIndex ? candidate : currentTier,
    lowestTier
  );
}
