import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK,
  type DefiningWorldPlazaAvatarMotionKind,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import type {
  DefiningFilmcowFootstepClipId,
  DefiningFilmcowFootstepSurfaceKind,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import {
  DEFINING_FILMCOW_BIOME_FOOTSTEP_SURFACE_BY_KIND,
  DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG,
  DEFINING_FILMCOW_FOOTSTEP_MAX_RUN_PLAYBACK_DURATION_S,
  DEFINING_FILMCOW_FOOTSTEP_MAX_WALK_PLAYBACK_DURATION_S,
  DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_PLAYBACK_RATE,
  DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

/**
 * FilmCow footstep SFX for girl-sample and playable animal avatar skins.
 *
 * Walk, run, and jump landing use biome-mapped clips from
 * `public/movement/sfx/filmcow-footsteps/` (and Nox on hard surfaces).
 * Animals use the wildlife clip pools so they stay disjoint from girl steps.
 *
 * @module components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants
 */

export type DefiningWorldPlazaAvatarFootstepSurfaceKind =
  DefiningFilmcowFootstepSurfaceKind;

export type DefiningWorldPlazaAvatarFootstepClipId =
  DefiningFilmcowFootstepClipId;

export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_CLIP_CATALOG =
  DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG;

export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS =
  DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS;

export const DEFINING_WORLD_PLAZA_BIOME_AVATAR_FOOTSTEP_SURFACE_BY_KIND =
  DEFINING_FILMCOW_BIOME_FOOTSTEP_SURFACE_BY_KIND;

/** Motion kinds that trigger the footstep loop. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MOTION_KINDS = [
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
] as const satisfies readonly DefiningWorldPlazaAvatarMotionKind[];

/** Footfalls per full walk/run animation cycle. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_STRIDES_PER_ANIMATION_CYCLE = 2;

/** How often avatar footstep SFX checks motion and biome (ms). */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_POLL_INTERVAL_MS = 50;

/** Per-step playback volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_TARGET_VOLUME = 0.22;

/** Hard cap on walk one-shot length so clips never stack into an echo. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MAX_WALK_PLAYBACK_DURATION_S =
  DEFINING_FILMCOW_FOOTSTEP_MAX_WALK_PLAYBACK_DURATION_S;

/** Hard cap on run one-shot length for the faster cadence. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_MAX_RUN_PLAYBACK_DURATION_S =
  DEFINING_FILMCOW_FOOTSTEP_MAX_RUN_PLAYBACK_DURATION_S;

/** Playback-rate boost for short FilmCow clips used as run steps. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SHORT_RUN_PLAYBACK_RATE =
  DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_PLAYBACK_RATE;

/** Jump landing volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_AVATAR_JUMP_LANDING_SFX_TARGET_VOLUME = 0.27;

/** Slight playback-rate boost while running when no dedicated run clip exists. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_RUN_PLAYBACK_RATE = 1.08;
