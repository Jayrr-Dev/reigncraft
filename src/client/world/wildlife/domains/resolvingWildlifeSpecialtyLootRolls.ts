/**
 * Pure specialty loot roll resolver for wildlife death drops.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpecialtyLootRolls
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeSpecialtyLootSpeciesEntry,
  type DefiningWildlifeSpecialtyLootRoll,
} from '@/components/world/wildlife/domains/definingWildlifeSpecialtyLootSpeciesRegistry';

export type ResolvingWildlifeSpecialtyLootRollResult = {
  readonly itemTypeId: string;
  readonly quantity: number;
};

function rollingWildlifeSpecialtyLootEntry(
  roll: DefiningWildlifeSpecialtyLootRoll,
  randomUnit: number
): ResolvingWildlifeSpecialtyLootRollResult | null {
  if (randomUnit >= roll.dropChance) {
    return null;
  }

  return {
    itemTypeId: roll.itemTypeId,
    quantity: 1,
  };
}

/**
 * Rolls common + rare specialty drops for a species.
 * Pass independent random units so tests stay deterministic.
 */
export function resolvingWildlifeSpecialtyLootRolls(
  speciesId: DefiningWildlifeSpeciesId,
  commonRandomUnit: number = Math.random(),
  rareRandomUnit: number = Math.random()
): readonly ResolvingWildlifeSpecialtyLootRollResult[] {
  const entry = resolvingWildlifeSpecialtyLootSpeciesEntry(speciesId);

  if (!entry) {
    return [];
  }

  const drops: ResolvingWildlifeSpecialtyLootRollResult[] = [];
  const commonDrop = rollingWildlifeSpecialtyLootEntry(
    entry.common,
    commonRandomUnit
  );
  const rareDrop = rollingWildlifeSpecialtyLootEntry(
    entry.rare,
    rareRandomUnit
  );

  if (commonDrop) {
    drops.push(commonDrop);
  }

  if (rareDrop) {
    drops.push(rareDrop);
  }

  return drops;
}
