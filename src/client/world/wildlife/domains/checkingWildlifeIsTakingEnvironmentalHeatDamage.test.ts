import { buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius } from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import { creatingWildlifeSpawnHealthState } from '@/components/world/wildlife/domains/creatingWildlifeSpawnHealthState';
import { checkingWildlifeIsTakingEnvironmentalHeatDamage } from '@/components/world/wildlife/domains/checkingWildlifeIsTakingEnvironmentalHeatDamage';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
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
  speciesId: keyof typeof DEFINING_WILDLIFE_SPECIES_REGISTRY = 'sheep'
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

describe('checkingWildlifeIsTakingEnvironmentalHeatDamage', () => {
  beforeEach(() => {
    localTemperatureCelsiusMock.mockReset();
    localTemperatureCelsiusMock.mockReturnValue(20);
  });

  it('returns true when local temperature deals heat damage', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep;
    const instance = buildingInstance('sheep');
    const comfortHigh =
      instance.healthState.temperatureResistance.baseComfortHighCelsius ?? 35;
    localTemperatureCelsiusMock.mockReturnValue(comfortHigh + 10);

    expect(
      checkingWildlifeIsTakingEnvironmentalHeatDamage({
        instance,
        species,
        isDaytime: true,
      })
    ).toBe(true);

    const hazard = buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius(
      comfortHigh + 10,
      instance.healthState.temperatureResistance
    );
    expect(hazard?.kind).toBe('heat');
  });

  it('returns false in the comfort band', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep;
    const instance = buildingInstance('sheep');
    localTemperatureCelsiusMock.mockReturnValue(20);

    expect(
      checkingWildlifeIsTakingEnvironmentalHeatDamage({
        instance,
        species,
        isDaytime: true,
      })
    ).toBe(false);
  });

  it('returns false for heat-immune species', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.zebra;
    const instance = buildingInstance('zebra');
    localTemperatureCelsiusMock.mockReturnValue(80);

    expect(species.hazards.isHeatImmune).toBe(true);
    expect(
      checkingWildlifeIsTakingEnvironmentalHeatDamage({
        instance,
        species,
        isDaytime: true,
      })
    ).toBe(false);
  });
});
