import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { applyingWildlifeAnimalRollAttackHitSideEffects } from '@/components/world/wildlife/domains/applyingWildlifeAnimalRollAttackHitSideEffects';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingTestWildlifeInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:0:0:0',
    speciesId: 'deer',
    anchorId: 'wildlife:0:0:0',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 0.5, y: 0.5, layer: 1 },
    position: { x: 0.5, y: 0.5, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 1,
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

describe('applyingWildlifeAnimalRollAttackHitSideEffects', () => {
  it('applies deer kick winded buff on successful roll', () => {
    const next = applyingWildlifeAnimalRollAttackHitSideEffects({
      instance: buildingTestWildlifeInstance(),
      attackerSpeciesId: 'deer',
      rollDamage: 100,
      extraOnHitEffects: [
        {
          kind: 'buff',
          buffId: 'winded-debuff',
          procChance: 1,
        },
      ],
      nowMs: 1000,
      roll: () => 0,
    });

    expect(
      next.healthState.movementModifiers.some(
        (modifier) => modifier.id === 'winded-debuff'
      )
    ).toBe(true);
  });

  it('skips extras when species already has shared on-hit table', () => {
    const instance = buildingTestWildlifeInstance();
    const next = applyingWildlifeAnimalRollAttackHitSideEffects({
      instance,
      attackerSpeciesId: 'crocodile',
      rollDamage: 100,
      extraOnHitEffects: [
        {
          kind: 'buff',
          buffId: 'winded-debuff',
          procChance: 1,
        },
      ],
      nowMs: 1000,
      roll: () => 0,
    });

    expect(next).toBe(instance);
  });
});
