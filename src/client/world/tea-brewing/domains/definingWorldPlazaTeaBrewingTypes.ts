/**
 * Types for modular teapot brewing traits and resolved brew results.
 *
 * @module components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingTypes
 */

import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type DefiningWorldPlazaTeaBrewingTraitCategory =
  | 'heal'
  | 'stamina'
  | 'speed'
  | 'calm'
  | 'defence'
  | 'cold'
  | 'heat'
  | 'sleep'
  | 'toxic'
  | 'utility';

export type DefiningWorldPlazaTeaBrewingTraitPolarity = 'positive' | 'negative';

export type DefiningWorldPlazaTeaBrewingScalableEffect =
  | {
      readonly kind: 'heal_of_max';
      /** Fraction of effective max HP at potency 1. */
      readonly baseOfMax: number;
    }
  | {
      readonly kind: 'movement_modifier';
      readonly modifierKind:
        | 'speed'
        | 'stamina_drain'
        | 'stamina_regen'
        | 'stamina_max';
      /** Multiplier delta from 1 at potency 1 (e.g. 0.1 → ×1.1). */
      readonly baseMultiplierDelta: number;
    }
  | {
      readonly kind: 'temperature_tolerance';
      readonly band: 'cold' | 'heat';
      readonly baseCelsius: number;
    }
  | {
      readonly kind: 'temperature_resistance';
      readonly band: 'cold' | 'heat';
      readonly baseResistance: number;
    }
  | {
      readonly kind: 'braced';
    }
  | {
      readonly kind: 'sleep';
      readonly baseDurationMs: number;
      readonly baseHealOfMax: number;
      readonly canWakeFromDamage: boolean;
      readonly regenMultiplier?: number;
    }
  | {
      readonly kind: 'poison_of_max';
      readonly baseOfMax: number;
      readonly baseDurationMs: number;
    }
  | {
      readonly kind: 'clear_sickness';
    }
  | {
      readonly kind: 'infection_resist';
      readonly chanceMultiplier: number;
    }
  | {
      readonly kind: 'incoming_damage_multiplier';
      readonly damageKinds: readonly DefiningWorldPlazaEntityDamageKind[];
      /** Multiplier at potency 1 (e.g. 0.5 → half damage). */
      readonly baseMultiplier: number;
    };

export type DefiningWorldPlazaTeaBrewingTraitDefinition = {
  readonly traitId: string;
  readonly category: DefiningWorldPlazaTeaBrewingTraitCategory;
  readonly polarity: DefiningWorldPlazaTeaBrewingTraitPolarity;
  readonly adjective: string;
  readonly basePotency: number;
  readonly baseDurationMs: number;
  readonly effect: DefiningWorldPlazaTeaBrewingScalableEffect;
};

export type DefiningWorldPlazaTeaBrewingIngredientDefinition = {
  readonly itemTypeId: string;
  readonly noun: string;
  readonly traits: readonly DefiningWorldPlazaTeaBrewingTraitDefinition[];
};

export type DefiningWorldPlazaTeaBrewingResolvedEffect = {
  readonly traitId: string;
  readonly category: DefiningWorldPlazaTeaBrewingTraitCategory;
  readonly polarity: DefiningWorldPlazaTeaBrewingTraitPolarity;
  readonly adjective: string;
  readonly potency: number;
  readonly durationMs: number;
  readonly effect: DefiningWorldPlazaTeaBrewingScalableEffect;
};

export type DefiningWorldPlazaTeaBrewingConcentrationBonus = {
  readonly category: DefiningWorldPlazaTeaBrewingTraitCategory;
  readonly label: string;
  readonly effect: DefiningWorldPlazaTeaBrewingScalableEffect;
  readonly durationMs: number;
};

export type DefiningWorldPlazaTeaBrewingRecipeResult = {
  readonly formulaVersion: number;
  readonly recipeSignature: string;
  readonly recipeHash: number;
  readonly displayName: string;
  readonly description: string;
  readonly ingredientCounts: Readonly<Record<string, number>>;
  readonly effects: readonly DefiningWorldPlazaTeaBrewingResolvedEffect[];
  readonly concentrationBonus: DefiningWorldPlazaTeaBrewingConcentrationBonus | null;
};

export type DefiningWorldPlazaTeaBrewingMetadata =
  DefiningWorldPlazaTeaBrewingRecipeResult;
