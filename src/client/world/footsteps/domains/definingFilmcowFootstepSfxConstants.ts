import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * FilmCow Recorded SFX footstep clips shared by avatar and wildlife locomotion.
 *
 * Assets live under `public/sfx/filmcow-footsteps/`.
 *
 * @module components/world/footsteps/domains/definingFilmcowFootstepSfxConstants
 */

/** Public URL prefix for shipped FilmCow footstep clips. */
export const DEFINING_FILMCOW_FOOTSTEP_SFX_ASSET_BASE_URL =
  '/sfx/filmcow-footsteps' as const;

/** Ground surface groups mapped from plaza biomes. */
export type DefiningFilmcowFootstepSurfaceKind =
  | 'grass'
  | 'forest'
  | 'gravel'
  | 'sand'
  | 'snow'
  | 'concrete';

/** Stable ids for each bundled FilmCow footstep clip. */
export type DefiningFilmcowFootstepClipId =
  | 'concrete_walk_01'
  | 'concrete_walk_02'
  | 'concrete_walk_03'
  | 'concrete_walk_04'
  | 'dirt_run'
  | 'dirt_walk_01'
  | 'dirt_walk_02'
  | 'dirt_walk_03'
  | 'dirt_walk_04'
  | 'dirt_walk_05'
  | 'dirt_walk_06'
  | 'forest_walk_01'
  | 'forest_walk_02'
  | 'forest_walk_03'
  | 'grass_light_01'
  | 'grass_light_02'
  | 'grass_light_03'
  | 'grass_light_04'
  | 'grass_run'
  | 'grass_stomp_01'
  | 'grass_stomp_02'
  | 'grass_walk_01'
  | 'grass_walk_02'
  | 'grass_walk_03'
  | 'grass_walk_04'
  | 'grass_walk_05'
  | 'grass_walk_06'
  | 'grass_walk_07'
  | 'grass_walk_08'
  | 'land_dirt_01'
  | 'land_dirt_02'
  | 'land_grass_01'
  | 'land_grass_02'
  | 'land_grass_03'
  | 'leaves_run'
  | 'leaves_walk_01'
  | 'leaves_walk_02'
  | 'leaves_walk_03'
  | 'leaves_walk_04'
  | 'leaves_walk_05'
  | 'leaves_walk_06'
  | 'snow_01';

/** One FilmCow footstep clip entry. */
export type DefiningFilmcowFootstepClipDefinition = {
  /** Stable clip id. */
  id: DefiningFilmcowFootstepClipId;
  /** WAV filename on disk. */
  fileName: string;
};

/** Every footstep clip shipped for plaza locomotion SFX. */
export const DEFINING_FILMCOW_FOOTSTEP_CLIP_CATALOG: Record<
  DefiningFilmcowFootstepClipId,
  DefiningFilmcowFootstepClipDefinition
