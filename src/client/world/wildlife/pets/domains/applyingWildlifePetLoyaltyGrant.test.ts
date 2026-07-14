import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { applyingWildlifePetLoyaltyGrant } from '@/components/world/wildlife/pets/domains/applyingWildlifePetLoyaltyGrant';
import { applyingWildlifePetSoulsave } from '@/components/world/wildlife/pets/domains/applyingWildlifePetSoulsave';
import { computingWildlifePetLoyaltyFromRestoredPoints } from '@/components/world/wildlife/pets/domains/computingWildlifePetLoyaltyFromRestoredPoints';
import {
  DEFINING_WILDLIFE_PET_MAX_LOYALTY,
  DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';
import { parsingWildlifePetRoster } from '@/components/world/wildlife/pets/domains/serializingWildlifePetRoster';
import { describe, expect, it } from 'vitest';

describe('wildlife pet loyalty', () => {
  it('grants curious on first point and unlocks familiar at 50', () => {
    const curious = applyingWildlifePetLoyaltyGrant(0, 1);
    expect(curious.loyalty).toBe(1);
    expect(curious.didUnlockTier).toBe(true);
    expect(curious.nextTierId).toBe('curious');

    const afterPet = applyingWildlifePetLoyaltyGrant(
      1,
      DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT
    );
    expect(afterPet.loyalty).toBe(18);
    expect(
      checkingWildlifePetHasCapability(afterPet.loyalty, 'pettingLoyalty')
    ).toBe(true);

    const familiar = applyingWildlifePetLoyaltyGrant(49, 1);
    expect(familiar.loyalty).toBe(50);
    expect(familiar.nextTierId).toBe('familiar');
    expect(checkingWildlifePetHasCapability(50, 'persistent')).toBe(true);
    expect(checkingWildlifePetHasCapability(50, 'allied')).toBe(true);
  });

  it('computes feed/heal loyalty from restored points', () => {
    expect(computingWildlifePetLoyaltyFromRestoredPoints(0)).toBe(0);
    expect(computingWildlifePetLoyaltyFromRestoredPoints(16)).toBe(4);
    expect(computingWildlifePetLoyaltyFromRestoredPoints(20)).toBe(4);
  });

  it('clamps loyalty at max', () => {
    const result = applyingWildlifePetLoyaltyGrant(
      DEFINING_WILDLIFE_PET_MAX_LOYALTY - 1,
      50
    );
    expect(result.loyalty).toBe(DEFINING_WILDLIFE_PET_MAX_LOYALTY);
    expect(result.nextTierId).toBe('bonded');
  });
});

describe('parsingWildlifePetRoster', () => {
  it('keeps valid pets and drops malformed rows', () => {
    const result = parsingWildlifePetRoster({
      activePetId: 'pet-a',
      pets: [
        {
          petId: 'pet-a',
          speciesId: 'cat-orange',
          displayName: 'Miso',
          loyalty: 112,
          isActive: true,
          command: 'follow',
          healthCurrent: 40,
          hungerRatio: 0.8,
          staminaRatio: 1,
          sizeScaleSample: 0,
          aggressionLevel: 'tame',
          weaponItem: null,
          armorItem: null,
          learnedSkillIds: [],
          equippedSkillId: null,
          soulsaveConsumed: false,
          lastKnownX: 1,
          lastKnownY: 2,
          lastKnownLayer: 1,
          deathCauseKind: null,
          acquiredAtMs: 1,
          updatedAtMs: 2,
        },
        { petId: '', speciesId: 'husky' },
      ],
    });

    expect(result.roster.pets).toHaveLength(1);
    expect(result.roster.activePetId).toBe('pet-a');
    expect(result.droppedPetCount).toBe(1);
  });
});

describe('applyingWildlifePetSoulsave', () => {
  it('intercepts fatal damage once for bonded pets', () => {
    const instance = creatingWildlifeTestInstance({
      instanceId: 'wildlife:pet:bonded',
      speciesId: 'golden-retriever',
      isDead: true,
      healthState: {
        ...creatingWildlifeTestInstance().healthState,
        currentHealth: 0,
      },
      petBond: {
        petId: 'bonded',
        ownerUserId: 'player-1',
        loyalty: 1000,
        command: 'follow',
        learnedSkillIds: [],
        equippedSkillId: null,
        soulsaveConsumed: false,
        weaponItem: null,
        armorItem: null,
        isPersistent: true,
        stayPoint: null,
      },
    });

    const first = applyingWildlifePetSoulsave({
      instance,
      nowMs: 1_000,
    });
    expect(first.intercepted).toBe(true);
    if (!first.intercepted) {
      return;
    }
    expect(first.instance.isDead).toBe(false);
    expect(first.instance.petBond?.soulsaveConsumed).toBe(true);

    const second = applyingWildlifePetSoulsave({
      instance: first.instance,
      nowMs: 2_000,
    });
    expect(second.intercepted).toBe(false);
  });
});
