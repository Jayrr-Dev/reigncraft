import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import type { DefiningWildlifePetPersistedRecord } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import {
  readingWildlifePetRosterSnapshot,
  resettingWildlifePetRosterStoreForTests,
  upsertingWildlifePetRecord,
} from '@/components/world/wildlife/pets/domains/managingWildlifePetRosterStore';
import { syncingWildlifePetInstanceVitalsToRoster } from '@/components/world/wildlife/pets/domains/syncingWildlifePetBondToRoster';
import { afterEach, describe, expect, it } from 'vitest';

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
    lastKnownX: 10,
    lastKnownY: 20,
    lastKnownLayer: 1,
    deathCauseKind: null,
    acquiredAtMs: 1_000,
    updatedAtMs: 2_000,
    ...overrides,
  };
}

describe('syncingWildlifePetInstanceVitalsToRoster', () => {
  afterEach(() => {
    resettingWildlifePetRosterStoreForTests();
  });

  it('does not bump updatedAtMs when vitals are unchanged', () => {
    upsertingWildlifePetRecord(buildingRosterRecord());

    const instance = creatingWildlifeTestInstance({
      position: { x: 10, y: 20, layer: 1 },
      healthState: {
        ...creatingWildlifeTestInstance().healthState,
        currentHealth: 295,
        baseMaxHealth: 295,
      },
      hungerState: {
        ...creatingWildlifeTestInstance().hungerState,
        hungerRatio: 0.88,
      },
      staminaState: {
        ...creatingWildlifeTestInstance().staminaState,
        staminaRatio: 1,
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

    syncingWildlifePetInstanceVitalsToRoster(instance, 9_999);

    expect(readingWildlifePetRosterSnapshot().pets[0]?.updatedAtMs).toBe(2_000);
  });

  it('writes when health changes', () => {
    upsertingWildlifePetRecord(buildingRosterRecord());

    const instance = creatingWildlifeTestInstance({
      position: { x: 10, y: 20, layer: 1 },
      healthState: {
        ...creatingWildlifeTestInstance().healthState,
        currentHealth: 40,
        baseMaxHealth: 295,
      },
      hungerState: {
        ...creatingWildlifeTestInstance().hungerState,
        hungerRatio: 0.88,
      },
      staminaState: {
        ...creatingWildlifeTestInstance().staminaState,
        staminaRatio: 1,
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

    syncingWildlifePetInstanceVitalsToRoster(instance, 9_999);

    const record = readingWildlifePetRosterSnapshot().pets[0];
    expect(record?.healthCurrent).toBe(40);
    expect(record?.updatedAtMs).toBe(9_999);
  });
});
