/**
 * Metadata parse / write helpers for teapot slots and brewed tea recipes.
 *
 * @module components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingMetadata
 */

import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_PLAZA_TEA_BREWING_METADATA_KEY,
  DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT,
  DEFINING_WORLD_PLAZA_TEA_POT_REMAINING_POURS_METADATA_KEY,
  DEFINING_WORLD_PLAZA_TEA_POT_SLOTS_METADATA_KEY,
} from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';
import type {
  DefiningWorldPlazaTeaBrewingConcentrationBonus,
  DefiningWorldPlazaTeaBrewingMetadata,
  DefiningWorldPlazaTeaBrewingResolvedEffect,
  DefiningWorldPlazaTeaBrewingScalableEffect,
  DefiningWorldPlazaTeaBrewingTraitCategory,
  DefiningWorldPlazaTeaBrewingTraitPolarity,
} from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingTypes';

function checkingIsPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parsingScalableEffect(
  value: unknown
): DefiningWorldPlazaTeaBrewingScalableEffect | null {
  if (!checkingIsPlainObject(value) || typeof value.kind !== 'string') {
    return null;
  }

  switch (value.kind) {
    case 'heal_of_max':
      return typeof value.baseOfMax === 'number'
        ? { kind: 'heal_of_max', baseOfMax: value.baseOfMax }
        : null;
    case 'movement_modifier':
      return typeof value.modifierKind === 'string' &&
        typeof value.baseMultiplierDelta === 'number'
        ? {
            kind: 'movement_modifier',
            modifierKind: value.modifierKind as
              | 'speed'
              | 'stamina_drain'
              | 'stamina_regen'
              | 'stamina_max',
            baseMultiplierDelta: value.baseMultiplierDelta,
          }
        : null;
    case 'temperature_tolerance':
      return (value.band === 'cold' || value.band === 'heat') &&
        typeof value.baseCelsius === 'number'
        ? {
            kind: 'temperature_tolerance',
            band: value.band,
            baseCelsius: value.baseCelsius,
          }
        : null;
    case 'temperature_resistance':
      return (value.band === 'cold' || value.band === 'heat') &&
        typeof value.baseResistance === 'number'
        ? {
            kind: 'temperature_resistance',
            band: value.band,
            baseResistance: value.baseResistance,
          }
        : null;
    case 'braced':
      return { kind: 'braced' };
    case 'sleep':
      return typeof value.baseDurationMs === 'number' &&
        typeof value.baseHealOfMax === 'number' &&
        typeof value.canWakeFromDamage === 'boolean'
        ? {
            kind: 'sleep',
            baseDurationMs: value.baseDurationMs,
            baseHealOfMax: value.baseHealOfMax,
            canWakeFromDamage: value.canWakeFromDamage,
            ...(typeof value.regenMultiplier === 'number'
              ? { regenMultiplier: value.regenMultiplier }
              : {}),
          }
        : null;
    case 'poison_of_max':
      return typeof value.baseOfMax === 'number' &&
        typeof value.baseDurationMs === 'number'
        ? {
            kind: 'poison_of_max',
            baseOfMax: value.baseOfMax,
            baseDurationMs: value.baseDurationMs,
          }
        : null;
    case 'clear_sickness':
      return { kind: 'clear_sickness' };
    case 'infection_resist':
      return typeof value.chanceMultiplier === 'number'
        ? {
            kind: 'infection_resist',
            chanceMultiplier: value.chanceMultiplier,
          }
        : null;
    default:
      return null;
  }
}

function parsingResolvedEffect(
  value: unknown
): DefiningWorldPlazaTeaBrewingResolvedEffect | null {
  if (!checkingIsPlainObject(value)) {
    return null;
  }

  const effect = parsingScalableEffect(value.effect);

  if (
    typeof value.traitId !== 'string' ||
    typeof value.category !== 'string' ||
    (value.polarity !== 'positive' && value.polarity !== 'negative') ||
    typeof value.adjective !== 'string' ||
    typeof value.potency !== 'number' ||
    typeof value.durationMs !== 'number' ||
    !effect
  ) {
    return null;
  }

  return {
    traitId: value.traitId,
    category: value.category as DefiningWorldPlazaTeaBrewingTraitCategory,
    polarity: value.polarity as DefiningWorldPlazaTeaBrewingTraitPolarity,
    adjective: value.adjective,
    potency: value.potency,
    durationMs: value.durationMs,
    effect,
  };
}

function parsingConcentrationBonus(
  value: unknown
): DefiningWorldPlazaTeaBrewingConcentrationBonus | null {
  if (value === null) {
    return null;
  }

  if (!checkingIsPlainObject(value)) {
    return null;
  }

  const effect = parsingScalableEffect(value.effect);

  if (
    typeof value.category !== 'string' ||
    typeof value.label !== 'string' ||
    typeof value.durationMs !== 'number' ||
    !effect
  ) {
    return null;
  }

  return {
    category: value.category as DefiningWorldPlazaTeaBrewingTraitCategory,
    label: value.label,
    durationMs: value.durationMs,
    effect,
  };
}

