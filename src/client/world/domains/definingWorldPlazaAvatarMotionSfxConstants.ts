import type { DefiningWorldPlazaSfxClipEntry } from '@/components/world/audio/definingWorldPlazaSfxClipEntry';
import type { DefiningFilmcowFootstepClipId } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

/**
 * Jump takeoff and roll dodge SFX for the girl-sample avatar skin.
 *
 * Clips reuse FilmCow footstep assets from `public/movement/sfx/filmcow-footsteps/`.
 *
 * @module components/world/domains/definingWorldPlazaAvatarMotionSfxConstants
 */

/** Local avatar motion events that play one-shot SFX. */
export type DefiningWorldPlazaAvatarMotionSfxEventKind =
  | 'jump_takeoff'
  | 'roll_dodge';

/** Rotating light push-off clips when a jump starts. */
export const DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_CLIP_IDS = [
  'grass_stomp_01',
  'grass_stomp_02',
  'land_grass_01',
  'land_grass_02',
] as const satisfies readonly DefiningWorldPlazaSfxClipEntry<DefiningFilmcowFootstepClipId>[];

/** Rotating tumble clips when a roll dodge starts. */
export const DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_CLIP_IDS = [
  'leaves_run',
  'dirt_run',
  'grass_stomp_02',
  'land_grass_03',
] as const satisfies readonly DefiningWorldPlazaSfxClipEntry<DefiningFilmcowFootstepClipId>[];

/** Jump takeoff volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_TARGET_VOLUME = 0.42;

/** Roll dodge volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_TARGET_VOLUME = 0.5;

/** Playback-rate boost for jump takeoff one-shots. */
export const DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_PLAYBACK_RATE = 1.12;

/** Playback-rate boost for roll dodge one-shots. */
export const DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_PLAYBACK_RATE = 1.22;

/** Hard cap on jump takeoff length so clips do not linger. */
export const DEFINING_WORLD_PLAZA_AVATAR_JUMP_TAKEOFF_SFX_MAX_PLAYBACK_DURATION_S = 0.38;

/** Hard cap on roll dodge length so clips do not linger. */
export const DEFINING_WORLD_PLAZA_AVATAR_ROLL_DODGE_SFX_MAX_PLAYBACK_DURATION_S = 0.48;
