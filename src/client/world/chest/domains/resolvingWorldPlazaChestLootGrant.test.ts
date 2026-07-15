import {
  DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY,
  DEFINING_WORLD_PLAZA_CHEST_MID_UNIQUE_MIN_DISTANCE_FROM_ORIGIN_TILES,
} from '@/components/world/chest/domains/definingWorldPlazaChestLootPoolRegistry';
import {
  hashingWorldPlazaChestIdToSeed,
  resolvingWorldPlazaChestLootGrant,
} from '@/components/world/chest/domains/resolvingWorldPlazaChestLootGrant';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
  DEFINING_WORLD_PLAZA_MID_UNIQUE_WEAPON_ITEM_TYPE_IDS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

const MID_UNIQUE_ITEM_TYPE_IDS = new Set<string>(
  DEFINING_WORLD_PLAZA_MID_UNIQUE_WEAPON_ITEM_TYPE_IDS
);

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
      'chest-demo-packs-a',
      { worldX: 0, worldY: 0 }
    );
    const grantsB = resolvingWorldPlazaChestLootGrant(
      { kind: 'pool', poolId: 'packs-and-tools' },
      'chest-demo-packs-a',
      { worldX: 0, worldY: 0 }
    );

    expect(grantsA).toEqual(grantsB);
    expect(grantsA).toHaveLength(1);

    const allowedItemTypeIds = new Set<string>(
      DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY['packs-and-tools']
        .filter((entry) => entry.minDistanceFromOriginTiles === undefined)
        .map((entry) => entry.itemTypeId)
    );

    expect(allowedItemTypeIds.has(grantsA[0]!.itemTypeId)).toBe(true);
    expect(grantsA[0]!.quantity).toBe(1);
  });

  it('never grants mid unique weapons near origin', () => {
    const nearOrigin = { worldX: 0, worldY: 0 };
    const justInside = {
      worldX:
        DEFINING_WORLD_PLAZA_CHEST_MID_UNIQUE_MIN_DISTANCE_FROM_ORIGIN_TILES -
        1,
      worldY: 0,
    };

    for (let index = 0; index < 200; index += 1) {
      const chestId = `chest-near-origin-${index}`;
      const nearGrant = resolvingWorldPlazaChestLootGrant(
        { kind: 'pool', poolId: 'packs-and-tools' },
        chestId,
        nearOrigin
      )[0];
      const insideGrant = resolvingWorldPlazaChestLootGrant(
        { kind: 'pool', poolId: 'packs-and-tools' },
        chestId,
        justInside
      )[0];

      expect(MID_UNIQUE_ITEM_TYPE_IDS.has(nearGrant?.itemTypeId ?? '')).toBe(
        false
      );
      expect(MID_UNIQUE_ITEM_TYPE_IDS.has(insideGrant?.itemTypeId ?? '')).toBe(
        false
      );
    }
  });

  it('can grant mid unique weapons at or past the distance gate', () => {
    const farOrigin = {
      worldX:
        DEFINING_WORLD_PLAZA_CHEST_MID_UNIQUE_MIN_DISTANCE_FROM_ORIGIN_TILES,
      worldY: 0,
    };
    let sawMidUnique = false;

    for (let index = 0; index < 2000; index += 1) {
      const grant = resolvingWorldPlazaChestLootGrant(
        { kind: 'pool', poolId: 'packs-and-tools' },
        `chest-far-origin-${index}`,
        farOrigin
      )[0];

      if (grant && MID_UNIQUE_ITEM_TYPE_IDS.has(grant.itemTypeId)) {
        sawMidUnique = true;
        break;
      }
    }

    expect(sawMidUnique).toBe(true);
  });

  it('returns empty mid-unique-weapons grants inside the distance gate', () => {
    const grants = resolvingWorldPlazaChestLootGrant(
      { kind: 'pool', poolId: 'mid-unique-weapons' },
      'chest-mid-unique-near',
      { worldX: 0, worldY: 0 }
    );

    expect(grants).toEqual([]);
  });

  it('grants from mid-unique-weapons past the distance gate', () => {
    const grants = resolvingWorldPlazaChestLootGrant(
      { kind: 'pool', poolId: 'mid-unique-weapons' },
      'chest-mid-unique-far',
      {
        worldX:
          DEFINING_WORLD_PLAZA_CHEST_MID_UNIQUE_MIN_DISTANCE_FROM_ORIGIN_TILES,
        worldY: 0,
      }
    );

    expect(grants).toHaveLength(1);
    expect(MID_UNIQUE_ITEM_TYPE_IDS.has(grants[0]!.itemTypeId)).toBe(true);
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
