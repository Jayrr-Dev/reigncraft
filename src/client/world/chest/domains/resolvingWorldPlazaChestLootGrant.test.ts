import { DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY } from '@/components/world/chest/domains/definingWorldPlazaChestLootPoolRegistry';
import {
  hashingWorldPlazaChestIdToSeed,
  resolvingWorldPlazaChestLootGrant,
} from '@/components/world/chest/domains/resolvingWorldPlazaChestLootGrant';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaChestLootGrant', () => {
  it('returns the declared item grant', () => {
    const grants = resolvingWorldPlazaChestLootGrant(
      {
        kind: 'item',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
        quantity: 3,
      },
      'chest-demo-1'
    );

    expect(grants).toEqual([
      {
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
        quantity: 3,
      },
    ]);
  });

  it('returns empty grants for non-positive item quantity', () => {
    const grants = resolvingWorldPlazaChestLootGrant(
      {
        kind: 'item',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
        quantity: 0,
      },
      'chest-demo-1'
    );

    expect(grants).toEqual([]);
  });

  it('rolls a deterministic starter-forage pool entry for a chestId', () => {
    const grantsA = resolvingWorldPlazaChestLootGrant(
      { kind: 'pool', poolId: 'starter-forage' },
      'chest-demo-pool-a'
    );
    const grantsB = resolvingWorldPlazaChestLootGrant(
      { kind: 'pool', poolId: 'starter-forage' },
      'chest-demo-pool-a'
    );

    expect(grantsA).toEqual(grantsB);
    expect(grantsA).toHaveLength(1);

    const allowedItemTypeIds = new Set<string>(
      DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY['starter-forage'].map(
        (entry) => entry.itemTypeId
      )
    );

    expect(allowedItemTypeIds.has(grantsA[0]!.itemTypeId)).toBe(true);
    expect(grantsA[0]!.quantity).toBeGreaterThan(0);
  });

  it('rolls a deterministic packs-and-tools pool entry for a chestId', () => {
    const grantsA = resolvingWorldPlazaChestLootGrant(
      { kind: 'pool', poolId: 'packs-and-tools' },
      'chest-demo-packs-a'
    );
    const grantsB = resolvingWorldPlazaChestLootGrant(
      { kind: 'pool', poolId: 'packs-and-tools' },
      'chest-demo-packs-a'
    );

    expect(grantsA).toEqual(grantsB);
    expect(grantsA).toHaveLength(1);

    const allowedItemTypeIds = new Set<string>(
      DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY['packs-and-tools'].map(
        (entry) => entry.itemTypeId
      )
    );

    expect(allowedItemTypeIds.has(grantsA[0]!.itemTypeId)).toBe(true);
    expect(grantsA[0]!.quantity).toBe(1);
  });

  it('can produce different pool rolls for different chest ids', () => {
    const seeds = [
      hashingWorldPlazaChestIdToSeed('chest-a'),
      hashingWorldPlazaChestIdToSeed('chest-b'),
      hashingWorldPlazaChestIdToSeed('chest-c'),
    ];

    expect(new Set(seeds).size).toBeGreaterThan(1);

    const poolItemTypeIds = [
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
    ];

    const rolls = [
      'chest-roll-1',
      'chest-roll-2',
      'chest-roll-3',
      'chest-roll-4',
    ].map(
      (chestId) =>
        resolvingWorldPlazaChestLootGrant(
          { kind: 'pool', poolId: 'starter-forage' },
          chestId
        )[0]?.itemTypeId
    );

    for (const itemTypeId of rolls) {
      expect(poolItemTypeIds).toContain(itemTypeId);
    }
  });

  it('returns empty grants for an unknown pool id', () => {
    const grants = resolvingWorldPlazaChestLootGrant(
      { kind: 'pool', poolId: 'missing-pool' },
      'chest-demo-1'
    );

    expect(grants).toEqual([]);
  });
});
