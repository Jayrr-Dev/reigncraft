/**
 * Thins easy biomes farther from origin by deterministic remapping.
 *
 * @module components/world/domains/resolvingWorldPlazaDistanceDangerBiasedBiomeKind
 */

import { computingWorldPlazaDistanceDangerBandFromOrigin } from '@/components/world/domains/computingWorldPlazaDistanceDangerBandFromOrigin';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_BIOME_SUPPRESS_SALT,
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_KINDS,
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_REPLACEMENTS,
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_SUPPRESS_CHANCE_MAX,
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_SUPPRESS_CHANCE_PER_BAND,
  type DefiningWorldPlazaDistanceDangerEasyBiomeKind,
} from '@/components/world/domains/definingWorldPlazaDistanceDangerConstants';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';

const EASY_BIOME_KIND_SET = new Set<string>(
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_KINDS
);

function checkingWorldPlazaDistanceDangerEasyBiomeKind(
  biomeKind: DefiningWorldPlazaBiomeKind
): biomeKind is DefiningWorldPlazaDistanceDangerEasyBiomeKind {
  return EASY_BIOME_KIND_SET.has(biomeKind);
}

/** Suppress chance for the current danger band, capped. */
export function resolvingWorldPlazaDistanceDangerEasyBiomeSuppressChance(
  dangerBand: number
): number {
  if (dangerBand <= 0) {
    return 0;
  }

  return Math.min(
    DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_SUPPRESS_CHANCE_MAX,
    DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_SUPPRESS_CHANCE_PER_BAND *
      dangerBand
  );
}

function pickingWorldPlazaDistanceDangerReplacementBiome(
  easyBiomeKind: DefiningWorldPlazaDistanceDangerEasyBiomeKind,
  tileX: number,
  tileY: number
): DefiningWorldPlazaBiomeKind {
  const replacements =
    DEFINING_WORLD_PLAZA_DISTANCE_DANGER_EASY_BIOME_REPLACEMENTS[easyBiomeKind];
  const pickUnit = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_DISTANCE_DANGER_BIOME_SUPPRESS_SALT + 1
  );
  const pickIndex = Math.min(
    replacements.length - 1,
    Math.floor(
      mappingWorldPlazaGrassSeededUnitToFloatRange(
        pickUnit,
        0,
        replacements.length
      )
    )
  );

  return replacements[pickIndex] ?? easyBiomeKind;
}

/**
 * May replace plains / forest / snowy plains with a harder neighbor when far
 * from origin. Non-easy biomes pass through unchanged.
 */
export function resolvingWorldPlazaDistanceDangerBiasedBiomeKind(
  biomeKind: DefiningWorldPlazaBiomeKind,
  tileX: number,
  tileY: number
): DefiningWorldPlazaBiomeKind {
  if (!checkingWorldPlazaDistanceDangerEasyBiomeKind(biomeKind)) {
    return biomeKind;
  }

  const dangerBand = computingWorldPlazaDistanceDangerBandFromOrigin(
    tileX,
    tileY
  );
  const suppressChance =
    resolvingWorldPlazaDistanceDangerEasyBiomeSuppressChance(dangerBand);

  if (suppressChance <= 0) {
    return biomeKind;
  }

  const suppressRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_DISTANCE_DANGER_BIOME_SUPPRESS_SALT
  );

  if (suppressRoll >= suppressChance) {
    return biomeKind;
  }

  return pickingWorldPlazaDistanceDangerReplacementBiome(
    biomeKind,
    tileX,
    tileY
  );
}
