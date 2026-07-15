/**
 * Reel opportunity window roll unit tests.
 *
 * @module components/world/fishing/domains/rollingWorldPlazaFishingReelOpportunityWindows.test
 */

import { checkingWorldPlazaFishingReelOpportunityActive } from '@/components/world/fishing/domains/checkingWorldPlazaFishingReelOpportunityActive';
import {
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_COUNT_MAX,
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_COUNT_MIN,
  DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_END_CAST_RATIO_MAX,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingReelOpportunityConstants';
import { rollingWorldPlazaFishingReelOpportunityWindows } from '@/components/world/fishing/domains/rollingWorldPlazaFishingReelOpportunityWindows';
import { describe, expect, it } from 'vitest';

describe('rollingWorldPlazaFishingReelOpportunityWindows', () => {
  it('returns at least one window for a normal cast duration', () => {
    const windows = rollingWorldPlazaFishingReelOpportunityWindows(
      6000,
      () => 0.5
    );

    expect(windows.length).toBeGreaterThanOrEqual(
      DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_COUNT_MIN
    );
    expect(windows.length).toBeLessThanOrEqual(
      DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_COUNT_MAX
    );
  });

  it('keeps windows inside the cast timeline', () => {
    const castDurationMs = 8000;
    const windows = rollingWorldPlazaFishingReelOpportunityWindows(
      castDurationMs,
      () => 0.42
    );
    const latestEndMs =
      castDurationMs *
      DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_END_CAST_RATIO_MAX;

    for (const window of windows) {
      expect(window.startMs).toBeGreaterThanOrEqual(0);
      expect(window.startMs + window.durationMs).toBeLessThanOrEqual(
        latestEndMs + 1
      );
    }
  });

  it('marks elapsed time active only inside a rolled window', () => {
    const windows = rollingWorldPlazaFishingReelOpportunityWindows(
      5000,
      () => 0.25
    );
    const firstWindow = windows[0];

    expect(firstWindow).toBeDefined();

    if (!firstWindow) {
      return;
    }

    expect(
      checkingWorldPlazaFishingReelOpportunityActive(
        firstWindow.startMs - 1,
        windows
      )
    ).toBe(false);
    expect(
      checkingWorldPlazaFishingReelOpportunityActive(
        firstWindow.startMs + 10,
        windows
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaFishingReelOpportunityActive(
        firstWindow.startMs + firstWindow.durationMs,
        windows
      )
    ).toBe(false);
  });
});
