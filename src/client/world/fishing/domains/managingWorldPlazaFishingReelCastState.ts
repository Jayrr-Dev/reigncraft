/**
 * Mutable reel cast state: opportunity windows, hold acceleration, escape bonus.
 *
 * @module components/world/fishing/domains/managingWorldPlazaFishingReelCastState
 */

import { checkingWorldPlazaFishingReelOpportunityActive } from '@/components/world/fishing/domains/checkingWorldPlazaFishingReelOpportunityActive';
import { computingWorldPlazaFishingReelHoldAccelerationExtraRatio } from '@/components/world/fishing/domains/computingWorldPlazaFishingReelHoldAccelerationExtraRatio';
import {
  DEFINING_WORLD_PLAZA_FISHING_REEL_CLICK_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_FISHING_REEL_ESCAPE_REDUCTION_MAX,
  DEFINING_WORLD_PLAZA_FISHING_REEL_ESCAPE_REDUCTION_PER_CLICK,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';
import type { DefiningWorldPlazaFishingReelOpportunityWindow } from '@/components/world/fishing/domains/definingWorldPlazaFishingReelOpportunityConstants';
import { rollingWorldPlazaFishingReelOpportunityWindows } from '@/components/world/fishing/domains/rollingWorldPlazaFishingReelOpportunityWindows';
import { playingWildlifeStudySfx } from '@/components/world/wildlife/domains/playingWildlifeStudySfx';

type ManagingWorldPlazaFishingReelCastState = {
  castStartedAtMs: number;
  windows: readonly DefiningWorldPlazaFishingReelOpportunityWindow[];
  escapeReduction: number;
  lastReelClickAtMs: number;
  elapsedBonusMs: number;
  /** Real ms spent holding during an active opportunity (resets on release). */
  holdElapsedMs: number;
  isHoldingReel: boolean;
  /** True after the player starts holding during a ready window; lasts the cast. */
  hasCaughtReel: boolean;
  /** Window clock is inside a rolled opportunity. */
  isInsideOpportunityWindow: boolean;
  /** Ready for reel UI / clicks: inside window, or caught and still fishing. */
  isOpportunityActive: boolean;
  /** Yellow ready flash should render this frame (first window only). */
  isReadyFlashVisible: boolean;
  firedOpportunityWindowIndices: Set<number>;
};

const managingWorldPlazaFishingReelCastInitialState: ManagingWorldPlazaFishingReelCastState =
  {
    castStartedAtMs: 0,
    windows: [],
    escapeReduction: 0,
    lastReelClickAtMs: 0,
    elapsedBonusMs: 0,
    holdElapsedMs: 0,
    isHoldingReel: false,
    hasCaughtReel: false,
    isInsideOpportunityWindow: false,
    isOpportunityActive: false,
    isReadyFlashVisible: false,
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
  // Caught reel stays ready for rest of cast — no more ready bells.
  if (managingWorldPlazaFishingReelCastState.hasCaughtReel) {
    return;
  }

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

export function gettingWorldPlazaFishingReelReadyFlashVisible(): boolean {
  return managingWorldPlazaFishingReelCastState.isReadyFlashVisible;
}

export function gettingWorldPlazaFishingReelEscapeReduction(): number {
  return managingWorldPlazaFishingReelCastState.escapeReduction;
}

export function settingWorldPlazaFishingReelHold(isHoldingReel: boolean): void {
  const shouldCatchReel =
    isHoldingReel &&
    (managingWorldPlazaFishingReelCastState.isInsideOpportunityWindow ||
      managingWorldPlazaFishingReelCastState.hasCaughtReel);
  const wasHoldingReel = managingWorldPlazaFishingReelCastState.isHoldingReel;

  managingWorldPlazaFishingReelCastState = {
    ...managingWorldPlazaFishingReelCastState,
    isHoldingReel,
    // Fresh press restarts the accelerate → slow pull cycle.
    holdElapsedMs:
      isHoldingReel && !wasHoldingReel
        ? 0
        : isHoldingReel
          ? managingWorldPlazaFishingReelCastState.holdElapsedMs
          : 0,
    hasCaughtReel:
      managingWorldPlazaFishingReelCastState.hasCaughtReel || shouldCatchReel,
  };
}

export function gettingWorldPlazaFishingReelHold(): boolean {
  return managingWorldPlazaFishingReelCastState.isHoldingReel;
}

export function gettingWorldPlazaFishingReelCaught(): boolean {
  return managingWorldPlazaFishingReelCastState.hasCaughtReel;
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
  const isInsideOpportunityWindow =
    checkingWorldPlazaFishingReelOpportunityActive(
      castElapsedMs,
      managingWorldPlazaFishingReelCastState.windows
    );
  const hasCaughtReel = managingWorldPlazaFishingReelCastState.hasCaughtReel;
  const isOpportunityActive = isInsideOpportunityWindow || hasCaughtReel;
  const isHoldingReel = managingWorldPlazaFishingReelCastState.isHoldingReel;
  const firstWindow = managingWorldPlazaFishingReelCastState.windows[0];
  const isInsideFirstOpportunityWindow =
    firstWindow !== undefined &&
    castElapsedMs >= firstWindow.startMs &&
    castElapsedMs < firstWindow.startMs + firstWindow.durationMs;
  const isReadyFlashVisible = isInsideFirstOpportunityWindow;

  managingWorldPlazaFishingReelCastState = {
    ...managingWorldPlazaFishingReelCastState,
    isInsideOpportunityWindow,
    isOpportunityActive,
    isReadyFlashVisible,
  };

  firingWorldPlazaFishingReelOpportunityStudyCues(castElapsedMs);

  if (!isHoldingReel || !isOpportunityActive || deltaMs <= 0) {
    return;
  }

  const nextHoldElapsedMs =
    managingWorldPlazaFishingReelCastState.holdElapsedMs + deltaMs;
  const extraRatio =
    computingWorldPlazaFishingReelHoldAccelerationExtraRatio(nextHoldElapsedMs);

  managingWorldPlazaFishingReelCastState = {
    ...managingWorldPlazaFishingReelCastState,
    holdElapsedMs: nextHoldElapsedMs,
    elapsedBonusMs:
      managingWorldPlazaFishingReelCastState.elapsedBonusMs +
      deltaMs * extraRatio,
  };
}
