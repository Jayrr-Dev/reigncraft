import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import {
  consumingWildlifeGroundFoodBridgeUnit,
  enqueueingWildlifeEphemeralGroundFoodItem,
  registeringWildlifeGroundFoodBridge,
} from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import { afterEach, describe, expect, it, vi } from 'vitest';

const ephemeralMeat: DefiningWorldPlazaGroundItem = {
  id: 'meat-ephemeral',
  itemTypeId: 'world-plaza-raw-deer-meat',
  quantity: 1,
  gridX: 2,
  gridY: 2,
  layer: 1,
  spawnedAt: 1_000,
};

const persistedMeat: DefiningWorldPlazaGroundItem = {
  ...ephemeralMeat,
  id: 'meat-persisted',
};

afterEach(() => {
  registeringWildlifeGroundFoodBridge(null);
});

describe('consumingWildlifeGroundFoodBridgeUnit', () => {
  it('consumes ephemeral-only meat without calling the persisted bridge', () => {
    enqueueingWildlifeEphemeralGroundFoodItem(ephemeralMeat);
    const consumePersisted = vi.fn(() => true);

    registeringWildlifeGroundFoodBridge({
      listGroundItems: () => [],
      consumeGroundFoodUnit: consumePersisted,
    });

    const consumed = consumingWildlifeGroundFoodBridgeUnit('meat-ephemeral', {
      x: 2.4,
      y: 2.5,
      layer: 1,
    });

    expect(consumed).toBe(true);
    expect(consumePersisted).not.toHaveBeenCalled();
  });

  it('routes persisted meat through the bridge instead of the ephemeral store', () => {
    enqueueingWildlifeEphemeralGroundFoodItem(ephemeralMeat);
    const consumePersisted = vi.fn(() => true);

    registeringWildlifeGroundFoodBridge({
      listGroundItems: () => [persistedMeat],
      consumeGroundFoodUnit: consumePersisted,
    });

    const consumed = consumingWildlifeGroundFoodBridgeUnit('meat-persisted', {
      x: 2.4,
      y: 2.5,
      layer: 1,
    });

    expect(consumed).toBe(true);
    expect(consumePersisted).toHaveBeenCalledWith('meat-persisted', {
      x: 2.4,
      y: 2.5,
      layer: 1,
    });
  });

  it('mirrors persisted consume into the ephemeral store when ids match', () => {
    enqueueingWildlifeEphemeralGroundFoodItem(persistedMeat);
    const consumePersisted = vi.fn(() => true);

    registeringWildlifeGroundFoodBridge({
      listGroundItems: () => [persistedMeat],
      consumeGroundFoodUnit: consumePersisted,
    });

    expect(
      consumingWildlifeGroundFoodBridgeUnit('meat-persisted', {
        x: 2.4,
        y: 2.5,
        layer: 1,
      })
    ).toBe(true);

    registeringWildlifeGroundFoodBridge({
      listGroundItems: () => [],
      consumeGroundFoodUnit: consumePersisted,
    });

    expect(
      consumingWildlifeGroundFoodBridgeUnit('meat-persisted', {
        x: 2.4,
        y: 2.5,
        layer: 1,
      })
    ).toBe(false);
  });
});
