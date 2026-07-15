/**
 * Resolves overall panel milestone chest markers for Sighted/Logged and Studied.
 *
 * @module components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers
 */

import { DEFINING_PLAZA_CODEX_OVERALL_MILESTONE_REWARD_PERCENTS } from '@/components/home/domains/definingPlazaCodexStudyMilestoneRewardConstants';

export type PlazaCodexOverallMilestoneRewardMarker = {
  /** Stable key from percent position. */
  id: string;
  /** Absolute value on the meter needed to reach this chest. */
  threshold: number;
  /** 0–100 position along the progress track. */
  percent: number;
  /** True when current meter value has reached this milestone. */
  isReached: boolean;
};

/**
 * Builds chest markers for one overall panel meter (discovered or studied).
 * Thresholds scale to that meter's max.
 */
export function resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
  value: number,
  max: number
): readonly PlazaCodexOverallMilestoneRewardMarker[] {
  if (max <= 0) {
    return [];
  }

  return DEFINING_PLAZA_CODEX_OVERALL_MILESTONE_REWARD_PERCENTS.map((percent) => {
    const threshold = Math.round((percent / 100) * max);
    return {
      id: `milestone-${percent}`,
      threshold,
      percent,
      isReached: value >= threshold,
    };
  });
}

/** @deprecated Prefer {@link resolvingPlazaCodexOverallProgressMilestoneRewardMarkers}. */
export function resolvingPlazaCodexAggregateStudyMilestoneRewardMarkers(
  studyValue: number,
  studyMax: number
): readonly PlazaCodexOverallMilestoneRewardMarker[] {
  return resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
    studyValue,
    studyMax
  );
}
