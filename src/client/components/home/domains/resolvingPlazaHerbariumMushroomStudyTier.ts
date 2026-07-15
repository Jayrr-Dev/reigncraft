/**
 * Herbarium mushroom study helpers over the unified codex ladder.
 *
 * @module components/home/domains/resolvingPlazaHerbariumMushroomStudyTier
 */

import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  DEFINING_PLAZA_HERBARIUM_MUSHROOM_STUDY_TIER_TO_CODEX,
  type PlazaHerbariumMushroomStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumMushroomStudyTier';
import {
  checkingPlazaCodexStudyTierUnlocked,
  formattingPlazaCodexStudyCountProgress,
  formattingPlazaCodexStudyProgressLabel,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyFullCount,
  resolvingPlazaCodexStudyTierBookIcon,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';

const HERBARIUM_MUSHROOM_TRACK: PlazaCodexStudyTrackId = 'herbarium-mushroom';

/** Study count required for a full mushroom dossier. */
export const DEFINING_PLAZA_HERBARIUM_MUSHROOM_STUDY_FULL_COUNT =
  resolvingPlazaCodexStudyFullCount(HERBARIUM_MUSHROOM_TRACK);

/** Maps a unified tier onto the nearest legacy mushroom id. */
function resolvingPlazaHerbariumMushroomLegacyTierId(
  studyCount: number
): PlazaHerbariumMushroomStudyTierId {
  const unifiedTierId = resolvingPlazaCodexStudyTierId(
    HERBARIUM_MUSHROOM_TRACK,
    studyCount
  );

  switch (unifiedTierId) {
    case 'awareness':
    case 'familiarity':
      return 'sighted';
    case 'understanding':
      return 'fieldNotes';
    case 'application':
      return 'properties';
    case 'proficiency':
    case 'expertise':
      return 'habitats';
    case 'mastery':
      return 'full';
  }
}

/** Returns the highest mushroom study tier reached for a study count. */
export function resolvingPlazaHerbariumMushroomStudyTierId(
  studyCount: number
): PlazaHerbariumMushroomStudyTierId {
  return resolvingPlazaHerbariumMushroomLegacyTierId(studyCount);
}

/** True when the mushroom study count has reached a tier threshold. */
export function checkingPlazaHerbariumMushroomStudyTierUnlocked(
  tierId: PlazaHerbariumMushroomStudyTierId,
  studyCount: number
): boolean {
  return checkingPlazaCodexStudyTierUnlocked(
    HERBARIUM_MUSHROOM_TRACK,
    DEFINING_PLAZA_HERBARIUM_MUSHROOM_STUDY_TIER_TO_CODEX[tierId],
    studyCount
  );
}

/** True when the mushroom study count has reached mastery. */
export function checkingPlazaHerbariumMushroomStudyMasteryUnlocked(
  studyCount: number
): boolean {
  return checkingPlazaCodexStudyTierUnlocked(
    HERBARIUM_MUSHROOM_TRACK,
    'mastery',
    studyCount
  );
}

/** Study count needed for the next mushroom tier, or null when fully studied. */
export function resolvingPlazaHerbariumMushroomNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  return resolvingPlazaCodexNextStudyTierUnlockCount(
    HERBARIUM_MUSHROOM_TRACK,
    studyCount
  );
}

/** Formats mushroom study progress for the detail header. */
export function formattingPlazaHerbariumMushroomStudyProgressLabel(
  studyCount: number
): string {
  return formattingPlazaCodexStudyProgressLabel(
    HERBARIUM_MUSHROOM_TRACK,
    studyCount
  );
}

/** Compact `current/100` progress label for mushroom cards, detail, and toasts. */
export function formattingPlazaHerbariumMushroomStudyCountProgress(
  studyCount: number
): string {
  return formattingPlazaCodexStudyCountProgress(
    HERBARIUM_MUSHROOM_TRACK,
    studyCount
  );
}

/** Book icon for the player's current mushroom knowledge tier. */
export function resolvingPlazaHerbariumMushroomStudyTierBookIcon(
  studyCount: number
): string {
  return resolvingPlazaCodexStudyTierBookIcon(
    HERBARIUM_MUSHROOM_TRACK,
    studyCount
  );
}
