/**
 * Resolves overall panel milestone chest markers for Sighted/Logged and Studied.
 *
 * @module components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers
 */

import { checkingPlazaCodexMilestoneRewardClaimed } from '@/components/home/domains/claimingPlazaCodexMilestoneReward';
import {
  resolvingPlazaCodexMilestoneRewardDefinition,
  type PlazaCodexMilestoneRewardDefinition,
  type PlazaCodexMilestoneRewardMeterKind,
} from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import {
  DEFINING_PLAZA_CODEX_DISCOVERY_MILESTONE_REWARD_PERCENTS,
  DEFINING_PLAZA_CODEX_OVERALL_MILESTONE_REWARD_PERCENTS,
} from '@/components/home/domains/definingPlazaCodexStudyMilestoneRewardConstants';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';

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
  /** Registry row when this chest has a defined grant. */
  rewardDefinition: PlazaCodexMilestoneRewardDefinition | null;
  /** True when a defined attach-recipe reward is already claimed. */
  isClaimed: boolean;
  /** True when reached, defined, and not yet claimed. */
  hasUnclaimedReward: boolean;
};

export type ResolvingPlazaCodexOverallProgressMilestoneRewardMarkersOptions = {
  readonly sectionId?: WorldPlazaCodexSectionId;
  readonly meterKind?: PlazaCodexMilestoneRewardMeterKind;
  readonly attachedRecipeIds?: ReadonlySet<string>;
};

/**
 * Short popover copy for a milestone chest (remaining, claim, or claimed).
 * When a grant is defined, always name it so players see what the chest holds.
 */
export function resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(
  remainingNeeded: number,
  isReached: boolean,
  options: {
    readonly rewardLabel?: string | null;
    readonly isClaimed?: boolean;
    readonly hasUnclaimedReward?: boolean;
  } = {}
): string {
  if (options.isClaimed) {
    return 'Claimed';
  }

  if (options.hasUnclaimedReward && options.rewardLabel) {
    return `Claim ${options.rewardLabel}`;
  }

  if (options.rewardLabel) {
    if (isReached || remainingNeeded <= 0) {
      return options.rewardLabel;
    }

    return remainingNeeded === 1
      ? `1 more · ${options.rewardLabel}`
      : `${remainingNeeded} more · ${options.rewardLabel}`;
  }

  if (isReached || remainingNeeded <= 0) {
    return 'Reward ready';
  }

  return remainingNeeded === 1 ? '1 more' : `${remainingNeeded} more`;
}

/**
 * True when any overall milestone chest on this meter is reached (reward ready).
 * When section context is provided, only defined unclaimed rewards count.
 */
export function checkingPlazaCodexOverallProgressHasRewardReady(
  value: number,
  max: number,
  percents: readonly number[] = DEFINING_PLAZA_CODEX_OVERALL_MILESTONE_REWARD_PERCENTS,
  options?: ResolvingPlazaCodexOverallProgressMilestoneRewardMarkersOptions
): boolean {
  return resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
    value,
    max,
    percents,
    options
  ).some((marker) =>
    options?.sectionId && options.meterKind
      ? marker.hasUnclaimedReward
      : marker.isReached
  );
}

/**
 * Builds chest markers for one overall panel meter (discovered or studied).
 * Thresholds scale to that meter's max.
 */
export function resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
  value: number,
  max: number,
  percents: readonly number[] = DEFINING_PLAZA_CODEX_OVERALL_MILESTONE_REWARD_PERCENTS,
  options?: ResolvingPlazaCodexOverallProgressMilestoneRewardMarkersOptions
): readonly PlazaCodexOverallMilestoneRewardMarker[] {
  if (max <= 0) {
    return [];
  }

  const attachedRecipeIds = options?.attachedRecipeIds ?? new Set<string>();

  return percents.map((percent) => {
    const threshold = Math.round((percent / 100) * max);
    const remainingNeeded = Math.max(0, threshold - value);
    const isReached = value >= threshold;
    const rewardDefinition =
      options?.sectionId && options.meterKind
        ? resolvingPlazaCodexMilestoneRewardDefinition({
            sectionId: options.sectionId,
            meterKind: options.meterKind,
            percent,
          })
        : null;
    const isClaimed = rewardDefinition
      ? checkingPlazaCodexMilestoneRewardClaimed(
          rewardDefinition,
          attachedRecipeIds
        )
      : false;
    const hasUnclaimedReward = Boolean(
      rewardDefinition && isReached && !isClaimed
    );

    return {
      id: `milestone-${percent}`,
      threshold,
      percent,
      isReached,
      remainingNeeded,
      rewardDefinition,
      isClaimed,
      hasUnclaimedReward,
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
