/**
 * Declarative swing move sets for held tools during timed tool actions.
 *
 * Each facing direction gets an exact keyframe track (phase 0..1). A keyframe
 * pins rotation offset (added to the carry tilt) and hand-relative drift in
 * avatar-frame px. The interpolator in
 * `computingWorldPlazaHeldItemSwingPose.ts` eases between neighbors, so tuning
 * a swing means editing numbers here, never touching render code.
 *
 * @module components/world/equipment/domains/definingWorldPlazaHeldItemSwingRegistry
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaAvatarToolActionId } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';

/** One pinned pose on a swing track. Phases must ascend, 0 and 1 included. */
export type DefiningWorldPlazaHeldItemSwingKeyframe = {
  readonly phase: number;
  /** Added to the direction pose's carry rotation. */
  readonly rotationOffsetRadians: number;
  /** Drift from the carry position, avatar-frame px (scaled like offsets). */
  readonly driftAvatarFramePxX: number;
  readonly driftAvatarFramePxY: number;
};

export type DefiningWorldPlazaHeldItemSwingTrack = {
  readonly keyframes: readonly DefiningWorldPlazaHeldItemSwingKeyframe[];
};

export type DefiningWorldPlazaHeldItemSwingProfile = {
  /** Full windup-strike-recover loop length. */
  readonly cycleDurationMs: number;
  readonly byDirection: Record<
    DefiningWorldPlazaGirlSampleWalkDirection,
    DefiningWorldPlazaHeldItemSwingTrack
  >;
};

/**
 * Chop arc for right-side facings: raise behind the shoulder, snap down and
 * across the body, brief follow-through, return to carry.
 */
const DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_RIGHT_SIDE_KEYFRAMES: readonly DefiningWorldPlazaHeldItemSwingKeyframe[] =
  [
    { phase: 0, rotationOffsetRadians: 0, driftAvatarFramePxX: 0, driftAvatarFramePxY: 0 },
    { phase: 0.3, rotationOffsetRadians: -1.15, driftAvatarFramePxX: -3, driftAvatarFramePxY: -5 },
    { phase: 0.45, rotationOffsetRadians: -1.25, driftAvatarFramePxX: -3, driftAvatarFramePxY: -6 },
    { phase: 0.58, rotationOffsetRadians: 0.85, driftAvatarFramePxX: 4, driftAvatarFramePxY: 4 },
    { phase: 0.72, rotationOffsetRadians: 0.6, driftAvatarFramePxX: 3, driftAvatarFramePxY: 3 },
    { phase: 1, rotationOffsetRadians: 0, driftAvatarFramePxX: 0, driftAvatarFramePxY: 0 },
  ];

/** Mirror of the right-side chop arc for left-side facings. */
const DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_LEFT_SIDE_KEYFRAMES: readonly DefiningWorldPlazaHeldItemSwingKeyframe[] =
  DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_RIGHT_SIDE_KEYFRAMES.map(
    (keyframe) => ({
      phase: keyframe.phase,
      rotationOffsetRadians: -keyframe.rotationOffsetRadians,
      driftAvatarFramePxX: -keyframe.driftAvatarFramePxX,
      driftAvatarFramePxY: keyframe.driftAvatarFramePxY,
    })
  );

/**
 * Overhead chop for straight up/down facings: shorter arc, mostly vertical
 * drift so the tool reads as lifting over the head and striking forward.
 */
const DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_VERTICAL_KEYFRAMES: readonly DefiningWorldPlazaHeldItemSwingKeyframe[] =
  [
    { phase: 0, rotationOffsetRadians: 0, driftAvatarFramePxX: 0, driftAvatarFramePxY: 0 },
    { phase: 0.3, rotationOffsetRadians: -0.7, driftAvatarFramePxX: 0, driftAvatarFramePxY: -7 },
    { phase: 0.45, rotationOffsetRadians: -0.8, driftAvatarFramePxX: 0, driftAvatarFramePxY: -8 },
    { phase: 0.58, rotationOffsetRadians: 0.55, driftAvatarFramePxX: 0, driftAvatarFramePxY: 5 },
    { phase: 0.72, rotationOffsetRadians: 0.4, driftAvatarFramePxX: 0, driftAvatarFramePxY: 3 },
    { phase: 1, rotationOffsetRadians: 0, driftAvatarFramePxX: 0, driftAvatarFramePxY: 0 },
  ];

const DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_VERTICAL_MIRRORED_KEYFRAMES: readonly DefiningWorldPlazaHeldItemSwingKeyframe[] =
  DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_VERTICAL_KEYFRAMES.map(
    (keyframe) => ({
      ...keyframe,
      rotationOffsetRadians: -keyframe.rotationOffsetRadians,
    })
  );

const DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_PROFILE: DefiningWorldPlazaHeldItemSwingProfile =
  {
    cycleDurationMs: 520,
    byDirection: {
      Down: {
        keyframes: DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_VERTICAL_KEYFRAMES,
      },
      DownRight: {
        keyframes:
          DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_RIGHT_SIDE_KEYFRAMES,
      },
      Right: {
        keyframes:
          DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_RIGHT_SIDE_KEYFRAMES,
      },
      UpRight: {
        keyframes:
          DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_RIGHT_SIDE_KEYFRAMES,
      },
      Up: {
        keyframes:
          DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_VERTICAL_MIRRORED_KEYFRAMES,
      },
      UpLeft: {
        keyframes:
          DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_LEFT_SIDE_KEYFRAMES,
      },
      Left: {
        keyframes:
          DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_LEFT_SIDE_KEYFRAMES,
      },
      DownLeft: {
        keyframes:
          DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_LEFT_SIDE_KEYFRAMES,
      },
    },
  };

/**
 * Which swing profile plays for each tool action. `null` keeps the carry pose
 * (eating swings nothing).
 */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_SWING_PROFILE_BY_TOOL_ACTION: Record<
  DefiningWorldPlazaAvatarToolActionId,
  DefiningWorldPlazaHeldItemSwingProfile | null
> = {
  'tree-chop': DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_PROFILE,
  'rock-mine': DEFINING_WORLD_PLAZA_HELD_ITEM_CHOP_SWING_PROFILE,
  eat: null,
};
