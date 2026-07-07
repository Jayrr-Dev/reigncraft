import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { advancingWildlifeSleepTick } from '@/components/world/wildlife/domains/advancingWildlifeSleepTick';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
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
      jumpState: null,
      lastJumpEndedAtMs: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      fleeTargetPoint: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      isSleeping: false,
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
      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
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
      },
    };

    const nextInstance = advancingWildlifeSleepTick({
      instance: sleepingInstance,
      species,
      cyclePhase: 0.4,
    });

    expect(nextInstance.aiState.isSleeping).toBe(false);
    expect(nextInstance.aiState.motionClip).toBe('idle');
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
      },
    };

    const nextInstance = advancingWildlifeSleepTick({
      instance: disturbedInstance,
      species,
      cyclePhase: 0.5,
    });

    expect(nextInstance.aiState.isSleeping).toBe(false);
    expect(nextInstance.aiState.motionClip).not.toBe('sleep');
  });
});
