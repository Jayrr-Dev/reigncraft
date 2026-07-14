/**
 * Applies a loyalty grant and reports tier transitions.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetLoyaltyGrant
 */

import { DEFINING_WILDLIFE_PET_MAX_LOYALTY } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import type { DefiningWildlifePetLoyaltyTierId } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { resolvingWildlifePetLoyaltyDeltaWithNeglectedBadge } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyDeltaWithNeglectedBadge';
import { resolvingWildlifePetLoyaltyTierOrNull } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';

export type ApplyingWildlifePetLoyaltyGrantOptions = {
  /** When true, gains are halved and losses are increased by half. */
  hasNeglectedBadge?: boolean;
};

export type ApplyingWildlifePetLoyaltyGrantResult = {
  loyalty: number;
  /** Actual points added after clamp (negative when loyalty fell). */
  granted: number;
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
  grant: number,
  options?: ApplyingWildlifePetLoyaltyGrantOptions
): ApplyingWildlifePetLoyaltyGrantResult {
  const previousLoyalty = clampingWildlifePetLoyalty(currentLoyalty);
  const previousTier = resolvingWildlifePetLoyaltyTierOrNull(previousLoyalty);
  const adjustedGrant = resolvingWildlifePetLoyaltyDeltaWithNeglectedBadge(
    grant,
    options?.hasNeglectedBadge === true
  );
  const loyalty = clampingWildlifePetLoyalty(previousLoyalty + adjustedGrant);
  const nextTier = resolvingWildlifePetLoyaltyTierOrNull(loyalty);
  const previousTierId = previousTier?.tierId ?? 'curious';
  const nextTierId = nextTier?.tierId ?? 'curious';

  return {
    loyalty,
    granted: loyalty - previousLoyalty,
    previousTierId,
    nextTierId,
    didUnlockTier:
      nextTier !== null && (previousTier?.tierId ?? null) !== nextTier.tierId,
  };
}
