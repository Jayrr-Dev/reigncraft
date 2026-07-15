/**
 * Aggregate codex panel Studied meter: current points / max points.
 *
 * @module components/home/domains/computingPlazaCodexAggregateStudyProgress
 */

import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import { resolvingPlazaCodexStudyFullCount } from '@/components/home/domains/resolvingPlazaCodexStudyTier';

export type PlazaCodexStudyProgressContribution = {
  trackId: PlazaCodexStudyTrackId;
  studyCount: number;
  entryScaleMultiplier?: number;
};

export type PlazaCodexAggregateStudyProgress = {
  /** Sum of capped study points the player currently holds. */
  value: number;
  /** Sum of mastery thresholds across contributions. */
  max: number;
};

/**
 * Builds panel Studied progress from per-entry study counts.
 * Each entry contributes `min(studyCount, fullCount) / fullCount`.
 */
export function computingPlazaCodexAggregateStudyProgress(
  contributions: readonly PlazaCodexStudyProgressContribution[]
): PlazaCodexAggregateStudyProgress {
  let value = 0;
  let max = 0;

  for (const contribution of contributions) {
    const fullCount = resolvingPlazaCodexStudyFullCount(
      contribution.trackId,
      contribution.entryScaleMultiplier ?? 1
    );
    const cappedStudyCount = Math.min(
      Math.max(0, Math.floor(contribution.studyCount)),
      fullCount
    );
    value += cappedStudyCount;
    max += fullCount;
  }

  return { value, max };
}
