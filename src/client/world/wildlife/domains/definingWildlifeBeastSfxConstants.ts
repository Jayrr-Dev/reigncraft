/**
 * Beasts pack clips and pool tuning for wildlife species without farm-animal sources.
 *
 * Assets live under `public/sfx/beast/`.
 *
 * @module components/world/wildlife/domains/definingWildlifeBeastSfxConstants
 */

import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';

/** Public URL prefix for shipped beast clips. */
export const DEFINING_WILDLIFE_BEAST_SFX_ASSET_BASE_URL = '/sfx/beast' as const;

/** Beast vocal pool ids (ungulates, primates, swamp threats, etc.). */
export type DefiningWildlifeBeastSfxPoolId =
  | 'beast_short_bellow'
  | 'beast_bellow'
  | 'beast_grunt'
  | 'beast_growl'
  | 'beast_soft_growl'
  | 'beast_roar'
  | 'beast_snort'
  | 'beast_hoot'
  | 'beast_warble'
  | 'beast_croak';

/** Stable ids for every bundled beast clip. */
export type DefiningWildlifeBeastSfxClipId =
  | 'beast_short_bellow_01'
  | 'beast_short_bellow_02'
  | 'beast_short_bellow_03'
  | 'beast_bellow_01'
  | 'beast_bellow_02'
  | 'beast_bellow_03'
  | 'beast_bellow_04'
  | 'beast_bellow_05'
  | 'beast_bellow_06'
  | 'beast_grunt_01'
  | 'beast_grunt_02'
  | 'beast_grunt_03'
  | 'beast_grunt_04'
  | 'beast_grunt_05'
  | 'beast_growl_01'
  | 'beast_growl_02'
  | 'beast_growl_03'
  | 'beast_growl_04'
  | 'beast_growl_05'
  | 'beast_growl_06'
  | 'beast_soft_growl_01'
  | 'beast_roar_01'
  | 'beast_snort_01'
  | 'beast_sniff_01'
  | 'beast_sniff_02'
  | 'beast_hoot_01'
  | 'beast_warble_01'
  | 'beast_croak_01'
  | 'beast_croak_02'
  | 'beast_croak_03';

/** One shipped beast clip entry. */
export type DefiningWildlifeBeastSfxClipDefinition = {
  id: DefiningWildlifeBeastSfxClipId;
  fileName: string;
};

/** Every beast clip shipped in the plaza public folder. */
export const DEFINING_WILDLIFE_BEAST_SFX_CLIP_CATALOG: Record<
  DefiningWildlifeBeastSfxClipId,
  DefiningWildlifeBeastSfxClipDefinition