> = {
  grass_walk_01: { id: 'grass_walk_01', fileName: 'grass-walk-01.wav' },
  grass_walk_02: { id: 'grass_walk_02', fileName: 'grass-walk-02.wav' },
  grass_walk_03: { id: 'grass_walk_03', fileName: 'grass-walk-03.wav' },
  grass_walk_04: { id: 'grass_walk_04', fileName: 'grass-walk-04.wav' },
  grass_walk_05: { id: 'grass_walk_05', fileName: 'grass-walk-05.wav' },
  grass_walk_06: { id: 'grass_walk_06', fileName: 'grass-walk-06.wav' },
  grass_walk_07: { id: 'grass_walk_07', fileName: 'grass-walk-07.wav' },
  grass_walk_08: { id: 'grass_walk_08', fileName: 'grass-walk-08.wav' },
  grass_run: { id: 'grass_run', fileName: 'grass-run.wav' },
  grass_light_01: { id: 'grass_light_01', fileName: 'grass-light-01.wav' },
  grass_light_02: { id: 'grass_light_02', fileName: 'grass-light-02.wav' },
  grass_light_03: { id: 'grass_light_03', fileName: 'grass-light-03.wav' },
  grass_light_04: { id: 'grass_light_04', fileName: 'grass-light-04.wav' },
  grass_stomp_01: { id: 'grass_stomp_01', fileName: 'grass-stomp-01.wav' },
  grass_stomp_02: { id: 'grass_stomp_02', fileName: 'grass-stomp-02.wav' },
  land_grass_01: { id: 'land_grass_01', fileName: 'land-grass-01.wav' },
  land_grass_02: { id: 'land_grass_02', fileName: 'land-grass-02.wav' },
  land_grass_03: { id: 'land_grass_03', fileName: 'land-grass-03.wav' },
  dirt_walk_01: { id: 'dirt_walk_01', fileName: 'dirt-walk-01.wav' },
  dirt_walk_02: { id: 'dirt_walk_02', fileName: 'dirt-walk-02.wav' },
  dirt_walk_03: { id: 'dirt_walk_03', fileName: 'dirt-walk-03.wav' },
  dirt_walk_04: { id: 'dirt_walk_04', fileName: 'dirt-walk-04.wav' },
  dirt_walk_05: { id: 'dirt_walk_05', fileName: 'dirt-walk-05.wav' },
  dirt_walk_06: { id: 'dirt_walk_06', fileName: 'dirt-walk-06.wav' },
  dirt_run: { id: 'dirt_run', fileName: 'dirt-run.wav' },
  land_dirt_01: { id: 'land_dirt_01', fileName: 'land-dirt-01.wav' },
  land_dirt_02: { id: 'land_dirt_02', fileName: 'land-dirt-02.wav' },
  leaves_walk_01: { id: 'leaves_walk_01', fileName: 'leaves-walk-01.wav' },
  leaves_walk_02: { id: 'leaves_walk_02', fileName: 'leaves-walk-02.wav' },
  leaves_walk_03: { id: 'leaves_walk_03', fileName: 'leaves-walk-03.wav' },
  leaves_walk_04: { id: 'leaves_walk_04', fileName: 'leaves-walk-04.wav' },
  leaves_walk_05: { id: 'leaves_walk_05', fileName: 'leaves-walk-05.wav' },
  leaves_walk_06: { id: 'leaves_walk_06', fileName: 'leaves-walk-06.wav' },
  leaves_run: { id: 'leaves_run', fileName: 'leaves-run.wav' },
  forest_walk_01: { id: 'forest_walk_01', fileName: 'forest-walk-01.wav' },
  forest_walk_02: { id: 'forest_walk_02', fileName: 'forest-walk-02.wav' },
  forest_walk_03: { id: 'forest_walk_03', fileName: 'forest-walk-03.wav' },
  snow_01: { id: 'snow_01', fileName: 'snow-01.wav' },
  concrete_walk_01: { id: 'concrete_walk_01', fileName: 'dirt-walk-01.wav' },
  concrete_walk_02: { id: 'concrete_walk_02', fileName: 'dirt-walk-03.wav' },
  concrete_walk_03: { id: 'concrete_walk_03', fileName: 'dirt-walk-05.wav' },
  concrete_walk_04: { id: 'concrete_walk_04', fileName: 'grass-stomp-01.wav' },
};

/** Walk/run clip rotation and jump landing clip per surface. */
export type DefiningFilmcowFootstepSurfaceDefinition = {
  /** Walk cycle clip ids. */
  walkClipIds: DefiningFilmcowFootstepClipId[];
  /** Run cycle clip ids. */
  runClipIds: DefiningFilmcowFootstepClipId[];
  /** One-shot played when a jump finishes. */
  landingClipId: DefiningFilmcowFootstepClipId;
};

/** Surface playback tables keyed by ground type. */
export const DEFINING_FILMCOW_FOOTSTEP_SURFACE_DEFINITIONS: Record<
  DefiningFilmcowFootstepSurfaceKind,
  DefiningFilmcowFootstepSurfaceDefinition
