/**
 * Network-synced avatar motion kinds for plaza multiplayer.
 *
 * @module components/world/domains/definingWorldPlazaAvatarMotionConstants
 */

import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTIONS,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type {
  DefiningWorldPlazaHeldItemTier,
  DefiningWorldPlazaHeldItemVisualId,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';

/** Avatar is standing still. */
export const DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE = 'idle' as const;

/** Avatar is walking. */
export const DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK = 'walk' as const;

/** Avatar is running. */
export const DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN = 'run' as const;

/** Avatar is playing a jump animation. */
export const DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP = 'jump' as const;

/** Supported motion kinds synced over Colyseus. */
export const DEFINING_WORLD_PLAZA_AVATAR_MOTION_KINDS = [
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP,
] as const;

/** Network-synced avatar motion kind. */
export type DefiningWorldPlazaAvatarMotionKind =
  (typeof DEFINING_WORLD_PLAZA_AVATAR_MOTION_KINDS)[number];

/** Live motion state written by avatars and sent to multiplayer sync. */
export interface DefiningWorldPlazaAvatarMotionState {
  motionKind: DefiningWorldPlazaAvatarMotionKind;
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  /** Wall-clock ms when the current jump started; 0 when not jumping. */
  jumpStartedAtMs: number;
  /** Peak jump arc height in screen px; 0 when not jumping. */
  jumpArcPeakScreenPx: number;
  /** One-based world layer the avatar is standing on (1 = ground). */
  layer: number;
  /** Equipped hotbar held-item overlay; null when nothing visual equipped. */
  heldItemVisualId: DefiningWorldPlazaHeldItemVisualId | null;
  heldItemTier: DefiningWorldPlazaHeldItemTier | null;
}

/** Default idle motion state for newly joined players. */
export const DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE: DefiningWorldPlazaAvatarMotionState =
  {
    motionKind: DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE,
    facingDirection: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION,
    jumpStartedAtMs: 0,
    jumpArcPeakScreenPx: 0,
    layer: 1,
    heldItemVisualId: null,
    heldItemTier: null,
  };

/**
 * Parses a Colyseus motion kind string into a supported value.
 *
 * @param motionKind - Raw synchronized motion kind.
 */
export function resolvingWorldPlazaAvatarMotionKindFromString(
  motionKind: string
): DefiningWorldPlazaAvatarMotionKind {
  if (
    DEFINING_WORLD_PLAZA_AVATAR_MOTION_KINDS.includes(
      motionKind as DefiningWorldPlazaAvatarMotionKind
    )
  ) {
    return motionKind as DefiningWorldPlazaAvatarMotionKind;
  }

  return DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE;
}

/**
 * Parses a Colyseus facing string into a GirlSample direction strip.
 *
 * @param facingDirection - Raw synchronized facing direction.
 */
export function resolvingWorldPlazaGirlSampleWalkDirectionFromString(
  facingDirection: string
): DefiningWorldPlazaGirlSampleWalkDirection {
  if (
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTIONS.includes(
      facingDirection as DefiningWorldPlazaGirlSampleWalkDirection
    )
  ) {
    return facingDirection as DefiningWorldPlazaGirlSampleWalkDirection;
  }

  return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION;
}
