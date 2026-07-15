/**
 * Habitat biomes for fishing catch wildlife species (from catch water/biome filters).
 *
 * @module components/world/wildlife/domains/resolvingWildlifeFishSpeciesBiomeMembership
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { DEFINING_WORLD_PLAZA_BIOME_ALLOWED_WATER_KINDS } from '@/components/world/domains/definingWorldPlazaBiomeWaterPlacementConstants';
import {
  listingWorldPlazaFishingCatchCreatures,
  type DefiningWorldPlazaFishingCatchCreatureEntry,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const FISH_BIOME_MEMBERSHIP_BY_SPECIES_ID: Readonly<
  Record<string, readonly DefiningWorldPlazaBiomeKind[]>
> = Object.fromEntries(
  listingWorldPlazaFishingCatchCreatures().map((creature) => [
    creature.catchId,
    listingBiomesForFishCatch(creature),
  ])
);

function listingBiomesForFishCatch(
  creature: DefiningWorldPlazaFishingCatchCreatureEntry
): readonly DefiningWorldPlazaBiomeKind[] {
  if (creature.biomeKinds && creature.biomeKinds.length > 0) {
    return creature.biomeKinds;
  }

  const biomes: DefiningWorldPlazaBiomeKind[] = [];

  for (const [biomeKind, waterKinds] of Object.entries(
    DEFINING_WORLD_PLAZA_BIOME_ALLOWED_WATER_KINDS
  ) as Array<[DefiningWorldPlazaBiomeKind, readonly string[]]>) {
    if (
      creature.waterKinds.some((waterKind) => waterKinds.includes(waterKind))
    ) {
      biomes.push(biomeKind);
    }
  }

  return biomes;
}

/** Habitats for a fishing catch species, or null when not a fish catch id. */
export function resolvingWildlifeFishSpeciesBiomeMembership(
  speciesId: DefiningWildlifeSpeciesId
): readonly DefiningWorldPlazaBiomeKind[] | null {
  return FISH_BIOME_MEMBERSHIP_BY_SPECIES_ID[speciesId] ?? null;
}
