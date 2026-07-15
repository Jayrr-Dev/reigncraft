/**
 * Herbarium panel category filter ids and match rules.
 *
 * @module components/home/domains/definingPlazaHerbariumCategoryFilter
 */

import { DEFINING_WORLD_PLAZA_FORAGE_LEAF_LOOT_KINDS } from '@/components/world/inventory/domains/definingWorldPlazaForageLootKindMapping';

/** Panel tab ids for Herbarium flora groups. */
export type PlazaHerbariumCategoryFilterId =
  | 'all'
  | 'flower'
  | 'leaves'
  | 'berry'
  | 'mushroom'
  | 'tree';

/** Ordered category tabs shown above the Herbarium grid. */
export const DEFINING_PLAZA_HERBARIUM_CATEGORY_FILTERS: readonly {
  id: PlazaHerbariumCategoryFilterId;
  label: string;
}[] = [
  { id: 'all', label: 'All' },
  { id: 'flower', label: 'Flowers' },
  { id: 'leaves', label: 'Leaves' },
  { id: 'berry', label: 'Berries' },
  { id: 'mushroom', label: 'Mushrooms' },
  { id: 'tree', label: 'Trees' },
] as const;

/** Berry loot kinds that live under the Leaves tab with clovers. */
export const DEFINING_PLAZA_HERBARIUM_LEAVES_BERRY_LOOT_KINDS =
  DEFINING_WORLD_PLAZA_FORAGE_LEAF_LOOT_KINDS;

export type PlazaHerbariumLeavesBerryLootKind =
  (typeof DEFINING_PLAZA_HERBARIUM_LEAVES_BERRY_LOOT_KINDS)[number];

/** Minimal entry shape needed to match a category tab. */
export type PlazaHerbariumCategoryFilterableEntry =
  | { kind: 'flower' }
  | { kind: 'tree' }
  | { kind: 'clover' }
  | { kind: 'mushroom' }
  | { kind: 'berry'; berryLootKind: string };

/** True when a berry guide card belongs in Leaves, not Berries. */
export function checkingPlazaHerbariumBerryIsLeavesCategory(
  berryLootKind: string
): berryLootKind is PlazaHerbariumLeavesBerryLootKind {
  return (
    DEFINING_PLAZA_HERBARIUM_LEAVES_BERRY_LOOT_KINDS as readonly string[]
  ).includes(berryLootKind);
}

/** True when a display entry belongs under the given category tab. */
export function checkingPlazaHerbariumEntryMatchesCategoryFilter(
  entry: PlazaHerbariumCategoryFilterableEntry,
  filterId: PlazaHerbariumCategoryFilterId
): boolean {
  if (filterId === 'all') {
    return true;
  }

  if (filterId === 'leaves') {
    if (entry.kind === 'clover') {
      return true;
    }

    return (
      entry.kind === 'berry' &&
      checkingPlazaHerbariumBerryIsLeavesCategory(entry.berryLootKind)
    );
  }

  if (filterId === 'berry') {
    return (
      entry.kind === 'berry' &&
      !checkingPlazaHerbariumBerryIsLeavesCategory(entry.berryLootKind)
    );
  }

  return entry.kind === filterId;
}
