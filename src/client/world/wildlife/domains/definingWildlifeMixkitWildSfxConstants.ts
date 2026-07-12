/**
 * Mixkit wild-animal clips for species that need dedicated vocals.
 *
 * Assets live under `public/creatures/sfx/vocals/mixkit-wild/`.
 * Source pack: https://mixkit.co/free-sound-effects/animals/ (Mixkit License).
 *
 * @module components/world/wildlife/domains/definingWildlifeMixkitWildSfxConstants
 */

import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';

/** Public URL prefix for shipped Mixkit wild clips. */
export const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_ASSET_BASE_URL =
  '/creatures/sfx/vocals/mixkit-wild' as const;

/** Mixkit vocal pool ids. */
export type DefiningWildlifeMixkitWildSfxPoolId =
  | 'mixkit_lion_roar'
  | 'mixkit_monkey'
  | 'mixkit_wolf_howl'
  | 'mixkit_bird_screech';

/** Stable ids for every bundled Mixkit wild clip. */
export type DefiningWildlifeMixkitWildSfxClipId =
  | 'mixkit_lion_roar_01'
  | 'mixkit_lion_growl_01'
  | 'mixkit_lion_purr_01'
  | 'mixkit_monkey_screech_01'
  | 'mixkit_monkey_screech_02'
  | 'mixkit_monkey_grunt_01'
  | 'mixkit_monkey_chest_01'
  | 'mixkit_wolf_howl_01'
  | 'mixkit_wolf_howl_02'
  | 'mixkit_wolf_howl_03'
  | 'mixkit_bird_squeak_01'
  | 'mixkit_bird_screech_01';

/** One shipped Mixkit wild clip entry. */
export type DefiningWildlifeMixkitWildSfxClipDefinition = {
  id: DefiningWildlifeMixkitWildSfxClipId;
  fileName: string;
};

/** Every Mixkit wild clip shipped in the plaza public folder. */
export const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_CLIP_CATALOG: Record<
  DefiningWildlifeMixkitWildSfxClipId,
  DefiningWildlifeMixkitWildSfxClipDefinition
> = {
  mixkit_lion_roar_01: {
    id: 'mixkit_lion_roar_01',
    fileName: 'lion-roar-01.ogg',
  },
  mixkit_lion_growl_01: {
    id: 'mixkit_lion_growl_01',
    fileName: 'lion-growl-01.ogg',
  },
  mixkit_lion_purr_01: {
    id: 'mixkit_lion_purr_01',
    fileName: 'lion-purr-01.ogg',
  },
  mixkit_monkey_screech_01: {
    id: 'mixkit_monkey_screech_01',
    fileName: 'monkey-screech-01.ogg',
  },
  mixkit_monkey_screech_02: {
    id: 'mixkit_monkey_screech_02',
    fileName: 'monkey-screech-02.ogg',
  },
  mixkit_monkey_grunt_01: {
    id: 'mixkit_monkey_grunt_01',
    fileName: 'monkey-grunt-01.ogg',
  },
  mixkit_monkey_chest_01: {
    id: 'mixkit_monkey_chest_01',
    fileName: 'monkey-chest-01.ogg',
  },
  mixkit_wolf_howl_01: {
    id: 'mixkit_wolf_howl_01',
    fileName: 'wolf-howl-01.ogg',
  },
  mixkit_wolf_howl_02: {
    id: 'mixkit_wolf_howl_02',
    fileName: 'wolf-howl-02.ogg',
  },
  mixkit_wolf_howl_03: {
    id: 'mixkit_wolf_howl_03',
    fileName: 'wolf-howl-03.ogg',
  },
  mixkit_bird_squeak_01: {
    id: 'mixkit_bird_squeak_01',
    fileName: 'bird-squeak-01.ogg',
  },
  mixkit_bird_screech_01: {
    id: 'mixkit_bird_screech_01',
    fileName: 'bird-screech-01.ogg',
  },
};

