/**
 * Resolves brew potency, duration, concentration bonuses, and display name.
 *
 * @module components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingRecipe
 */

import {
  computingWorldPlazaTeaBrewingRecipeHash,
  computingWorldPlazaTeaBrewingRecipeSignature,
} from '@/components/world/tea-brewing/domains/computingWorldPlazaTeaBrewingRecipeSignature';
import {
  DEFINING_WORLD_PLAZA_TEA_BREWING_CONCENTRATION_BONUS_MULTIPLIER,
  DEFINING_WORLD_PLAZA_TEA_BREWING_CONCENTRATION_BONUS_THRESHOLD,
  DEFINING_WORLD_PLAZA_TEA_BREWING_CONCENTRATION_POTENCY_COEFFICIENT,
  DEFINING_WORLD_PLAZA_TEA_BREWING_DIVERSITY_DURATION_COEFFICIENT,
  DEFINING_WORLD_PLAZA_TEA_BREWING_FORMULA_VERSION,
} from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';
import { resolvingWorldPlazaTeaBrewingIngredient } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingIngredientRegistry';
import type {
  DefiningWorldPlazaTeaBrewingConcentrationBonus,
  DefiningWorldPlazaTeaBrewingRecipeResult,
  DefiningWorldPlazaTeaBrewingResolvedEffect,
  DefiningWorldPlazaTeaBrewingTraitCategory,
  DefiningWorldPlazaTeaBrewingTraitDefinition,
} from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingTypes';
import { namingWorldPlazaTeaBrewingRecipe } from '@/components/world/tea-brewing/domains/namingWorldPlazaTeaBrewingRecipe';

type TraitAccumulator = {
  readonly trait: DefiningWorldPlazaTeaBrewingTraitDefinition;
  count: number;
  nounVotes: Map<string, number>;
};

const DEFINING_WORLD_PLAZA_TEA_BREWING_CATEGORY_BONUS_LABEL: Readonly<
  Record<DefiningWorldPlazaTeaBrewingTraitCategory, string>
> = {
  heal: 'Concentrated Vitality',
  stamina: 'Concentrated Endurance',
  speed: 'Concentrated Swiftness',
  calm: 'Concentrated Ease',
  defence: 'Concentrated Guard',
  cold: 'Concentrated Chill',
  heat: 'Concentrated Warmth',
  sleep: 'Concentrated Slumber',
  toxic: 'Concentrated Venom',
  utility: 'Concentrated Ward',
};

function computingConcentrationPotency(basePotency: number, count: number): number {
  const extra = Math.max(0, count - 1);
  return (
    basePotency *
    count *
    (1 +
      DEFINING_WORLD_PLAZA_TEA_BREWING_CONCENTRATION_POTENCY_COEFFICIENT *
        extra *
        extra)
  );
}

function computingDiversityDurationMs(
  baseDurationMs: number,
  uniqueTraitCount: number
): number {
  if (baseDurationMs <= 0) {
    return 0;
  }

  return Math.round(
    baseDurationMs *
      (1 +
        DEFINING_WORLD_PLAZA_TEA_BREWING_DIVERSITY_DURATION_COEFFICIENT *
          Math.max(0, uniqueTraitCount - 1))
  );
}

function resolvingConcentrationBonus(
  categoryContributionCounts: ReadonlyMap<
    DefiningWorldPlazaTeaBrewingTraitCategory,
    number
  >,
  durationMs: number
): DefiningWorldPlazaTeaBrewingConcentrationBonus | null {
  let bestCategory: DefiningWorldPlazaTeaBrewingTraitCategory | null = null;
  let bestCount = 0;

  for (const [category, count] of categoryContributionCounts) {
    if (count < DEFINING_WORLD_PLAZA_TEA_BREWING_CONCENTRATION_BONUS_THRESHOLD) {
      continue;
    }

    if (count > bestCount) {
      bestCategory = category;
      bestCount = count;
    }
  }

  if (!bestCategory) {
    return null;
  }

  const bonusDurationMs = Math.max(durationMs, 60_000);
  const label =
    DEFINING_WORLD_PLAZA_TEA_BREWING_CATEGORY_BONUS_LABEL[bestCategory];
  const delta =
    DEFINING_WORLD_PLAZA_TEA_BREWING_CONCENTRATION_BONUS_MULTIPLIER - 1;

  switch (bestCategory) {
    case 'stamina':
      return {
        category: bestCategory,
        label,
        durationMs: bonusDurationMs,
        effect: {
          kind: 'movement_modifier',
          modifierKind: 'stamina_max',
          baseMultiplierDelta: delta,
        },
      };
    case 'speed':
      return {
        category: bestCategory,
        label,
        durationMs: bonusDurationMs,
        effect: {
          kind: 'movement_modifier',
          modifierKind: 'speed',
          baseMultiplierDelta: delta * 0.5,
        },
      };
    case 'calm':
      return {
        category: bestCategory,
        label,
        durationMs: bonusDurationMs,
        effect: {
          kind: 'movement_modifier',
          modifierKind: 'stamina_drain',
          baseMultiplierDelta: -delta,
        },
      };
    case 'heal':
      return {
        category: bestCategory,
        label,
        durationMs: 0,
        effect: { kind: 'heal_of_max', baseOfMax: 0.05 * delta },
      };
    case 'defence':
      return {
        category: bestCategory,
        label,
        durationMs: bonusDurationMs,
        effect: { kind: 'braced' },
      };
    case 'cold':
      return {
        category: bestCategory,
        label,
        durationMs: bonusDurationMs,
        effect: {
          kind: 'temperature_tolerance',
          band: 'cold',
          baseCelsius: 5,
        },
      };
    case 'heat':
      return {
        category: bestCategory,
        label,
        durationMs: bonusDurationMs,
        effect: {
          kind: 'temperature_tolerance',
          band: 'heat',
          baseCelsius: 5,
        },
      };
    case 'toxic':
      return {
        category: bestCategory,
        label,
        durationMs: bonusDurationMs,
        effect: {
          kind: 'poison_of_max',
          baseOfMax: 0.05,
          baseDurationMs: bonusDurationMs,
        },
      };
    case 'sleep':
      return {
        category: bestCategory,
        label,
        durationMs: bonusDurationMs,
        effect: {
          kind: 'sleep',
          baseDurationMs: Math.round(bonusDurationMs * 0.5),
          baseHealOfMax: 0.02,
          canWakeFromDamage: true,
          regenMultiplier: 2,
        },
      };
    case 'utility':
      return {
        category: bestCategory,
        label,
        durationMs: bonusDurationMs,
        effect: { kind: 'infection_resist', chanceMultiplier: 0.4 },
      };
    default:
      return null;
  }
}

