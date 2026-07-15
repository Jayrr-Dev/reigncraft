/**
 * Samples a fixed set of playable avatar skins for one Perma Death run.
 *
 * @module components/world/domains/rollingWorldPlazaPermaDeathCharacterPickerOptions
 */

import type { DefiningWorldPlazaAvatarSkinOption } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT } from '@/components/world/domains/definingWorldPlazaPermaDeathLoadConstants';

/**
 * Picks up to {@link DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT}
 * unique skins from the pool via partial Fisher–Yates.
 *
 * @param pool - Accessible playable avatar skin options.
 * @param count - How many options to offer. Defaults to the Perma Death constant.
 * @param random - Optional RNG in [0, 1). Defaults to Math.random.
 */
export function rollingWorldPlazaPermaDeathCharacterPickerOptions(
  pool: readonly DefiningWorldPlazaAvatarSkinOption[],
  count: number = DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT,
  random: () => number = Math.random
): readonly DefiningWorldPlazaAvatarSkinOption[] {
  if (pool.length === 0 || count <= 0) {
    return [];
  }

  const takeCount = Math.min(count, pool.length);
  const working = [...pool];

  for (let index = 0; index < takeCount; index += 1) {
    const remaining = working.length - index;
    const swapIndex =
      index +
      Math.min(remaining - 1, Math.max(0, Math.floor(random() * remaining)));
    const current = working[index]!;
    working[index] = working[swapIndex]!;
    working[swapIndex] = current;
  }

  return working.slice(0, takeCount);
}
