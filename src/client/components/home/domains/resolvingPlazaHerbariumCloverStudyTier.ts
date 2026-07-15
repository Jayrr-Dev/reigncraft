import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX,
  type PlazaHerbariumCloverStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumCloverStudyTier';
import {
  checkingPlazaCodexStudyTierUnlocked,
  formattingPlazaCodexStudyCountProgress,
  formattingPlazaCodexStudyProgressLabel,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyTierBookIcon,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';

const HERBARIUM_CLOVER_TRACK: PlazaCodexStudyTrackId = 'herbarium-clover';

/** Maps a unified tier onto the nearest legacy clover id. */
function resolvingPlazaHerbariumCloverLegacyTierId(
  studyCount: number
): PlazaHerbariumCloverStudyTierId {
  const unifiedTierId = resolvingPlazaCodexStudyTierId(
    HERBARIUM_CLOVER_TRACK,
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

/** Returns the highest clover study tier reached for a combined study count. */
export function resolvingPlazaHerbariumCloverStudyTierId(
  studyCount: number
): PlazaHerbariumCloverStudyTierId {
  return resolvingPlazaHerbariumCloverLegacyTierId(studyCount);
}

/** True when the combined clover study count has reached a tier threshold. */
export function checkingPlazaHerbariumCloverStudyTierUnlocked(
  tierId: PlazaHerbariumCloverStudyTierId,
  studyCount: number
): boolean {
  return checkingPlazaCodexStudyTierUnlocked(
    HERBARIUM_CLOVER_TRACK,
    DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_TO_CODEX[tierId],
    studyCount
  );
}

/** Study count needed for the next clover tier, or null when fully studied. */
export function resolvingPlazaHerbariumCloverNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  return resolvingPlazaCodexNextStudyTierUnlockCount(
    HERBARIUM_CLOVER_TRACK,
    studyCount
  );
}

/** Formats combined clover study progress for the detail header. */
export function formattingPlazaHerbariumCloverStudyProgressLabel(
  studyCount: number
): string {
  return formattingPlazaCodexStudyProgressLabel(
    HERBARIUM_CLOVER_TRACK,
    studyCount
  );
}

/** Compact `current/100` progress label for clover cards and detail. */
export function formattingPlazaHerbariumCloverStudyCountProgress(
  studyCount: number
): string {
  return formattingPlazaCodexStudyCountProgress(
    HERBARIUM_CLOVER_TRACK,
    studyCount
  );
}

/** Book icon for the player's current clover knowledge tier. */
export function resolvingPlazaHerbariumCloverStudyTierBookIcon(
  studyCount: number
): string {
  return resolvingPlazaCodexStudyTierBookIcon(
    HERBARIUM_CLOVER_TRACK,
    studyCount
  );
}
