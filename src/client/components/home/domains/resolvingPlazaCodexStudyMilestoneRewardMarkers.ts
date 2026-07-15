/**
 * Resolves study-milestone chest marker positions along a progress track.
 *
 * @module components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers
 */

import { DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_TIERS } from '@/components/home/domains/definingPlazaCodexStudyMilestoneRewardConstants';
import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';
import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  resolvingPlazaCodexStudyFullCount,
  resolvingPlazaCodexStudyTierThreshold,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';

export type PlazaCodexStudyMilestoneRewardMarker = {
  tierId: PlazaCodexStudyTierId;
  /** Absolute study threshold for this track/entry. */
  threshold: number;
  /** 0–100 position along the progress track. */
  percent: number;
  /** True when current study points have reached this milestone. */
  isReached: boolean;
};

/**
 * Builds chest markers for one study track.
 * Positions scale with mastery so 2x/3x entries still sit at the right spots.
 */
export function resolvingPlazaCodexStudyMilestoneRewardMarkers(
  trackId: PlazaCodexStudyTrackId,
  studyCount: number,
  entryScaleMultiplier = 1
): readonly PlazaCodexStudyMilestoneRewardMarker[] {
  const fullCount = resolvingPlazaCodexStudyFullCount(
    trackId,
    entryScaleMultiplier
  );

  if (fullCount <= 0) {
    return [];
  }

  return DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_TIERS.map((tierId) => {
    const threshold = resolvingPlazaCodexStudyTierThreshold(
      trackId,
      tierId,
      entryScaleMultiplier
    );
    const percent = Math.min(100, Math.round((threshold / fullCount) * 100));

    return {
      tierId,
      threshold,
      percent,
      isReached: studyCount >= threshold,
    };
  });
}

/**
 * Builds chest markers for an aggregate Studied meter (panel dual progress).
 * Uses the same relative milestone ratios as a 1x study track.
 */
export function resolvingPlazaCodexAggregateStudyMilestoneRewardMarkers(
  studyValue: number,
  studyMax: number
): readonly PlazaCodexStudyMilestoneRewardMarker[] {
  if (studyMax <= 0) {
    return [];
  }

  return resolvingPlazaCodexStudyMilestoneRewardMarkers(
    'herbarium-flower',
    0,
    1
  ).map((marker) => {
    const threshold = Math.round((marker.percent / 100) * studyMax);
    return {
      ...marker,
      threshold,
      isReached: studyValue >= threshold,
    };
  });
}
