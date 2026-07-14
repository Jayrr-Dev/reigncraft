import {
  DEFINING_PLAZA_HERBARIUM_STUDY_FULL_COUNT,
  DEFINING_PLAZA_HERBARIUM_STUDY_TIER_BOOK_ICONS,
  DEFINING_PLAZA_HERBARIUM_STUDY_TIER_ORDER,
  DEFINING_PLAZA_HERBARIUM_STUDY_TIER_THRESHOLDS,
  type PlazaHerbariumStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumStudyTier';

/** Returns the highest study tier reached for a study count. */
export function resolvingPlazaHerbariumStudyTierId(
  studyCount: number
): PlazaHerbariumStudyTierId {
  let currentTier: PlazaHerbariumStudyTierId = 'sighted';

  for (const tierId of DEFINING_PLAZA_HERBARIUM_STUDY_TIER_ORDER) {
    if (studyCount >= DEFINING_PLAZA_HERBARIUM_STUDY_TIER_THRESHOLDS[tierId]) {
      currentTier = tierId;
    }
  }

  return currentTier;
}

/** True when the study count has reached a tier threshold. */
export function checkingPlazaHerbariumStudyTierUnlocked(
  tierId: PlazaHerbariumStudyTierId,
  studyCount: number
): boolean {
  return studyCount >= DEFINING_PLAZA_HERBARIUM_STUDY_TIER_THRESHOLDS[tierId];
}

/** Study count needed for the next tier, or null when fully studied. */
export function resolvingPlazaHerbariumNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  for (const tierId of DEFINING_PLAZA_HERBARIUM_STUDY_TIER_ORDER) {
    const threshold = DEFINING_PLAZA_HERBARIUM_STUDY_TIER_THRESHOLDS[tierId];

    if (studyCount < threshold) {
      return threshold;
    }
  }

  return null;
}

/** Formats study progress for the detail header. */
export function formattingPlazaHerbariumStudyProgressLabel(
  studyCount: number
): string {
  const nextUnlockStudyCount =
    resolvingPlazaHerbariumNextStudyTierUnlockCount(studyCount);

  if (nextUnlockStudyCount === null) {
    return `Studied ${studyCount} · Fully studied`;
  }

  return `Studied ${studyCount} · Next unlock at ${nextUnlockStudyCount}`;
}

/** Compact `current/25` progress label for cards and detail. */
export function formattingPlazaHerbariumStudyCountProgress(
  studyCount: number
): string {
  return `${Math.min(studyCount, DEFINING_PLAZA_HERBARIUM_STUDY_FULL_COUNT)}/${DEFINING_PLAZA_HERBARIUM_STUDY_FULL_COUNT}`;
}

/** Book icon for the player's current knowledge tier on one species. */
export function resolvingPlazaHerbariumStudyTierBookIcon(
  studyCount: number
): string {
  return DEFINING_PLAZA_HERBARIUM_STUDY_TIER_BOOK_ICONS[
    resolvingPlazaHerbariumStudyTierId(studyCount)
  ];
}
