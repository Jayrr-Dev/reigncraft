import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  creatingWildlifeInstanceStore,
  replacingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  resolvingWildlifeGroundFoodEatProgressByItemId,
  type ResolvingWildlifeGroundFoodEatProgress,
} from '@/components/world/wildlife/domains/resolvingWildlifeGroundFoodEatProgressByItemId';
import { describe, expect, it } from 'vitest';

function buildingEatingInstance(
  overrides: Partial<DefiningWildlifeInstance> &
    Pick<DefiningWildlifeInstance, 'instanceId'>
): DefiningWildlifeInstance {
  const nowMs = 5_000;

  return {
    speciesId: 'grey-wolf',
    anchorId: overrides.instanceId,
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
      intent: {
        mode: 'forageEat',
        targetGroundItemId: 'meat-1',
        targetPoint: { x: 2.5, y: 2.5, layer: 1 },
      },
      facingDirection: 'Right',
      motionClip: 'idle',
      isMoving: false,
      lastThinkAtMs: nowMs,
      wanderTarget: null,
      steeringCache: null,
      lastAttackAtMs: nowMs,
      attackComboIndex: 0,
      howlingUntilMs: null,
      lastHowlAtMs: null,
      jumpState: null,
      lastJumpEndedAtMs: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      hasUsedBluffCharge: false,
      bluffChargePlayerExitedTerritory: false,
      bluffReturnPoint: null,
      fleeTargetPoint: null,
      pendingGroundFoodBite: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      isSleeping: false,
      hasSleepBeenDisturbed: false,
      hasPlayerSleepBumpContact: false,
      docileFollowUntilMs: null,
      docileLastReactAtMs: null,
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    hasBeenStudied: false,
    floatingTexts: [],
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
    ...overrides,
  };
}

describe('resolvingWildlifeGroundFoodEatProgressByItemId', () => {
  it('returns inactive when no animal is eating the stack', () => {
    const store = creatingWildlifeInstanceStore();

    expect(
      resolvingWildlifeGroundFoodEatProgressByItemId(store, 'meat-1', 5_000)
    ).toEqual<ResolvingWildlifeGroundFoodEatProgress>({
      isActive: false,
      progressRatio: 0,
    });
  });

  it('returns chew-timer progress for a forageEat animal', () => {
    const store: ManagingWildlifeInstanceStore =
      creatingWildlifeInstanceStore();
    replacingWildlifeInstance(
      store,
      buildingEatingInstance({
        instanceId: 'wildlife:wolf:1',
        aiState: {
          ...buildingEatingInstance({ instanceId: 'wildlife:wolf:1' }).aiState,
          pendingGroundFoodBite: {
            groundItemId: 'meat-1',
            startedAtMs: 5_000,
            readyAtMs: 13_000,
          },
        },
      })
    );

    // chew window is 8s here; querying 4s in gives 0.5
    expect(
      resolvingWildlifeGroundFoodEatProgressByItemId(store, 'meat-1', 9_000)
    ).toEqual({
      isActive: true,
      progressRatio: 0.5,
    });
  });

  it('ignores animals targeting a different ground item', () => {
    const store = creatingWildlifeInstanceStore();
    replacingWildlifeInstance(
      store,
      buildingEatingInstance({ instanceId: 'wildlife:wolf:1' })
    );

    expect(
      resolvingWildlifeGroundFoodEatProgressByItemId(store, 'meat-other', 5_600)
    ).toEqual({
      isActive: false,
      progressRatio: 0,
    });
  });
});