const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_LION_ROARS = [
  'mixkit_lion_roar_01',
  'mixkit_lion_growl_01',
] as const satisfies readonly DefiningWildlifeMixkitWildSfxClipId[];

/** Shortest lion punch bark (~1.3s). */
const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_LION_ATTACK = [
  'mixkit_lion_roar_01',
] as const satisfies readonly DefiningWildlifeMixkitWildSfxClipId[];

const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_LION_PURRS = [
  'mixkit_lion_purr_01',
] as const satisfies readonly DefiningWildlifeMixkitWildSfxClipId[];

/** Prefer shorter screeches (~1.9s) for combat; grunts for hit/warn. */
const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_MONKEY_SCREECHES = [
  'mixkit_monkey_screech_01',
  'mixkit_monkey_screech_02',
] as const satisfies readonly DefiningWildlifeMixkitWildSfxClipId[];

const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_MONKEY_GRUNTS = [
  'mixkit_monkey_grunt_01',
  'mixkit_monkey_chest_01',
] as const satisfies readonly DefiningWildlifeMixkitWildSfxClipId[];

/**
 * Mixkit wolf howls are 6–8s beds. Keep all three for variety; hard-stop caps
 * them to a one-shot bark when used for punch/combat.
 */
const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_WOLF_HOWLS = [
  'mixkit_wolf_howl_01',
  'mixkit_wolf_howl_02',
  'mixkit_wolf_howl_03',
] as const satisfies readonly DefiningWildlifeMixkitWildSfxClipId[];

const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_BIRD_SCREECHES = [
  'mixkit_bird_squeak_01',
  'mixkit_bird_screech_01',
] as const satisfies readonly DefiningWildlifeMixkitWildSfxClipId[];

/** Default clip rotation per Mixkit pool and event kind. */
export const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_CLIP_IDS_BY_EVENT: Record<
  DefiningWildlifeMixkitWildSfxPoolId,
  Partial<
    Record<
      DefiningWildlifeSpeciesSfxEventKind,
      readonly DefiningWildlifeMixkitWildSfxClipId[]
    >
  >
> = {
  mixkit_lion_roar: {
    warn: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_LION_ROARS,
    attack: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_LION_ATTACK,
    chase_call: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_LION_ROARS,
    hit_taken: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_LION_ROARS,
    stalk: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_LION_PURRS,
  },
  mixkit_monkey: {
    idle_ambient: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_MONKEY_SCREECHES,
    flee_start: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_MONKEY_SCREECHES,
    hit_taken: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_MONKEY_GRUNTS,
    warn: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_MONKEY_GRUNTS,
    attack: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_MONKEY_SCREECHES,
  },
  mixkit_wolf_howl: {
    howl: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_WOLF_HOWLS,
    chase_call: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_WOLF_HOWLS,
    warn: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_WOLF_HOWLS,
    attack: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_WOLF_HOWLS,
    hit_taken: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_WOLF_HOWLS,
  },
  mixkit_bird_screech: {
    flee_start: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_BIRD_SCREECHES,
    hit_taken: DEFINING_WILDLIFE_MIXKIT_WILD_SFX_BIRD_SCREECHES,
  },
};

/**
 * Minimum ms before the same instance replays a Mixkit pool clip.
 */
export const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_MIN_REPLAY_INTERVAL_MS: Partial<
  Record<DefiningWildlifeMixkitWildSfxPoolId, number>
> = {
  mixkit_lion_roar: 5_000,
  mixkit_monkey: 7_000,
  mixkit_wolf_howl: 14_000,
  mixkit_bird_screech: 7_000,
};

/**
 * Hard stop for Mixkit pools that shipped as long beds (wolf howls 6–8s).
 */
export const DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_MAX_PLAYBACK_DURATION_S: Partial<
  Record<DefiningWildlifeMixkitWildSfxPoolId, number>
> = {
  mixkit_lion_roar: 1.55,
  mixkit_monkey: 1.55,
  mixkit_wolf_howl: 1.55,
  mixkit_bird_screech: 1.55,
};
