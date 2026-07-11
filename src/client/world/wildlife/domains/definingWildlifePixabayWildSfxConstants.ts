/**
 * Pixabay wildlife clips for species without dedicated farm/beast sources.
 *
 * Assets live under `public/creatures/sfx/vocals/pixabay-wild/`.
 * Source pack: `Projects/reigncraft/1- sounds/Added Animals/` (Pixabay License).
 *
 * @module components/world/wildlife/domains/definingWildlifePixabayWildSfxConstants
 */

import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';

/** Public URL prefix for shipped Pixabay wild clips. */
export const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_ASSET_BASE_URL =
  '/creatures/sfx/vocals/pixabay-wild' as const;

/** Pixabay vocal pool ids. */
export type DefiningWildlifePixabayWildSfxPoolId =
  | 'pixabay_prey'
  | 'pixabay_zebra_whinny'
  | 'pixabay_hyena_laugh'
  | 'pixabay_tiger_roar'
  | 'pixabay_crocodile'
  | 'pixabay_hippo_grunt'
  | 'pixabay_rhino'
  | 'pixabay_reptile_hiss';

/** Stable ids for every bundled Pixabay wild clip. */
export type DefiningWildlifePixabayWildSfxClipId =
  | 'pixabay_deer_snort_01'
  | 'pixabay_deer_grunt_01'
  | 'pixabay_deer_fawn_bleat_01'
  | 'pixabay_stag_call_01'
  | 'pixabay_hyena_laugh_01'
  | 'pixabay_hyena_laugh_02'
  | 'pixabay_hyena_laugh_hd_01'
  | 'pixabay_crocodile_hiss_01'
  | 'pixabay_crocodile_growl_01'
  | 'pixabay_hippo_grunt_01'
  | 'pixabay_hippo_grunt_02'
  | 'pixabay_rhino_vocal_01'
  | 'pixabay_rhino_snort_01'
  | 'pixabay_zebra_whinny_01'
  | 'pixabay_reptile_hiss_01'
  | 'pixabay_reptile_hiss_02'
  | 'pixabay_tiger_growl_01'
  | 'pixabay_tiger_roar_loud_01'
  | 'pixabay_tiger_roar_light_01';

/** One shipped Pixabay wild clip entry. */
export type DefiningWildlifePixabayWildSfxClipDefinition = {
  id: DefiningWildlifePixabayWildSfxClipId;
  fileName: string;
};

/** Every Pixabay wild clip shipped in the plaza public folder. */
export const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_CLIP_CATALOG: Record<
  DefiningWildlifePixabayWildSfxClipId,
  DefiningWildlifePixabayWildSfxClipDefinition
