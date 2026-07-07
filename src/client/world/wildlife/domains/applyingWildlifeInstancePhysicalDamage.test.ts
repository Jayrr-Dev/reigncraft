import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { applyingWildlifeInstancePhysicalDamage } from '@/components/world/wildlife/domains/applyingWildlifeInstancePhysicalDamage';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSleepAmbushHealthDamageOptions } from '@/components/world/wildlife/domains/resolvingWildlifeSleepAmbushHealthDamageOptions';
import { describe, expect, it } from 'vitest';

function buildingSleepingWildlifeInstance(): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:boar:1',
    speciesId: 'boar',
    anchorId: 'wildlife:boar:1',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
    position: { x: 1.5, y: 1.5, layer: 1 },
    facingDirection: 'Down',
    healthState: {
      ...creatingWorldPlazaEntityHealthInitialState(),
      baseMaxHealth: 550,
      currentHealth: 550,
    },
    hungerState: {
      hungerRatio: 0.85,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: {
      intent: { mode: 'idle' },
      facingDirection: 'Down',
      motionClip: 'sleep',
      isMoving: false,
      lastThinkAtMs: 0,
      wanderTarget: null,
      steeringCache: null,
      lastAttackAtMs: null,
      jumpState: null,
      lastJumpEndedAtMs: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      fleeTargetPoint: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      isSleeping: true,
      hasSleepBeenDisturbed: false,
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    floatingTexts: [],
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: 'sleep',
    },
    environmentalDamageLastTickAtMs: null,
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
  };
}

describe('resolvingWildlifeSleepAmbushHealthDamageOptions', () => {
  it('forces a lethal-tier EV roll for sleeping targets', () => {
    expect(
      resolvingWildlifeSleepAmbushHealthDamageOptions(
        buildingSleepingWildlifeInstance()
      )
    ).toEqual({
      skipDamageRoll: false,
      forcedDeviationScore: 2.25,
    });
  });

  it('returns null for awake targets', () => {
    const awakeInstance = {
      ...buildingSleepingWildlifeInstance(),
      aiState: {
        ...buildingSleepingWildlifeInstance().aiState,
        isSleeping: false,
      },
    };

    expect(resolvingWildlifeSleepAmbushHealthDamageOptions(awakeInstance)).toBe(
      null
    );
  });
});

describe('applyingWildlifeInstancePhysicalDamage', () => {
  it('labels the first sleeping hit as lethal EV damage', () => {
    const nextInstance = applyingWildlifeInstancePhysicalDamage({
      instance: buildingSleepingWildlifeInstance(),
      rawAmount: 10,
      nowMs: 1000,
    });

    expect(nextInstance.aiState.isSleeping).toBe(false);
    expect(nextInstance.aiState.hasSleepBeenDisturbed).toBe(true);
    expect(nextInstance.floatingTexts[0]?.outcomeTier).toBe('lethal');
    expect(nextInstance.floatingTexts[0]?.amount).toBeGreaterThan(10);
    expect(nextInstance.healthState.currentHealth).toBeLessThan(550);
    expect(nextInstance.isDead).toBe(false);
  });
});
