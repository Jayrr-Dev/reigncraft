import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX,
  type PlazaPathologyStudyTierId,
} from '@/components/home/domains/definingPlazaPathologyStudyTier';
import {
  checkingPlazaCodexStudyTierUnlocked,
  formattingPlazaCodexStudyCountProgress,
  formattingPlazaCodexStudyProgressLabel,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyTierBookIcon,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';

const PATHOLOGY_TRACK: PlazaCodexStudyTrackId = 'pathology';

/** Maps a unified tier onto the nearest legacy pathology id. */
function resolvingPlazaPathologyLegacyTierId(
  studyCount: number
): PlazaPathologyStudyTierId {
  const unifiedTierId = resolvingPlazaCodexStudyTierId(
    PATHOLOGY_TRACK,
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

/** Returns the highest study tier reached for a Pathology study-point total. */
export function resolvingPlazaPathologyStudyTierId(
  studyCount: number
): PlazaPathologyStudyTierId {
  return resolvingPlazaPathologyLegacyTierId(studyCount);
}

/** True when the Pathology study count has reached a tier threshold. */
export function checkingPlazaPathologyStudyTierUnlocked(
  tierId: PlazaPathologyStudyTierId,
  studyCount: number
): boolean {
  return checkingPlazaCodexStudyTierUnlocked(
    PATHOLOGY_TRACK,
    DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_TO_CODEX[tierId],
    studyCount
  );
}

/** Study count needed for the next tier, or null when fully studied. */
export function resolvingPlazaPathologyNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  return resolvingPlazaCodexNextStudyTierUnlockCount(
    PATHOLOGY_TRACK,
    studyCount
  );
}

/** Formats study progress for the detail header. */
export function formattingPlazaPathologyStudyProgressLabel(
  studyCount: number
): string {
  return formattingPlazaCodexStudyProgressLabel(PATHOLOGY_TRACK, studyCount);
}

/** Compact `current/100` progress label for cards and detail. */
export function formattingPlazaPathologyStudyCountProgress(
  studyCount: number
): string {
  return formattingPlazaCodexStudyCountProgress(PATHOLOGY_TRACK, studyCount);
}

/** Book icon for the player's current knowledge tier on one disease. */
export function resolvingPlazaPathologyStudyTierBookIcon(
  studyCount: number
): string {
  return resolvingPlazaCodexStudyTierBookIcon(PATHOLOGY_TRACK, studyCount);
}
