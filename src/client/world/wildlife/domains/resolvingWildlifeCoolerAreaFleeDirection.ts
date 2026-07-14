/**
 * Picks a heading toward cooler walkable ground for heat flee.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeCoolerAreaFleeDirection
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureComfortBand';
import { resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import {
  DEFINING_WILDLIFE_HEAT_FLEE_DIRECTION_COUNT,
  DEFINING_WILDLIFE_HEAT_FLEE_DISTANCE_GRID,
  DEFINING_WILDLIFE_HEAT_FLEE_EXIT_MARGIN_CELSIUS,
  DEFINING_WILDLIFE_HEAT_FLEE_MIN_COOLER_DELTA_CELSIUS,
  DEFINING_WILDLIFE_HEAT_FLEE_SCAN_STEP_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeHeatFleeConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type ResolvingWildlifeCoolerAreaFleeDirectionParams = {
  position: DefiningWorldPlazaWorldPoint;
  instance: Pick<DefiningWildlifeInstance, 'healthState'>;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  currentTemperatureCelsius: number;
};

export type ResolvingWildlifeCoolerAreaFleeDirectionResult = {
  direction: { x: number; y: number };
  temperatureCelsius: number;
};

function resolvingWildlifeNormalizedDirection(direction: {
  x: number;
  y: number;
}): { x: number; y: number } | null {
  const length = Math.hypot(direction.x, direction.y);

  if (length <= 0.0001) {
    return null;
  }

  return {
    x: direction.x / length,
    y: direction.y / length,
  };
}

/**
 * Returns the best cooler walkable heading, or null when none beats current heat.
 */
export function resolvingWildlifeCoolerAreaFleeDirection({
  position,
  instance,
  species,
  hazardSampling,
  currentTemperatureCelsius,
}: ResolvingWildlifeCoolerAreaFleeDirectionParams): ResolvingWildlifeCoolerAreaFleeDirectionResult | null {
  const comfortBand = resolvingWorldPlazaEntityTemperatureComfortBand(
    instance.healthState.temperatureResistance
  );

  let best: ResolvingWildlifeCoolerAreaFleeDirectionResult | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (
    let index = 0;
    index < DEFINING_WILDLIFE_HEAT_FLEE_DIRECTION_COUNT;
    index += 1
  ) {
    const angle =
      (index / DEFINING_WILDLIFE_HEAT_FLEE_DIRECTION_COUNT) * Math.PI * 2;
    const direction = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    for (
      let distanceGrid = DEFINING_WILDLIFE_HEAT_FLEE_SCAN_STEP_GRID;
      distanceGrid <= DEFINING_WILDLIFE_HEAT_FLEE_DISTANCE_GRID;
      distanceGrid += DEFINING_WILDLIFE_HEAT_FLEE_SCAN_STEP_GRID
    ) {
      const candidatePoint = {
        x: position.x + direction.x * distanceGrid,
        y: position.y + direction.y * distanceGrid,
        layer: position.layer,
      };

      if (
        checkingWildlifeHazardAtPoint({
          point: candidatePoint,
          species,
          placedBlocks: hazardSampling.placedBlocks,
          placedBlocksByTile: hazardSampling.placedBlocksByTile,
          isDaytime: hazardSampling.isDaytime,
        }) !== 'safe'
      ) {
        continue;
      }

      const temperatureCelsius =
        resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
          tileX: Math.floor(candidatePoint.x),
          tileY: Math.floor(candidatePoint.y),
          isDaytime: hazardSampling.isDaytime,
          placedBlocksByTile: hazardSampling.placedBlocksByTile,
        });
      const coolerDeltaCelsius =
        currentTemperatureCelsius - temperatureCelsius;

      if (
        coolerDeltaCelsius < DEFINING_WILDLIFE_HEAT_FLEE_MIN_COOLER_DELTA_CELSIUS
      ) {
        continue;
      }

      const underComfort =
        temperatureCelsius <=
        comfortBand.comfortHighCelsius -
          DEFINING_WILDLIFE_HEAT_FLEE_EXIT_MARGIN_CELSIUS
          ? 1
          : 0;
      // Prefer under-comfort tiles, then bigger cool drops, then farther legs.
      const score =
        underComfort * 1000 + coolerDeltaCelsius * 10 + distanceGrid * 0.1;

      if (score > bestScore) {
        bestScore = score;
        best = {
          direction,
          temperatureCelsius,
        };
      }
    }
  }

  if (!best) {
    return null;
  }

  const normalized = resolvingWildlifeNormalizedDirection(best.direction);

  if (!normalized) {
    return null;
  }

  return {
    direction: normalized,
    temperatureCelsius: best.temperatureCelsius,
  };
}
