/**
 * Applies loyalty gained from one successful Pet interaction.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetPettingLoyalty
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  applyingWildlifePetLoyaltyGrant,
  type ApplyingWildlifePetLoyaltyGrantResult,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetLoyaltyGrant';
import { DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import type { DefiningWildlifePetBondState } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';

export type ApplyingWildlifePetPettingLoyaltyParams = {
  instance: DefiningWildlifeInstance;
  ownerUserId: string;
  nowMs: number;
};

export type ApplyingWildlifePetPettingLoyaltyResult = {
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

/**
 * Awards {@link DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT} loyalty for one
 * completed Pet, creating the bond if this is the animal's first pet, and
 * flips `isPersistent` on once loyalty crosses the Familiar threshold.
 */
export function applyingWildlifePetPettingLoyalty({
  instance,
  ownerUserId,
  nowMs,
}: ApplyingWildlifePetPettingLoyaltyParams): ApplyingWildlifePetPettingLoyaltyResult {
  const currentPetBond =
    instance.petBond ?? creatingWildlifePetProvisionalBond(ownerUserId);
  const loyaltyResult = applyingWildlifePetLoyaltyGrant(
    currentPetBond.loyalty,
    DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT
  );
  const wasPersistent = currentPetBond.isPersistent;
  const isPersistentNow =
    wasPersistent ||
    checkingWildlifePetHasCapability(loyaltyResult.loyalty, 'persistent');
  const becamePersistent = !wasPersistent && isPersistentNow;

  return {
    instance: {
      ...instance,
      petBond: {
        ...currentPetBond,
        ownerUserId,
        loyalty: loyaltyResult.loyalty,
        isPersistent: isPersistentNow,
      },
    },
    loyaltyResult,
    becamePersistent,
  };
}
