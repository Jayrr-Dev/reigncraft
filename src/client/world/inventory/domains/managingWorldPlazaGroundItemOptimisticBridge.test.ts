import { checkingWorldPlazaGroundItemIsExpired } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemIsExpired';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { mergingWorldPlazaGroundItemsWithPendingOptimistic } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { describe, expect, it } from 'vitest';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS } from '../../../../shared/worldInventoryDevvit';

function buildingGroundItem(
  overrides: Partial<DefiningWorldPlazaGroundItem> &
    Pick<DefiningWorldPlazaGroundItem, 'id' | 'spawnedAt'>
): DefiningWorldPlazaGroundItem {
  return {
    itemTypeId: 'world-plaza-wood',
    quantity: 1,
    gridX: 0,
    gridY: 0,
    layer: 1,
    ...overrides,
  };
}

describe('checkingWorldPlazaGroundItemIsExpired', () => {
  it('is false before the shared lifetime elapses', () => {
    const spawnedAt = 1_000_000;
    const groundItem = buildingGroundItem({ id: 'fresh', spawnedAt });

    expect(
      checkingWorldPlazaGroundItemIsExpired(
        groundItem,
        spawnedAt + WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS - 1
      )
    ).toBe(false);
  });

  it('is true once the shared lifetime elapses', () => {
    const spawnedAt = 1_000_000;
    const groundItem = buildingGroundItem({ id: 'stale', spawnedAt });

    expect(
      checkingWorldPlazaGroundItemIsExpired(
        groundItem,
        spawnedAt + WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS
      )
    ).toBe(true);
  });
});

describe('mergingWorldPlazaGroundItemsWithPendingOptimistic', () => {
  it('keeps pending optimistic drops that are still within lifetime', () => {
    const nowMs = 10_000;
    const polled = [
      buildingGroundItem({ id: 'polled', spawnedAt: nowMs - 1_000 }),
    ];
    const current = [
      buildingGroundItem({ id: 'polled', spawnedAt: nowMs - 1_000 }),
      buildingGroundItem({ id: 'pending', spawnedAt: nowMs - 500 }),
    ];

    expect(
      mergingWorldPlazaGroundItemsWithPendingOptimistic(
        polled,
        current,
        nowMs
      ).map((item) => item.id)
    ).toEqual(['polled', 'pending']);
  });

  it('does not resurrect expired optimistic rows after the poll drops them', () => {
    const nowMs = 10_000;
    const expiredSpawnedAt =
      nowMs - WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS;
    const polled: DefiningWorldPlazaGroundItem[] = [];
    const current = [
      buildingGroundItem({ id: 'expired', spawnedAt: expiredSpawnedAt }),
    ];

    expect(
      mergingWorldPlazaGroundItemsWithPendingOptimistic(polled, current, nowMs)
    ).toEqual([]);
  });
});
