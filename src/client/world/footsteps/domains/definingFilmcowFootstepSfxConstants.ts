import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Plaza footstep clips shared by avatar and wildlife locomotion.
 *
 * Grass and forest use FilmCow (`public/sfx/filmcow-footsteps/`).
 * Gravel, sand, snow, rock, and mud use NOX Essentials
 * (`public/sfx/nox-footsteps/`).
 *
 * @module components/world/footsteps/domains/definingFilmcowFootstepSfxConstants
 */

/** Public URL prefix for shipped FilmCow footstep clips. */
export const DEFINING_FILMCOW_FOOTSTEP_SFX_ASSET_BASE_URL =
  '/sfx/filmcow-footsteps' as const;

/** Public URL prefix for shipped NOX Essentials footstep clips. */
export const DEFINING_NOX_FOOTSTEP_SFX_ASSET_BASE_URL =
  '/sfx/nox-footsteps' as const;

/** Which asset folder hosts one footstep clip. */
export type DefiningFilmcowFootstepClipAssetPack = 'filmcow' | 'nox';

/** Ground surface groups mapped from plaza biomes. */
export type DefiningFilmcowFootstepSurfaceKind =
  | 'grass'
  | 'forest'
  | 'gravel'
  | 'sand'
  | 'snow'
  | 'concrete'
  | 'mud';

/**
 * Footstep surfaces warmed during world boot before the loading bar finishes.
 *
 * Grass and forest cover plains, forest, flower forest, savanna, and jungle
 * spawns without pulling the full NOX surface pack up front.
 */
export const DEFINING_FILMCOW_FOOTSTEP_BOOT_PRIORITY_SURFACE_KINDS = [
  'grass',
  'forest',
] as const satisfies readonly DefiningFilmcowFootstepSurfaceKind[];

/** Stable ids for each bundled plaza footstep clip. */
export type DefiningFilmcowFootstepClipId =
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
  | 'nox_gravel_land_01'
  | 'nox_gravel_land_02'
  | 'nox_gravel_run_01'
  | 'nox_gravel_run_02'
  | 'nox_gravel_run_03'
  | 'nox_gravel_walk_01'
  | 'nox_gravel_walk_02'
  | 'nox_gravel_walk_03'
  | 'nox_gravel_walk_04'
  | 'nox_mud_land_02'
  | 'nox_mud_run_01'
  | 'nox_mud_run_02'
  | 'nox_mud_run_03'
  | 'nox_mud_walk_01'
  | 'nox_mud_walk_02'
  | 'nox_mud_walk_03'
  | 'nox_mud_walk_04'
  | 'nox_rock_land_02'
  | 'nox_rock_run_01'
  | 'nox_rock_run_02'
  | 'nox_rock_run_03'
  | 'nox_rock_walk_01'
  | 'nox_rock_walk_02'
  | 'nox_rock_walk_03'
  | 'nox_rock_walk_04'
  | 'nox_sand_land_02'
  | 'nox_sand_run_01'
  | 'nox_sand_run_02'
  | 'nox_sand_run_03'
  | 'nox_sand_walk_01'
  | 'nox_sand_walk_02'
  | 'nox_sand_walk_03'
  | 'nox_sand_walk_04'
  | 'nox_snow_land_02'
  | 'nox_snow_run_01'
  | 'nox_snow_run_02'
  | 'nox_snow_run_03'
  | 'nox_snow_walk_01'
  | 'nox_snow_walk_02'
  | 'nox_snow_walk_03'
  | 'nox_snow_walk_04';

