import {
  DEFINING_PLAZA_BESTIARY_STUDY_TIER_ORDER,
  DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS,
  type PlazaBestiaryStudyTierId,
} from '@/components/home/domains/definingPlazaBestiaryStudyTier';

/** Returns the highest study tier reached for a kill count. */
export function resolvingPlazaBestiaryStudyTierId(
  killCount: number
): PlazaBestiaryStudyTierId {
  let currentTier: PlazaBestiaryStudyTierId = 'sighted';

  for (const tierId of DEFINING_PLAZA_BESTIARY_STUDY_TIER_ORDER) {
    if (killCount >= DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS[tierId]) {
      currentTier = tierId;
    }
  }

  return currentTier;
}

/** True when the kill count has reached a tier threshold. */
export function checkingPlazaBestiaryStudyTierUnlocked(
  tierId: PlazaBestiaryStudyTierId,
  killCount: number
): boolean {
  return killCount >= DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS[tierId];
}

/** Kill count needed for the next tier, or null when fully studied. */
export function resolvingPlazaBestiaryNextStudyTierUnlockKillCount(
  killCount: number
): number | null {
  for (const tierId of DEFINING_PLAZA_BESTIARY_STUDY_TIER_ORDER) {
    const threshold = DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS[tierId];

    if (killCount < threshold) {
      return threshold;
    }
  }

  return null;
}

/** Formats kill progress for the detail header. */
export function formattingPlazaBestiaryKillProgressLabel(
  killCount: number
): string {
  const nextUnlockKillCount =
    resolvingPlazaBestiaryNextStudyTierUnlockKillCount(killCount);

  if (nextUnlockKillCount === null) {
    return `Kills ${killCount} · Fully studied`;
  }

  return `Kills ${killCount} · Next unlock at ${nextUnlockKillCount}`;
}