> = {
  pixabay_deer_snort_01: {
    id: 'pixabay_deer_snort_01',
    fileName: 'deer-snort-01.ogg',
  },
  pixabay_deer_grunt_01: {
    id: 'pixabay_deer_grunt_01',
    fileName: 'deer-grunt-01.ogg',
  },
  pixabay_deer_fawn_bleat_01: {
    id: 'pixabay_deer_fawn_bleat_01',
    fileName: 'deer-fawn-bleat-01.ogg',
  },
  pixabay_stag_call_01: {
    id: 'pixabay_stag_call_01',
    fileName: 'stag-call-01.ogg',
  },
  pixabay_hyena_laugh_01: {
    id: 'pixabay_hyena_laugh_01',
    fileName: 'hyena-laugh-01.ogg',
  },
  pixabay_hyena_laugh_02: {
    id: 'pixabay_hyena_laugh_02',
    fileName: 'hyena-laugh-02.ogg',
  },
  pixabay_hyena_laugh_hd_01: {
    id: 'pixabay_hyena_laugh_hd_01',
    fileName: 'hyena-laugh-hd-01.ogg',
  },
  pixabay_crocodile_hiss_01: {
    id: 'pixabay_crocodile_hiss_01',
    fileName: 'crocodile-hiss-01.ogg',
  },
  pixabay_crocodile_growl_01: {
    id: 'pixabay_crocodile_growl_01',
    fileName: 'crocodile-growl-01.ogg',
  },
  pixabay_hippo_grunt_01: {
    id: 'pixabay_hippo_grunt_01',
    fileName: 'hippo-grunt-01.ogg',
  },
  pixabay_hippo_grunt_02: {
    id: 'pixabay_hippo_grunt_02',
    fileName: 'hippo-grunt-02.ogg',
  },
  pixabay_rhino_vocal_01: {
    id: 'pixabay_rhino_vocal_01',
    fileName: 'rhino-vocal-01.ogg',
  },
  pixabay_rhino_snort_01: {
    id: 'pixabay_rhino_snort_01',
    fileName: 'rhino-snort-01.ogg',
  },
  pixabay_zebra_whinny_01: {
    id: 'pixabay_zebra_whinny_01',
    fileName: 'zebra-whinny-01.ogg',
  },
  pixabay_reptile_hiss_01: {
    id: 'pixabay_reptile_hiss_01',
    fileName: 'reptile-hiss-01.ogg',
  },
  pixabay_reptile_hiss_02: {
    id: 'pixabay_reptile_hiss_02',
    fileName: 'reptile-hiss-02.ogg',
  },
  pixabay_tiger_growl_01: {
    id: 'pixabay_tiger_growl_01',
    fileName: 'tiger-growl-01.ogg',
  },
  pixabay_tiger_roar_loud_01: {
    id: 'pixabay_tiger_roar_loud_01',
    fileName: 'tiger-roar-loud-01.ogg',
  },
  pixabay_tiger_roar_light_01: {
    id: 'pixabay_tiger_roar_light_01',
    fileName: 'tiger-roar-light-01.ogg',
  },
};

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_PREY_FLEE = [
  'pixabay_deer_snort_01',
  'pixabay_deer_grunt_01',
  'pixabay_deer_fawn_bleat_01',
  'pixabay_stag_call_01',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_HYENA_LAUGHS = [
  'pixabay_hyena_laugh_01',
  'pixabay_hyena_laugh_02',
  'pixabay_hyena_laugh_hd_01',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_CROCODILE_HISSES = [
  'pixabay_crocodile_hiss_01',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_CROCODILE_GROWLS = [
  'pixabay_crocodile_growl_01',
  'pixabay_crocodile_hiss_01',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_HIPPO_GRUNTS = [
  'pixabay_hippo_grunt_01',
  'pixabay_hippo_grunt_02',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_RHINO_WARNS = [
  'pixabay_rhino_vocal_01',
  'pixabay_rhino_snort_01',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_RHINO_ATTACKS = [
  'pixabay_rhino_snort_01',
  'pixabay_rhino_vocal_01',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_ZEBRA_WHINNIES = [
  'pixabay_zebra_whinny_01',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_REPTILE_HISSES = [
  'pixabay_reptile_hiss_01',
  'pixabay_reptile_hiss_02',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_TIGER_ROARS = [
  'pixabay_tiger_growl_01',
  'pixabay_tiger_roar_loud_01',
  'pixabay_tiger_roar_light_01',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_TIGER_STALK_ROARS = [
  'pixabay_tiger_roar_light_01',
  'pixabay_tiger_growl_01',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_TIGER_LOUD_ROARS = [
  'pixabay_tiger_roar_loud_01',
  'pixabay_tiger_growl_01',
  'pixabay_tiger_roar_light_01',
] as const satisfies readonly DefiningWildlifePixabayWildSfxClipId[];

/** Default clip rotation per Pixabay pool and event kind. */
export const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_CLIP_IDS_BY_EVENT: Record<
  DefiningWildlifePixabayWildSfxPoolId,
  Partial<
    Record<
      DefiningWildlifeSpeciesSfxEventKind,
      readonly DefiningWildlifePixabayWildSfxClipId[]
    >
  >
> = {
  pixabay_prey: {
    flee_start: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_PREY_FLEE,
    hit_taken: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_PREY_FLEE,
  },
  pixabay_zebra_whinny: {
    flee_start: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_ZEBRA_WHINNIES,
    hit_taken: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_ZEBRA_WHINNIES,
  },
  pixabay_hyena_laugh: {
    howl: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_HYENA_LAUGHS,
    chase_call: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_HYENA_LAUGHS,
    warn: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_HYENA_LAUGHS,
    attack: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_HYENA_LAUGHS,
    hit_taken: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_HYENA_LAUGHS,
  },
  pixabay_tiger_roar: {
    stalk: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_TIGER_STALK_ROARS,
    chase_call: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_TIGER_LOUD_ROARS,
    warn: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_TIGER_LOUD_ROARS,
    attack: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_TIGER_LOUD_ROARS,
    hit_taken: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_TIGER_ROARS,
  },
  pixabay_crocodile: {
    attack: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_CROCODILE_HISSES,
    hit_taken: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_CROCODILE_GROWLS,
  },
  pixabay_hippo_grunt: {
    warn: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_HIPPO_GRUNTS,
    attack: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_HIPPO_GRUNTS,
  },
  pixabay_rhino: {
    warn: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_RHINO_WARNS,
    attack: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_RHINO_ATTACKS,
  },
  pixabay_reptile_hiss: {
    hit_taken: DEFINING_WILDLIFE_PIXABAY_WILD_SFX_REPTILE_HISSES,
  },
};

/**
 * Minimum ms before the same instance replays a Pixabay pool clip.
 */
export const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_MIN_REPLAY_INTERVAL_MS: Partial<
  Record<DefiningWildlifePixabayWildSfxPoolId, number>
> = {
  pixabay_tiger_roar: 5_000,
  pixabay_hippo_grunt: 8_000,
  pixabay_zebra_whinny: 8_000,
  pixabay_hyena_laugh: 8_000,
  pixabay_rhino: 8_000,
  pixabay_prey: 8_000,
  pixabay_crocodile: 7_000,
};

/**
 * Hard stop for Pixabay pools that shipped as multi-call beds.
 */
export const DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_MAX_PLAYBACK_DURATION_S: Partial<
  Record<DefiningWildlifePixabayWildSfxPoolId, number>
> = {
  pixabay_tiger_roar: 2.7,
  pixabay_hippo_grunt: 2.4,
  pixabay_zebra_whinny: 2.4,
  pixabay_hyena_laugh: 2.4,
  pixabay_rhino: 2.4,
  pixabay_prey: 2.2,
  pixabay_crocodile: 2.4,
};
