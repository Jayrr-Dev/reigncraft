import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_TO_CODEX,
  type PlazaHerbariumBerryStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumBerryStudyTier';
import {
  checkingPlazaCodexStudyTierUnlocked,
  formattingPlazaCodexStudyCountProgress,
  formattingPlazaCodexStudyProgressLabel,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyTierBookIcon,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';

const HERBARIUM_BERRY_TRACK: PlazaCodexStudyTrackId = 'herbarium-berry';

/** Maps a unified tier onto the nearest legacy berry id. */
function resolvingPlazaHerbariumBerryLegacyTierId(
  studyCount: number
): PlazaHerbariumBerryStudyTierId {
  const unifiedTierId = resolvingPlazaCodexStudyTierId(
    HERBARIUM_BERRY_TRACK,
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

/** Returns the highest berry study tier reached for a study count. */
export function resolvingPlazaHerbariumBerryStudyTierId(
  studyCount: number
): PlazaHerbariumBerryStudyTierId {
  return resolvingPlazaHerbariumBerryLegacyTierId(studyCount);
}

/** True when the berry study count has reached a tier threshold. */
export function checkingPlazaHerbariumBerryStudyTierUnlocked(
  tierId: PlazaHerbariumBerryStudyTierId,
  studyCount: number
): boolean {
  return checkingPlazaCodexStudyTierUnlocked(
    HERBARIUM_BERRY_TRACK,
    DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_TO_CODEX[tierId],
    studyCount
  );
}

/** Study count needed for the next berry tier, or null when fully studied. */
export function resolvingPlazaHerbariumBerryNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  return resolvingPlazaCodexNextStudyTierUnlockCount(
    HERBARIUM_BERRY_TRACK,
    studyCount
  );
}

/** Formats berry study progress for the detail header. */
export function formattingPlazaHerbariumBerryStudyProgressLabel(
  studyCount: number
): string {
  return formattingPlazaCodexStudyProgressLabel(
    HERBARIUM_BERRY_TRACK,
    studyCount
  );
}

/** Compact `current/100` progress label for berry cards and detail. */
export function formattingPlazaHerbariumBerryStudyCountProgress(
  studyCount: number
): string {
  return formattingPlazaCodexStudyCountProgress(
    HERBARIUM_BERRY_TRACK,
    studyCount
  );
}

/** Book icon for the player's current berry knowledge tier. */
export function resolvingPlazaHerbariumBerryStudyTierBookIcon(
  studyCount: number
): string {
  return resolvingPlazaCodexStudyTierBookIcon(HERBARIUM_BERRY_TRACK, studyCount);
}
