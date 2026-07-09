import {
  DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_ADJECTIVE_SALT,
  DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_NOUN_SALT,
  DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_PATTERN_SALT,
  DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_SEED_SALT,
} from '@/components/world/domains/definingWorldPlazaBiomeRegionNameConstants';
import {
  DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_CONNECTORS,
  DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_NOUNS_BY_KIND,
  DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_SHARED_ADJECTIVES,
} from '@/components/world/domains/definingWorldPlazaBiomeRegionNameWordPools';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { hashingWorldPlazaCoordinateToUnitFloat } from '@/components/world/domains/generatingWorldPlazaValueNoise';

/**
 * Permanent unique display names for biome region cells.
 *
 * @module components/world/domains/resolvingWorldPlazaBiomeRegionDisplayName
 */

export type ResolvingWorldPlazaBiomeRegionDisplayNameInput = {
  regionX: number;
  regionY: number;
  biomeKind: DefiningWorldPlazaBiomeKind;
};

/**
 * Stable storage / discovery key for one biome region cell.
 *
 * @param regionX - Region column index.
 * @param regionY - Region row index.
 */
export function formattingWorldPlazaBiomeRegionDiscoveryKey(
  regionX: number,
  regionY: number
): string {
  return `${regionX}:${regionY}`;
}

function pickingWorldPlazaBiomeRegionNamePoolIndex(
  regionX: number,
  regionY: number,
  salt: number,
  poolLength: number
): number {
  const unit = hashingWorldPlazaCoordinateToUnitFloat(
    regionX,
    regionY,
    DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_SEED_SALT ^ salt
  );

  return Math.min(poolLength - 1, Math.floor(unit * poolLength));
}

/**
 * Resolves the permanent unique display name for a biome region cell.
 *
 * Deterministic from region coordinates + biome kind. Same world layout always
 * yields the same name for that cell.
 */
export function resolvingWorldPlazaBiomeRegionDisplayName({
  regionX,
  regionY,
  biomeKind,
}: ResolvingWorldPlazaBiomeRegionDisplayNameInput): string {
  const adjectives = DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_SHARED_ADJECTIVES;
  const nouns = DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_NOUNS_BY_KIND[biomeKind];
  const connectors = DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_CONNECTORS;

  const adjectiveIndex = pickingWorldPlazaBiomeRegionNamePoolIndex(
    regionX,
    regionY,
    DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_ADJECTIVE_SALT,
    adjectives.length
  );
  const nounIndex = pickingWorldPlazaBiomeRegionNamePoolIndex(
    regionX,
    regionY,
    DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_NOUN_SALT,
    nouns.length
  );
  const patternRoll = hashingWorldPlazaCoordinateToUnitFloat(
    regionX,
    regionY,
    DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_SEED_SALT ^
      DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_PATTERN_SALT
  );

  const adjective = adjectives[adjectiveIndex] ?? adjectives[0];
  const noun = nouns[nounIndex] ?? nouns[0];

  // ~70% "Adjective Noun", ~30% "The Noun Connector Adjective"
  if (patternRoll < 0.7) {
    return `${adjective} ${noun}`;
  }

  const connectorIndex = pickingWorldPlazaBiomeRegionNamePoolIndex(
    regionX,
    regionY,
    DEFINING_WORLD_PLAZA_BIOME_REGION_NAME_PATTERN_SALT + 11,
    connectors.length
  );
  const connector = connectors[connectorIndex] ?? connectors[0];

  return `The ${noun} ${connector} ${adjective}`;
}