> = {
  beast_short_bellow_01: {
    id: 'beast_short_bellow_01',
    fileName: 'beast-short-bellow-01.wav',
  },
  beast_short_bellow_02: {
    id: 'beast_short_bellow_02',
    fileName: 'beast-short-bellow-02.wav',
  },
  beast_short_bellow_03: {
    id: 'beast_short_bellow_03',
    fileName: 'beast-short-bellow-03.wav',
  },
  beast_bellow_01: {
    id: 'beast_bellow_01',
    fileName: 'beast-bellow-01.wav',
  },
  beast_bellow_02: {
    id: 'beast_bellow_02',
    fileName: 'beast-bellow-02.wav',
  },
  beast_bellow_03: {
    id: 'beast_bellow_03',
    fileName: 'beast-bellow-03.wav',
  },
  beast_bellow_04: {
    id: 'beast_bellow_04',
    fileName: 'beast-bellow-04.wav',
  },
  beast_bellow_05: {
    id: 'beast_bellow_05',
    fileName: 'beast-bellow-05.wav',
  },
  beast_bellow_06: {
    id: 'beast_bellow_06',
    fileName: 'beast-bellow-06.wav',
  },
  beast_grunt_01: {
    id: 'beast_grunt_01',
    fileName: 'beast-grunt-01.wav',
  },
  beast_grunt_02: {
    id: 'beast_grunt_02',
    fileName: 'beast-grunt-02.wav',
  },
  beast_grunt_03: {
    id: 'beast_grunt_03',
    fileName: 'beast-grunt-03.wav',
  },
  beast_grunt_04: {
    id: 'beast_grunt_04',
    fileName: 'beast-grunt-04.wav',
  },
  beast_grunt_05: {
    id: 'beast_grunt_05',
    fileName: 'beast-grunt-05.wav',
  },
  beast_growl_01: {
    id: 'beast_growl_01',
    fileName: 'beast-growl-01.wav',
  },
  beast_growl_02: {
    id: 'beast_growl_02',
    fileName: 'beast-growl-02.wav',
  },
  beast_growl_03: {
    id: 'beast_growl_03',
    fileName: 'beast-growl-03.wav',
  },
  beast_growl_04: {
    id: 'beast_growl_04',
    fileName: 'beast-growl-04.wav',
  },
  beast_growl_05: {
    id: 'beast_growl_05',
    fileName: 'beast-growl-05.wav',
  },
  beast_growl_06: {
    id: 'beast_growl_06',
    fileName: 'beast-growl-06.wav',
  },
  beast_soft_growl_01: {
    id: 'beast_soft_growl_01',
    fileName: 'beast-soft-growl-01.wav',
  },
  beast_roar_01: {
    id: 'beast_roar_01',
    fileName: 'beast-roar-01.wav',
  },
  beast_snort_01: {
    id: 'beast_snort_01',
    fileName: 'beast-snort-01.wav',
  },
  beast_sniff_01: {
    id: 'beast_sniff_01',
    fileName: 'beast-sniff-01.wav',
  },
  beast_sniff_02: {
    id: 'beast_sniff_02',
    fileName: 'beast-sniff-02.wav',
  },
  beast_hoot_01: {
    id: 'beast_hoot_01',
    fileName: 'beast-hoot-01.wav',
  },
  beast_warble_01: {
    id: 'beast_warble_01',
    fileName: 'beast-warble-01.wav',
  },
  beast_croak_01: {
    id: 'beast_croak_01',
    fileName: 'beast-croak-01.wav',
  },
  beast_croak_02: {
    id: 'beast_croak_02',
    fileName: 'beast-croak-02.wav',
  },
  beast_croak_03: {
    id: 'beast_croak_03',
    fileName: 'beast-croak-03.wav',
  },
};

const DEFINING_WILDLIFE_BEAST_SFX_SHORT_BELLOWS = [
  'beast_short_bellow_01',
  'beast_short_bellow_02',
  'beast_short_bellow_03',
] as const satisfies readonly DefiningWildlifeBeastSfxClipId[];

const DEFINING_WILDLIFE_BEAST_SFX_BELLOWS = [
  'beast_bellow_01',
  'beast_bellow_02',
  'beast_bellow_03',
  'beast_bellow_04',
  'beast_bellow_05',
  'beast_bellow_06',
] as const satisfies readonly DefiningWildlifeBeastSfxClipId[];

const DEFINING_WILDLIFE_BEAST_SFX_GRUNTS = [
  'beast_grunt_01',
  'beast_grunt_02',
  'beast_grunt_03',
  'beast_grunt_04',
  'beast_grunt_05',
] as const satisfies readonly DefiningWildlifeBeastSfxClipId[];

const DEFINING_WILDLIFE_BEAST_SFX_GROWLS = [
  'beast_growl_01',
  'beast_growl_02',
  'beast_growl_03',
  'beast_growl_04',
  'beast_growl_05',
  'beast_growl_06',
] as const satisfies readonly DefiningWildlifeBeastSfxClipId[];

const DEFINING_WILDLIFE_BEAST_SFX_SOFT_GROWLS = [
  'beast_soft_growl_01',
  'beast_growl_04',
] as const satisfies readonly DefiningWildlifeBeastSfxClipId[];

const DEFINING_WILDLIFE_BEAST_SFX_ROARS = [
  'beast_roar_01',
  'beast_bellow_05',
] as const satisfies readonly DefiningWildlifeBeastSfxClipId[];

const DEFINING_WILDLIFE_BEAST_SFX_SNORTS = [
  'beast_snort_01',
  'beast_sniff_01',
  'beast_sniff_02',
] as const satisfies readonly DefiningWildlifeBeastSfxClipId[];

const DEFINING_WILDLIFE_BEAST_SFX_HOOTS = [
  'beast_hoot_01',
] as const satisfies readonly DefiningWildlifeBeastSfxClipId[];

const DEFINING_WILDLIFE_BEAST_SFX_WARBLES = [
  'beast_warble_01',
] as const satisfies readonly DefiningWildlifeBeastSfxClipId[];

