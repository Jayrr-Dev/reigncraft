/**
 * Environmental hazard damage tick for one wildlife instance.
 *
 * @module components/world/wildlife/domains/advancingWildlifeEnvironmentalDamageTick
 */

import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond } from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import type { DefiningWorldPlazaEnvironmentalHazard } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';
import { pruningWorldPlazaEntityHealthFloatTexts } from '@/components/world/health/domains/managingWorldPlazaEntityHealthFloatTexts';
import { mappingWorldPlazaEnvironmentalHazardKindToDamageKind } from '@/components/world/health/domains/mappingWorldPlazaEnvironmentalHazardKindToDamageKind';
import { applyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRates } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureResistanceMultiplier';
import { resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint';
import { applyingWildlifeInstanceHealthDamageWithFloatFeedback } from '@/components/world/wildlife/domains/applyingWildlifeInstanceHealthDamageWithFloatFeedback';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceCollisionRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

export type AdvancingWildlifeEnvironmentalDamageTickParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  isDaytime: boolean;
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  nowMs: number;
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

function resolvingWildlifeEnvironmentalHazardAtPosition(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  isDaytime: boolean,
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): DefiningWorldPlazaEnvironmentalHazard | null {
  const hazard = resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint({
    center: instance.position,
    isDaytime,
    playerRadiusGrid: resolvingWildlifeInstanceCollisionRadiusGrid(
      species,
      instance
    ),
    placedBlocksByTile,
  });

  if (
    !hazard ||
    !checkingWildlifeSpeciesTakesEnvironmentalHazard(hazard, species)
  ) {
    return null;
  }

  return hazard;
}

/**
 * Applies discrete environmental damage ticks and prunes expired combat floats.
 */
export function advancingWildlifeEnvironmentalDamageTick({
  instance,
  species,
  isDaytime,
  placedBlocksByTile,
  nowMs,
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

  const prunedInstance = {
    ...instance,
    floatingTexts: pruningWorldPlazaEntityHealthFloatTexts(
      instance.floatingTexts,
      nowMs
    ),
  };

  const hazard = resolvingWildlifeEnvironmentalHazardAtPosition(
    prunedInstance,
    species,
    isDaytime,
    placedBlocksByTile
  );

  if (!hazard) {
    return {
      ...prunedInstance,
      environmentalDamageLastTickAtMs: null,
    };
  }

  const effectiveMaxHealth = computingWorldPlazaEntityHealthEffectiveMax(
    prunedInstance.healthState,
    nowMs
  );
  const resistedRates =
    applyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRates({
      damagePerSecond: hazard.damagePerSecond,
      maxHealthPercentPerSecond: hazard.maxHealthPercentPerSecond,
      exposureKind: hazard.kind === 'cold' ? 'cold' : 'heat',
      resistance: prunedInstance.healthState.temperatureResistance,
    });
  const resistedDamagePerSecond =
    computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond(
      resistedRates.damagePerSecond,
      resistedRates.maxHealthPercentPerSecond,
      effectiveMaxHealth
    );

  if (resistedDamagePerSecond <= 0) {
    return {
      ...prunedInstance,
      environmentalDamageLastTickAtMs: null,
    };
  }

  const lastTickAtMs = prunedInstance.environmentalDamageLastTickAtMs;

  if (lastTickAtMs === null) {
    return {
      ...prunedInstance,
      environmentalDamageLastTickAtMs: nowMs,
    };
  }

  const elapsedMs = nowMs - lastTickAtMs;

  if (
    elapsedMs <
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS
  ) {
    return prunedInstance;
  }

  const tickDamage = resistedDamagePerSecond * (elapsedMs / 1000);

  return {
    ...applyingWildlifeInstanceHealthDamageWithFloatFeedback({
      instance: prunedInstance,
      rawAmount: tickDamage,
      kind: mappingWorldPlazaEnvironmentalHazardKindToDamageKind(hazard.kind),
      nowMs,
      options: {
        skipDamageRoll: true,
      },
    }),
    environmentalDamageLastTickAtMs: nowMs,
  };
}
