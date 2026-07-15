import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_TO_CODEX,
  type PlazaHerbariumFlowerStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumFlowerStudyTier';
import {
  checkingPlazaCodexStudyTierUnlocked,
  formattingPlazaCodexStudyCountProgress,
  formattingPlazaCodexStudyProgressLabel,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyTierBookIcon,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';

const HERBARIUM_FLOWER_TRACK: PlazaCodexStudyTrackId = 'herbarium-flower';

/** Maps a unified tier onto the nearest legacy flower id. */
function resolvingPlazaHerbariumFlowerLegacyTierId(
  studyCount: number
): PlazaHerbariumFlowerStudyTierId {
  const unifiedTierId = resolvingPlazaCodexStudyTierId(
    HERBARIUM_FLOWER_TRACK,
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

/** Returns the highest flower study tier reached for a study count. */
export function resolvingPlazaHerbariumFlowerStudyTierId(
  studyCount: number
): PlazaHerbariumFlowerStudyTierId {
  return resolvingPlazaHerbariumFlowerLegacyTierId(studyCount);
}

/** True when the flower study count has reached a tier threshold. */
export function checkingPlazaHerbariumFlowerStudyTierUnlocked(
  tierId: PlazaHerbariumFlowerStudyTierId,
  studyCount: number
): boolean {
  return checkingPlazaCodexStudyTierUnlocked(
    HERBARIUM_FLOWER_TRACK,
    DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_TO_CODEX[tierId],
    studyCount
  );
}

/** Study count needed for the next flower tier, or null when fully studied. */
export function resolvingPlazaHerbariumFlowerNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  return resolvingPlazaCodexNextStudyTierUnlockCount(
    HERBARIUM_FLOWER_TRACK,
    studyCount
  );
}

/** Formats flower study progress for the detail header. */
export function formattingPlazaHerbariumFlowerStudyProgressLabel(
  studyCount: number
): string {
  return formattingPlazaCodexStudyProgressLabel(
    HERBARIUM_FLOWER_TRACK,
    studyCount
  );
}

/** Compact `current/100` progress label for flower cards and detail. */
export function formattingPlazaHerbariumFlowerStudyCountProgress(
  studyCount: number
): string {
  return formattingPlazaCodexStudyCountProgress(
    HERBARIUM_FLOWER_TRACK,
    studyCount
  );
}

/** Book icon for the player's current flower knowledge tier. */
export function resolvingPlazaHerbariumFlowerStudyTierBookIcon(
  studyCount: number
): string {
  return resolvingPlazaCodexStudyTierBookIcon(
    HERBARIUM_FLOWER_TRACK,
    studyCount
  );
}
