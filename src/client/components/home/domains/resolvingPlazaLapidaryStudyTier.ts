import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX,
  type PlazaLapidaryStudyTierId,
} from '@/components/home/domains/definingPlazaLapidaryStudyTier';
import {
  checkingPlazaCodexStudyTierUnlocked,
  formattingPlazaCodexStudyCountProgress,
  formattingPlazaCodexStudyProgressLabel,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyTierBookIcon,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';

const LAPIDARY_TRACK: PlazaCodexStudyTrackId = 'lapidary';

/** Maps a unified tier onto the nearest legacy lapidary id. */
function resolvingPlazaLapidaryLegacyTierId(
  studyCount: number
): PlazaLapidaryStudyTierId {
  const unifiedTierId = resolvingPlazaCodexStudyTierId(
    LAPIDARY_TRACK,
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
export function resolvingPlazaLapidaryStudyTierId(
  studyCount: number
): PlazaLapidaryStudyTierId {
  return resolvingPlazaLapidaryLegacyTierId(studyCount);
}

/** True when the study count has reached a tier threshold. */
export function checkingPlazaLapidaryStudyTierUnlocked(
  tierId: PlazaLapidaryStudyTierId,
  studyCount: number
): boolean {
  return checkingPlazaCodexStudyTierUnlocked(
    LAPIDARY_TRACK,
    DEFINING_PLAZA_LAPIDARY_STUDY_TIER_TO_CODEX[tierId],
    studyCount
  );
}

/** Study count needed for the next tier, or null when fully studied. */
export function resolvingPlazaLapidaryNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  return resolvingPlazaCodexNextStudyTierUnlockCount(LAPIDARY_TRACK, studyCount);
}

/** Formats study progress for the detail header. */
export function formattingPlazaLapidaryStudyProgressLabel(
  studyCount: number
): string {
  return formattingPlazaCodexStudyProgressLabel(LAPIDARY_TRACK, studyCount);
}

/** Compact `current/100` progress label for cards and detail. */
export function formattingPlazaLapidaryStudyCountProgress(
  studyCount: number
): string {
  return formattingPlazaCodexStudyCountProgress(LAPIDARY_TRACK, studyCount);
}

/** Book icon for the player's current knowledge tier on one species. */
export function resolvingPlazaLapidaryStudyTierBookIcon(
  studyCount: number
): string {
  return resolvingPlazaCodexStudyTierBookIcon(LAPIDARY_TRACK, studyCount);
}