const DEFINING_WILDLIFE_BEAST_SFX_CROAKS = [
  'beast_croak_01',
  'beast_croak_02',
  'beast_croak_03',
] as const satisfies readonly DefiningWildlifeBeastSfxClipId[];

/** Default clip rotation per beast pool and event kind. */
export const DEFINING_WILDLIFE_BEAST_SFX_POOL_CLIP_IDS_BY_EVENT: Record<
  DefiningWildlifeBeastSfxPoolId,
  Partial<
    Record<
      DefiningWildlifeSpeciesSfxEventKind,
      readonly DefiningWildlifeBeastSfxClipId[]
    >
  >
> = {
  beast_short_bellow: {
    flee_start: DEFINING_WILDLIFE_BEAST_SFX_SHORT_BELLOWS,
    hit_taken: DEFINING_WILDLIFE_BEAST_SFX_SHORT_BELLOWS,
    idle_ambient: DEFINING_WILDLIFE_BEAST_SFX_SHORT_BELLOWS,
  },
  beast_bellow: {
    idle_ambient: DEFINING_WILDLIFE_BEAST_SFX_BELLOWS,
    flee_start: DEFINING_WILDLIFE_BEAST_SFX_BELLOWS,
    warn: DEFINING_WILDLIFE_BEAST_SFX_BELLOWS,
    attack: DEFINING_WILDLIFE_BEAST_SFX_ROARS,
    hit_taken: DEFINING_WILDLIFE_BEAST_SFX_BELLOWS,
    chase_call: DEFINING_WILDLIFE_BEAST_SFX_BELLOWS,
  },
  beast_grunt: {
    idle_ambient: DEFINING_WILDLIFE_BEAST_SFX_GRUNTS,
    flee_start: DEFINING_WILDLIFE_BEAST_SFX_GRUNTS,
    hit_taken: DEFINING_WILDLIFE_BEAST_SFX_GRUNTS,
  },
  beast_growl: {
    warn: DEFINING_WILDLIFE_BEAST_SFX_GROWLS,
    attack: DEFINING_WILDLIFE_BEAST_SFX_GROWLS,
    hit_taken: DEFINING_WILDLIFE_BEAST_SFX_GROWLS,
    chase_call: DEFINING_WILDLIFE_BEAST_SFX_GROWLS,
    howl: DEFINING_WILDLIFE_BEAST_SFX_GROWLS,
    stalk: DEFINING_WILDLIFE_BEAST_SFX_SOFT_GROWLS,
    flee_start: DEFINING_WILDLIFE_BEAST_SFX_GROWLS,
  },
  beast_soft_growl: {
    attack: DEFINING_WILDLIFE_BEAST_SFX_SOFT_GROWLS,
    hit_taken: DEFINING_WILDLIFE_BEAST_SFX_SOFT_GROWLS,
    stalk: DEFINING_WILDLIFE_BEAST_SFX_SOFT_GROWLS,
  },
  beast_roar: {
    warn: DEFINING_WILDLIFE_BEAST_SFX_ROARS,
    attack: DEFINING_WILDLIFE_BEAST_SFX_ROARS,
    chase_call: DEFINING_WILDLIFE_BEAST_SFX_ROARS,
  },
  beast_snort: {
    warn: DEFINING_WILDLIFE_BEAST_SFX_SNORTS,
    attack: DEFINING_WILDLIFE_BEAST_SFX_SNORTS,
    hit_taken: DEFINING_WILDLIFE_BEAST_SFX_SNORTS,
  },
  beast_hoot: {
    flee_start: DEFINING_WILDLIFE_BEAST_SFX_HOOTS,
    hit_taken: DEFINING_WILDLIFE_BEAST_SFX_HOOTS,
    idle_ambient: DEFINING_WILDLIFE_BEAST_SFX_HOOTS,
  },
  beast_warble: {
    idle_ambient: DEFINING_WILDLIFE_BEAST_SFX_WARBLES,
    flee_start: DEFINING_WILDLIFE_BEAST_SFX_WARBLES,
    howl: DEFINING_WILDLIFE_BEAST_SFX_WARBLES,
    chase_call: DEFINING_WILDLIFE_BEAST_SFX_WARBLES,
    hit_taken: DEFINING_WILDLIFE_BEAST_SFX_WARBLES,
  },
  beast_croak: {
    attack: DEFINING_WILDLIFE_BEAST_SFX_CROAKS,
    hit_taken: DEFINING_WILDLIFE_BEAST_SFX_CROAKS,
  },
};
