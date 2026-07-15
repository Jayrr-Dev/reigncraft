/**
 * Study-gates animal playable avatar skins behind bestiary mastery.
 *
 * @module components/world/domains/checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked
 */

import { checkingPlazaCodexStudyTierUnlocked } from '@/components/home/domains/resolvingPlazaCodexStudyTier';
import {
  checkingWorldPlazaAnimalPlayableAvatarSkinId,
  resolvingWorldPlazaAnimalPlayableAvatarSkinRow,
} from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId } from '@/components/world/domains/resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Wildlife species id used to gate one animal playable skin, when study applies.
 */
export function resolvingWorldPlazaAnimalPlayableAvatarUnlockWildlifeSpeciesId(
  skinId: DefiningWorldPlazaAvatarSkinId
): DefiningWildlifeSpeciesId | null {
  if (!checkingWorldPlazaAnimalPlayableAvatarSkinId(skinId)) {
    return null;
  }

  const skinRow = resolvingWorldPlazaAnimalPlayableAvatarSkinRow(skinId);

  if (!skinRow) {
    return null;
  }

  const mappedSpeciesId =
    resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId(
      skinRow.spriteFolder
    ) ?? (skinRow.spriteFolder as DefiningWildlifeSpeciesId);

  if (!resolvingWildlifeSpeciesDefinition(mappedSpeciesId)) {
    return null;
  }

  return mappedSpeciesId;
}

/**
 * True when the skin is selectable for the current bestiary study progress.
 *
 * Non-animal skins always pass. Animal skins without a wildlife species stay
 * unlocked. Catalog animals need mastery (100 studies).
 */
export function checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked(
  skinId: DefiningWorldPlazaAvatarSkinId,
  studyCountsBySpeciesId: Readonly<Partial<Record<string, number>>>
): boolean {
  const unlockSpeciesId =
    resolvingWorldPlazaAnimalPlayableAvatarUnlockWildlifeSpeciesId(skinId);

  if (unlockSpeciesId === null) {
    return true;
  }

  const studyCount = studyCountsBySpeciesId[unlockSpeciesId] ?? 0;

  return checkingPlazaCodexStudyTierUnlocked(
    'bestiary',
    'mastery',
    studyCount
  );
}
