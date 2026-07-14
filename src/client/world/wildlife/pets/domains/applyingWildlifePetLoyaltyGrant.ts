/**
 * Applies a loyalty grant and reports tier transitions.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetLoyaltyGrant
 */

import { DEFINING_WILDLIFE_PET_MAX_LOYALTY } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import {
  resolvingWildlifePetLoyaltyTierOrNull,
  resolvingWildlifePetLoyaltyTierId,
} from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';
import type { DefiningWildlifePetLoyaltyTierId } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';

export type ApplyingWildlifePetLoyaltyGrantResult = {
  loyalty: number;
  previousTierId: DefiningWildlifePetLoyaltyTierId;
  nextTierId: DefiningWildlifePetLoyaltyTierId;
  didUnlockTier: boolean;
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

/** Adds loyalty, clamps to 0..1000, and detects tier unlocks. */
export function applyingWildlifePetLoyaltyGrant(
  currentLoyalty: number,
  grant: number
): ApplyingWildlifePetLoyaltyGrantResult {
  const previousTier = resolvingWildlifePetLoyaltyTierOrNull(currentLoyalty);
  const loyalty = clampingWildlifePetLoyalty(currentLoyalty + grant);
  const nextTier = resolvingWildlifePetLoyaltyTierOrNull(loyalty);
  const previousTierId = previousTier?.tierId ?? 'curious';
  const nextTierId = nextTier?.tierId ?? 'curious';

  return {
    loyalty,
    previousTierId,
    nextTierId,
    didUnlockTier:
      nextTier !== null &&
      (previousTier?.tierId ?? null) !== nextTier.tierId,
  };
}
