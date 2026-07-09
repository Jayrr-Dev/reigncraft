import { applyingWildlifeMealTheftAggroForGroundItem } from '@/components/world/wildlife/domains/applyingWildlifeMealTheftAggroForGroundItem';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import {
  creatingWildlifeInstanceStore,
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { describe, expect, it } from 'vitest';

describe('applyingWildlifeMealTheftAggroForGroundItem', () => {
  it('locks eaters onto the player and clears the feed lock', () => {
    const store = creatingWildlifeInstanceStore();
    const eater = creatingWildlifeTestInstance({
      instanceId: 'wildlife:wolf:1',
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        intent: {
          mode: 'forageEat',
          targetGroundItemId: 'meat-1',
          targetPoint: { x: 2.5, y: 2.5, layer: 1 },
        },
        pendingGroundFoodBite: {
          groundItemId: 'meat-1',
          startedAtMs: 1_000,
          readyAtMs: 8_000,
        },
        feedingOnKillUntilMs: 11_000,
        feedingOnKillGroundItemId: 'meat-1',
      },
    });
    replacingWildlifeInstance(store, eater);

    const aggroedCount = applyingWildlifeMealTheftAggroForGroundItem({
      store,
      groundItemId: 'meat-1',
      playerTargetId: 'player-1',
      nowMs: 5_000,
    });

    expect(aggroedCount).toBe(1);
    const next = listingWildlifeInstances(store)[0];
    expect(next?.aggroState.activeTargetId).toBe('player-1');
    expect(next?.aiState.feedingOnKillUntilMs).toBeNull();
    expect(next?.aiState.pendingGroundFoodBite).toBeNull();
    expect(next?.aiState.intent.mode).toBe('chase');
  });

  it('ignores animals eating a different stack', () => {
    const store = creatingWildlifeInstanceStore();
    replacingWildlifeInstance(
      store,
      creatingWildlifeTestInstance({
        instanceId: 'wildlife:wolf:1',
        aiState: {
          ...creatingWildlifeTestInstance().aiState,
          intent: {
            mode: 'forageEat',
            targetGroundItemId: 'meat-other',
            targetPoint: { x: 2.5, y: 2.5, layer: 1 },
          },
        },
      })
    );

    expect(
      applyingWildlifeMealTheftAggroForGroundItem({
        store,
        groundItemId: 'meat-1',
        playerTargetId: 'player-1',
        nowMs: 5_000,
      })
    ).toBe(0);
  });
});
