import {
  DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_FULL_COUNT,
  DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_BOOK_ICONS,
  DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_ORDER,
  DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_THRESHOLDS,
  type PlazaHerbariumBerryStudyTierId,
} from '@/components/home/domains/definingPlazaHerbariumBerryStudyTier';

/** Returns the highest berry study tier reached for a study count. */
export function resolvingPlazaHerbariumBerryStudyTierId(
  studyCount: number
): PlazaHerbariumBerryStudyTierId {
  let currentTier: PlazaHerbariumBerryStudyTierId = 'sighted';

  for (const tierId of DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_ORDER) {
    if (
      studyCount >= DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_THRESHOLDS[tierId]
    ) {
      currentTier = tierId;
    }
  }

  return currentTier;
}

/** True when the berry study count has reached a tier threshold. */
export function checkingPlazaHerbariumBerryStudyTierUnlocked(
  tierId: PlazaHerbariumBerryStudyTierId,
  studyCount: number
): boolean {
  return studyCount >= DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_THRESHOLDS[tierId];
}

/** Study count needed for the next berry tier, or null when fully studied. */
export function resolvingPlazaHerbariumBerryNextStudyTierUnlockCount(
  studyCount: number
): number | null {
  for (const tierId of DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_ORDER) {
    const threshold = DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_THRESHOLDS[tierId];

    if (studyCount < threshold) {
      return threshold;
    }
  }

  return null;
}

/** Formats berry study progress for the detail header. */
export function formattingPlazaHerbariumBerryStudyProgressLabel(
  studyCount: number
): string {
  const nextUnlockStudyCount =
    resolvingPlazaHerbariumBerryNextStudyTierUnlockCount(studyCount);

  if (nextUnlockStudyCount === null) {
    return `Studied ${studyCount} · Fully studied`;
  }

  return `Studied ${studyCount} · Next unlock at ${nextUnlockStudyCount}`;
}

/** Compact `current/100` progress label for berry cards and detail. */
export function formattingPlazaHerbariumBerryStudyCountProgress(
  studyCount: number
): string {
  return `${Math.min(studyCount, DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_FULL_COUNT)}/${DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_FULL_COUNT}`;
}

/** Book icon for the player's current berry knowledge tier. */
export function resolvingPlazaHerbariumBerryStudyTierBookIcon(
  studyCount: number
): string {
  return DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_BOOK_ICONS[
    resolvingPlazaHerbariumBerryStudyTierId(studyCount)
  ];
}
