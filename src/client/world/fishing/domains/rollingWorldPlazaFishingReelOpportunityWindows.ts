/**
 * Rolls randomized reel-ready windows for one fishing cast.
 *
 * @module components/world/fishing/domains/rollingWorldPlazaFishingReelOpportunityWindows
 */

import {
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_COUNT_MAX,
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_COUNT_MIN,
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_DURATION_MS_MAX,
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_DURATION_MS_MIN,
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_END_CAST_RATIO_MAX,
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_MIN_GAP_CAST_RATIO,
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_PLACEMENT_ATTEMPTS,
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_START_CAST_RATIO_MAX,
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_START_CAST_RATIO_MIN,
  type DefiningWorldPlazaFishingReelOpportunityWindow,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingReelOpportunityConstants';

function interpolatingWorldPlazaFishingReelOpportunityValue(
  min: number,
  max: number,
  randomUnit: () => number
): number {
  return min + randomUnit() * (max - min);
}

function checkingWorldPlazaFishingReelOpportunityWindowOverlaps(
  windows: readonly DefiningWorldPlazaFishingReelOpportunityWindow[],
  startMs: number,
  endMs: number,
  minGapMs: number
): boolean {
  return windows.some((window) => {
    const existingStartMs = window.startMs;
    const existingEndMs = window.startMs + window.durationMs;

    return (
      startMs < existingEndMs + minGapMs && endMs + minGapMs > existingStartMs
    );
  });
}

/**
 * Schedules one or more non-overlapping reel-ready windows across a cast.
 */
export function rollingWorldPlazaFishingReelOpportunityWindows(
  castDurationMs: number,
  randomUnit: () => number = Math.random
): readonly DefiningWorldPlazaFishingReelOpportunityWindow[] {
  if (castDurationMs <= 0) {
    return [];
  }

  const windowCountRange =
    DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_COUNT_MAX -
    DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_COUNT_MIN +
    1;
  const windowCount =
    DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_COUNT_MIN +
    Math.floor(randomUnit() * windowCountRange);

  const minStartMs =
    castDurationMs *
    DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_START_CAST_RATIO_MIN;
  const maxStartMs =
    castDurationMs *
    DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_START_CAST_RATIO_MAX;
  const minGapMs =
    castDurationMs *
    DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_MIN_GAP_CAST_RATIO;
  const latestEndMs =
    castDurationMs *
    DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_END_CAST_RATIO_MAX;

  const windows: DefiningWorldPlazaFishingReelOpportunityWindow[] = [];

  for (let windowIndex = 0; windowIndex < windowCount; windowIndex += 1) {
    const durationMs = Math.round(
      interpolatingWorldPlazaFishingReelOpportunityValue(
        DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_DURATION_MS_MIN,
        DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_DURATION_MS_MAX,
        randomUnit
      )
    );

    for (
      let attempt = 0;
      attempt <
      DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_PLACEMENT_ATTEMPTS;
      attempt += 1
    ) {
      const latestStartMs = Math.max(
        minStartMs,
        Math.min(maxStartMs, latestEndMs - durationMs)
      );

      if (latestStartMs >= latestEndMs - durationMs) {
        break;
      }

      const startMs = Math.round(
        interpolatingWorldPlazaFishingReelOpportunityValue(
          minStartMs,
          latestStartMs,
          randomUnit
        )
      );
      const endMs = startMs + durationMs;

      if (endMs > latestEndMs) {
        continue;
      }

      if (
        checkingWorldPlazaFishingReelOpportunityWindowOverlaps(
          windows,
          startMs,
          endMs,
          minGapMs
        )
      ) {
        continue;
      }

      windows.push({ startMs, durationMs });
      break;
    }
  }

  return [...windows].sort((left, right) => left.startMs - right.startMs);
}
