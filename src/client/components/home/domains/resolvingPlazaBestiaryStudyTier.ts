import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  DEFINING_PLAZA_BESTIARY_CODEX_TIER_TO_LEGACY,
  DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX,
  type PlazaBestiaryStudyTierId,
} from '@/components/home/domains/definingPlazaBestiaryStudyTier';
import {
  checkingPlazaCodexStudyTierUnlocked,
  formattingPlazaCodexStudyCountProgress,
  formattingPlazaCodexStudyProgressLabel,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyTierBookIcon,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';

const BESTIARY_TRACK: PlazaCodexStudyTrackId = 'bestiary';

/** Returns the highest study tier reached for a study count. */
export function resolvingPlazaBestiaryStudyTierId(
  studyCount: number
): PlazaBestiaryStudyTierId {
  return DEFINING_PLAZA_BESTIARY_CODEX_TIER_TO_LEGACY[
    resolvingPlazaCodexStudyTierId(BESTIARY_TRACK, studyCount)
  ];
}

/** True when the study count has reached a tier threshold. */
export function checkingPlazaBestiaryStudyTierUnlocked(
  tierId: PlazaBestiaryStudyTierId,
  studyCount: number
): boolean {
  return checkingPlazaCodexStudyTierUnlocked(
    BESTIARY_TRACK,
    DEFINING_PLAZA_BESTIARY_STUDY_TIER_TO_CODEX[tierId],
    studyCount
  );
}

/** Study count needed for the next tier, or null when fully studied. */
export function resolvingPlazaBestiaryNextStudyTierUnlockKillCount(
  studyCount: number
): number | null {
  return resolvingPlazaCodexNextStudyTierUnlockCount(BESTIARY_TRACK, studyCount);
}

/** Formats study progress for the detail header. */
export function formattingPlazaBestiaryKillProgressLabel(
  studyCount: number
): string {
  return formattingPlazaCodexStudyProgressLabel(BESTIARY_TRACK, studyCount);
}

/** Compact `current/100` progress label for cards and detail. */
export function formattingPlazaBestiaryStudyCountProgress(
  studyCount: number
): string {
  return formattingPlazaCodexStudyCountProgress(BESTIARY_TRACK, studyCount);
}

/** Book icon for the player's current knowledge tier on one species. */
export function resolvingPlazaBestiaryStudyTierBookIcon(
  studyCount: number
): string {
  return resolvingPlazaCodexStudyTierBookIcon(BESTIARY_TRACK, studyCount);
}
