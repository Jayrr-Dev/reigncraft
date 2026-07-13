import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { applyingWildlifeTransformMeleeHitSideEffects } from '@/components/world/wildlife/domains/applyingWildlifeTransformMeleeHitSideEffects';
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
      driveLevel: 'content',
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

describe('applyingWildlifeTransformMeleeHitSideEffects', () => {
  it('applies crocodile bleed and poison when rolls succeed', () => {
    const next = applyingWildlifeTransformMeleeHitSideEffects({
      instance: buildingTestWildlifeInstance(),
      attackerSpeciesId: 'crocodile',
      meleeDamage: 100,
      nowMs: 1000,
      roll: () => 0,
    });

    expect(next.healthState.bleedEffects.length).toBeGreaterThan(0);
    expect(next.healthState.poisonEffects.length).toBeGreaterThan(0);
  });

  it('skips procs when rolls miss', () => {
    const next = applyingWildlifeTransformMeleeHitSideEffects({
      instance: buildingTestWildlifeInstance(),
      attackerSpeciesId: 'crocodile',
      meleeDamage: 100,
      nowMs: 1000,
      roll: () => 0.99,
    });

    expect(next.healthState.bleedEffects).toEqual([]);
    expect(next.healthState.poisonEffects).toEqual([]);
  });

  it('no-ops for species without on-hit passives', () => {
    const instance = buildingTestWildlifeInstance();
    const next = applyingWildlifeTransformMeleeHitSideEffects({
      instance,
      attackerSpeciesId: 'deer',
      meleeDamage: 100,
      nowMs: 1000,
      roll: () => 0,
    });

    expect(next).toBe(instance);
  });
});
