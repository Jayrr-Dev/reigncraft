/**
 * Whether a living companion should keep the overhead Pet / Name? action.
 *
 * @module components/world/wildlife/domains/checkingWildlifeDocilePetProximityActionAvailable
 */

import { checkingWildlifeDocilePetIsReady } from '@/components/world/wildlife/domains/checkingWildlifeDocilePetIsReady';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';

/**
 * Familiar+ namable bonds stay actionable even while Pet is on cooldown.
 * Below Familiar, Pet readiness still gates the overhead prompt.
 */
export function checkingWildlifeDocilePetProximityActionAvailable(
  instance: DefiningWildlifeInstance,
  nowMs: number
): boolean {
  const loyalty = instance.petBond?.loyalty ?? 0;

  if (loyalty > 0 && checkingWildlifePetHasCapability(loyalty, 'namable')) {
    return true;
  }

  return checkingWildlifeDocilePetIsReady(instance, nowMs);
}
