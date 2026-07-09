import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  buildingWildlifeSpatialGrid,
  queryingWildlifeInstancesNearPoint,
} from '@/components/world/wildlife/domains/managingWildlifeSpatialGrid';
import { describe, expect, it } from 'vitest';

function buildingSpatialGridTestInstance(
  instanceId: string,
  x: number,
  y: number
): DefiningWildlifeInstance {
  return {
    instanceId,
    speciesId: 'deer',
    anchorId: instanceId,
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x, y, layer: 1 },
    position: { x, y, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.8,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: {
      intent: { mode: 'idle' },
      facingDirection: 'Down',
      motionClip: 'idle',
      isMoving: false,
      lastThinkAtMs: 0,
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
      hasUsedBluffCharge: false,
      bluffChargePlayerExitedTerritory: false,
      bluffReturnPoint: null,
      fleeTargetPoint: null,
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
  };
}

describe('managingWildlifeSpatialGrid', () => {
  it('returns only instances within the query radius', () => {
    const instances = [
      buildingSpatialGridTestInstance('near', 1, 1),
      buildingSpatialGridTestInstance('far', 20, 20),
    ];
    const grid = buildingWildlifeSpatialGrid(instances);
    const nearby = queryingWildlifeInstancesNearPoint({
      grid,
      point: { x: 1, y: 1 },
      radiusGrid: 2,
    });

    expect(nearby.map((entry) => entry.instanceId)).toEqual(['near']);
  });

  it('excludes the requested instance id', () => {
    const instances = [buildingSpatialGridTestInstance('self', 1, 1)];
    const grid = buildingWildlifeSpatialGrid(instances);
    const nearby = queryingWildlifeInstancesNearPoint({
      grid,
      point: { x: 1, y: 1 },
      radiusGrid: 2,
      excludeInstanceId: 'self',
    });

    expect(nearby).toHaveLength(0);
  });
});
