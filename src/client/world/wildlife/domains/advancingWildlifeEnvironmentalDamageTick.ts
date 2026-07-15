/**
 * Environmental hazard damage tick for one wildlife instance.
 *
 * Cold exposure also advances frostbite stacks (same pipeline as the player).
 *
 * @module components/world/wildlife/domains/advancingWildlifeEnvironmentalDamageTick
 */

import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { computingWorldPlazaFrostbiteStacksGainedFromColdDeficit } from '@/components/world/health/domains/computingWorldPlazaFrostbiteColdSeverityStackGainMultiplier';
import { computingWorldPlazaFrostbiteColdTickDamage } from '@/components/world/health/domains/computingWorldPlazaFrostbiteColdTickDamage';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import {
  buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius,
  computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond,
} from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import type { DefiningWorldPlazaEnvironmentalHazard } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';
import { advancingWorldPlazaEntityFrostbiteTick } from '@/components/world/health/domains/advancingWorldPlazaEntityFrostbiteTick';
import { gainingWorldPlazaEntityFrostbiteStacksFromColdTick } from '@/components/world/health/domains/applyingWorldPlazaEntityFrostbiteStack';
import { resolvingWorldPlazaEntityEffectiveLocalTemperatureCelsius } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthTemperatureImpulse';
import { pruningWorldPlazaEntityHealthFloatTexts } from '@/components/world/health/domains/managingWorldPlazaEntityHealthFloatTexts';
import { mappingWorldPlazaEnvironmentalHazardKindToDamageKind } from '@/components/world/health/domains/mappingWorldPlazaEnvironmentalHazardKindToDamageKind';
import { applyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRates } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureResistanceMultiplier';
import { resolvingWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureComfortBand';
import { resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint';
import { applyingWildlifeInstanceHealthDamageWithFloatFeedback } from '@/components/world/wildlife/domains/applyingWildlifeInstanceHealthDamageWithFloatFeedback';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { notifyingWildlifeVocalSfxOnDeath } from '@/components/world/wildlife/domains/notifyingWildlifeVocalSfxOnDeath';
import { resolvingWildlifeInstanceCollisionRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

export type AdvancingWildlifeEnvironmentalDamageTickParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  isDaytime: boolean;
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  nowMs: number;
  /** Frame delta for frostbite warm decay / sleep spells. */
  deltaMs: number;
};

function checkingWildlifeSpeciesTakesEnvironmentalHazard(
  hazard: DefiningWorldPlazaEnvironmentalHazard,
  species: DefiningWildlifeSpeciesDefinition
): boolean {
  if (hazard.kind === 'lava') {
    return species.hazards.treatsLavaAsLethal;
  }

  if (hazard.kind === 'heat') {
    return !species.hazards.isHeatImmune;
  }

  if (hazard.kind === 'cold') {
    return !species.hazards.isColdImmune;
  }

  return true;
}

function resolvingWildlifeLocalTemperatureCelsius(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  isDaytime: boolean,
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): number {
  const ambientTemperatureCelsius =
    resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint({
      center: instance.position,
      isDaytime,
      playerRadiusGrid: resolvingWildlifeInstanceCollisionRadiusGrid(
        species,
        instance
      ),
      placedBlocksByTile,
    });

  return resolvingWorldPlazaEntityEffectiveLocalTemperatureCelsius(
    ambientTemperatureCelsius,
    instance.healthState
  );
}

function resolvingWildlifeEnvironmentalHazardAtTemperature(
  localTemperatureCelsius: number,
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition
): DefiningWorldPlazaEnvironmentalHazard | null {
  const hazard = buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius(
    localTemperatureCelsius,
    instance.healthState.temperatureResistance
  );

  if (
    !hazard ||
    !checkingWildlifeSpeciesTakesEnvironmentalHazard(hazard, species)
  ) {
    return null;
  }

  return hazard;
}

/**
 * Applies discrete environmental damage ticks, frostbite stacks, and prunes floats.
 */
export function advancingWildlifeEnvironmentalDamageTick({
  instance,
  species,
  isDaytime,
  placedBlocksByTile,
  nowMs,
  deltaMs,
}: AdvancingWildlifeEnvironmentalDamageTickParams): DefiningWildlifeInstance {
  if (instance.isDead) {
    return {
      ...instance,
      floatingTexts: pruningWorldPlazaEntityHealthFloatTexts(
        instance.floatingTexts,
        nowMs
      ),
    };
  }

  let nextInstance: DefiningWildlifeInstance = {
    ...instance,
    floatingTexts: pruningWorldPlazaEntityHealthFloatTexts(
      instance.floatingTexts,
      nowMs
    ),
  };

  const localTemperatureCelsius = resolvingWildlifeLocalTemperatureCelsius(
    nextInstance,
    species,
    isDaytime,
    placedBlocksByTile
  );

  if (!species.hazards.isColdImmune) {
    const frostbiteTick = advancingWorldPlazaEntityFrostbiteTick({
      state: nextInstance.healthState,
      nowMs,
      deltaMs,
      localTemperatureCelsius,
    });
    nextInstance = {
      ...nextInstance,
      healthState: frostbiteTick.state,
    };
  }

  const hazard = resolvingWildlifeEnvironmentalHazardAtTemperature(
    localTemperatureCelsius,
    nextInstance,
    species
  );

  if (!hazard) {
    return {
      ...nextInstance,
      environmentalDamageLastTickAtMs: null,
    };
  }

  const effectiveMaxHealth = computingWorldPlazaEntityHealthEffectiveMax(
    nextInstance.healthState,
    nowMs
  );
  const resistedRates =
    applyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRates({
      damagePerSecond: hazard.damagePerSecond,
      maxHealthPercentPerSecond: hazard.maxHealthPercentPerSecond,
      exposureKind: hazard.kind === 'cold' ? 'cold' : 'heat',
      resistance: nextInstance.healthState.temperatureResistance,
    });
  const resistedDamagePerSecond =
    computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond(
      resistedRates.damagePerSecond,
      resistedRates.maxHealthPercentPerSecond,
      effectiveMaxHealth
    );

  if (resistedDamagePerSecond <= 0) {
    return {
      ...nextInstance,
      environmentalDamageLastTickAtMs: null,
    };
  }

  const lastTickAtMs = nextInstance.environmentalDamageLastTickAtMs;

  if (lastTickAtMs === null) {
    return {
      ...nextInstance,
      environmentalDamageLastTickAtMs: nowMs,
    };
  }

  const elapsedMs = nowMs - lastTickAtMs;

  if (
    elapsedMs <
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS
  ) {
    return nextInstance;
  }

  const ambientTickDamage = resistedDamagePerSecond * (elapsedMs / 1000);
  let tickDamage = ambientTickDamage;
  let healthStateForDamage = nextInstance.healthState;

  if (hazard.kind === 'cold') {
    const comfortBand = resolvingWorldPlazaEntityTemperatureComfortBand(
      nextInstance.healthState.temperatureResistance
    );
    const deficitCelsius = Math.max(
      0,
      comfortBand.comfortLowCelsius - localTemperatureCelsius
    );
    const stacksToAdd =
      computingWorldPlazaFrostbiteStacksGainedFromColdDeficit(deficitCelsius);
    const gained = gainingWorldPlazaEntityFrostbiteStacksFromColdTick({
      state: nextInstance.healthState,
      stacksToAdd,
      nowMs,
    });
    healthStateForDamage = gained.state;
    const frostTick = computingWorldPlazaFrostbiteColdTickDamage({
      ambientTickDamage,
      frostbite: healthStateForDamage.frostbite,
      effectiveMaxHealth,
    });
    tickDamage = frostTick.totalDamage;
  }

  const damagedInstance = applyingWildlifeInstanceHealthDamageWithFloatFeedback(
    {
      instance: {
        ...nextInstance,
        healthState: healthStateForDamage,
      },
      rawAmount: tickDamage,
      kind: mappingWorldPlazaEnvironmentalHazardKindToDamageKind(hazard.kind),
      nowMs,
      options: {
        skipDamageRoll: true,
      },
    }
  );

  notifyingWildlifeVocalSfxOnDeath({
    instanceId: nextInstance.instanceId,
    wasDead: nextInstance.isDead,
    isDead: damagedInstance.isDead,
  });

  return {
    ...damagedInstance,
    environmentalDamageLastTickAtMs: nowMs,
  };
}
