/**
 * Marks a companion with a rising paw +N loyalty float after a loyalty grant.
 *
 * @module components/world/wildlife/pets/domains/enqueueingWildlifePetLoyaltyFloatFeedback
 */

import { enqueueingWorldPlazaEntityHealthFloatText } from '@/components/world/health/domains/managingWorldPlazaEntityHealthFloatTexts';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Appends a loyalty float when `loyaltyPoints` is a positive award.
 */
export function enqueueingWildlifePetLoyaltyFloatFeedback({
  instance,
  loyaltyPoints,
  nowMs,
}: {
  instance: DefiningWildlifeInstance;
  loyaltyPoints: number;
  nowMs: number;
}): DefiningWildlifeInstance {
  const awardedLoyaltyPoints = Math.max(0, Math.floor(loyaltyPoints));

  if (awardedLoyaltyPoints <= 0) {
    return instance;
  }

  const enqueueResult = enqueueingWorldPlazaEntityHealthFloatText({
    floats: instance.floatingTexts,
    kind: 'loyalty',
    amount: awardedLoyaltyPoints,
    nowMs,
    outcomeTier: 'normal',
  });

  return {
    ...instance,
    floatingTexts: enqueueResult.floats,
  };
}
