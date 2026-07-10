import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK,
  type DefiningWorldPlazaAvatarMotionKind,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Free Footsteps Pack surface SFX for the girl-sample avatar skin.
 *
 * Walk, run, and jump landing use biome-mapped clips from
 * `public/sfx/free-footsteps-pack/`. Other skins stay silent.
 *
 * @module components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants
 */

/** Public URL prefix for shipped Free Footsteps Pack clips. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_ASSET_BASE_URL =
  '/sfx/free-footsteps-pack' as const;

/** Ground surface groups in the Free Footsteps Pack. */
export type DefiningWorldPlazaAvatarFootstepSurfaceKind =
  | 'grass'
  | 'forest'
  | 'gravel'
  | 'sand'
  | 'snow'
  | 'concrete';

/** Stable ids for each bundled avatar footstep clip. */
export type DefiningWorldPlazaAvatarFootstepClipId =
  | 'concrete_1'
  | 'concrete_2'
  | 'forest_1'
  | 'forest_2'
  | 'grass_1'
  | 'grass_running'
  | 'gravel_1'
  | 'gravel_run'
  | 'sand'
  | 'snow';

/** One Free Footsteps Pack clip entry. */
export type DefiningWorldPlazaAvatarFootstepClipDefinition = {
  /** Stable clip id. */
  id: DefiningWorldPlazaAvatarFootstepClipId;
  /** WAV filename on disk. */
  fileName: string;
};

/** Every footstep clip shipped for the local avatar. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_CLIP_CATALOG: Record<
  DefiningWorldPlazaAvatarFootstepClipId,
  DefiningWorldPlazaAvatarFootstepClipDefinition
> = {
  concrete_1: { id: 'concrete_1', fileName: 'concrete-1.wav' },
  concrete_2: { id: 'concrete_2', fileName: 'concrete-2.wav' },
  forest_1: { id: 'forest_1', fileName: 'forest-1.wav' },
  forest_2: { id: 'forest_2', fileName: 'forest-2.wav' },
  grass_1: { id: 'grass_1', fileName: 'grass-1.wav' },
  grass_running: { id: 'grass_running', fileName: 'grass-running.wav' },
  gravel_1: { id: 'gravel_1', fileName: 'gravel-1.wav' },
  gravel_run: { id: 'gravel_run', fileName: 'gravel-run.wav' },
  sand: { id: 'sand', fileName: 'sand.wav' },
  snow: { id: 'snow', fileName: 'snow.wav' },
};

/** Walk/run clip rotation and jump landing clip per surface. */
export type DefiningWorldPlazaAvatarFootstepSurfaceDefinition = {
  /** Walk cycle clip ids. */
  walkClipIds: DefiningWorldPlazaAvatarFootstepClipId[];
  /** Run cycle clip ids. */
  runClipIds: DefiningWorldPlazaAvatarFootstepClipId[];
  /** One-shot played when a jump finishes. */
  landingClipId: DefiningWorldPlazaAvatarFootstepClipId;
};

/** Surface playback tables keyed by Free Footsteps Pack ground type. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SURFACE_DEFINITIONS: Record<
  DefiningWorldPlazaAvatarFootstepSurfaceKind,
  DefiningWorldPlazaAvatarFootstepSurfaceDefinition
> = {
  grass: {
    walkClipIds: ['grass_1'],
    runClipIds: ['grass_running'],
    landingClipId: 'grass_1',
  },
  forest: {
    walkClipIds: ['forest_1', 'forest_2'],
    runClipIds: ['forest_1', 'forest_2'],
    landingClipId: 'forest_2',
  },
  gravel: {
    walkClipIds: ['gravel_1'],
    runClipIds: ['gravel_run'],
    landingClipId: 'gravel_1',
  },
  sand: {
    walkClipIds: ['sand'],
    runClipIds: ['sand'],
    landingClipId: 'sand',
  },
  snow: {
    walkClipIds: ['snow'],
    runClipIds: ['snow'],
    landingClipId: 'snow',
  },
  concrete: {
    walkClipIds: ['concrete_1', 'concrete_2'],
    runClipIds: ['concrete_1', 'concrete_2'],
    landingClipId: 'concrete_2',
  },
};

/**
 * Maps each plaza biome to the Free Footsteps Pack surface that best matches
 * its ground feel.
 */
export const DEFINING_WORLD_PLAZA_BIOME_AVATAR_FOOTSTEP_SURFACE_BY_KIND: Record<
  DefiningWorldPlazaBiomeKind,
  DefiningWorldPlazaAvatarFootstepSurfaceKind
> = {
  plains: 'grass',
  forest: 'forest',
  flower_forest: 'grass',
  jungle: 'forest',
  desert: 'sand',
  snowy_plains: 'snow',
  swamp: 'grass',
  savanna: 'grass',
  badlands: 'gravel',
  beach: 'sand',
  ocean: 'sand',
  rocky: 'concrete',
  firelands: 'gravel',
};

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
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_SFX_TARGET_VOLUME = 0.28;

/** Jump landing volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_AVATAR_JUMP_LANDING_SFX_TARGET_VOLUME = 0.34;

/** Slight playback-rate boost while running when no dedicated run clip exists. */
export const DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_RUN_PLAYBACK_RATE = 1.08;
