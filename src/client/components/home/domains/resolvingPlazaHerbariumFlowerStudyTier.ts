import {
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT,
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_BOOK_ICONS,
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_ORDER,
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_THRESHOLDS,
  type PlazaHerbariumFlowerStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumFlowerStudyTier';

/** Returns the highest flower study tier reached for a study count. */
export function resolvingPlazaHerbariumFlowerStudyTierId(
  studyCount: number
): PlazaHerbariumFlowerStudyTierId {
  let currentTier: PlazaHerbariumFlowerStudyTierId = 'sighted';

  for (const tierId of DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_ORDER) {
    if (
      studyCount >=
      DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_THRESHOLDS[tierId]
    ) {
      currentTier = tierId;
    }
  }

  return currentTier;
}

/** True when the flower study count has reached a tier threshold. */
export function checkingPlazaHerbariumFlowerStudyTierUnlocked(
  tierId: PlazaHerbariumFlowerStudyTierId,
  studyCount: number
): boolean {
  return (
    studyCount >= DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_THRESHOLDS[tierId]
  );
}

/** Study count needed for the next flower tier, or null when fully studied. */
export function resolvingPlazaHerbariumFlowerNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  for (const tierId of DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_ORDER) {
    const threshold =
      DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_THRESHOLDS[tierId];

    if (studyCount < threshold) {
      return threshold;
    }
  }

  return null;
}

/** Formats flower study progress for the detail header. */
export function formattingPlazaHerbariumFlowerStudyProgressLabel(
  studyCount: number
): string {
  const nextUnlockStudyCount =
    resolvingPlazaHerbariumFlowerNextStudyTierUnlockCount(studyCount);

  if (nextUnlockStudyCount === null) {
    return `Studied ${studyCount} · Fully studied`;
  }

  return `Studied ${studyCount} · Next unlock at ${nextUnlockStudyCount}`;
}

/** Compact `current/100` progress label for flower cards and detail. */
export function formattingPlazaHerbariumFlowerStudyCountProgress(
  studyCount: number
): string {
  return `${Math.min(studyCount, DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT)}/${DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT}`;
}

/** Book icon for the player's current flower knowledge tier. */
export function resolvingPlazaHerbariumFlowerStudyTierBookIcon(
  studyCount: number
): string {
  return DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_BOOK_ICONS[
    resolvingPlazaHerbariumFlowerStudyTierId(studyCount)
  ];
}
