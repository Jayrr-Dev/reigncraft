/**
 * True when a wildlife instance is taking environmental heat damage.
 *
 * @module components/world/wildlife/domains/checkingWildlifeIsTakingEnvironmentalHeatDamage
 */

import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { resolvingWorldPlazaEntityEffectiveLocalTemperatureCelsius } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthTemperatureImpulse';
import { buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius } from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import { resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceCollisionRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

export type CheckingWildlifeIsTakingEnvironmentalHeatDamageParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  isDaytime: boolean;
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
};

/**
 * Returns true while species-specific heat DoT applies (heat-immune skip).
 */
export function checkingWildlifeIsTakingEnvironmentalHeatDamage({
  instance,
  species,
  isDaytime,
  placedBlocksByTile,
}: CheckingWildlifeIsTakingEnvironmentalHeatDamageParams): boolean {
  if (species.hazards.isHeatImmune || instance.isDead) {
    return false;
  }

  const localTemperatureCelsius =
    resolvingWorldPlazaEntityEffectiveLocalTemperatureCelsius(
      resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint({
        center: instance.position,
        isDaytime,
        playerRadiusGrid: resolvingWildlifeInstanceCollisionRadiusGrid(
          species,
          instance
        ),
        placedBlocksByTile,
      }),
      instance.healthState
    );

  const hazard = buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius(
    localTemperatureCelsius,
    instance.healthState.temperatureResistance
  );

  return hazard?.kind === 'heat';
}
