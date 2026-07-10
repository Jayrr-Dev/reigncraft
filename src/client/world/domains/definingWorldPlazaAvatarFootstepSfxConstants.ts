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
  DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

/**
 * FilmCow footstep SFX for the girl-sample avatar skin.
 *
 * Walk, run, and jump landing use biome-mapped clips from
 * `public/sfx/filmcow-footsteps/`. Other skins stay silent.
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

/** Jump landing volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_AVATAR_JUMP_LANDING_SFX_TARGET_VOLUME = 0.27;

/** Slight playback-rate boost while running when no dedicated run clip exists. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_RUN_PLAYBACK_RATE = 1.08;
