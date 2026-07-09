import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { advancingWildlifeHealthStatusTick } from '@/components/world/wildlife/domains/advancingWildlifeHealthStatusTick';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingInstance(): DefiningWildlifeInstance {
  const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.zebra;

  return {
    instanceId: 'wildlife:1:1:0',
    speciesId: species.speciesId,
    anchorId: 'wildlife:1:1:0',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
    position: { x: 1.5, y: 1.5, layer: 1 },
    facingDirection: 'Down',
    healthState: {
      ...creatingWorldPlazaEntityHealthInitialState(),
      baseMaxHealth: species.vitals.baseMaxHealth,
      currentHealth: species.vitals.baseMaxHealth,
    },
    hungerState: {
      hungerRatio: 0.9,
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

describe('advancingWildlifeHealthStatusTick', () => {
  it('ticks bleed damage and enqueues a combat float', () => {
    const instance = buildingInstance();
    const nowMs = 0;
    const bleedState = applyingWorldPlazaEntityHealthBleedStack(
      instance.healthState,
      'bleeding',
      20,
      nowMs
    );

    const bleedingInstance = {
      ...instance,
      healthState: bleedState,
    };

    const nextInstance = advancingWildlifeHealthStatusTick({
      instance: bleedingInstance,
      deltaMs: 1_000,
      nowMs: 1_000,
    });

    expect(nextInstance.healthState.currentHealth).toBeLessThan(
      bleedingInstance.healthState.currentHealth
    );
    expect(
      nextInstance.healthState.bleedEffects[0]?.remainingBleedDamage ?? 20
    ).toBeLessThan(20);
    expect(nextInstance.floatingTexts.length).toBeGreaterThan(0);
    expect(nextInstance.floatingTexts[0]?.damageKind).toBe('bleeding');
  });
});
