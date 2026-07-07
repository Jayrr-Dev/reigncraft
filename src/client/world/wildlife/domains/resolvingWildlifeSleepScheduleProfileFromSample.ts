/**
 * Maps a per-instance sleep bell-curve sample to schedule offsets.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSleepScheduleProfileFromSample
 */

import {
  DEFINING_WILDLIFE_CATHEMERAL_SLEEP_BASE_PROBABILITY,
  DEFINING_WILDLIFE_CATHEMERAL_SLEEP_MAX_PROBABILITY,
  DEFINING_WILDLIFE_CATHEMERAL_SLEEP_MIN_PROBABILITY,
  DEFINING_WILDLIFE_CATHEMERAL_SLEEP_PROBABILITY_PER_SIGMA,
  DEFINING_WILDLIFE_SLEEP_SCHEDULE_PHASE_COMPRESSION_PER_SIGMA,
  DEFINING_WILDLIFE_SLEEP_SCHEDULE_PHASE_EXPANSION_PER_SIGMA,
} from '@/components/world/wildlife/domains/definingWildlifeSleepScheduleConstants';

export type ResolvingWildlifeSleepScheduleProfile = {
  /** Species-adjusted standard-normal sleep roll. */
  shiftedSigma: number;
  /**
   * Positive values widen the sleep window on both edges; negative values
   * narrow it (short sleepers go to bed later and wake earlier).
   */
  phaseWindowOffset: number;
  /** Cathemeral per-bucket sleep probability after bell-curve shift. */
  cathemeralSleepProbability: number;
};

function clampingWildlifeSleepScheduleValue(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Resolves per-instance sleep timing from one bell-curve sample.
 */
export function resolvingWildlifeSleepScheduleProfileFromSample(
  sleepScheduleSample: number,
  bellCurveMeanShift = 0
): ResolvingWildlifeSleepScheduleProfile {
  const shiftedSigma = sleepScheduleSample + bellCurveMeanShift;
  const expansionPhase =
    Math.max(0, shiftedSigma) *
    DEFINING_WILDLIFE_SLEEP_SCHEDULE_PHASE_EXPANSION_PER_SIGMA;
  const compressionPhase =
    Math.max(0, -shiftedSigma) *
    DEFINING_WILDLIFE_SLEEP_SCHEDULE_PHASE_COMPRESSION_PER_SIGMA;
  const phaseWindowOffset = expansionPhase - compressionPhase;
  const cathemeralSleepProbability = clampingWildlifeSleepScheduleValue(
    DEFINING_WILDLIFE_CATHEMERAL_SLEEP_BASE_PROBABILITY +
      shiftedSigma * DEFINING_WILDLIFE_CATHEMERAL_SLEEP_PROBABILITY_PER_SIGMA,
    DEFINING_WILDLIFE_CATHEMERAL_SLEEP_MIN_PROBABILITY,
    DEFINING_WILDLIFE_CATHEMERAL_SLEEP_MAX_PROBABILITY
  );

  return {
    shiftedSigma,
    phaseWindowOffset,
    cathemeralSleepProbability,
  };
}
