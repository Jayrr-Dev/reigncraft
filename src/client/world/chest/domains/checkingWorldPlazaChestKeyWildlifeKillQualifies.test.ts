import { checkingWorldPlazaChestKeyWildlifeKillQualifies } from '@/components/world/chest/domains/checkingWorldPlazaChestKeyWildlifeKillQualifies';
import {
  resettingWorldPlazaChestInstanceStoreForTests,
  upsertingWorldPlazaChestInstanceFromPlacement,
} from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';
import { registeringWorldPlazaChestWildlifeInstancesLookup } from '@/components/world/chest/domains/registeringWorldPlazaChestWildlifeInstancesLookup';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { afterEach, describe, expect, it } from 'vitest';

function creatingWildlifeHealthState(
  baseMaxHealth: number,
  currentHealth: number
) {
  return {
    ...creatingWorldPlazaEntityHealthInitialState(),
    baseMaxHealth,
    maxHealth: baseMaxHealth,
    currentHealth,
  };
}

afterEach(() => {
  resettingWorldPlazaChestInstanceStoreForTests();
  registeringWorldPlazaChestWildlifeInstancesLookup(null);
});

describe('checkingWorldPlazaChestKeyWildlifeKillQualifies', () => {
  it('accepts any kill for generic wildlife chests', () => {
    const store = resettingWorldPlazaChestInstanceStoreForTests();

    upsertingWorldPlazaChestInstanceFromPlacement(
      {
        chestId: 'chest-proc-1-1',
        worldX: 10.5,
        worldY: 10.5,
        facing: 's',
        variant: 'a',
        initialState: 'locked',
        loot: { kind: 'pool', poolId: 'starter-forage' },
        keySource: 'wildlife',
      },
      null,
      store
    );

    expect(
      checkingWorldPlazaChestKeyWildlifeKillQualifies(
        creatingWildlifeTestInstance({
          instanceId: 'wolf-1',
          speciesId: 'grey-wolf',
          position: { x: 100, y: 100, layer: 1 },
          healthState: creatingWildlifeHealthState(40, 0),
          isDead: true,
        })
      )
    ).toBe(true);
  });

  it('requires the assigned species for wildlife-species chests', () => {
    const store = resettingWorldPlazaChestInstanceStoreForTests();

    upsertingWorldPlazaChestInstanceFromPlacement(
      {
        chestId: 'chest-proc-2-2',
        worldX: 20.5,
        worldY: 20.5,
        facing: 's',
        variant: 'a',
        initialState: 'locked',
        loot: { kind: 'pool', poolId: 'starter-forage' },
        keySource: 'wildlife-species',
        keyWildlifeSpeciesId: 'chicken',
      },
      null,
      store
    );

    expect(
      checkingWorldPlazaChestKeyWildlifeKillQualifies(
        creatingWildlifeTestInstance({
          instanceId: 'chicken-1',
          speciesId: 'chicken',
          position: { x: 21, y: 21, layer: 1 },
          healthState: creatingWildlifeHealthState(8, 0),
          isDead: true,
        })
      )
    ).toBe(true);

    expect(
      checkingWorldPlazaChestKeyWildlifeKillQualifies(
        creatingWildlifeTestInstance({
          instanceId: 'wolf-1',
          speciesId: 'grey-wolf',
          position: { x: 21, y: 21, layer: 1 },
          healthState: creatingWildlifeHealthState(40, 0),
          isDead: true,
        })
      )
    ).toBe(false);
  });

  it('requires the killed animal to be strongest near the chest', () => {
    const store = resettingWorldPlazaChestInstanceStoreForTests();

    upsertingWorldPlazaChestInstanceFromPlacement(
      {
        chestId: 'chest-proc-3-3',
        worldX: 30.5,
        worldY: 30.5,
        facing: 's',
        variant: 'a',
        initialState: 'locked',
        loot: { kind: 'pool', poolId: 'starter-forage' },
        keySource: 'wildlife-strongest',
      },
      null,
      store
    );

    registeringWorldPlazaChestWildlifeInstancesLookup(() => [
      creatingWildlifeTestInstance({
        instanceId: 'wolf-live',
        speciesId: 'grey-wolf',
        position: { x: 32, y: 30.5, layer: 1 },
        healthState: creatingWildlifeHealthState(50, 50),
      }),
    ]);

    expect(
      checkingWorldPlazaChestKeyWildlifeKillQualifies(
        creatingWildlifeTestInstance({
          instanceId: 'chicken-kill',
          speciesId: 'chicken',
          position: { x: 31, y: 30.5, layer: 1 },
          healthState: creatingWildlifeHealthState(8, 0),
          isDead: true,
        })
      )
    ).toBe(false);

    registeringWorldPlazaChestWildlifeInstancesLookup(() => []);

    expect(
      checkingWorldPlazaChestKeyWildlifeKillQualifies(
        creatingWildlifeTestInstance({
          instanceId: 'wolf-kill',
          speciesId: 'grey-wolf',
          position: { x: 31, y: 30.5, layer: 1 },
          healthState: creatingWildlifeHealthState(50, 0),
          isDead: true,
        })
      )
    ).toBe(true);
  });
});
