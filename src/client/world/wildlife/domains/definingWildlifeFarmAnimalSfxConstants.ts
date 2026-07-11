/**
 * Orange Free Sounds farm animal pack clips and pool tuning.
 *
 * Assets live under `public/creatures/sfx/vocals/farm-animal/`.
 *
 * @module components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants
 */

import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';

/** Public URL prefix for shipped farm animal clips. */
export const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ASSET_BASE_URL =
  '/creatures/sfx/vocals/farm-animal' as const;

/** Shared vocal pool ids (many species reuse one pool). */
export type DefiningWildlifeFarmAnimalSfxPoolId =
  | 'cow_moo'
  | 'sheep_baa'
  | 'chicken_cluck'
  | 'chicken_crow'
  | 'pig_grunt'
  | 'dog_bark'
  | 'cat_meow'
  | 'horse_whinny'
  | 'donkey_bray'
  | 'goat_bleat'
  | 'elephant_trumpet'
  | 'bear_growl'
  | 'tiger_growl'
  | 'wolf_howl';

/** Distance class for falloff curves. */
export type DefiningWildlifeSpeciesSfxSizeClass =
  | 'farm'
  | 'predator'
  | 'megafauna';

/** Stable ids for every bundled farm animal clip. */
export type DefiningWildlifeFarmAnimalSfxClipId =
  | 'cow_moo_01'
  | 'cow_moo_02'
  | 'cow_moo_03'
  | 'cow_moo_04'
  | 'cow_moo_05'
  | 'cow_moo_06'
  | 'sheep_baa_01'
  | 'sheep_baa_02'
  | 'chicken_cluck_01'
  | 'chicken_cluck_02'
  | 'chicken_cluck_03'
  | 'chicken_cluck_04'
  | 'rooster_crow_01'
  | 'rooster_crow_02'
  | 'rooster_crow_03'
  | 'rooster_crow_04'
  | 'pig_grunt_01'
  | 'pig_grunt_02'
  | 'pig_grunt_03'
  | 'dog_bark_01'
  | 'dog_bark_02'
  | 'cat_meow_01'
  | 'cat_meow_02'
  | 'cat_meow_03'
  | 'horse_whinny_01'
  | 'horse_whinny_02'
  | 'donkey_bray_01'
  | 'donkey_bray_02'
  | 'goat_bleat_01'
  | 'elephant_trumpet_01'
  | 'elephant_trumpet_02'
  | 'bear_growl_01'
  | 'bear_growl_02'
  | 'bear_growl_03'
  | 'tiger_growl_01'
  | 'wolf_howl_01';

/** One shipped farm animal clip entry. */
export type DefiningWildlifeFarmAnimalSfxClipDefinition = {
  id: DefiningWildlifeFarmAnimalSfxClipId;
  fileName: string;
};

/** Every farm animal clip shipped in the plaza public folder. */
export const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG: Record<
  DefiningWildlifeFarmAnimalSfxClipId,
  DefiningWildlifeFarmAnimalSfxClipDefinition
