/**
 * Resolves a flee intent toward cooler ground when heat damage applies.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeFleeToCoolerAreaIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardForPlayerAtWorldPoint';
import { DEFINING_WILDLIFE_HEAT_FLEE_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifeHeatFleeConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeCoolerAreaFleeDirection } from '@/components/world/wildlife/domains/resolvingWildlifeCoolerAreaFleeDirection';
import { resolvingWildlifeInstanceCollisionRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { resolvingWildlifeFleeFromThreatPointIntent } from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type ResolvingWildlifeFleeToCoolerAreaIntentParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
};

/**
 * Builds a synthetic heat "threat" behind the animal so flee sampling runs
 * toward cooler ground via the shared walkable flee picker.
 */
function resolvingWildlifeHeatThreatPoint(
  position: DefiningWorldPlazaWorldPoint,
  coolerDirection: { x: number; y: number }
): DefiningWorldPlazaWorldPoint {
  return {
    x: position.x - coolerDirection.x * DEFINING_WILDLIFE_HEAT_FLEE_DISTANCE_GRID,
    y: position.y - coolerDirection.y * DEFINING_WILDLIFE_HEAT_FLEE_DISTANCE_GRID,
    layer: position.layer,
  };
}

/**
 * Returns a flee intent aimed at cooler walkable terrain.
 * Falls back to a seeded escape away from the current tile when no cooler
 * heading is found (still better than standing in heat).
 */
export function resolvingWildlifeFleeToCoolerAreaIntent({
  instance,
  species,
  hazardSampling,
}: ResolvingWildlifeFleeToCoolerAreaIntentParams): DefiningWildlifeBehaviorIntent {
  const currentTemperatureCelsius =
    resolvingWorldPlazaEnvironmentalTemperatureForPlayerAtWorldPoint({
      center: instance.position,
      isDaytime: hazardSampling.isDaytime,
      playerRadiusGrid: resolvingWildlifeInstanceCollisionRadiusGrid(
        species,
        instance
      ),
      placedBlocksByTile: hazardSampling.placedBlocksByTile,
    });

  const cooler = resolvingWildlifeCoolerAreaFleeDirection({
    position: instance.position,
    instance,
    species,
    hazardSampling,
    currentTemperatureCelsius,
  });

  if (!cooler) {
    // No cooler tile in range: still panic-run away from the hot tile center.
    const hotTileThreat: DefiningWorldPlazaWorldPoint = {
      x: Math.floor(instance.position.x) + 0.5,
      y: Math.floor(instance.position.y) + 0.5,
      layer: instance.position.layer,
    };

    return resolvingWildlifeFleeFromThreatPointIntent({
      position: instance.position,
      threatPoint: hotTileThreat,
      fleeDistanceGrid: DEFINING_WILDLIFE_HEAT_FLEE_DISTANCE_GRID,
      species,
      hazardSampling,
    });
  }

  return resolvingWildlifeFleeFromThreatPointIntent({
    position: instance.position,
    threatPoint: resolvingWildlifeHeatThreatPoint(
      instance.position,
      cooler.direction
    ),
    fleeDistanceGrid: DEFINING_WILDLIFE_HEAT_FLEE_DISTANCE_GRID,
    species,
    hazardSampling,
    preferredFleeDirection: cooler.direction,
  });
}
