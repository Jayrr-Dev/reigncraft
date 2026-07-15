/**
 * Resolves the Perma Death character-picker offer for one pending run.
 *
 * Reuses a locked roll when present; otherwise samples and locks a new set.
 *
 * @module components/world/domains/resolvingWorldPlazaPermaDeathCharacterPickerOptions
 */

import type { DefiningWorldPlazaAvatarSkinOption } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT } from '@/components/world/domains/definingWorldPlazaPermaDeathLoadConstants';
import {
  gettingWorldPlazaPermaDeathCharacterPickerOfferedSkinIds,
  settingWorldPlazaPermaDeathCharacterPickerOfferedSkinIds,
} from '@/components/world/domains/managingWorldPlazaPermaDeathCharacterPickerOfferStore';
import { rollingWorldPlazaPermaDeathCharacterPickerOptions } from '@/components/world/domains/rollingWorldPlazaPermaDeathCharacterPickerOptions';

/**
 * Returns the fixed offer for this pending run, rolling once when needed.
 *
 * @param pool - Accessible playable avatar skin options.
 * @param count - How many options to offer. Defaults to the Perma Death constant.
 * @param random - Optional RNG in [0, 1). Defaults to Math.random.
 */
export function resolvingWorldPlazaPermaDeathCharacterPickerOptions(
  pool: readonly DefiningWorldPlazaAvatarSkinOption[],
  count: number = DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT,
  random: () => number = Math.random
): readonly DefiningWorldPlazaAvatarSkinOption[] {
  if (pool.length === 0 || count <= 0) {
    return [];
  }

  const poolBySkinId = new Map(
    pool.map((skinOption) => [skinOption.skinId, skinOption] as const)
  );
  const lockedSkinIds =
    gettingWorldPlazaPermaDeathCharacterPickerOfferedSkinIds();

  if (lockedSkinIds !== null) {
    const lockedOptions = lockedSkinIds.flatMap((skinId) => {
      const skinOption = poolBySkinId.get(skinId);
      return skinOption ? [skinOption] : [];
    });

    if (lockedOptions.length > 0) {
      return lockedOptions;
    }
  }

  const rolledOptions = rollingWorldPlazaPermaDeathCharacterPickerOptions(
    pool,
    count,
    random
  );
  settingWorldPlazaPermaDeathCharacterPickerOfferedSkinIds(
    rolledOptions.map((skinOption) => skinOption.skinId)
  );

  return rolledOptions;
}
