import {
  DEFINING_PLAZA_PATHOLOGY_STUDY_FULL_COUNT,
  DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_BOOK_ICONS,
  DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_ORDER,
  DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_THRESHOLDS,
  type PlazaPathologyStudyTierId,
} from '@/components/home/domains/definingPlazaPathologyStudyTier';

/** Returns the highest study tier reached for a Pathology study-point total. */
export function resolvingPlazaPathologyStudyTierId(
  studyCount: number
): PlazaPathologyStudyTierId {
  let currentTier: PlazaPathologyStudyTierId = 'sighted';

  for (const tierId of DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_ORDER) {
    if (studyCount >= DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_THRESHOLDS[tierId]) {
      currentTier = tierId;
    }
  }

  return currentTier;
}

/** True when the Pathology study count has reached a tier threshold. */
export function checkingPlazaPathologyStudyTierUnlocked(
  tierId: PlazaPathologyStudyTierId,
  studyCount: number
): boolean {
  return studyCount >= DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_THRESHOLDS[tierId];
}

/** Study count needed for the next tier, or null when fully studied. */
export function resolvingPlazaPathologyNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  for (const tierId of DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_ORDER) {
    const threshold = DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_THRESHOLDS[tierId];

    if (studyCount < threshold) {
      return threshold;
    }
  }

  return null;
}

/** Formats study progress for the detail header. */
export function formattingPlazaPathologyStudyProgressLabel(
  studyCount: number
): string {
  const nextUnlockStudyCount =
    resolvingPlazaPathologyNextStudyTierUnlockCount(studyCount);

  if (nextUnlockStudyCount === null) {
    return `Studied ${studyCount} · Fully studied`;
  }

  return `Studied ${studyCount} · Next unlock at ${nextUnlockStudyCount}`;
}

/** Compact `current/25` progress label for cards and detail. */
export function formattingPlazaPathologyStudyCountProgress(
  studyCount: number
): string {
  return `${Math.min(studyCount, DEFINING_PLAZA_PATHOLOGY_STUDY_FULL_COUNT)}/${DEFINING_PLAZA_PATHOLOGY_STUDY_FULL_COUNT}`;
}

/** Book icon for the player's current knowledge tier on one disease. */
export function resolvingPlazaPathologyStudyTierBookIcon(
  studyCount: number
): string {
  return DEFINING_PLAZA_PATHOLOGY_STUDY_TIER_BOOK_ICONS[
    resolvingPlazaPathologyStudyTierId(studyCount)
  ];
}
