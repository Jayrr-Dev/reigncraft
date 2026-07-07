import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeInstanceAttackPowerMultiplier,
  resolvingWildlifeInstanceBaseMaxHealth,
  resolvingWildlifeInstanceRunSpeedGridPerSecond,
  resolvingWildlifeInstanceSizeScale,
  resolvingWildlifeInstanceStaminaConfig,
  resolvingWildlifeInstanceWalkSpeedGridPerSecond,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { describe, expect, it } from 'vitest';

function buildingChickenInstance(
  aggressionLevel: DefiningWildlifeInstance['aggressionLevel']
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:chicken:0',
    speciesId: 'chicken',
    anchorId: 'wildlife:chicken:0',
    aggressionLevel,
    sleepScheduleSample: 0,
    sizeScaleSample: 0,
    spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
    position: { x: 1.5, y: 1.5, layer: 1 },
    facingDirection: 'Down',
    healthState: {
      baseMaxHealth: 150,
      currentHealth: 150,
      lastDamagedAtMs: null,
      regenCooldownUntilMs: null,
    },
    hungerState: {
      hungerRatio: 0.9,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    staminaState: {
      staminaRatio: 1,
      isExhausted: false,
    },
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
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
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

describe('resolvingWildlifeInstanceCombatPresentation', () => {
  const chickenSpecies = DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken;

  it('buffs aggressive chickens with Zelda-style cucco stats', () => {
    const aggressiveChicken = buildingChickenInstance('aggressive');
    const normalChicken = buildingChickenInstance('normal');

    expect(
      resolvingWildlifeInstanceSizeScale(chickenSpecies, aggressiveChicken)
    ).toBe(chickenSpecies.sizeScale * 2);
    expect(
      resolvingWildlifeInstanceBaseMaxHealth(chickenSpecies, aggressiveChicken)
    ).toBe(chickenSpecies.vitals.baseMaxHealth * 10);
    expect(
      resolvingWildlifeInstanceAttackPowerMultiplier(
        chickenSpecies,
        aggressiveChicken
      )
    ).toBe(100);
    expect(
      resolvingWildlifeInstanceWalkSpeedGridPerSecond(
        chickenSpecies,
        aggressiveChicken
      )
    ).toBe(chickenSpecies.vitals.walkSpeedGridPerSecond * 2);
    expect(
      resolvingWildlifeInstanceRunSpeedGridPerSecond(
        chickenSpecies,
        aggressiveChicken
      )
    ).toBe(chickenSpecies.vitals.runSpeedGridPerSecond * 2);

    const aggressiveStamina = resolvingWildlifeInstanceStaminaConfig(
      chickenSpecies,
      aggressiveChicken
    );
    expect(aggressiveStamina.drainMultiplier).toBe(
      chickenSpecies.stamina.drainMultiplier / 4
    );
    expect(aggressiveStamina.regenMultiplier).toBe(
      chickenSpecies.stamina.regenMultiplier * 4
    );

    expect(
      resolvingWildlifeInstanceSizeScale(chickenSpecies, normalChicken)
    ).toBe(chickenSpecies.sizeScale);
    expect(
      resolvingWildlifeInstanceAttackPowerMultiplier(
        chickenSpecies,
        normalChicken
      )
    ).toBe(1);
  });

  it('scales health and attack with the size bell curve', () => {
    const largeChicken = buildingChickenInstance('normal');
    largeChicken.sizeScaleSample = 1;

    expect(
      resolvingWildlifeInstanceBaseMaxHealth(chickenSpecies, largeChicken)
    ).toBe(Math.round(chickenSpecies.vitals.baseMaxHealth * 1.08));
    expect(
      resolvingWildlifeInstanceAttackPowerMultiplier(
        chickenSpecies,
        largeChicken
      )
    ).toBeCloseTo(1.08);
    expect(
      resolvingWildlifeInstanceSizeScale(chickenSpecies, largeChicken)
    ).toBeCloseTo(chickenSpecies.sizeScale * 1.08);
  });
});
