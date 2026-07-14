/**
 * Formats loyalty overlay text for wildlife name tags.
 *
 * @module components/world/wildlife/pets/domains/formattingWildlifePetLoyaltyDebugLabel
 */

import { resolvingWildlifePetLoyaltyTierOrNull } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';

/**
 * Compact loyalty readout: "Curious 12" or "0" when unbonded.
 */
export function formattingWildlifePetLoyaltyDebugLabel(
  loyalty: number | null | undefined
): string {
  if (loyalty === null || loyalty === undefined || loyalty <= 0) {
    return '0';
  }

  const tier = resolvingWildlifePetLoyaltyTierOrNull(loyalty);

  if (!tier) {
    return String(Math.round(loyalty));
  }

  return `${tier.displayName} ${Math.round(loyalty)}`;
}

/**
 * Appends a loyalty segment to an existing wildlife name-tag label.
 */
export function appendingWildlifePetLoyaltyDebugToNameTagLabel(
  displayLabel: string,
  loyalty: number | null | undefined
): string {
  return `${displayLabel} · ${formattingWildlifePetLoyaltyDebugLabel(loyalty)}`;
}
