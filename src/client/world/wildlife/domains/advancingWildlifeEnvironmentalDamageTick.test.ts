import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import { advancingWildlifeEnvironmentalDamageTick } from '@/components/world/wildlife/domains/advancingWildlifeEnvironmentalDamageTick';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { creatingWildlifeSpawnHealthState } from '@/components/world/wildlife/domains/creatingWildlifeSpawnHealthState';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceWalkSpeedGridPerSecond } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const localTemperatureCelsiusMock = vi.hoisted(() => vi.fn(() => 20));

vi.mock(
  '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint',
  () => ({
    resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint: () =>
      localTemperatureCelsiusMock(),
  })
);

function buildingInstance(
  speciesId: keyof typeof DEFINING_WILDLIFE_SPECIES_REGISTRY = 'zebra'
): DefiningWildlifeInstance {
  const species = DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId];
  const healthState = creatingWildlifeSpawnHealthState(
    species.vitals.baseMaxHealth,
    null,
    species
  );

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
    healthState,
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

describe('advancingWildlifeEnvironmentalDamageTick frostbite', () => {
  beforeEach(() => {
    localTemperatureCelsiusMock.mockReset();
    localTemperatureCelsiusMock.mockReturnValue(20);
  });

  it('gains frostbite stacks and deals cold damage on cold ticks', () => {
    localTemperatureCelsiusMock.mockReturnValue(-15);
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.zebra;
    const instance = buildingInstance('zebra');
    const nowMs = 5_000;
    const armed = advancingWildlifeEnvironmentalDamageTick({
      instance,
      species,
      isDaytime: true,
      nowMs: nowMs - DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS,
      deltaMs: 16,
    });

    expect(armed.environmentalDamageLastTickAtMs).toBe(
      nowMs - DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS
    );

    const next = advancingWildlifeEnvironmentalDamageTick({
      instance: armed,
      species,
      isDaytime: true,
      nowMs,
      deltaMs: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS,
    });

    expect(next.healthState.frostbite?.stackCount ?? 0).toBeGreaterThan(0);
    expect(next.healthState.currentHealth).toBeLessThan(
      instance.healthState.currentHealth
    );
    expect(next.floatingTexts.some((float) => float.kind === 'damage')).toBe(
      true
    );
  });

  it('skips frostbite for cold-immune species', () => {
    localTemperatureCelsiusMock.mockReturnValue(-30);
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['polar-bear'];
    const instance = buildingInstance('polar-bear');
    const nowMs = 5_000;
    const armed = advancingWildlifeEnvironmentalDamageTick({
      instance,
      species,
      isDaytime: true,
      nowMs:
        nowMs -
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS,
      deltaMs: 16,
    });
    const next = advancingWildlifeEnvironmentalDamageTick({
      instance: armed,
      species,
      isDaytime: true,
      nowMs,
      deltaMs:
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS,
    });

    expect(next.healthState.frostbite).toBeNull();
    expect(next.healthState.currentHealth).toBe(
      instance.healthState.currentHealth
    );
  });

  it('decays frostbite stacks when warm', () => {
    localTemperatureCelsiusMock.mockReturnValue(25);
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.zebra;
    const instance = buildingInstance('zebra');
    const withStacks: DefiningWildlifeInstance = {
      ...instance,
      healthState: {
        ...instance.healthState,
        frostbite: {
          stackCount: 100,
          activeStageId: 'cold',
          lastGainAtMs: 1_000,
          lastDecayAtMs: 1_000,
          lastSleepSpellAtStacks: null,
        },
      },
    };

    const next = advancingWildlifeEnvironmentalDamageTick({
      instance: withStacks,
      species,
      isDaytime: true,
      nowMs:
        1_000 +
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS,
      deltaMs:
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS,
    });

    expect(next.healthState.frostbite?.stackCount ?? 0).toBeLessThan(100);
  });

  it('slows walk speed from frostbite movement modifiers', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.zebra;
    const instance = buildingInstance('zebra');
    const baseline = resolvingWildlifeInstanceWalkSpeedGridPerSecond(
      species,
      instance,
      1_000
    );
    const slowed: DefiningWildlifeInstance = {
      ...instance,
      healthState: {
        ...instance.healthState,
        movementModifiers: [
          {
            id: 'frostbite-stage:test-speed',
            kind: 'speed',
            multiplier: 0.5,
            expiresAtMs: null,
          },
        ],
      },
    };

    expect(
      resolvingWildlifeInstanceWalkSpeedGridPerSecond(species, slowed, 1_000)
    ).toBeCloseTo(baseline * 0.5);
  });
});
