/**
 * Pure keyframe interpolation for held-item swing tracks.
 *
 * @module components/world/equipment/domains/computingWorldPlazaHeldItemSwingPose
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaHeldItemSwingProfile } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemSwingRegistry';

export type ComputingWorldPlazaHeldItemSwingPose = {
  readonly rotationOffsetRadians: number;
  readonly driftAvatarFramePxX: number;
  readonly driftAvatarFramePxY: number;
};

function computingSmoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Samples one swing track at `elapsedMs` into the action. Loops every cycle.
 */
export function computingWorldPlazaHeldItemSwingPose(
  profile: DefiningWorldPlazaHeldItemSwingProfile,
  direction: DefiningWorldPlazaGirlSampleWalkDirection,
  elapsedMs: number
): ComputingWorldPlazaHeldItemSwingPose {
  const { keyframes } = profile.byDirection[direction];
  const cyclePhase =
    (((elapsedMs % profile.cycleDurationMs) + profile.cycleDurationMs) %
      profile.cycleDurationMs) /
    profile.cycleDurationMs;

  let previousKeyframe = keyframes[0];
  let nextKeyframe = keyframes[keyframes.length - 1];

  for (const keyframe of keyframes) {
    if (keyframe.phase <= cyclePhase) {
      previousKeyframe = keyframe;
    } else {
      nextKeyframe = keyframe;
      break;
    }
  }

  if (!previousKeyframe || !nextKeyframe) {
    return {
      rotationOffsetRadians: 0,
      driftAvatarFramePxX: 0,
      driftAvatarFramePxY: 0,
    };
  }

  const segmentSpan = nextKeyframe.phase - previousKeyframe.phase;
  const segmentT =
    segmentSpan <= 0
      ? 0
      : computingSmoothstep((cyclePhase - previousKeyframe.phase) / segmentSpan);

  return {
    rotationOffsetRadians:
      previousKeyframe.rotationOffsetRadians +
      (nextKeyframe.rotationOffsetRadians -
        previousKeyframe.rotationOffsetRadians) *
        segmentT,
    driftAvatarFramePxX:
      previousKeyframe.driftAvatarFramePxX +
      (nextKeyframe.driftAvatarFramePxX -
        previousKeyframe.driftAvatarFramePxX) *
        segmentT,
    driftAvatarFramePxY:
      previousKeyframe.driftAvatarFramePxY +
      (nextKeyframe.driftAvatarFramePxY -
        previousKeyframe.driftAvatarFramePxY) *
        segmentT,
  };
}