/**
 * Reads validated brew recipe metadata from an item instance.
 */
export function resolvingWorldPlazaTeaBrewingMetadata(
  metadata: DefiningInventoryItem['metadata']
): DefiningWorldPlazaTeaBrewingMetadata | null {
  const raw = metadata?.[DEFINING_WORLD_PLAZA_TEA_BREWING_METADATA_KEY];

  if (!checkingIsPlainObject(raw)) {
    return null;
  }

  if (
    typeof raw.formulaVersion !== 'number' ||
    typeof raw.recipeSignature !== 'string' ||
    typeof raw.recipeHash !== 'number' ||
    typeof raw.displayName !== 'string' ||
    typeof raw.description !== 'string' ||
    !checkingIsPlainObject(raw.ingredientCounts) ||
    !Array.isArray(raw.effects)
  ) {
    return null;
  }

  const effects: DefiningWorldPlazaTeaBrewingResolvedEffect[] = [];

  for (const entry of raw.effects) {
    const parsed = parsingResolvedEffect(entry);

    if (!parsed) {
      return null;
    }

    effects.push(parsed);
  }

  const ingredientCounts: Record<string, number> = {};

  for (const [itemTypeId, count] of Object.entries(raw.ingredientCounts)) {
    if (typeof count !== 'number' || count <= 0) {
      return null;
    }

    ingredientCounts[itemTypeId] = count;
  }

  return {
    formulaVersion: raw.formulaVersion,
    recipeSignature: raw.recipeSignature,
    recipeHash: raw.recipeHash,
    displayName: raw.displayName,
    description: raw.description,
    ingredientCounts,
    effects,
    concentrationBonus: parsingConcentrationBonus(raw.concentrationBonus),
  };
}

export function writingWorldPlazaTeaBrewingMetadata(
  metadata: DefiningInventoryItem['metadata'] | undefined,
  brew: DefiningWorldPlazaTeaBrewingMetadata
): Record<string, unknown> {
  return {
    ...(metadata ?? {}),
    [DEFINING_WORLD_PLAZA_TEA_BREWING_METADATA_KEY]: brew,
  };
}

export function resolvingWorldPlazaTeaPotIngredientSlots(
  metadata: DefiningInventoryItem['metadata']
): readonly (string | null)[] {
  const raw = metadata?.[DEFINING_WORLD_PLAZA_TEA_POT_SLOTS_METADATA_KEY];
  const slots: (string | null)[] = Array.from(
    { length: DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT },
    () => null
  );

  if (!Array.isArray(raw)) {
    return slots;
  }

  for (
    let index = 0;
    index < DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT;
    index += 1
  ) {
    const value = raw[index];
    slots[index] = typeof value === 'string' ? value : null;
  }

  return slots;
}

export function writingWorldPlazaTeaPotIngredientSlots(
  metadata: DefiningInventoryItem['metadata'] | undefined,
  slots: readonly (string | null)[]
): Record<string, unknown> {
  const normalized = Array.from(
    { length: DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT },
    (_, index) => slots[index] ?? null
  );

  return {
    ...(metadata ?? {}),
    [DEFINING_WORLD_PLAZA_TEA_POT_SLOTS_METADATA_KEY]: normalized,
  };
}

export function resolvingWorldPlazaTeaPotRemainingPours(
  metadata: DefiningInventoryItem['metadata']
): number | null {
  const raw =
    metadata?.[DEFINING_WORLD_PLAZA_TEA_POT_REMAINING_POURS_METADATA_KEY];

  return typeof raw === 'number' && Number.isFinite(raw) && raw >= 0
    ? Math.floor(raw)
    : null;
}

export function writingWorldPlazaTeaPotRemainingPours(
  metadata: DefiningInventoryItem['metadata'] | undefined,
  remainingPours: number
): Record<string, unknown> {
  return {
    ...(metadata ?? {}),
    [DEFINING_WORLD_PLAZA_TEA_POT_REMAINING_POURS_METADATA_KEY]: remainingPours,
  };
}

/**
 * True when two brew stacks share the same recipe signature and formula version.
 */
export function checkingWorldPlazaTeaBrewingMetadataStackCompatible(
  leftMetadata: DefiningInventoryItem['metadata'],
  rightMetadata: DefiningInventoryItem['metadata']
): boolean {
  const left = resolvingWorldPlazaTeaBrewingMetadata(leftMetadata);
  const right = resolvingWorldPlazaTeaBrewingMetadata(rightMetadata);

  if (!left && !right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  return (
    left.formulaVersion === right.formulaVersion &&
    left.recipeSignature === right.recipeSignature
  );
}
