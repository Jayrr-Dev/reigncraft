/**
 * Picks a biome-appropriate wildlife species for a procedural chest key.
 *
 * @module components/world/chest/domains/resolvingWorldPlazaProceduralChestWildlifeSpeciesIdAtTileIndex
 */

import { computingWorldPlazaProceduralChestSeedUnitFromTileIndex } from '@/components/world/chest/domains/computingWorldPlazaProceduralChestSeedUnitFromTileIndex';
import { DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_WILDLIFE_SPECIES_SEED_SALT } from '@/components/world/chest/domains/definingWorldPlazaProceduralChestConstants';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeSpeciesIdsForBiomeKinds } from '@/components/world/wildlife/domains/listingWildlifeSpeciesIdsForBiomeKinds';

const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_WILDLIFE_SPECIES_FALLBACK_ID =
  'deer' as const satisfies DefiningWildlifeSpeciesId;

/**
 * Deterministically picks a hunt target species for one chest tile.
 */
export function resolvingWorldPlazaProceduralChestWildlifeSpeciesIdAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWildlifeSpeciesId {
  const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);
  const speciesIds = listingWildlifeSpeciesIdsForBiomeKinds([biome.kind]);

  if (speciesIds.length === 0) {
    return DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_WILDLIFE_SPECIES_FALLBACK_ID;
  }

  const speciesUnit = computingWorldPlazaProceduralChestSeedUnitFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_WILDLIFE_SPECIES_SEED_SALT
  );
  const speciesIndex = Math.min(
    speciesIds.length - 1,
    Math.floor(speciesUnit * speciesIds.length)
  );

  return speciesIds[speciesIndex] ?? speciesIds[0]!;
}
