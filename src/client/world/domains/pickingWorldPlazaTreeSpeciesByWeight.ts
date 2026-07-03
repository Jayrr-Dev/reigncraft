import type {
  DefiningWorldPlazaTreeSpecies,
  DefiningWorldPlazaTreeSpeciesWeight,
} from "@/components/world/domains/definingWorldPlazaTreeConstants";

/**
 * Deterministic weighted selection of a tree species from a biome pool.
 *
 * @module components/world/domains/pickingWorldPlazaTreeSpeciesByWeight
 */

/**
 * Picks a species from a weighted pool using a seeded unit float.
 *
 * @param speciesWeights - Non-empty weighted pool for one biome.
 * @param unitFloat - Seeded value in [0, 1) deciding the roll.
 */
export function pickingWorldPlazaTreeSpeciesByWeight(
  speciesWeights: readonly DefiningWorldPlazaTreeSpeciesWeight[],
  unitFloat: number,
): DefiningWorldPlazaTreeSpecies {
  let totalWeight = 0;

  for (const entry of speciesWeights) {
    totalWeight += entry.weight;
  }

  let cursor = unitFloat * totalWeight;

  for (const entry of speciesWeights) {
    cursor -= entry.weight;

    if (cursor < 0) {
      return entry.species;
    }
  }

  return speciesWeights[speciesWeights.length - 1].species;
}
