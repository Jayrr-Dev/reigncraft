/**
 * Predicate for whether a cast is inside a reel-ready opportunity window.
 *
 * @module components/world/fishing/domains/checkingWorldPlazaFishingReelOpportunityActive
 */

import type { DefiningWorldPlazaFishingReelOpportunityWindow } from '@/components/world/fishing/domains/definingWorldPlazaFishingReelOpportunityConstants';

export function checkingWorldPlazaFishingReelOpportunityActive(
  castElapsedMs: number,
  windows: readonly DefiningWorldPlazaFishingReelOpportunityWindow[]
): boolean {
  return windows.some((window) => {
    const windowEndMs = window.startMs + window.durationMs;

    return castElapsedMs >= window.startMs && castElapsedMs < windowEndMs;
  });
}