function describingBrew(
  effects: readonly DefiningWorldPlazaTeaBrewingResolvedEffect[],
  concentrationBonus: DefiningWorldPlazaTeaBrewingConcentrationBonus | null
): string {
  const positive = effects.filter((effect) => effect.polarity === 'positive');
  const negative = effects.filter((effect) => effect.polarity === 'negative');
  const parts: string[] = [];

  if (positive.length > 0) {
    parts.push(
      `Steeped traits: ${positive.map((effect) => effect.adjective).join(', ')}.`
    );
  }

  if (negative.length > 0) {
    parts.push(
      `Also concentrates: ${negative.map((effect) => effect.adjective).join(', ')}.`
    );
  }

  if (concentrationBonus) {
    parts.push(`${concentrationBonus.label} from a heavy steep.`);
  }

  if (parts.length === 0) {
    return 'A careful pour from the clay teapot.';
  }

  return parts.join(' ');
}

/**
 * Resolves a deterministic brew from ingredient item type ids (1–4).
 * Same multiset + formula version → same name and effects.
 */
export function resolvingWorldPlazaTeaBrewingRecipe(
  ingredientItemTypeIds: readonly string[],
  formulaVersion: number = DEFINING_WORLD_PLAZA_TEA_BREWING_FORMULA_VERSION
): DefiningWorldPlazaTeaBrewingRecipeResult | null {
  if (ingredientItemTypeIds.length === 0) {
    return null;
  }

  const traitAccumulators = new Map<string, TraitAccumulator>();
  const categoryContributionCounts = new Map<
    DefiningWorldPlazaTeaBrewingTraitCategory,
    number
  >();
  const ingredientCounts: Record<string, number> = {};
  const nouns: string[] = [];

  for (const itemTypeId of ingredientItemTypeIds) {
    const ingredient = resolvingWorldPlazaTeaBrewingIngredient(itemTypeId);

    if (!ingredient) {
      return null;
    }

    ingredientCounts[itemTypeId] = (ingredientCounts[itemTypeId] ?? 0) + 1;
    nouns.push(ingredient.noun);

    for (const trait of ingredient.traits) {
      const existing = traitAccumulators.get(trait.traitId);

      if (existing) {
        existing.count += 1;
        existing.nounVotes.set(
          ingredient.noun,
          (existing.nounVotes.get(ingredient.noun) ?? 0) + 1
        );
      } else {
        traitAccumulators.set(trait.traitId, {
          trait,
          count: 1,
          nounVotes: new Map([[ingredient.noun, 1]]),
        });
      }

      categoryContributionCounts.set(
        trait.category,
        (categoryContributionCounts.get(trait.category) ?? 0) + 1
      );
    }
  }

  const uniqueTraitCount = traitAccumulators.size;
  const effects: DefiningWorldPlazaTeaBrewingResolvedEffect[] = [];

  for (const accumulator of traitAccumulators.values()) {
    const potency = computingConcentrationPotency(
      accumulator.trait.basePotency,
      accumulator.count
    );
    const durationMs = computingDiversityDurationMs(
      accumulator.trait.baseDurationMs,
      uniqueTraitCount
    );

    effects.push({
      traitId: accumulator.trait.traitId,
      category: accumulator.trait.category,
      polarity: accumulator.trait.polarity,
      adjective: accumulator.trait.adjective,
      potency,
      durationMs,
      effect: accumulator.trait.effect,
    });
  }

  effects.sort((left, right) => {
    if (left.polarity !== right.polarity) {
      return left.polarity === 'positive' ? -1 : 1;
    }

    if (right.potency !== left.potency) {
      return right.potency - left.potency;
    }

    return left.traitId.localeCompare(right.traitId);
  });

  const maxDurationMs = effects.reduce(
    (max, effect) => Math.max(max, effect.durationMs),
    0
  );
  const concentrationBonus = resolvingConcentrationBonus(
    categoryContributionCounts,
    maxDurationMs
  );

  const recipeSignature = computingWorldPlazaTeaBrewingRecipeSignature(
    ingredientItemTypeIds,
    formulaVersion
  );
  const recipeHash = computingWorldPlazaTeaBrewingRecipeHash(recipeSignature);
  const displayName = namingWorldPlazaTeaBrewingRecipe({
    effects,
    nouns,
    recipeHash,
    hasConcentrationBonus: concentrationBonus !== null,
  });

  return {
    formulaVersion,
    recipeSignature,
    recipeHash,
    displayName,
    description: describingBrew(effects, concentrationBonus),
    ingredientCounts,
    effects,
    concentrationBonus,
  };
}