> = {
  grass: {
    walkClipIds: [
      'grass_walk_01',
      'grass_walk_02',
      'grass_walk_03',
      'grass_walk_04',
      'grass_walk_05',
      'grass_walk_06',
    ],
    runClipIds: ['grass_run'],
    landingClipId: 'land_grass_02',
  },
  forest: {
    walkClipIds: [
      'forest_walk_01',
      'forest_walk_02',
      'forest_walk_03',
      'leaves_walk_01',
      'leaves_walk_03',
      'leaves_walk_05',
    ],
    runClipIds: ['leaves_run'],
    landingClipId: 'land_grass_03',
  },
  gravel: {
    walkClipIds: [
      'dirt_walk_01',
      'dirt_walk_02',
      'dirt_walk_03',
      'dirt_walk_04',
    ],
    runClipIds: ['dirt_run'],
    landingClipId: 'land_dirt_01',
  },
  sand: {
    walkClipIds: [
      'grass_light_01',
      'grass_light_02',
      'grass_light_03',
      'grass_light_04',
    ],
    runClipIds: ['grass_light_02', 'grass_light_04'],
    landingClipId: 'land_dirt_02',
  },
  snow: {
    walkClipIds: ['snow_01'],
    runClipIds: ['snow_01'],
    landingClipId: 'snow_01',
  },
  concrete: {
    walkClipIds: [
      'concrete_walk_01',
      'concrete_walk_02',
      'concrete_walk_03',
      'concrete_walk_04',
    ],
    runClipIds: ['dirt_run'],
    landingClipId: 'land_dirt_02',
  },
};

/**
 * Maps each plaza biome to the footstep surface that best matches its ground feel.
 */
export const DEFINING_FILMCOW_BIOME_FOOTSTEP_SURFACE_BY_KIND: Record<
  DefiningWorldPlazaBiomeKind,
  DefiningFilmcowFootstepSurfaceKind
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

/** Wildlife body-size buckets for clip weighting and playback tuning. */
export type DefiningFilmcowFootstepWildlifeSizeTier =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'heavy';

/** Visual size multiplier thresholds for wildlife footstep tiers. */
export const DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_THRESHOLDS: readonly {
  readonly minVisualSizeMultiplier: number;
  readonly tier: DefiningFilmcowFootstepWildlifeSizeTier;
}[] = [
  { minVisualSizeMultiplier: 1.45, tier: 'heavy' },
  { minVisualSizeMultiplier: 1.2, tier: 'large' },
  { minVisualSizeMultiplier: 0.92, tier: 'medium' },
  { minVisualSizeMultiplier: 0.72, tier: 'small' },
  { minVisualSizeMultiplier: 0, tier: 'tiny' },
];

/** Per-tier clip pools layered on top of the surface walk/run tables. */
export const DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_CLIP_OVERRIDES: Record<
  DefiningFilmcowFootstepWildlifeSizeTier,
  {
    readonly walkClipIds: DefiningFilmcowFootstepClipId[];
    readonly runClipIds: DefiningFilmcowFootstepClipId[];
  }
> = {
  tiny: {
    walkClipIds: ['grass_light_01', 'grass_light_02', 'grass_light_03'],
    runClipIds: ['grass_light_02', 'grass_light_04'],
  },
  small: {
    walkClipIds: ['grass_light_02', 'grass_light_03', 'grass_walk_01'],
    runClipIds: ['grass_light_04', 'grass_run'],
  },
  medium: {
    walkClipIds: [],
    runClipIds: [],
  },
  large: {
    walkClipIds: ['grass_walk_05', 'grass_walk_06', 'grass_stomp_01'],
    runClipIds: ['grass_run', 'dirt_run'],
  },
  heavy: {
    walkClipIds: ['grass_stomp_01', 'grass_stomp_02', 'dirt_walk_05'],
    runClipIds: ['dirt_run'],
  },
};

/** Base per-step volume before distance falloff and master SFX volume. */
export const DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_TARGET_VOLUME: Record<
  DefiningFilmcowFootstepWildlifeSizeTier,
  number
> = {
  tiny: 0.08,
  small: 0.11,
  medium: 0.14,
  large: 0.18,
  heavy: 0.22,
};

/** Playback-rate multiplier applied on top of surface/motion rate. */
export const DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_PLAYBACK_RATE: Record<
  DefiningFilmcowFootstepWildlifeSizeTier,
  number
> = {
  tiny: 1.18,
  small: 1.08,
  medium: 1,
  large: 0.9,
  heavy: 0.82,
};
