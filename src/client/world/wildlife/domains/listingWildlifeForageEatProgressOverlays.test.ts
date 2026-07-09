import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeForageEatProgressOverlays } from '@/components/world/wildlife/domains/listingWildlifeForageEatProgressOverlays';
import {
  creatingWildlifeInstanceStore,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
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
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      isSleeping: false,
      hasSleepBeenDisturbed: false,
      hasPlayerSleepBumpContact: false,
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

describe('listingWildlifeForageEatProgressOverlays', () => {
  it('returns empty when no animal is eating', () => {
    const store = creatingWildlifeInstanceStore();

    expect(listingWildlifeForageEatProgressOverlays(store, 5_000)).toEqual([]);
  });

  it('lists forageEat animals with bite-cooldown progress', () => {
    const store = creatingWildlifeInstanceStore();
    const lastAttackAtMs = 5_000;
    replacingWildlifeInstance(
      store,
      buildingEatingInstance({
        instanceId: 'wildlife:wolf:1',
        aiState: {
          ...buildingEatingInstance({ instanceId: 'wildlife:wolf:1' }).aiState,
          lastAttackAtMs,
        },
      })
    );

    expect(
      listingWildlifeForageEatProgressOverlays(store, lastAttackAtMs + 450)
    ).toEqual([
      {
        instanceId: 'wildlife:wolf:1',
        instance: expect.objectContaining({
          instanceId: 'wildlife:wolf:1',
        }),
        progressRatio: 0.5,
      },
    ]);
  });

  it('skips dead animals', () => {
    const store = creatingWildlifeInstanceStore();
    replacingWildlifeInstance(
      store,
      buildingEatingInstance({
        instanceId: 'wildlife:wolf:1',
        isDead: true,
      })
    );

    expect(listingWildlifeForageEatProgressOverlays(store, 5_500)).toEqual([]);
  });
});
