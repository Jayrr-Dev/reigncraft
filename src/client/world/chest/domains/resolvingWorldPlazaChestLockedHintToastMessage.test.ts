import type { DefiningWorldPlazaChestInstance } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import {
  LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_LONG_GRASS,
  LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_SHRUB,
  LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_WILDLIFE,
  LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_WILDLIFE_STRONGEST,
} from '@/components/world/chest/domains/definingWorldPlazaProceduralChestConstants';
import { resolvingWorldPlazaChestLockedHintToastMessage } from '@/components/world/chest/domains/resolvingWorldPlazaChestLockedHintToastMessage';
import { describe, expect, it } from 'vitest';

function creatingChestInstance(
  overrides: Partial<DefiningWorldPlazaChestInstance> = {}
): DefiningWorldPlazaChestInstance {
  return {
    chestId: 'chest-proc-0-0',
    position: { x: 0.5, y: 0.5 },
    facing: 's',
    variant: 'a',
    state: 'locked',
    loot: { kind: 'pool', poolId: 'starter-forage' },
    collisionRadiusGrid: 0.28,
    displayScale: 0.4,
    ...overrides,
  };
}

describe('resolvingWorldPlazaChestLockedHintToastMessage', () => {
  it('maps wildlife key sources to hunt hints', () => {
    expect(
      resolvingWorldPlazaChestLockedHintToastMessage(
        creatingChestInstance({ keySource: 'wildlife' })
      )
    ).toBe(LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_WILDLIFE);

    expect(
      resolvingWorldPlazaChestLockedHintToastMessage(
        creatingChestInstance({ keySource: 'wildlife-strongest' })
      )
    ).toBe(LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_WILDLIFE_STRONGEST);

    expect(
      resolvingWorldPlazaChestLockedHintToastMessage(
        creatingChestInstance({
          keySource: 'wildlife-species',
          keyWildlifeSpeciesId: 'chicken',
        })
      )
    ).toBe('Hunt the Chicken.');
  });

  it('maps forage key sources to pick/search hints', () => {
    expect(
      resolvingWorldPlazaChestLockedHintToastMessage(
        creatingChestInstance({ keySource: 'shrub' })
      )
    ).toBe(LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_SHRUB);

    expect(
      resolvingWorldPlazaChestLockedHintToastMessage(
        creatingChestInstance({ keySource: 'long-grass' })
      )
    ).toBe(LABELING_WORLD_PLAZA_CHEST_LOCKED_HINT_LONG_GRASS);
  });
});
