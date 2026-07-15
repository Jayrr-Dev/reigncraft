import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
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
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 150,
    },
    hungerState: {
      hungerRatio: 0.9,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    staminaState: {
      staminaRatio: 1,
      isExhausted: false,
      fatigueTier: 'fresh',
      runningForSeconds: 0,
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

  it('scales combat stats with the size bell curve', () => {
    const largeChicken = buildingChickenInstance('normal');
    largeChicken.sizeScaleSample = 1;
    const visualMultiplier = 1.16;
    const combatMultiplier = visualMultiplier * visualMultiplier;

    expect(
      resolvingWildlifeInstanceBaseMaxHealth(chickenSpecies, largeChicken)
    ).toBe(Math.round(chickenSpecies.vitals.baseMaxHealth * combatMultiplier));
    expect(
      resolvingWildlifeInstanceAttackPowerMultiplier(
        chickenSpecies,
        largeChicken
      )
    ).toBeCloseTo(combatMultiplier);
    expect(
      resolvingWildlifeInstanceSizeScale(chickenSpecies, largeChicken)
    ).toBeCloseTo(chickenSpecies.sizeScale * visualMultiplier);
    expect(
      resolvingWildlifeInstanceWalkSpeedGridPerSecond(
        chickenSpecies,
        largeChicken
      )
    ).toBeCloseTo(
      chickenSpecies.vitals.walkSpeedGridPerSecond * visualMultiplier
    );
    expect(
      resolvingWildlifeInstanceRunSpeedGridPerSecond(
        chickenSpecies,
        largeChicken
      )
    ).toBeCloseTo(
      chickenSpecies.vitals.runSpeedGridPerSecond * visualMultiplier
    );

    const largeStamina = resolvingWildlifeInstanceStaminaConfig(
      chickenSpecies,
      largeChicken
    );
    expect(largeStamina.drainMultiplier).toBeCloseTo(
      chickenSpecies.stamina.drainMultiplier / combatMultiplier
    );
    expect(largeStamina.regenMultiplier).toBeCloseTo(
      chickenSpecies.stamina.regenMultiplier * combatMultiplier
    );
  });

  it('makes tiny animals much weaker than their visual size suggests', () => {
    const runtChicken = buildingChickenInstance('normal');
    runtChicken.sizeScaleSample = -10;

    expect(
      resolvingWildlifeInstanceBaseMaxHealth(chickenSpecies, runtChicken)
    ).toBe(Math.round(chickenSpecies.vitals.baseMaxHealth * 0.42 * 0.42));
    expect(
      resolvingWildlifeInstanceSizeScale(chickenSpecies, runtChicken)
    ).toBeCloseTo(chickenSpecies.sizeScale * 0.42);
  });

  it('scales health and attack +5% per 1000 tiles from origin', () => {
    const nearOrigin = buildingChickenInstance('normal');
    const farOut = buildingChickenInstance('normal');
    farOut.spawnAnchor = { x: 2000, y: 0, layer: 1 };
    farOut.position = { x: 2000, y: 0, layer: 1 };

    const nearHealth = resolvingWildlifeInstanceBaseMaxHealth(
      chickenSpecies,
      nearOrigin
    );
    const farHealth = resolvingWildlifeInstanceBaseMaxHealth(
      chickenSpecies,
      farOut
    );
    const nearAttack = resolvingWildlifeInstanceAttackPowerMultiplier(
      chickenSpecies,
      nearOrigin
    );
    const farAttack = resolvingWildlifeInstanceAttackPowerMultiplier(
      chickenSpecies,
      farOut
    );

    expect(farHealth / nearHealth).toBeCloseTo(1.1);
    expect(farAttack / nearAttack).toBeCloseTo(1.1);
  });

  it('stacks god-spawn 5x combat and 2x stamina on top of distance bonuses', () => {
    const sheepSpecies = DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep;
    const normal = buildingChickenInstance('normal');
    normal.speciesId = 'sheep';
    normal.spawnAnchor = { x: 2000, y: 0, layer: 1 };
    const godSpawn = buildingChickenInstance('aggressive');
    godSpawn.speciesId = 'sheep';
    godSpawn.spawnAnchor = { x: 2000, y: 0, layer: 1 };
    godSpawn.isGodSpawn = true;
    godSpawn.temperamentOverrideId = 'stalker';

    expect(
      resolvingWildlifeInstanceBaseMaxHealth(sheepSpecies, godSpawn) /
        resolvingWildlifeInstanceBaseMaxHealth(sheepSpecies, normal)
    ).toBeCloseTo(5);
    expect(
      resolvingWildlifeInstanceAttackPowerMultiplier(sheepSpecies, godSpawn) /
        resolvingWildlifeInstanceAttackPowerMultiplier(sheepSpecies, normal)
    ).toBeCloseTo(5);

    const normalStamina = resolvingWildlifeInstanceStaminaConfig(
      sheepSpecies,
      normal
    );
    const godStamina = resolvingWildlifeInstanceStaminaConfig(
      sheepSpecies,
      godSpawn
    );
    expect(godStamina.drainMultiplier).toBeCloseTo(
      normalStamina.drainMultiplier / 2
    );
    expect(godStamina.regenMultiplier).toBeCloseTo(
      normalStamina.regenMultiplier * 2
    );
  });
});
