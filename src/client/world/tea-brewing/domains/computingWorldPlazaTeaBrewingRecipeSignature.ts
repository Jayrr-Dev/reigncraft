/**
 * Canonical recipe signature and deterministic hash for tea brews.
 *
 * @module components/world/tea-brewing/domains/computingWorldPlazaTeaBrewingRecipeSignature
 */

import { DEFINING_WORLD_PLAZA_TEA_BREWING_FORMULA_VERSION } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';

/**
 * Builds a stable signature from ingredient counts (order-independent).
 * Format: `v{version}|itemId:count|itemId:count|...` sorted by itemId.
 */
export function computingWorldPlazaTeaBrewingRecipeSignature(
  ingredientItemTypeIds: readonly string[],
  formulaVersion: number = DEFINING_WORLD_PLAZA_TEA_BREWING_FORMULA_VERSION
): string {
  const counts = new Map<string, number>();

  for (const itemTypeId of ingredientItemTypeIds) {
    counts.set(itemTypeId, (counts.get(itemTypeId) ?? 0) + 1);
  }

  const parts = [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([itemTypeId, count]) => `${itemTypeId}:${count}`);

  return `v${formulaVersion}|${parts.join('|')}`;
}

export function parsingWorldPlazaTeaBrewingIngredientCountsFromSignature(
  recipeSignature: string
): Record<string, number> {
  const counts: Record<string, number> = {};
  const segments = recipeSignature.split('|').slice(1);

  for (const segment of segments) {
    const separatorIndex = segment.lastIndexOf(':');

    if (separatorIndex <= 0) {
      continue;
    }

    const itemTypeId = segment.slice(0, separatorIndex);
    const count = Number(segment.slice(separatorIndex + 1));

    if (itemTypeId && Number.isFinite(count) && count > 0) {
      counts[itemTypeId] = count;
    }
  }

  return counts;
}

/**
 * Deterministic 32-bit hash for naming tie-breaks.
 */
export function computingWorldPlazaTeaBrewingRecipeHash(
  recipeSignature: string
): number {
  let hash = 2166136261;

  for (let index = 0; index < recipeSignature.length; index += 1) {
    hash ^= recipeSignature.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