/** One shipped footstep clip entry. */
export type DefiningFilmcowFootstepClipDefinition = {
  /** Stable clip id. */
  id: DefiningFilmcowFootstepClipId;
  /** WAV filename on disk. */
  fileName: string;
  /** Asset folder; defaults to FilmCow when omitted. */
  assetPack?: DefiningFilmcowFootstepClipAssetPack;
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
  nox_gravel_walk_01: {
    id: 'nox_gravel_walk_01',
    fileName: 'gravel-walk-01.wav',
    assetPack: 'nox',
  },
  nox_gravel_walk_02: {
    id: 'nox_gravel_walk_02',
    fileName: 'gravel-walk-02.wav',
    assetPack: 'nox',
  },
  nox_gravel_walk_03: {
    id: 'nox_gravel_walk_03',
    fileName: 'gravel-walk-03.wav',
    assetPack: 'nox',
  },
  nox_gravel_walk_04: {
    id: 'nox_gravel_walk_04',
    fileName: 'gravel-walk-04.wav',
    assetPack: 'nox',
  },
  nox_gravel_run_01: {
    id: 'nox_gravel_run_01',
    fileName: 'gravel-run-01.wav',
    assetPack: 'nox',
  },
  nox_gravel_run_02: {
    id: 'nox_gravel_run_02',
    fileName: 'gravel-run-02.wav',
    assetPack: 'nox',
  },
  nox_gravel_run_03: {
    id: 'nox_gravel_run_03',
    fileName: 'gravel-run-03.wav',
    assetPack: 'nox',
  },
  nox_gravel_land_01: {
    id: 'nox_gravel_land_01',
    fileName: 'gravel-land-01.wav',
    assetPack: 'nox',
  },
  nox_gravel_land_02: {
    id: 'nox_gravel_land_02',
    fileName: 'gravel-land-02.wav',
    assetPack: 'nox',
  },
  nox_sand_walk_01: {
    id: 'nox_sand_walk_01',
    fileName: 'sand-walk-01.wav',
    assetPack: 'nox',
  },
  nox_sand_walk_02: {
    id: 'nox_sand_walk_02',
    fileName: 'sand-walk-02.wav',
    assetPack: 'nox',
  },
  nox_sand_walk_03: {
    id: 'nox_sand_walk_03',
    fileName: 'sand-walk-03.wav',
    assetPack: 'nox',
  },
  nox_sand_walk_04: {
    id: 'nox_sand_walk_04',
    fileName: 'sand-walk-04.wav',
    assetPack: 'nox',
  },
  nox_sand_run_01: {
    id: 'nox_sand_run_01',
    fileName: 'sand-run-01.wav',
    assetPack: 'nox',
  },
  nox_sand_run_02: {
    id: 'nox_sand_run_02',
    fileName: 'sand-run-02.wav',
    assetPack: 'nox',
  },
  nox_sand_run_03: {
    id: 'nox_sand_run_03',
    fileName: 'sand-run-03.wav',
    assetPack: 'nox',
  },
  nox_sand_land_02: {
    id: 'nox_sand_land_02',
    fileName: 'sand-land-02.wav',
    assetPack: 'nox',
  },
  nox_snow_walk_01: {
    id: 'nox_snow_walk_01',
    fileName: 'snow-walk-01.wav',
    assetPack: 'nox',
  },
  nox_snow_walk_02: {
    id: 'nox_snow_walk_02',
    fileName: 'snow-walk-02.wav',
    assetPack: 'nox',
  },
  nox_snow_walk_03: {
    id: 'nox_snow_walk_03',
    fileName: 'snow-walk-03.wav',
    assetPack: 'nox',
  },
  nox_snow_walk_04: {
    id: 'nox_snow_walk_04',
    fileName: 'snow-walk-04.wav',
    assetPack: 'nox',
  },
  nox_snow_run_01: {
    id: 'nox_snow_run_01',
    fileName: 'snow-run-01.wav',
    assetPack: 'nox',
  },
  nox_snow_run_02: {
    id: 'nox_snow_run_02',
    fileName: 'snow-run-02.wav',
    assetPack: 'nox',
  },
  nox_snow_run_03: {
    id: 'nox_snow_run_03',
    fileName: 'snow-run-03.wav',
    assetPack: 'nox',
  },
  nox_snow_land_02: {
    id: 'nox_snow_land_02',
    fileName: 'snow-land-02.wav',
    assetPack: 'nox',
  },
  nox_rock_walk_01: {
    id: 'nox_rock_walk_01',
    fileName: 'rock-walk-01.wav',
    assetPack: 'nox',
  },
  nox_rock_walk_02: {
    id: 'nox_rock_walk_02',
    fileName: 'rock-walk-02.wav',
    assetPack: 'nox',
  },
  nox_rock_walk_03: {
    id: 'nox_rock_walk_03',
    fileName: 'rock-walk-03.wav',
    assetPack: 'nox',
  },
  nox_rock_walk_04: {
    id: 'nox_rock_walk_04',
    fileName: 'rock-walk-04.wav',
    assetPack: 'nox',
  },
  nox_rock_run_01: {
    id: 'nox_rock_run_01',
    fileName: 'rock-run-01.wav',
    assetPack: 'nox',
  },
  nox_rock_run_02: {
    id: 'nox_rock_run_02',
    fileName: 'rock-run-02.wav',
    assetPack: 'nox',
  },
  nox_rock_run_03: {
    id: 'nox_rock_run_03',
    fileName: 'rock-run-03.wav',
    assetPack: 'nox',
  },
  nox_rock_land_02: {
    id: 'nox_rock_land_02',
    fileName: 'rock-land-02.wav',
    assetPack: 'nox',
  },
  nox_mud_walk_01: {
    id: 'nox_mud_walk_01',
    fileName: 'mud-walk-01.wav',
    assetPack: 'nox',
  },
  nox_mud_walk_02: {
    id: 'nox_mud_walk_02',
    fileName: 'mud-walk-02.wav',
    assetPack: 'nox',
  },
  nox_mud_walk_03: {
    id: 'nox_mud_walk_03',
    fileName: 'mud-walk-03.wav',
    assetPack: 'nox',
  },
  nox_mud_walk_04: {
    id: 'nox_mud_walk_04',
    fileName: 'mud-walk-04.wav',
    assetPack: 'nox',
  },
  nox_mud_run_01: {
    id: 'nox_mud_run_01',
    fileName: 'mud-run-01.wav',
    assetPack: 'nox',
  },
  nox_mud_run_02: {
    id: 'nox_mud_run_02',
    fileName: 'mud-run-02.wav',
    assetPack: 'nox',
  },
  nox_mud_run_03: {
    id: 'nox_mud_run_03',
    fileName: 'mud-run-03.wav',
    assetPack: 'nox',
  },
  nox_mud_land_02: {
    id: 'nox_mud_land_02',
    fileName: 'mud-land-02.wav',
    assetPack: 'nox',
  },
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
      'nox_gravel_walk_01',
      'nox_gravel_walk_02',
      'nox_gravel_walk_03',
      'nox_gravel_walk_04',
    ],
    runClipIds: ['nox_gravel_run_01', 'nox_gravel_run_02', 'nox_gravel_run_03'],
    landingClipId: 'nox_gravel_land_02',
  },
  sand: {
    walkClipIds: [
      'nox_sand_walk_01',
      'nox_sand_walk_02',
      'nox_sand_walk_03',
      'nox_sand_walk_04',
    ],
    runClipIds: ['nox_sand_run_01', 'nox_sand_run_02', 'nox_sand_run_03'],
    landingClipId: 'nox_sand_land_02',
  },
  snow: {
    walkClipIds: [
      'nox_snow_walk_01',
      'nox_snow_walk_02',
      'nox_snow_walk_03',
      'nox_snow_walk_04',
    ],
    runClipIds: ['nox_snow_run_01', 'nox_snow_run_02', 'nox_snow_run_03'],
    landingClipId: 'nox_snow_land_02',
  },
  concrete: {
    walkClipIds: [
      'nox_rock_walk_01',
      'nox_rock_walk_02',
      'nox_rock_walk_03',
      'nox_rock_walk_04',
    ],
    runClipIds: ['nox_rock_run_01', 'nox_rock_run_02', 'nox_rock_run_03'],
    landingClipId: 'nox_rock_land_02',
  },
  mud: {
    walkClipIds: [
      'nox_mud_walk_01',
      'nox_mud_walk_02',
      'nox_mud_walk_03',
      'nox_mud_walk_04',
    ],
    runClipIds: ['nox_mud_run_01', 'nox_mud_run_02', 'nox_mud_run_03'],
    landingClipId: 'nox_mud_land_02',
  },
};

