/**
 * Motion clip presentation when wildlife is stationary vs actually moving.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeLocomotionPresentation
 */

import { DEFINING_WILDLIFE_ATTACK_CLIP_HOLD_MS } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeMotionClipKind } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type {
  DefiningWildlifeAiState,
  DefiningWildlifeBehaviorIntent,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  DEFINING_WILDLIFE_WOLF_ATTACK2_CLIP_HOLD_MS,
  DEFINING_WILDLIFE_WOLF_ATTACK3_CLIP_HOLD_MS,
} from '@/components/world/wildlife/domains/definingWildlifeWolfVocalizationConstants';

/** Grid movement below this counts as standing still for locomotion clips. */
export const DEFINING_WILDLIFE_LOCOMOTION_MOTION_EPSILON_GRID = 0.02;

/**
 * Body speed below this counts as standing still (grid/s). Speed-based so the
 * walk/idle decision is frame-rate independent: a fixed per-frame distance
 * epsilon flickers slow walkers (sheep 1.5 grid/s ≈ 0.025 grid per 60fps
 * frame) between walk and idle on fast or jittery frames, resetting the walk
 * clip to frame 0 each flip.
 */
export const DEFINING_WILDLIFE_LOCOMOTION_MOTION_EPSILON_GRID_PER_SECOND = 0.3;

export type ResolvingWildlifeLocomotionPresentationParams = {
  aiState: DefiningWildlifeAiState;
  intent: DefiningWildlifeBehaviorIntent;
  movedDistanceGrid: number;
  deltaSeconds: number;
  nowMs: number;
};

function checkingWildlifeLocomotionClipIsStationary(
  motionClip: DefiningWildlifeMotionClipKind
): boolean {
  return motionClip === 'walk' || motionClip === 'run';
}

function resolvingWildlifeAttackMotionClipHoldMs(
  motionClip: DefiningWildlifeMotionClipKind
): number {
  if (motionClip === 'attack3') {
    return DEFINING_WILDLIFE_WOLF_ATTACK3_CLIP_HOLD_MS;
  }

  if (motionClip === 'attack2') {
    return DEFINING_WILDLIFE_WOLF_ATTACK2_CLIP_HOLD_MS;
  }

  return DEFINING_WILDLIFE_ATTACK_CLIP_HOLD_MS;
}

function resolvingWildlifeAttackMotionClip(
  lastAttackAtMs: number | null,
  currentMotionClip: DefiningWildlifeMotionClipKind,
  nowMs: number
): DefiningWildlifeMotionClipKind {
  if (
    lastAttackAtMs !== null &&
    (currentMotionClip === 'attack' ||
      currentMotionClip === 'attack2' ||
      currentMotionClip === 'attack3') &&
    nowMs - lastAttackAtMs <
      resolvingWildlifeAttackMotionClipHoldMs(currentMotionClip)
  ) {
    return currentMotionClip;
  }

  return 'idle';
}

/**
 * Keeps walk/run clips off when the instance did not actually move this tick.
 */
export function resolvingWildlifeLocomotionPresentation({
  aiState,
  intent,
  movedDistanceGrid,
  deltaSeconds,
  nowMs,
}: ResolvingWildlifeLocomotionPresentationParams): Pick<
  DefiningWildlifeAiState,
  'motionClip' | 'isMoving'
> {
  if (aiState.jumpState || aiState.isSleeping) {
    return {
      isMoving: aiState.isMoving,
      motionClip: aiState.motionClip,
    };
  }

  if (intent.mode === 'attack') {
    return {
      isMoving: false,
      motionClip: resolvingWildlifeAttackMotionClip(
        aiState.lastAttackAtMs,
        aiState.motionClip,
        nowMs
      ),
    };
  }

  if (aiState.motionClip === 'howl') {
    return {
      isMoving: false,
      motionClip: 'howl',
    };
  }

  // Zero-delta frames carry no movement information; keep the current clip
  // instead of flashing to idle.
  if (deltaSeconds <= 0) {
    return {
      isMoving: aiState.isMoving,
      motionClip: aiState.motionClip,
    };
  }

  const moved =
    movedDistanceGrid / deltaSeconds >
    DEFINING_WILDLIFE_LOCOMOTION_MOTION_EPSILON_GRID_PER_SECOND;

  if (!moved) {
    return {
      isMoving: false,
      motionClip: checkingWildlifeLocomotionClipIsStationary(aiState.motionClip)
        ? 'idle'
        : aiState.motionClip,
    };
  }

  if (intent.mode === 'stalk') {
    return {
      isMoving: true,
      motionClip: intent.pace === 'run' ? 'run' : 'walk',
    };
  }

  return {
    isMoving: true,
    motionClip: aiState.motionClip,
  };
}

/**
 * Clears stale locomotion clips after passive position nudges (separation, sync).
 */
export function syncingWildlifeStationaryLocomotionPresentation(instance: {
  aiState: DefiningWildlifeAiState;
  isDead: boolean;
}): Pick<DefiningWildlifeAiState, 'motionClip' | 'isMoving'> | null {
  if (
    instance.isDead ||
    instance.aiState.jumpState ||
    instance.aiState.isSleeping
  ) {
    return null;
  }

  if (
    !instance.aiState.isMoving &&
    checkingWildlifeLocomotionClipIsStationary(instance.aiState.motionClip)
  ) {
    return {
      isMoving: false,
      motionClip: 'idle',
    };
  }

  return null;
}
