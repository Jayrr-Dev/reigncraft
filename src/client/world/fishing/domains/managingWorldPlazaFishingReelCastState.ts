/**
 * Mutable reel cast state: opportunity windows, hold acceleration, escape bonus.
 *
 * @module components/world/fishing/domains/managingWorldPlazaFishingReelCastState
 */

import { checkingWorldPlazaFishingReelOpportunityActive } from '@/components/world/fishing/domains/checkingWorldPlazaFishingReelOpportunityActive';
import {
  DEFINING_WORLD_PLAZA_FISHING_REEL_CLICK_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_FISHING_REEL_ESCAPE_REDUCTION_MAX,
  DEFINING_WORLD_PLAZA_FISHING_REEL_ESCAPE_REDUCTION_PER_CLICK,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';
import type { DefiningWorldPlazaFishingReelOpportunityWindow } from '@/components/world/fishing/domains/definingWorldPlazaFishingReelOpportunityConstants';
import { DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO } from '@/components/world/fishing/domains/definingWorldPlazaFishingReelOpportunityConstants';
import { rollingWorldPlazaFishingReelOpportunityWindows } from '@/components/world/fishing/domains/rollingWorldPlazaFishingReelOpportunityWindows';
import { playingWildlifeStudySfx } from '@/components/world/wildlife/domains/playingWildlifeStudySfx';

type ManagingWorldPlazaFishingReelCastState = {
  castStartedAtMs: number;
  windows: readonly DefiningWorldPlazaFishingReelOpportunityWindow[];
  escapeReduction: number;
  lastReelClickAtMs: number;
  elapsedBonusMs: number;
  isHoldingReel: boolean;
  isOpportunityActive: boolean;
  firedOpportunityWindowIndices: Set<number>;
};

const managingWorldPlazaFishingReelCastInitialState: ManagingWorldPlazaFishingReelCastState =
  {
    castStartedAtMs: 0,
    windows: [],
    escapeReduction: 0,
    lastReelClickAtMs: 0,
    elapsedBonusMs: 0,
    isHoldingReel: false,
    isOpportunityActive: false,
    firedOpportunityWindowIndices: new Set(),
  };

let managingWorldPlazaFishingReelCastState: ManagingWorldPlazaFishingReelCastState =
  { ...managingWorldPlazaFishingReelCastInitialState };

function resolvingWorldPlazaFishingReelCastElapsedMs(nowMs: number): number {
  if (managingWorldPlazaFishingReelCastState.castStartedAtMs <= 0) {
    return 0;
  }

  return (
    nowMs -
    managingWorldPlazaFishingReelCastState.castStartedAtMs +
    managingWorldPlazaFishingReelCastState.elapsedBonusMs
  );
}

function firingWorldPlazaFishingReelOpportunityStudyCues(
  castElapsedMs: number
): void {
  for (
    let windowIndex = 0;
    windowIndex < managingWorldPlazaFishingReelCastState.windows.length;
    windowIndex += 1
  ) {
    const window = managingWorldPlazaFishingReelCastState.windows[windowIndex];

    if (!window) {
      continue;
    }

    const windowEndMs = window.startMs + window.durationMs;

    if (castElapsedMs < window.startMs || castElapsedMs >= windowEndMs) {
      continue;
    }

    if (
      managingWorldPlazaFishingReelCastState.firedOpportunityWindowIndices.has(
        windowIndex
      )
    ) {
      continue;
    }

    managingWorldPlazaFishingReelCastState.firedOpportunityWindowIndices.add(
      windowIndex
    );
    playingWildlifeStudySfx({ sectionId: 'study' });
  }
}

export function resettingWorldPlazaFishingReelCastState(): void {
  managingWorldPlazaFishingReelCastState = {
    ...managingWorldPlazaFishingReelCastInitialState,
    firedOpportunityWindowIndices: new Set(),
  };
}

export function beginningWorldPlazaFishingReelCastState(
  castStartedAtMs: number,
  castDurationMs: number,
  randomUnit: () => number = Math.random
): void {
  resettingWorldPlazaFishingReelCastState();
  managingWorldPlazaFishingReelCastState = {
    ...managingWorldPlazaFishingReelCastState,
    castStartedAtMs,
    windows: rollingWorldPlazaFishingReelOpportunityWindows(
      castDurationMs,
      randomUnit
    ),
  };
}

export function gettingWorldPlazaFishingReelCastElapsedBonusMs(): number {
  return managingWorldPlazaFishingReelCastState.elapsedBonusMs;
}

export function gettingWorldPlazaFishingReelOpportunityActive(): boolean {
  return managingWorldPlazaFishingReelCastState.isOpportunityActive;
}

export function gettingWorldPlazaFishingReelEscapeReduction(): number {
  return managingWorldPlazaFishingReelCastState.escapeReduction;
}

export function settingWorldPlazaFishingReelHold(isHoldingReel: boolean): void {
  managingWorldPlazaFishingReelCastState = {
    ...managingWorldPlazaFishingReelCastState,
    isHoldingReel,
  };
}

export function gettingWorldPlazaFishingReelHold(): boolean {
  return managingWorldPlazaFishingReelCastState.isHoldingReel;
}

export type ApplyingWorldPlazaFishingReelEscapeReductionResult =
  | 'applied'
  | 'capped'
  | 'cooldown'
  | 'not-ready';

/**
 * Adds one reel click worth of escape reduction when a window is active.
 */
export function applyingWorldPlazaFishingReelEscapeReduction(
  nowMs: number = performance.now(),
  cooldownMs: number = DEFINING_WORLD_PLAZA_FISHING_REEL_CLICK_COOLDOWN_MS
): ApplyingWorldPlazaFishingReelEscapeReductionResult {
  if (!gettingWorldPlazaFishingReelOpportunityActive()) {
    return 'not-ready';
  }

  if (
    nowMs - managingWorldPlazaFishingReelCastState.lastReelClickAtMs <
    cooldownMs
  ) {
    return 'cooldown';
  }

  if (
    managingWorldPlazaFishingReelCastState.escapeReduction >=
    DEFINING_WORLD_PLAZA_FISHING_REEL_ESCAPE_REDUCTION_MAX
  ) {
    return 'capped';
  }

  const nextEscapeReduction = Math.min(
    DEFINING_WORLD_PLAZA_FISHING_REEL_ESCAPE_REDUCTION_MAX,
    managingWorldPlazaFishingReelCastState.escapeReduction +
      DEFINING_WORLD_PLAZA_FISHING_REEL_ESCAPE_REDUCTION_PER_CLICK
  );

  managingWorldPlazaFishingReelCastState = {
    ...managingWorldPlazaFishingReelCastState,
    escapeReduction: nextEscapeReduction,
    lastReelClickAtMs: nowMs,
  };

  return nextEscapeReduction >=
    DEFINING_WORLD_PLAZA_FISHING_REEL_ESCAPE_REDUCTION_MAX
    ? 'capped'
    : 'applied';
}

/**
 * Updates opportunity-active flag, study cue, and hold acceleration each frame.
 */
export function tickingWorldPlazaFishingReelCastFrame(
  deltaMs: number,
  nowMs: number = performance.now()
): void {
  if (managingWorldPlazaFishingReelCastState.castStartedAtMs <= 0) {
    return;
  }

  const castElapsedMs = resolvingWorldPlazaFishingReelCastElapsedMs(nowMs);
  const isOpportunityActive = checkingWorldPlazaFishingReelOpportunityActive(
    castElapsedMs,
    managingWorldPlazaFishingReelCastState.windows
  );

  managingWorldPlazaFishingReelCastState = {
    ...managingWorldPlazaFishingReelCastState,
    isOpportunityActive,
  };

  firingWorldPlazaFishingReelOpportunityStudyCues(castElapsedMs);

  if (
    !managingWorldPlazaFishingReelCastState.isHoldingReel ||
    !isOpportunityActive ||
    deltaMs <= 0
  ) {
    return;
  }

  managingWorldPlazaFishingReelCastState = {
    ...managingWorldPlazaFishingReelCastState,
    elapsedBonusMs:
      managingWorldPlazaFishingReelCastState.elapsedBonusMs +
      deltaMs * DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO,
  };
}