/**
 * FilmCow composite run loops are too long for cadence-synced one-shots.
 * Avatar and wildlife locomotion skip these in favor of short walk/stomp clips.
 */
export const DEFINING_FILMCOW_FOOTSTEP_LONG_COMPOSITE_CLIP_IDS = [
  'grass_run',
  'leaves_run',
  'dirt_run',
] as const satisfies readonly DefiningFilmcowFootstepClipId[];

/** Hard cap on walk one-shot length so clips never stack into an echo. */
export const DEFINING_FILMCOW_FOOTSTEP_MAX_WALK_PLAYBACK_DURATION_S = 0.52;

/** Hard cap on run one-shot length for the faster cadence. */
export const DEFINING_FILMCOW_FOOTSTEP_MAX_RUN_PLAYBACK_DURATION_S = 0.28;

/** Playback-rate boost for short FilmCow clips used as run steps. */
export const DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_PLAYBACK_RATE = 1.22;

/** Short one-shots reused when run pools borrow walk-style clips. */
export const DEFINING_FILMCOW_FOOTSTEP_SHORT_RUN_CLIP_IDS = [
  'grass_light_01',
  'grass_light_02',
  'grass_stomp_02',
  'dirt_walk_04',
  'forest_walk_03',
] as const satisfies readonly DefiningFilmcowFootstepClipId[];

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
  swamp: 'mud',
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
    runClipIds: ['grass_light_04', 'grass_stomp_02'],
  },
  medium: {
    walkClipIds: [],
    runClipIds: [],
  },
  large: {
    walkClipIds: ['grass_walk_05', 'grass_walk_06', 'grass_stomp_01'],
    runClipIds: ['grass_stomp_02', 'grass_light_01', 'dirt_walk_04'],
  },
  heavy: {
    walkClipIds: ['grass_stomp_01', 'grass_stomp_02', 'dirt_walk_05'],
    runClipIds: ['grass_stomp_02', 'dirt_walk_04', 'dirt_walk_05'],
  },
};

/** Base per-step volume before distance falloff and master SFX volume. */
export const DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_TARGET_VOLUME: Record<
  DefiningFilmcowFootstepWildlifeSizeTier,
  number
> = {
  tiny: 0.09,
  small: 0.12,
  medium: 0.15,
  large: 0.19,
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