> = {
  cow_moo_01: { id: 'cow_moo_01', fileName: 'cow-moo-01.ogg' },
  cow_moo_02: { id: 'cow_moo_02', fileName: 'cow-moo-02.ogg' },
  cow_moo_03: { id: 'cow_moo_03', fileName: 'cow-moo-03.ogg' },
  cow_moo_04: { id: 'cow_moo_04', fileName: 'cow-moo-04.ogg' },
  cow_moo_05: { id: 'cow_moo_05', fileName: 'cow-moo-05.ogg' },
  cow_moo_06: { id: 'cow_moo_06', fileName: 'cow-moo-06.ogg' },
  sheep_baa_01: { id: 'sheep_baa_01', fileName: 'sheep-baa-01.ogg' },
  sheep_baa_02: { id: 'sheep_baa_02', fileName: 'sheep-baa-02.ogg' },
  chicken_cluck_01: {
    id: 'chicken_cluck_01',
    fileName: 'chicken-cluck-01.ogg',
  },
  chicken_cluck_02: {
    id: 'chicken_cluck_02',
    fileName: 'chicken-cluck-02.ogg',
  },
  chicken_cluck_03: {
    id: 'chicken_cluck_03',
    fileName: 'chicken-cluck-03.ogg',
  },
  chicken_cluck_04: {
    id: 'chicken_cluck_04',
    fileName: 'chicken-cluck-04.ogg',
  },
  rooster_crow_01: {
    id: 'rooster_crow_01',
    fileName: 'rooster-crow-01.ogg',
  },
  rooster_crow_02: {
    id: 'rooster_crow_02',
    fileName: 'rooster-crow-02.ogg',
  },
  rooster_crow_03: {
    id: 'rooster_crow_03',
    fileName: 'rooster-crow-03.ogg',
  },
  rooster_crow_04: {
    id: 'rooster_crow_04',
    fileName: 'rooster-crow-04.ogg',
  },
  pig_grunt_01: { id: 'pig_grunt_01', fileName: 'pig-grunt-01.ogg' },
  pig_grunt_02: { id: 'pig_grunt_02', fileName: 'pig-grunt-02.ogg' },
  pig_grunt_03: { id: 'pig_grunt_03', fileName: 'pig-grunt-03.ogg' },
  dog_bark_01: { id: 'dog_bark_01', fileName: 'dog-bark-01.ogg' },
  dog_bark_02: { id: 'dog_bark_02', fileName: 'dog-bark-02.ogg' },
  cat_meow_01: { id: 'cat_meow_01', fileName: 'cat-meow-01.ogg' },
  cat_meow_02: { id: 'cat_meow_02', fileName: 'cat-meow-02.ogg' },
  cat_meow_03: { id: 'cat_meow_03', fileName: 'cat-meow-03.ogg' },
  horse_whinny_01: {
    id: 'horse_whinny_01',
    fileName: 'horse-whinny-01.ogg',
  },
  horse_whinny_02: {
    id: 'horse_whinny_02',
    fileName: 'horse-whinny-02.ogg',
  },
  donkey_bray_01: { id: 'donkey_bray_01', fileName: 'donkey-bray-01.ogg' },
  donkey_bray_02: { id: 'donkey_bray_02', fileName: 'donkey-bray-02.ogg' },
  goat_bleat_01: { id: 'goat_bleat_01', fileName: 'goat-bleat-01.ogg' },
  elephant_trumpet_01: {
    id: 'elephant_trumpet_01',
    fileName: 'elephant-trumpet-01.ogg',
  },
  elephant_trumpet_02: {
    id: 'elephant_trumpet_02',
    fileName: 'elephant-trumpet-02.ogg',
  },
  bear_growl_01: { id: 'bear_growl_01', fileName: 'bear-growl-01.ogg' },
  bear_growl_02: { id: 'bear_growl_02', fileName: 'bear-growl-02.ogg' },
  bear_growl_03: { id: 'bear_growl_03', fileName: 'bear-growl-03.ogg' },
  tiger_growl_01: { id: 'tiger_growl_01', fileName: 'tiger-growl-01.ogg' },
  wolf_howl_01: { id: 'wolf_howl_01', fileName: 'wolf-howl-01.ogg' },
};

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_COW_MOOS = [
  'cow_moo_01',
  'cow_moo_02',
  'cow_moo_03',
  'cow_moo_04',
  'cow_moo_05',
  'cow_moo_06',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_SHEEP_BAAS = [
  'sheep_baa_01',
  'sheep_baa_02',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CHICKEN_CLUCKS = [
  'chicken_cluck_01',
  'chicken_cluck_02',
  'chicken_cluck_03',
  'chicken_cluck_04',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ROOSTER_CROWS = [
  'rooster_crow_01',
  'rooster_crow_02',
  'rooster_crow_03',
  'rooster_crow_04',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_PIG_GRUNTS = [
  'pig_grunt_01',
  'pig_grunt_02',
  'pig_grunt_03',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_DOG_BARKS = [
  'dog_bark_01',
  'dog_bark_02',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CAT_MEOWS = [
  'cat_meow_01',
  'cat_meow_02',
  'cat_meow_03',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_HORSE_WHINNIES = [
  'horse_whinny_01',
  'horse_whinny_02',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_DONKEY_BRAYS = [
  'donkey_bray_01',
  'donkey_bray_02',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_GOAT_BLEATS = [
  'goat_bleat_01',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ELEPHANT_TRUMPETS = [
  'elephant_trumpet_01',
  'elephant_trumpet_02',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_BEAR_GROWLS = [
  'bear_growl_01',
  'bear_growl_02',
  'bear_growl_03',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_TIGER_GROWLS = [
  'tiger_growl_01',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_WOLF_HOWLS = [
  'wolf_howl_01',
] as const satisfies readonly DefiningWildlifeFarmAnimalSfxClipId[];

/** Default clip rotation per pool and event kind. */
export const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_CLIP_IDS_BY_EVENT: Record<
  DefiningWildlifeFarmAnimalSfxPoolId,
  Partial<
    Record<
      DefiningWildlifeSpeciesSfxEventKind,
      readonly DefiningWildlifeFarmAnimalSfxClipId[]
    >
  >
> = {
  cow_moo: {
    idle_ambient: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_COW_MOOS,
    idle_eating: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_COW_MOOS,
    flee_start: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_COW_MOOS,
    warn: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_COW_MOOS,
    attack: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_COW_MOOS,
    hit_taken: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_COW_MOOS,
    wake: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_COW_MOOS,
  },
  sheep_baa: {
    idle_ambient: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_SHEEP_BAAS,
    flee_start: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_SHEEP_BAAS,
    hit_taken: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_SHEEP_BAAS,
    wake: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_SHEEP_BAAS,
  },
  chicken_cluck: {
    idle_ambient: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CHICKEN_CLUCKS,
    attack: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CHICKEN_CLUCKS,
    flee_start: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CHICKEN_CLUCKS,
    hit_taken: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CHICKEN_CLUCKS,
    wake: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CHICKEN_CLUCKS,
  },
  chicken_crow: {
    idle_ambient: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ROOSTER_CROWS,
  },
  pig_grunt: {
    idle_ambient: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_PIG_GRUNTS,
    idle_eating: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_PIG_GRUNTS,
    flee_start: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_PIG_GRUNTS,
    warn: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_PIG_GRUNTS,
    attack: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_PIG_GRUNTS,
    hit_taken: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_PIG_GRUNTS,
    wake: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_PIG_GRUNTS,
  },
  dog_bark: {
    friendly: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_DOG_BARKS,
    flee_start: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_DOG_BARKS,
    hit_taken: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_DOG_BARKS,
    chase_call: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_DOG_BARKS,
    howl: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_DOG_BARKS,
  },
  cat_meow: {
    friendly: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CAT_MEOWS,
    flee_start: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CAT_MEOWS,
    hit_taken: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CAT_MEOWS,
    wake: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CAT_MEOWS,
  },
  horse_whinny: {
    idle_ambient: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_HORSE_WHINNIES,
    flee_start: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_HORSE_WHINNIES,
    wake: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_HORSE_WHINNIES,
  },
  donkey_bray: {
    idle_ambient: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_DONKEY_BRAYS,
    flee_start: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_DONKEY_BRAYS,
    wake: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_DONKEY_BRAYS,
  },
  goat_bleat: {
    idle_ambient: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_GOAT_BLEATS,
    warn: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_GOAT_BLEATS,
    attack: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_GOAT_BLEATS,
    hit_taken: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_GOAT_BLEATS,
  },
  elephant_trumpet: {
    warn: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ELEPHANT_TRUMPETS,
    attack: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ELEPHANT_TRUMPETS,
    hit_taken: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ELEPHANT_TRUMPETS,
    chase_call: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ELEPHANT_TRUMPETS,
  },
  bear_growl: {
    warn: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_BEAR_GROWLS,
    attack: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_BEAR_GROWLS,
    hit_taken: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_BEAR_GROWLS,
    chase_call: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_BEAR_GROWLS,
  },
  tiger_growl: {
    stalk: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_TIGER_GROWLS,
    chase_call: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_TIGER_GROWLS,
    attack: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_TIGER_GROWLS,
    warn: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_TIGER_GROWLS,
    hit_taken: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_TIGER_GROWLS,
  },
  wolf_howl: {
    howl: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_WOLF_HOWLS,
    chase_call: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_WOLF_HOWLS,
    warn: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_WOLF_HOWLS,
    attack: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_WOLF_HOWLS,
    hit_taken: DEFINING_WILDLIFE_FARM_ANIMAL_SFX_WOLF_HOWLS,
  },
};

/**
 * Minimum ms before the same instance replays a pool clip.
 * Prevents long single-clip pools (tiger growl) from stacking on itself.
 */
export const DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_MIN_REPLAY_INTERVAL_MS: Partial<
  Record<DefiningWildlifeFarmAnimalSfxPoolId, number>
> = {
  tiger_growl: 8_000,
  wolf_howl: 14_000,
};

/** Base event volume before distance falloff and the SFX slider. */
export const DEFINING_WILDLIFE_SPECIES_SFX_TARGET_VOLUME_BY_EVENT: Record<
  DefiningWildlifeSpeciesSfxEventKind,
  number
> = {
  idle_ambient: 0.17,
  idle_eating: 0.16,
  wake: 0.24,
  sleep: 0.1,
  friendly: 0.22,
  flee_start: 0.3,
  flee_mid: 0.15,
  warn: 0.34,
  stalk: 0.16,
  howl: 0.42,
  chase_call: 0.36,
  attack: 0.3,
  hit_taken: 0.24,
  death: 0.28,
};

/**
 * How often active species vocals recompute distance falloff while playing.
 * Long moos/howls keep following the animal and player after the initial play.
 */
export const DEFINING_WILDLIFE_SPECIES_SFX_SPATIAL_POLL_INTERVAL_MS = 100;

/** Quiet ambient vocals (idle graze, eat, stalk): short radius. */
export const DEFINING_WILDLIFE_SPECIES_SFX_AMBIENT_FULL_VOLUME_DISTANCE_GRID = 2;

export const DEFINING_WILDLIFE_SPECIES_SFX_AMBIENT_MAX_AUDIBLE_DISTANCE_GRID = 6;

/**
 * Exponent applied after linear falloff normalization.
 * Quartic keeps nearby vocals readable while distant ones drop off faster.
 */
export const DEFINING_WILDLIFE_SPECIES_SFX_DISTANCE_FALLOFF_EXPONENT = 4;

/** Farm stock combat / reaction vocals (grid tiles). */
export const DEFINING_WILDLIFE_SPECIES_SFX_FARM_FULL_VOLUME_DISTANCE_GRID = 2.5;

export const DEFINING_WILDLIFE_SPECIES_SFX_FARM_MAX_AUDIBLE_DISTANCE_GRID = 9;

/** Predator combat vocals (grid tiles). */
export const DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_FULL_VOLUME_DISTANCE_GRID = 2;

export const DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_MAX_AUDIBLE_DISTANCE_GRID = 10;

/** Megafauna combat vocals (grid tiles). */
export const DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_FULL_VOLUME_DISTANCE_GRID = 3;

export const DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_MAX_AUDIBLE_DISTANCE_GRID = 12;

/** Farm long-call vocals such as distant bleats (grid tiles). */
export const DEFINING_WILDLIFE_SPECIES_SFX_FARM_LONG_CALL_FULL_VOLUME_DISTANCE_GRID = 2.5;

export const DEFINING_WILDLIFE_SPECIES_SFX_FARM_LONG_CALL_MAX_AUDIBLE_DISTANCE_GRID = 11;

/** Predator howls and chase calls (grid tiles). */
export const DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_LONG_CALL_FULL_VOLUME_DISTANCE_GRID = 2.5;

export const DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_LONG_CALL_MAX_AUDIBLE_DISTANCE_GRID = 14;

/** Megafauna long-call vocals (grid tiles). */
export const DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_LONG_CALL_FULL_VOLUME_DISTANCE_GRID = 3.5;

export const DEFINING_WILDLIFE_SPECIES_SFX_MEGAFAUNA_LONG_CALL_MAX_AUDIBLE_DISTANCE_GRID = 16;
