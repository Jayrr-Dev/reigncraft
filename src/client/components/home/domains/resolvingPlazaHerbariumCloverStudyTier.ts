import {
  DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_FULL_COUNT,
  DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_BOOK_ICONS,
  DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_ORDER,
  DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_THRESHOLDS,
  type PlazaHerbariumCloverStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumCloverStudyTier';

/** Returns the highest clover study tier reached for a combined study count. */
export function resolvingPlazaHerbariumCloverStudyTierId(
  studyCount: number
): PlazaHerbariumCloverStudyTierId {
  let currentTier: PlazaHerbariumCloverStudyTierId = 'sighted';

  for (const tierId of DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_ORDER) {
    if (
      studyCount >=
      DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_THRESHOLDS[tierId]
    ) {
      currentTier = tierId;
    }
  }

  return currentTier;
}

/** True when the combined clover study count has reached a tier threshold. */
export function checkingPlazaHerbariumCloverStudyTierUnlocked(
  tierId: PlazaHerbariumCloverStudyTierId,
  studyCount: number
): boolean {
  return (
    studyCount >= DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_THRESHOLDS[tierId]
  );
}

/** Study count needed for the next clover tier, or null when fully studied. */
export function resolvingPlazaHerbariumCloverNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  for (const tierId of DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_ORDER) {
    const threshold =
      DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_THRESHOLDS[tierId];

    if (studyCount < threshold) {
      return threshold;
    }
  }

  return null;
}

/** Formats combined clover study progress for the detail header. */
export function formattingPlazaHerbariumCloverStudyProgressLabel(
  studyCount: number
): string {
  const nextUnlockStudyCount =
    resolvingPlazaHerbariumCloverNextStudyTierUnlockCount(studyCount);

  if (nextUnlockStudyCount === null) {
    return `Studied ${studyCount} · Fully studied`;
  }

  return `Studied ${studyCount} · Next unlock at ${nextUnlockStudyCount}`;
}

/** Compact `current/100` progress label for clover cards and detail. */
export function formattingPlazaHerbariumCloverStudyCountProgress(
  studyCount: number
): string {
  return `${Math.min(studyCount, DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_FULL_COUNT)}/${DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_FULL_COUNT}`;
}

/** Book icon for the player's current clover knowledge tier. */
export function resolvingPlazaHerbariumCloverStudyTierBookIcon(
  studyCount: number
): string {
  return DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_TIER_BOOK_ICONS[
    resolvingPlazaHerbariumCloverStudyTierId(studyCount)
  ];
}
