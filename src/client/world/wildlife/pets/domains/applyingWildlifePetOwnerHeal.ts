/**
 * Applies owner-cast healing to a bonded pet and grants loyalty.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetOwnerHeal
 */

import { healingWorldPlazaEntityHealthWithAmplifiers } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  applyingWildlifePetLoyaltyGrant,
  type ApplyingWildlifePetLoyaltyGrantResult,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetLoyaltyGrant';
import { computingWildlifePetLoyaltyFromRestoredPoints } from '@/components/world/wildlife/pets/domains/computingWildlifePetLoyaltyFromRestoredPoints';
import { enqueueingWildlifePetLoyaltyFloatFeedback } from '@/components/world/wildlife/pets/domains/enqueueingWildlifePetLoyaltyFloatFeedback';

export type ApplyingWildlifePetOwnerHealParams = {
  instance: DefiningWildlifeInstance;
  healAmount: number;
  nowMs: number;
};

export type ApplyingWildlifePetOwnerHealResult = {
  instance: DefiningWildlifeInstance;
  restoredHealth: number;
  loyaltyGrant: ApplyingWildlifePetLoyaltyGrantResult | null;
};

/**
 * Heals a companion through the standard amplifier pipeline and grants
 * loyalty scaled by the actual HP restored (not the requested amount).
 */
export function applyingWildlifePetOwnerHeal({
  instance,
  healAmount,
  nowMs,
}: ApplyingWildlifePetOwnerHealParams): ApplyingWildlifePetOwnerHealResult {
  const beforeHealth = instance.healthState.currentHealth;
  const { state: healedHealthState } =
    healingWorldPlazaEntityHealthWithAmplifiers({
      receiverState: instance.healthState,
      baseHealAmount: healAmount,
      nowMs,
    });
  const restoredHealth = Math.max(
    0,
    healedHealthState.currentHealth - beforeHealth
  );
  const nextInstance: DefiningWildlifeInstance = {
    ...instance,
    healthState: healedHealthState,
  };

  const petBond = instance.petBond;

  if (!petBond || restoredHealth <= 0) {
    return { instance: nextInstance, restoredHealth, loyaltyGrant: null };
  }

  const loyaltyPoints =
    computingWildlifePetLoyaltyFromRestoredPoints(restoredHealth);
  const loyaltyGrant = applyingWildlifePetLoyaltyGrant(
    petBond.loyalty,
    loyaltyPoints,
    { hasNeglectedBadge: petBond.hasNeglectedBadge === true }
  );

  const withBond: DefiningWildlifeInstance = {
    ...nextInstance,
    petBond: { ...petBond, loyalty: loyaltyGrant.loyalty },
  };

  return {
    instance: enqueueingWildlifePetLoyaltyFloatFeedback({
      instance: withBond,
      loyaltyPoints: loyaltyGrant.granted,
      nowMs,
    }),
    restoredHealth,
    loyaltyGrant,
  };
}
