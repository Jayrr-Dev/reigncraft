import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import type { DefiningWildlifePetPersistedRecord } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { resolvingWildlifePetRosterRecordWithLiveVitals } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetRosterPetsWithLiveVitals';
import { describe, expect, it } from 'vitest';

function buildingRosterRecord(
  overrides: Partial<DefiningWildlifePetPersistedRecord> = {}
): DefiningWildlifePetPersistedRecord {
  return {
    petId: 'pet-a',
    speciesId: 'shepherd-dog',
    displayName: 'Shepard',
    loyalty: 100,
    isActive: true,
    command: 'follow',
    healthCurrent: 295,
    hungerRatio: 0.88,
    staminaRatio: 1,
    sizeScaleSample: 1,
    aggressionLevel: 'normal',
    weaponItem: null,
    armorItem: null,
    learnedSkillIds: [],
    equippedSkillId: null,
    soulsaveConsumed: false,
    hasNeglectedBadge: false,
    isNeglectHunting: false,
    spritcoreUpgrades: {
      bonusMaxHealth: 0,
      bonusAttackPower: 0,
      bonusAttackSpeed: 0,
      bonusDefense: 0,
      bonusMoveSpeed: 0,
      totalSpritcoreInvested: 0,
    },
    lastKnownX: 1,
    lastKnownY: 2,
    lastKnownLayer: 1,
    deathCauseKind: null,
    acquiredAtMs: 1_000,
    updatedAtMs: 2_000,
    ...overrides,
  };
}

describe('resolvingWildlifePetRosterRecordWithLiveVitals', () => {
  it('overlays live health onto a living roster row', () => {
    const instance = creatingWildlifeTestInstance({
      healthState: {
        ...creatingWildlifeTestInstance().healthState,
        currentHealth: 40,
        baseMaxHealth: 295,
      },
      petBond: {
        petId: 'pet-a',
        ownerUserId: 'player-1',
        loyalty: 100,
        command: 'follow',
        learnedSkillIds: [],
        equippedSkillId: null,
        soulsaveConsumed: false,
        weaponItem: null,
        armorItem: null,
        isPersistent: true,
      },
    });

    const next = resolvingWildlifePetRosterRecordWithLiveVitals(
      buildingRosterRecord(),
      instance
    );

    expect(next.healthCurrent).toBe(40);
    expect(next.isActive).toBe(true);
    expect(next.deathCauseKind).toBeNull();
  });

  it('forces deceased display when the live instance is dead', () => {
    const alive = creatingWildlifeTestInstance();
    const instance = creatingWildlifeTestInstance({
      isDead: true,
      diedAtMs: 9_000,
      healthState: {
        ...alive.healthState,
        currentHealth: 0,
        lastDamageKind: 'physical',
      },
      petBond: {
        petId: 'pet-a',
        ownerUserId: 'player-1',
        loyalty: 100,
        command: 'follow',
        learnedSkillIds: [],
        equippedSkillId: null,
        soulsaveConsumed: false,
        weaponItem: null,
        armorItem: null,
        isPersistent: true,
      },
    });

    const next = resolvingWildlifePetRosterRecordWithLiveVitals(
      buildingRosterRecord(),
      instance
    );

    expect(next.healthCurrent).toBe(0);
    expect(next.isActive).toBe(false);
    expect(next.deathCauseKind).toBe('physical');
  });

  it('leaves already-deceased roster rows unchanged', () => {
    const record = buildingRosterRecord({
      healthCurrent: 0,
      isActive: false,
      deathCauseKind: 'lava',
    });
    const next = resolvingWildlifePetRosterRecordWithLiveVitals(
      record,
      creatingWildlifeTestInstance({ isDead: true })
    );

    expect(next).toBe(record);
  });
});
