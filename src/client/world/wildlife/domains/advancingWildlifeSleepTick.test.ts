import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { advancingWildlifeSleepTick } from '@/components/world/wildlife/domains/advancingWildlifeSleepTick';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS } from '@/components/world/wildlife/domains/definingWildlifeSleepConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingAwakeWildlifeInstance(): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:cow:1',
    speciesId: 'cow',
    anchorId: 'wildlife:cow:1',
    aggressionLevel: 'tame',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
    position: { x: 1.5, y: 1.5, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.85,
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
    floatingTexts: [],
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    hasBeenStudied: false,
  };
}

describe('advancingWildlifeSleepTick', () => {
  it('wakes diurnal animals when the schedule no longer calls for sleep', () => {
    const species = resolvingWildlifeSpeciesDefinition('cow');

    if (!species) {
      throw new Error('cow species missing');
    }

    const sleepingInstance = {
      ...buildingAwakeWildlifeInstance(),
      aiState: {
        ...buildingAwakeWildlifeInstance().aiState,
        isSleeping: true,
        motionClip: 'sleep' as const,
        hasUsedBluffCharge: false,
        bluffChargePlayerExitedTerritory: false,
        bluffReturnPoint: null,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    };

    const nextInstance = advancingWildlifeSleepTick({
      instance: sleepingInstance,
      species,
      cyclePhase: 0.4,
      nowMs: 0,
    });

    expect(nextInstance.aiState.isSleeping).toBe(false);
    expect(nextInstance.aiState.motionClip).toBe('idle');
    expect(nextInstance.speechState.lastContextKey).toBe('wake');
    expect(nextInstance.speechState.activeBubble?.message).toMatch(/\?\!/);
  });

  it('does not re-enter sleep after the animal has been disturbed by damage', () => {
    const species = resolvingWildlifeSpeciesDefinition('cow');

    if (!species) {
      throw new Error('cow species missing');
    }

    const disturbedInstance = {
      ...buildingAwakeWildlifeInstance(),
      aiState: {
        ...buildingAwakeWildlifeInstance().aiState,
        hasSleepBeenDisturbed: true,
        hasUsedBluffCharge: false,
        bluffChargePlayerExitedTerritory: false,
        bluffReturnPoint: null,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    };

    const nextInstance = advancingWildlifeSleepTick({
      instance: disturbedInstance,
      species,
      cyclePhase: 0.5,
      nowMs: 0,
    });

    expect(nextInstance.aiState.isSleeping).toBe(false);
    expect(nextInstance.aiState.motionClip).not.toBe('sleep');
  });

  it('does not enter sleep while still within the post-aggro cooldown', () => {
    const species = resolvingWildlifeSpeciesDefinition('cow');

    if (!species) {
      throw new Error('cow species missing');
    }

    const recentlyAggroedInstance = {
      ...buildingAwakeWildlifeInstance(),
      aggroState: {
        ...buildingAwakeWildlifeInstance().aggroState,
        activeTargetId: null,
        lastAggroedAtMs: 10_000,
      },
    };
    const nowMs = 10_000 + DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS - 1_000;

    const nextInstance = advancingWildlifeSleepTick({
      instance: recentlyAggroedInstance,
      species,
      cyclePhase: 0.05,
      nowMs,
    });

    expect(nextInstance.aiState.isSleeping).toBe(false);
    expect(nextInstance.aiState.motionClip).not.toBe('sleep');
  });

  it('allows sleep again after the post-aggro cooldown expires', () => {
    const species = resolvingWildlifeSpeciesDefinition('cow');

    if (!species) {
      throw new Error('cow species missing');
    }

    const cooledDownInstance = {
      ...buildingAwakeWildlifeInstance(),
      aggroState: {
        ...buildingAwakeWildlifeInstance().aggroState,
        activeTargetId: null,
        lastAggroedAtMs: 10_000,
      },
    };
    const nowMs = 10_000 + DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS;

    const nextInstance = advancingWildlifeSleepTick({
      instance: cooledDownInstance,
      species,
      cyclePhase: 0.05,
      nowMs,
    });

    expect(nextInstance.aiState.isSleeping).toBe(true);
    expect(nextInstance.aiState.motionClip).toBe('sleep');
  });

  it('does not enter schedule sleep while still holding an active target', () => {
    const species = resolvingWildlifeSpeciesDefinition('cow');

    if (!species) {
      throw new Error('cow species missing');
    }

    const huntingInstance = {
      ...buildingAwakeWildlifeInstance(),
      aggroState: {
        ...buildingAwakeWildlifeInstance().aggroState,
        activeTargetId: 'player-1',
        lastAggroedAtMs: 60_000,
      },
    };

    const nextInstance = advancingWildlifeSleepTick({
      instance: huntingInstance,
      species,
      cyclePhase: 0.05,
      nowMs: 60_000,
    });

    expect(nextInstance.aiState.isSleeping).toBe(false);
    expect(nextInstance.aiState.motionClip).not.toBe('sleep');
  });

  it('forces sleep from a sleep debuff even while aggroed', () => {
    const species = resolvingWildlifeSpeciesDefinition('cow');

    if (!species) {
      throw new Error('cow species missing');
    }

    const debuffedAggroInstance = {
      ...buildingAwakeWildlifeInstance(),
      healthState: {
        ...buildingAwakeWildlifeInstance().healthState,
        sleepEffects: [
          {
            id: 'sleep-debuff',
            appliedAtMs: 0,
            expiresAtMs: 20_000,
            wakeBonusDamage: 30,
          },
        ],
      },
      aggroState: {
        ...buildingAwakeWildlifeInstance().aggroState,
        activeTargetId: 'player-1',
        lastAggroedAtMs: 10_000,
      },
    };

    const nextInstance = advancingWildlifeSleepTick({
      instance: debuffedAggroInstance,
      species,
      cyclePhase: 0.4,
      nowMs: 10_000,
    });

    expect(nextInstance.aiState.isSleeping).toBe(true);
    expect(nextInstance.aiState.motionClip).toBe('sleep');
  });
});
