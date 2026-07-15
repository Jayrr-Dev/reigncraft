/**
 * Resolves overall panel milestone chest markers for Sighted/Logged and Studied.
 *
 * @module components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers
 */

import {
  DEFINING_PLAZA_CODEX_DISCOVERY_MILESTONE_REWARD_PERCENTS,
  DEFINING_PLAZA_CODEX_OVERALL_MILESTONE_REWARD_PERCENTS,
} from '@/components/home/domains/definingPlazaCodexStudyMilestoneRewardConstants';

export type PlazaCodexOverallMilestoneRewardMarker = {
  /** Stable key from percent position. */
  id: string;
  /** Absolute value on the meter needed to reach this chest. */
  threshold: number;
  /** 0–100 position along the progress track. */
  percent: number;
  /** True when current meter value has reached this milestone. */
  isReached: boolean;
  /** How many more points until this chest unlocks. */
  remainingNeeded: number;
};

/**
 * Short popover copy for a milestone chest (remaining count or ready).
 */
export function resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(
  remainingNeeded: number,
  isReached: boolean
): string {
  if (isReached || remainingNeeded <= 0) {
    return 'Reward ready';
  }
  return remainingNeeded === 1 ? '1 more' : `${remainingNeeded} more`;
}

/**
 * True when any overall milestone chest on this meter is reached (reward ready).
 */
export function checkingPlazaCodexOverallProgressHasRewardReady(
  value: number,
  max: number,
  percents: readonly number[] = DEFINING_PLAZA_CODEX_OVERALL_MILESTONE_REWARD_PERCENTS
): boolean {
  return resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
    value,
    max,
    percents
  ).some((marker) => marker.isReached);
}

/**
 * Builds chest markers for one overall panel meter (discovered or studied).
 * Thresholds scale to that meter's max.
 */
export function resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
  value: number,
  max: number,
  percents: readonly number[] = DEFINING_PLAZA_CODEX_OVERALL_MILESTONE_REWARD_PERCENTS
): readonly PlazaCodexOverallMilestoneRewardMarker[] {
  if (max <= 0) {
    return [];
  }

  return percents.map((percent) => {
    const threshold = Math.round((percent / 100) * max);
    const remainingNeeded = Math.max(0, threshold - value);
    return {
      id: `milestone-${percent}`,
      threshold,
      percent,
      isReached: value >= threshold,
      remainingNeeded,
    };
  });
}

/**
 * Four discovery-only chests for Biomes / Recipes single meters.
 */
export function resolvingPlazaCodexDiscoveryMilestoneRewardMarkers(
  value: number,
  max: number
): readonly PlazaCodexOverallMilestoneRewardMarker[] {
  return resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
    value,
    max,
    DEFINING_PLAZA_CODEX_DISCOVERY_MILESTONE_REWARD_PERCENTS
  );
}

/**
 * True when a discovery-only meter (Biomes / Recipes) has a reached chest.
 */
export function checkingPlazaCodexDiscoveryProgressHasRewardReady(
  value: number,
  max: number
): boolean {
  return checkingPlazaCodexOverallProgressHasRewardReady(
    value,
    max,
    DEFINING_PLAZA_CODEX_DISCOVERY_MILESTONE_REWARD_PERCENTS
  );
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
