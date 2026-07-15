import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX,
  type PlazaHerbariumStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumStudyTier';
import {
  checkingPlazaCodexStudyTierUnlocked,
  formattingPlazaCodexStudyCountProgress,
  formattingPlazaCodexStudyProgressLabel,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyTierBookIcon,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';

const HERBARIUM_TREE_TRACK: PlazaCodexStudyTrackId = 'herbarium-tree';

/** Maps a unified tier onto the nearest legacy tree id. */
function resolvingPlazaHerbariumLegacyTierId(
  studyCount: number
): PlazaHerbariumStudyTierId {
  const unifiedTierId = resolvingPlazaCodexStudyTierId(
    HERBARIUM_TREE_TRACK,
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

/** Returns the highest study tier reached for a study count. */
export function resolvingPlazaHerbariumStudyTierId(
  studyCount: number
): PlazaHerbariumStudyTierId {
  return resolvingPlazaHerbariumLegacyTierId(studyCount);
}

/** True when the study count has reached a tier threshold. */
export function checkingPlazaHerbariumStudyTierUnlocked(
  tierId: PlazaHerbariumStudyTierId,
  studyCount: number
): boolean {
  return checkingPlazaCodexStudyTierUnlocked(
    HERBARIUM_TREE_TRACK,
    DEFINING_PLAZA_HERBARIUM_STUDY_TIER_TO_CODEX[tierId],
    studyCount
  );
}

/** Study count needed for the next tier, or null when fully studied. */
export function resolvingPlazaHerbariumNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  return resolvingPlazaCodexNextStudyTierUnlockCount(
    HERBARIUM_TREE_TRACK,
    studyCount
  );
}

/** Formats study progress for the detail header. */
export function formattingPlazaHerbariumStudyProgressLabel(
  studyCount: number
): string {
  return formattingPlazaCodexStudyProgressLabel(HERBARIUM_TREE_TRACK, studyCount);
}

/** Compact `current/100` progress label for cards and detail. */
export function formattingPlazaHerbariumStudyCountProgress(
  studyCount: number
): string {
  return formattingPlazaCodexStudyCountProgress(HERBARIUM_TREE_TRACK, studyCount);
}

/** Book icon for the player's current knowledge tier on one species. */
export function resolvingPlazaHerbariumStudyTierBookIcon(
  studyCount: number
): string {
  return resolvingPlazaCodexStudyTierBookIcon(HERBARIUM_TREE_TRACK, studyCount);
}
