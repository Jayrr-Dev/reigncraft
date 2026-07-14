/**
 * Dev-only loyalty grants for the nearest pettable companion.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetDevLoyaltyGrant
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  applyingWildlifePetLoyaltyGrant,
  type ApplyingWildlifePetLoyaltyGrantResult,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetLoyaltyGrant';
import { DEFINING_WILDLIFE_PET_MAX_LOYALTY } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import type { DefiningWildlifePetBondState } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { enqueueingWildlifePetLoyaltyFloatFeedback } from '@/components/world/wildlife/pets/domains/enqueueingWildlifePetLoyaltyFloatFeedback';
import {
  checkingWildlifePetHasCapability,
  resolvingWildlifePetNextTier,
} from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';

export type ApplyingWildlifePetDevLoyaltyGrantKind =
  | { kind: 'add'; amount: number }
  | { kind: 'next-tier' }
  | { kind: 'max' };

export type ApplyingWildlifePetDevLoyaltyGrantParams = {
  instance: DefiningWildlifeInstance;
  ownerUserId: string;
  grant: ApplyingWildlifePetDevLoyaltyGrantKind;
  nowMs: number;
};

export type ApplyingWildlifePetDevLoyaltyGrantResult = {
  instance: DefiningWildlifeInstance;
  loyaltyResult: ApplyingWildlifePetLoyaltyGrantResult;
  becamePersistent: boolean;
};

function creatingWildlifePetProvisionalBond(
  ownerUserId: string
): DefiningWildlifePetBondState {
  return {
    petId: crypto.randomUUID(),
    ownerUserId,
    loyalty: 0,
    command: 'follow',
    learnedSkillIds: [],
    equippedSkillId: null,
    soulsaveConsumed: false,
    weaponItem: null,
    armorItem: null,
    isPersistent: false,
    stayPoint: null,
  };
}

function resolvingWildlifePetDevLoyaltyDelta(
  currentLoyalty: number,
  grant: ApplyingWildlifePetDevLoyaltyGrantKind
): number {
  if (grant.kind === 'max') {
    return DEFINING_WILDLIFE_PET_MAX_LOYALTY - currentLoyalty;
  }

  if (grant.kind === 'add') {
    return grant.amount;
  }

  const nextTier = resolvingWildlifePetNextTier(currentLoyalty);

  if (!nextTier) {
    return DEFINING_WILDLIFE_PET_MAX_LOYALTY - currentLoyalty;
  }

  return nextTier.loyaltyRemaining;
}

/**
 * Applies a QA loyalty grant, creating a provisional bond when needed.
 */
export function applyingWildlifePetDevLoyaltyGrant({
  instance,
  ownerUserId,
  grant,
  nowMs,
}: ApplyingWildlifePetDevLoyaltyGrantParams): ApplyingWildlifePetDevLoyaltyGrantResult {
  const currentPetBond =
    instance.petBond ?? creatingWildlifePetProvisionalBond(ownerUserId);
  const delta = resolvingWildlifePetDevLoyaltyDelta(
    currentPetBond.loyalty,
    grant
  );
  const loyaltyResult = applyingWildlifePetLoyaltyGrant(
    currentPetBond.loyalty,
    delta,
    { hasNeglectedBadge: currentPetBond.hasNeglectedBadge === true }
  );
  const wasPersistent = currentPetBond.isPersistent;
  const isPersistentNow =
    wasPersistent ||
    checkingWildlifePetHasCapability(loyaltyResult.loyalty, 'persistent');
  const becamePersistent = !wasPersistent && isPersistentNow;

  const withBond: DefiningWildlifeInstance = {
    ...instance,
    petBond: {
      ...currentPetBond,
      ownerUserId,
      loyalty: loyaltyResult.loyalty,
      isPersistent: isPersistentNow,
    },
  };

  return {
    instance: enqueueingWildlifePetLoyaltyFloatFeedback({
      instance: withBond,
      loyaltyPoints: loyaltyResult.granted,
      nowMs,
    }),
    loyaltyResult,
    becamePersistent,
  };
}
