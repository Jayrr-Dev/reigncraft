import { checkingWorldPlazaGroundItemIsExpired } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemIsExpired';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import {
  clearingWorldPlazaGroundItemOptimisticTracking,
  markingWorldPlazaGroundItemPendingOptimisticDrop,
  markingWorldPlazaGroundItemPendingRemoved,
  mergingWorldPlazaGroundItemsWithPendingOptimistic,
} from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { afterEach, describe, expect, it } from 'vitest';
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
  afterEach(() => {
    clearingWorldPlazaGroundItemOptimisticTracking();
  });

  it('keeps pending optimistic drops that are still within lifetime', () => {
    const nowMs = 10_000;
    const polled = [
      buildingGroundItem({ id: 'polled', spawnedAt: nowMs - 1_000 }),
    ];
    const current = [
      buildingGroundItem({ id: 'polled', spawnedAt: nowMs - 1_000 }),
      buildingGroundItem({ id: 'pending', spawnedAt: nowMs - 500 }),
    ];
    markingWorldPlazaGroundItemPendingOptimisticDrop('pending');

    expect(
      mergingWorldPlazaGroundItemsWithPendingOptimistic(
        polled,
        current,
        nowMs
      ).map((item) => item.id)
    ).toEqual(['polled', 'pending']);
  });

  it('does not resurrect non-pending rows missing from the poll', () => {
    const nowMs = 10_000;
    const polled: DefiningWorldPlazaGroundItem[] = [];
    const current = [
      buildingGroundItem({ id: 'ghost', spawnedAt: nowMs - 500 }),
    ];

    expect(
      mergingWorldPlazaGroundItemsWithPendingOptimistic(polled, current, nowMs)
    ).toEqual([]);
  });

  it('does not resurrect expired optimistic rows after the poll drops them', () => {
    const nowMs = 10_000;
    const expiredSpawnedAt =
      nowMs - WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS;
    const polled: DefiningWorldPlazaGroundItem[] = [];
    const current = [
      buildingGroundItem({ id: 'expired', spawnedAt: expiredSpawnedAt }),
    ];
    markingWorldPlazaGroundItemPendingOptimisticDrop('expired');

    expect(
      mergingWorldPlazaGroundItemsWithPendingOptimistic(polled, current, nowMs)
    ).toEqual([]);
  });

  it('filters pending-removed ids out of a stale poll snapshot', () => {
    const nowMs = 10_000;
    const polled = [
      buildingGroundItem({ id: 'picked', spawnedAt: nowMs - 1_000 }),
      buildingGroundItem({ id: 'other', spawnedAt: nowMs - 1_000 }),
    ];
    markingWorldPlazaGroundItemPendingRemoved('picked');

    expect(
      mergingWorldPlazaGroundItemsWithPendingOptimistic(polled, [], nowMs).map(
        (item) => item.id
      )
    ).toEqual(['other']);
  });

  it('clears pending-removed once the poll confirms the item is gone', () => {
    const nowMs = 10_000;
    markingWorldPlazaGroundItemPendingRemoved('picked');

    expect(
      mergingWorldPlazaGroundItemsWithPendingOptimistic([], [], nowMs)
    ).toEqual([]);

    // A later poll that somehow reintroduces the id should show it again.
    expect(
      mergingWorldPlazaGroundItemsWithPendingOptimistic(
        [buildingGroundItem({ id: 'picked', spawnedAt: nowMs - 100 })],
        [],
        nowMs
      ).map((item) => item.id)
    ).toEqual(['picked']);
  });
});
