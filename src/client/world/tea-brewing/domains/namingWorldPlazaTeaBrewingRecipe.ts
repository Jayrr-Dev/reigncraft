/**
 * Deterministic display names for brewed tea recipes.
 *
 * @module components/world/tea-brewing/domains/namingWorldPlazaTeaBrewingRecipe
 */

import type { DefiningWorldPlazaTeaBrewingResolvedEffect } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingTypes';

const DEFINING_WORLD_PLAZA_TEA_BREWING_NAME_SUFFIXES = [
  'Infusion',
  'Draught',
  'Brew',
  'Tonic',
  'Cup',
] as const;

export type NamingWorldPlazaTeaBrewingRecipeParams = {
  readonly effects: readonly DefiningWorldPlazaTeaBrewingResolvedEffect[];
  readonly nouns: readonly string[];
  readonly recipeHash: number;
  readonly hasConcentrationBonus: boolean;
};

function resolvingDominantAdjective(
  effects: readonly DefiningWorldPlazaTeaBrewingResolvedEffect[]
): string {
  const positive = effects.filter((effect) => effect.polarity === 'positive');
  const pool = positive.length > 0 ? positive : effects;

  if (pool.length === 0) {
    return 'Plain';
  }

  return [...pool].sort((left, right) => {
    if (right.potency !== left.potency) {
      return right.potency - left.potency;
    }

    return left.traitId.localeCompare(right.traitId);
  })[0].adjective;
}

function resolvingDominantNoun(nouns: readonly string[]): string {
  const votes = new Map<string, number>();

  for (const noun of nouns) {
    votes.set(noun, (votes.get(noun) ?? 0) + 1);
  }

  return [...votes.entries()].sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }

    return left[0].localeCompare(right[0]);
  })[0][0];
}

/**
 * Builds a stable name from concentration, dominant trait, noun, and hash suffix.
 */
export function namingWorldPlazaTeaBrewingRecipe({
  effects,
  nouns,
  recipeHash,
  hasConcentrationBonus,
}: NamingWorldPlazaTeaBrewingRecipeParams): string {
  const prefix = hasConcentrationBonus ? 'Concentrated ' : '';
  const adjective = resolvingDominantAdjective(effects);
  const noun = nouns.length > 0 ? resolvingDominantNoun(nouns) : 'Herb';
  const suffix =
    DEFINING_WORLD_PLAZA_TEA_BREWING_NAME_SUFFIXES[
      recipeHash % DEFINING_WORLD_PLAZA_TEA_BREWING_NAME_SUFFIXES.length
    ];

  return `${prefix}${adjective} ${noun} ${suffix}`;
}
