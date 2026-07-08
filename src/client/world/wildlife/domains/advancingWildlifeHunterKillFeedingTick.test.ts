import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { advancingWildlifeHunterKillFeedingTick } from '@/components/world/wildlife/domains/advancingWildlifeHunterKillFeedingTick';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_HUNTER_KILL_FEEDING_DURATION_MS } from '@/components/world/wildlife/domains/definingWildlifeHunterFeedingConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  enqueueingWildlifeEphemeralGroundFoodItem,
  listingWildlifeGroundFoodItems,
} from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import { describe, expect, it } from 'vitest';

function buildingFeedingWolf(nowMs: number): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:wolf:1',
    speciesId: 'grey-wolf',
    anchorId: 'wildlife:wolf:1',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 1.5, y: 2.5, layer: 1 },
    position: { x: 2.4, y: 2.5, layer: 1 },
    facingDirection: 'Right',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.2,
      driveLevel: 'hungry',
      lastFedAtMs: null,
    },
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: {
      intent: { mode: 'idle' },
      facingDirection: 'Right',
      motionClip: 'idle',
      isMoving: false,
      lastThinkAtMs: nowMs,
      wanderTarget: null,
      steeringCache: null,
      lastAttackAtMs: null,
      attackComboIndex: 0,
      howlingUntilMs: null,
      lastHowlAtMs: null,
      jumpState: null,
      lastJumpEndedAtMs: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      fleeTargetPoint: null,
      feedingOnKillUntilMs:
        nowMs + DEFINING_WILDLIFE_HUNTER_KILL_FEEDING_DURATION_MS,
      feedingOnKillGroundItemId: 'meat-1',
    isSleeping: false,
    hasSleepBeenDisturbed: false,
    },
    aggroState: {
      threats: [
        { targetId: 'wildlife:deer:1', threat: 3, lastUpdatedAtMs: nowMs },
      ],
      activeTargetId: 'wildlife:deer:1',
      lastDamagedAtMs: null,
    },
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    floatingTexts: [],
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
  };
}

describe('advancingWildlifeHunterKillFeedingTick', () => {
  it('keeps the hunter on forageEat while the feeding window is active', () => {
    const nowMs = 2_000;
    enqueueingWildlifeEphemeralGroundFoodItem({
      id: 'meat-1',
      itemTypeId: 'world-plaza-raw-deer-meat',
      quantity: 1,
      gridX: 2,
      gridY: 2,
      layer: 1,
      spawnedAt: nowMs,
    });

    const next = advancingWildlifeHunterKillFeedingTick(
      buildingFeedingWolf(nowMs),
      nowMs + 1_000
    );

    expect(next.aiState.intent.mode).toBe('forageEat');
    expect(next.aggroState.activeTargetId).toBeNull();
    expect(listingWildlifeGroundFoodItems()).toHaveLength(1);
  });

  it('releases the hunter once the feeding window expires', () => {
    const nowMs = 2_000;
    enqueueingWildlifeEphemeralGroundFoodItem({
      id: 'meat-1',
      itemTypeId: 'world-plaza-raw-deer-meat',
      quantity: 1,
      gridX: 2,
      gridY: 2,
      layer: 1,
      spawnedAt: nowMs,
    });

    const next = advancingWildlifeHunterKillFeedingTick(
      buildingFeedingWolf(nowMs),
      nowMs + DEFINING_WILDLIFE_HUNTER_KILL_FEEDING_DURATION_MS
    );

    expect(next.aiState.intent.mode).toBe('idle');
    expect(next.aiState.feedingOnKillUntilMs).toBeNull();
    expect(next.aiState.feedingOnKillGroundItemId).toBeNull();
  });
});
