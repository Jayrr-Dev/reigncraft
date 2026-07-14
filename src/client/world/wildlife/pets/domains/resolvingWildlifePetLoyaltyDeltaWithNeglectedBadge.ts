/**
 * Scales a raw loyalty delta when the companion carries the Neglected badge.
 *
 * @module components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyDeltaWithNeglectedBadge
 */

import {
  DEFINING_WILDLIFE_PET_NEGLECTED_LOYALTY_GAIN_MULTIPLIER,
  DEFINING_WILDLIFE_PET_NEGLECTED_LOYALTY_LOSS_MULTIPLIER,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetHungerLoyaltyNeglectConstants';

/**
 * Gains ×0.5 and losses ×1.5 while Neglected. Zero stays zero. Rounds to the
 * nearest whole loyalty point after scaling.
 */
export function resolvingWildlifePetLoyaltyDeltaWithNeglectedBadge(
  rawDelta: number,
  hasNeglectedBadge: boolean
): number {
  if (!Number.isFinite(rawDelta) || rawDelta === 0 || !hasNeglectedBadge) {
    return rawDelta;
  }

  if (rawDelta > 0) {
    return Math.round(
      rawDelta * DEFINING_WILDLIFE_PET_NEGLECTED_LOYALTY_GAIN_MULTIPLIER
    );
  }

  return Math.round(
    rawDelta * DEFINING_WILDLIFE_PET_NEGLECTED_LOYALTY_LOSS_MULTIPLIER
  );
}
