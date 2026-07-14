/**
 * Grants first-follow Curious loyalty and attaches a provisional pet bond.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetCuriousFollowGrant
 */

import { checkingWildlifeDocileFollowIsActive } from '@/components/world/wildlife/domains/checkingWildlifeDocileFollowIsActive';
import { checkingWildlifeSpeciesIsPettable } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsPettable';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { applyingWildlifePetLoyaltyGrant } from '@/components/world/wildlife/pets/domains/applyingWildlifePetLoyaltyGrant';
import { DEFINING_WILDLIFE_PET_CURIOUS_FOLLOW_LOYALTY_GRANT } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import type { DefiningWildlifePetBondState } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { enqueueingWildlifePetLoyaltyFloatFeedback } from '@/components/world/wildlife/pets/domains/enqueueingWildlifePetLoyaltyFloatFeedback';

export type ApplyingWildlifePetCuriousFollowGrantParams = {
  instance: DefiningWildlifeInstance;
  ownerUserId: string;
  nowMs: number;
};

function creatingWildlifePetProvisionalBond(
  ownerUserId: string,
  loyalty: number
): DefiningWildlifePetBondState {
  return {
    petId: crypto.randomUUID(),
    ownerUserId,
    loyalty,
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

/**
 * Awards Curious (1) loyalty and attaches a provisional pet bond the first
 * time a living pettable animal starts trailing the player. Once a bond
 * already holds loyalty ≥ 1 this is a no-op, so it is safe to call every tick.
 */
export function applyingWildlifePetCuriousFollowGrant({
  instance,
  ownerUserId,
  nowMs,
}: ApplyingWildlifePetCuriousFollowGrantParams): DefiningWildlifeInstance {
  if (
    instance.isDead ||
    !checkingWildlifeSpeciesIsPettable(instance.speciesId)
  ) {
    return instance;
  }

  const isFollowing =
    checkingWildlifeDocileFollowIsActive(instance, nowMs) ||
    instance.aiState.intent.mode === 'followPlayer';

  if (!isFollowing) {
    return instance;
  }

  const currentLoyalty = instance.petBond?.loyalty ?? 0;

  if (instance.petBond && currentLoyalty >= 1) {
    return instance;
  }

  const grant = applyingWildlifePetLoyaltyGrant(
    currentLoyalty,
    DEFINING_WILDLIFE_PET_CURIOUS_FOLLOW_LOYALTY_GRANT,
    { hasNeglectedBadge: instance.petBond?.hasNeglectedBadge === true }
  );

  const nextPetBond =
    instance.petBond ??
    creatingWildlifePetProvisionalBond(ownerUserId, grant.loyalty);

  const withBond: DefiningWildlifeInstance = {
    ...instance,
    petBond: {
      ...nextPetBond,
      ownerUserId,
      loyalty: grant.loyalty,
    },
  };

  return enqueueingWildlifePetLoyaltyFloatFeedback({
    instance: withBond,
    loyaltyPoints: grant.granted,
    nowMs,
  });
}
