/**
 * Applies owner-fed hunger restore to a bonded pet and grants loyalty.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetOwnerFeed
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeHungerState,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  applyingWildlifePetLoyaltyGrant,
  type ApplyingWildlifePetLoyaltyGrantResult,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetLoyaltyGrant';
import { computingWildlifePetLoyaltyFromRestoredPoints } from '@/components/world/wildlife/pets/domains/computingWildlifePetLoyaltyFromRestoredPoints';
import { enqueueingWildlifePetLoyaltyFloatFeedback } from '@/components/world/wildlife/pets/domains/enqueueingWildlifePetLoyaltyFloatFeedback';

export type ApplyingWildlifePetOwnerFeedParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  /** Hunger ratio (0..1) restored by the fed item. */
  hungerRestoreRatio: number;
  nowMs: number;
};

export type ApplyingWildlifePetOwnerFeedResult = {
  instance: DefiningWildlifeInstance;
  loyaltyGrant: ApplyingWildlifePetLoyaltyGrantResult | null;
};

function clampingHungerRatio(ratio: number): number {
  return Math.min(1, Math.max(0, ratio));
}

function resolvingWildlifeHungerDriveLevel(
  hungerRatio: number,
  species: DefiningWildlifeSpeciesDefinition
): DefiningWildlifeHungerState['driveLevel'] {
  if (hungerRatio <= species.hunger.starvingThreshold) {
    return 'starving';
  }

  if (hungerRatio <= species.hunger.hungryThreshold) {
    return 'hungry';
  }

  if (hungerRatio <= species.hunger.peckishThreshold) {
    return 'peckish';
  }

  return 'sated';
}

/**
 * Restores hunger from an owner-fed item and grants loyalty scaled by how
 * many hunger points (ratio × 100) were actually restored.
 */
export function applyingWildlifePetOwnerFeed({
  instance,
  species,
  hungerRestoreRatio,
  nowMs,
}: ApplyingWildlifePetOwnerFeedParams): ApplyingWildlifePetOwnerFeedResult {
  const beforeRatio = instance.hungerState.hungerRatio;
  const afterRatio = clampingHungerRatio(
    beforeRatio + Math.max(0, hungerRestoreRatio)
  );
  const nextHungerState: DefiningWildlifeHungerState = {
    hungerRatio: afterRatio,
    driveLevel: resolvingWildlifeHungerDriveLevel(afterRatio, species),
    lastFedAtMs: nowMs,
  };
  const nextInstance: DefiningWildlifeInstance = {
    ...instance,
    hungerState: nextHungerState,
  };

  const petBond = instance.petBond;
  const restoredPoints = Math.max(0, (afterRatio - beforeRatio) * 100);

  if (!petBond || restoredPoints <= 0) {
    return { instance: nextInstance, loyaltyGrant: null };
  }

  const loyaltyPoints =
    computingWildlifePetLoyaltyFromRestoredPoints(restoredPoints);
  const loyaltyGrant = applyingWildlifePetLoyaltyGrant(
    petBond.loyalty,
    loyaltyPoints,
    { hasNeglectedBadge: petBond.hasNeglectedBadge === true }
  );

  const withBond: DefiningWildlifeInstance = {
    ...nextInstance,
    petBond: {
      ...petBond,
      loyalty: loyaltyGrant.loyalty,
      // Owner feed clears the lasting Neglected stigma.
      hasNeglectedBadge: false,
      // Fed pets stop the forage abandon and can resume commands next tick.
      isNeglectHunting: false,
      neglectAbandonAtMs: null,
    },
  };

  return {
    instance: enqueueingWildlifePetLoyaltyFloatFeedback({
      instance: withBond,
      loyaltyPoints: loyaltyGrant.granted,
      nowMs,
    }),
    loyaltyGrant,
  };
}
