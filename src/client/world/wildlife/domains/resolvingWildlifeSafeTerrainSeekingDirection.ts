/**
 * Blends a base heading with Safe-terrain seeking (nearest jumpable gap).
 *
 * Reusable for flee, herd panic, or any future intent that wants rivers /
 * cliffs between the animal and a threat.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSafeTerrainSeekingDirection
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_DIRECTION_BLEND_WEIGHT } from '@/components/world/wildlife/domains/definingWildlifeSafeTerrainSeekingConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeNearestSafeTerrainDirection } from '@/components/world/wildlife/domains/resolvingWildlifeNearestSafeTerrainDirection';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type ResolvingWildlifeSafeTerrainSeekingDirectionParams = {
  position: DefiningWorldPlazaWorldPoint;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  /** Base heading (away from threat, herd blend, etc.). */
  baseDirection: { x: number; y: number };
};

function resolvingWildlifeNormalizedDirection(direction: {
  x: number;
  y: number;
}): { x: number; y: number } {
  const length = Math.hypot(direction.x, direction.y);

  if (length <= 0.0001) {
    return { x: 1, y: 0 };
  }

  return {
    x: direction.x / length,
    y: direction.y / length,
  };
}

/**
 * Returns a heading biased toward the nearest qualifying jumpable gap.
 * When the species does not seek safe terrain or no gap is found, returns
 * the normalized `baseDirection` unchanged.
 */
export function resolvingWildlifeSafeTerrainSeekingDirection({
  position,
  species,
  hazardSampling,
  baseDirection,
}: ResolvingWildlifeSafeTerrainSeekingDirectionParams): { x: number; y: number } {
  const base = resolvingWildlifeNormalizedDirection(baseDirection);
  const safeTerrain = resolvingWildlifeNearestSafeTerrainDirection({
    position,
    species,
    hazardSampling,
    preferredDirection: base,
  });

  if (!safeTerrain) {
    return base;
  }

  const blend = DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_DIRECTION_BLEND_WEIGHT;
  const blended = {
    x: base.x * (1 - blend) + safeTerrain.direction.x * blend,
    y: base.y * (1 - blend) + safeTerrain.direction.y * blend,
  };

  return resolvingWildlifeNormalizedDirection(blended);
}
