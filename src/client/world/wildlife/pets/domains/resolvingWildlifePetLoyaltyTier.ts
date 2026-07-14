/**
 * Pure loyalty tier resolution and capability gates.
 *
 * @module components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier
 */

import {
  DEFINING_WILDLIFE_PET_LOYALTY_TIER_REGISTRY,
  DEFINING_WILDLIFE_PET_MAX_LOYALTY,
  type DefiningWildlifePetLoyaltyTierDefinition,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import type {
  DefiningWildlifePetCapabilityId,
  DefiningWildlifePetLoyaltyTierId,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';

export type ResolvingWildlifePetNextTierResult = {
  tier: DefiningWildlifePetLoyaltyTierDefinition;
  loyaltyRemaining: number;
};

function clampingWildlifePetLoyalty(loyalty: number): number {
  if (!Number.isFinite(loyalty)) {
    return 0;
  }

  return Math.min(
    DEFINING_WILDLIFE_PET_MAX_LOYALTY,
    Math.max(0, Math.round(loyalty))
  );
}

/**
 * Highest loyalty tier reached at the given point total.
 * Returns null when loyalty is below Curious (1).
 */
export function resolvingWildlifePetLoyaltyTierOrNull(
  loyalty: number
): DefiningWildlifePetLoyaltyTierDefinition | null {
  const clampedLoyalty = clampingWildlifePetLoyalty(loyalty);
  const firstTier = DEFINING_WILDLIFE_PET_LOYALTY_TIER_REGISTRY[0];

  if (!firstTier || clampedLoyalty < firstTier.minLoyalty) {
    return null;
  }

  let resolvedTier = firstTier;

  for (const tier of DEFINING_WILDLIFE_PET_LOYALTY_TIER_REGISTRY) {
    if (clampedLoyalty >= tier.minLoyalty) {
      resolvedTier = tier;
      continue;
    }

    break;
  }

  return resolvedTier;
}

/**
 * Highest loyalty tier reached at the given point total.
 * Below Curious, returns the Curious row as a display fallback.
 */
export function resolvingWildlifePetLoyaltyTier(
  loyalty: number
): DefiningWildlifePetLoyaltyTierDefinition {
  return (
    resolvingWildlifePetLoyaltyTierOrNull(loyalty) ??
    DEFINING_WILDLIFE_PET_LOYALTY_TIER_REGISTRY[0]
  );
}

/** True when loyalty meets the threshold that unlocks one capability. */
export function checkingWildlifePetHasCapability(
  loyalty: number,
  capability: DefiningWildlifePetCapabilityId
): boolean {
  const clampedLoyalty = clampingWildlifePetLoyalty(loyalty);

  return DEFINING_WILDLIFE_PET_LOYALTY_TIER_REGISTRY.some(
    (tier) =>
      clampedLoyalty >= tier.minLoyalty &&
      tier.capabilities.includes(capability)
  );
}

/** All capabilities unlocked at the given loyalty total. */
export function listingWildlifePetUnlockedCapabilities(
  loyalty: number
): readonly DefiningWildlifePetCapabilityId[] {
  const clampedLoyalty = clampingWildlifePetLoyalty(loyalty);
  const unlocked = new Set<DefiningWildlifePetCapabilityId>();

  for (const tier of DEFINING_WILDLIFE_PET_LOYALTY_TIER_REGISTRY) {
    if (clampedLoyalty < tier.minLoyalty) {
      continue;
    }

    for (const capability of tier.capabilities) {
      unlocked.add(capability);
    }
  }

  return [...unlocked];
}

/** Next tier above the current loyalty total, if any. */
export function resolvingWildlifePetNextTier(
  loyalty: number
): ResolvingWildlifePetNextTierResult | null {
  const clampedLoyalty = clampingWildlifePetLoyalty(loyalty);

  for (const tier of DEFINING_WILDLIFE_PET_LOYALTY_TIER_REGISTRY) {
    if (tier.minLoyalty <= clampedLoyalty) {
      continue;
    }

    return {
      tier,
      loyaltyRemaining: tier.minLoyalty - clampedLoyalty,
    };
  }

  return null;
}

/** Resolves tier id at a loyalty total without returning the full definition. */
export function resolvingWildlifePetLoyaltyTierId(
  loyalty: number
): DefiningWildlifePetLoyaltyTierId {
  return resolvingWildlifePetLoyaltyTier(loyalty).tierId;
}
