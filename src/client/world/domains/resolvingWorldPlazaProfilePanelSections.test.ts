import type { ComputingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { resolvingWorldPlazaProfilePanelSections } from '@/components/world/domains/resolvingWorldPlazaProfilePanelSections';
import {
  DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import type { UsingWorldPlazaPlayerHungerHudSnapshot } from '@/components/world/hunger/hooks/usingWorldPlazaPlayerHunger';
import { describe, expect, it } from 'vitest';

const DEFINING_PROFILE_PANEL_TEST_DERIVED_STATS: ComputingWorldPlazaCharacterEngineDerivedStats =
  {
    level: 1,
    effectiveMaxHealth: 1000,
    attackPower: 300,
    attackSpeed: 0.7,
    defense: 5,
    sizeScale: 1,
    heightWorldLayers: 4,
    collisionRadiusGrid: 0.35,
    walkSpeedGridPerSecond: 2,
    runSpeedGridPerSecond: 3,
    jumpDistanceScale: 1,
    healthRegenPerSecond: 2,
    hungerDrainMultiplier: 1,
    massKg: 70,
    isLavaWalkable: false,
  };

function buildingMinimalHealthHud(
  temperatureResistance: UsingWorldPlazaPlayerHealthHudSnapshot['temperatureResistance']
): UsingWorldPlazaPlayerHealthHudSnapshot {
  return {
    currentHealth: 1000,
    effectiveMaxHealth: 1000,
    shieldPoints: 0,
    healthRatio: 1,
    isInvincible: false,
    isDead: false,
    isDamageFlashing: false,
    lastDamageKind: null,
    activeDotCount: 0,
    activeBleedCount: 0,
    activePoisonCount: 0,
    activePotentialDamageCount: 0,
    floatingTexts: [],
    localTemperatureCelsius: 20,
    temperatureDisplayUnit: 'celsius',
    temperatureResistance,
    damageRoll: {
      expectedMultiplier: 1,
      standardDeviationMultiplier: 0,
      luck: 0,
      blockBiasTotal: 0,
      dodgeBiasTotal: 0,
      criticalBiasTotal: 0,
      deviationBiasShift: 0,
      sampleExpectedDamage: 100,
      sampleStandardDeviation: 0,
      isLockInActive: false,
      isChaoticActive: false,
      activeDefenderPresetIds: [],
      activeAttackerPresetIds: [],
      activePresetIds: [],
    },
    activeBuffIds: [],
    activeBuffs: [],
    statusEffectHudRows: [],
  };
}

const DEFINING_PROFILE_PANEL_TEST_HUNGER: UsingWorldPlazaPlayerHungerHudSnapshot =
  {
    hungerRatio: 1,
    tier: 'well_fed',
    isStarving: false,
  };

describe('resolvingWorldPlazaProfilePanelSections', () => {
  it('shows default cold and heat comfort thresholds as attributes', () => {
    const sections = resolvingWorldPlazaProfilePanelSections({
      health: buildingMinimalHealthHud(
        DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT
      ),
      stamina: {
        staminaRatio: 1,
        isRunning: false,
        isDepleted: false,
      },
      hunger: DEFINING_PROFILE_PANEL_TEST_HUNGER,
      derivedStats: DEFINING_PROFILE_PANEL_TEST_DERIVED_STATS,
    });

    expect(
      sections.attributeEntries.find((entry) => entry.id === 'cold-threshold')
    ).toEqual({
      id: 'cold-threshold',
      label: 'Cold threshold',
      iconName: 'mdi:snowflake',
      valueText: `${DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS}°C`,
    });
    expect(
      sections.attributeEntries.find((entry) => entry.id === 'heat-threshold')
    ).toEqual({
      id: 'heat-threshold',
      label: 'Heat threshold',
      iconName: 'mdi:fire',
      valueText: `${DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS}°C`,
    });
    expect(
      sections.attributeEntries.find((entry) => entry.id === 'weight')
    ).toEqual({
      id: 'weight',
      label: 'Weight',
      iconName: 'mdi:scale-balance',
      valueText: '70 kg',
    });
  });

  it('widens thresholds from heat and cold comfort bonuses', () => {
    const sections = resolvingWorldPlazaProfilePanelSections({
      health: buildingMinimalHealthHud({
        ...DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT,
        heatComfortBonusCelsius: 15,
        coldComfortBonusCelsius: 10,
      }),
      stamina: {
        staminaRatio: 1,
        isRunning: false,
        isDepleted: false,
      },
      hunger: DEFINING_PROFILE_PANEL_TEST_HUNGER,
      derivedStats: DEFINING_PROFILE_PANEL_TEST_DERIVED_STATS,
    });

    expect(
      sections.attributeEntries.find((entry) => entry.id === 'cold-threshold')
        ?.valueText
    ).toBe(`${DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS - 10}°C`);
    expect(
      sections.attributeEntries.find((entry) => entry.id === 'heat-threshold')
        ?.valueText
    ).toBe(`${DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS + 15}°C`);
  });
});
