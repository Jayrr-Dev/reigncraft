/**
 * Rolls whether a universal chest key should drop from an active source.
 *
 * @module components/world/chest/domains/rollingWorldPlazaChestKeyDrop
 */

import type { DefiningWorldPlazaChestKeySource } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import { DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_KEY_DROP_CHANCE } from '@/components/world/chest/domains/definingWorldPlazaProceduralChestConstants';

/**
 * Returns true when the source is active for a locked chest and the roll succeeds.
 */
export function rollingWorldPlazaChestKeyDrop(
  activeSources: ReadonlySet<DefiningWorldPlazaChestKeySource>,
  source: DefiningWorldPlazaChestKeySource,
  randomUnit: number,
  dropChance: number = DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_KEY_DROP_CHANCE
): boolean {
  if (!activeSources.has(source)) {
    return false;
  }

  return randomUnit < dropChance;
}
