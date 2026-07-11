/**
 * Atelier Magicae Werewolf pack SFX for the Omega Wolf elite.
 *
 * Assets live under `public/creatures/sfx/vocals/werewolf/`.
 *
 * @module components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants
 */

import type { DefiningWildlifeWolfAttackMotionClip } from '@/components/world/wildlife/domains/resolvingWildlifeWolfAttackMotionClip';

/** Public URL prefix for shipped Omega Wolf clips. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_SFX_ASSET_BASE_URL =
  '/creatures/sfx/vocals/werewolf' as const;

/** Stable ids for each bundled Omega Wolf clip. */
export type DefiningWildlifeOmegaWolfSfxClipId =
  | 'attack'
  | 'attack_2'
  | 'attack_7'
  | 'short_roar_1'
  | 'short_roar_2'
  | 'short_roar_3'
  | 'short_roar_4'
  | 'short_roar_5'
  | 'chase'
  | 'chase_2'
  | 'anger'
  | 'anger_2'
  | 'hit'
  | 'hit_2'
  | 'hit_3';

/** One Werewolf pack clip entry. */
export type DefiningWildlifeOmegaWolfSfxClipDefinition = {
  /** Stable clip id. */
  id: DefiningWildlifeOmegaWolfSfxClipId;
  /** OGG filename on disk. */
  fileName: string;
};

/** Every Omega Wolf clip shipped in the preload manifest. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_SFX_CLIP_CATALOG: Record<
  DefiningWildlifeOmegaWolfSfxClipId,
  DefiningWildlifeOmegaWolfSfxClipDefinition
> = {
  attack: { id: 'attack', fileName: 'attack.ogg' },
  attack_2: { id: 'attack_2', fileName: 'attack-2.ogg' },
  attack_7: { id: 'attack_7', fileName: 'attack-7.ogg' },
  short_roar_1: { id: 'short_roar_1', fileName: 'short-roar-1.ogg' },
  short_roar_2: { id: 'short_roar_2', fileName: 'short-roar-2.ogg' },
  short_roar_3: { id: 'short_roar_3', fileName: 'short-roar-3.ogg' },
  short_roar_4: { id: 'short_roar_4', fileName: 'short-roar-4.ogg' },
  short_roar_5: { id: 'short_roar_5', fileName: 'short-roar-5.ogg' },
  chase: { id: 'chase', fileName: 'chase.ogg' },
  chase_2: { id: 'chase_2', fileName: 'chase-2.ogg' },
  anger: { id: 'anger', fileName: 'anger.ogg' },
  anger_2: { id: 'anger_2', fileName: 'anger-2.ogg' },
  hit: { id: 'hit', fileName: 'hit.ogg' },
  hit_2: { id: 'hit_2', fileName: 'hit-2.ogg' },
  hit_3: { id: 'hit_3', fileName: 'hit-3.ogg' },
};

/** Simulation events that can trigger Omega Wolf SFX. */
export type DefiningWildlifeOmegaWolfSfxEventKind =
  | 'howl'
  | 'attack_bite'
  | 'attack_snap'
  | 'attack_lunge'
  | 'chase_call'
  | 'territory_warn'
  | 'hit_taken';

/** Maps wolf combo motion clips to attack SFX event kinds. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_MOTION_CLIP_TO_SFX_EVENT_KIND: Record<
  DefiningWildlifeWolfAttackMotionClip,
  Exclude<
    DefiningWildlifeOmegaWolfSfxEventKind,
    'howl' | 'chase_call' | 'territory_warn' | 'hit_taken'
  >
> = {
  attack: 'attack_bite',
  attack2: 'attack_snap',
  attack3: 'attack_lunge',
};

/** Rotating howl clips (ShortRoar pool). */
export const DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_CLIP_IDS = [
  'short_roar_1',
  'short_roar_2',
  'short_roar_3',
  'short_roar_4',
  'short_roar_5',
] as const satisfies readonly DefiningWildlifeOmegaWolfSfxClipId[];

/** Rotating chase call clips. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_CHASE_SFX_CLIP_IDS = [
  'chase',
  'chase_2',
] as const satisfies readonly DefiningWildlifeOmegaWolfSfxClipId[];

/** Rotating territory warn clips. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_TERRITORY_WARN_SFX_CLIP_IDS = [
  'anger',
  'anger_2',
] as const satisfies readonly DefiningWildlifeOmegaWolfSfxClipId[];

/** Rotating hit reaction clips. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_HIT_SFX_CLIP_IDS = [
  'hit',
  'hit_2',
  'hit_3',
] as const satisfies readonly DefiningWildlifeOmegaWolfSfxClipId[];

/** Fixed attack clip per combo step. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_CLIP_IDS = {
  attack_bite: 'attack',
  attack_snap: 'attack_2',
  attack_lunge: 'attack_7',
} as const satisfies Record<
  Exclude<
    DefiningWildlifeOmegaWolfSfxEventKind,
    'howl' | 'chase_call' | 'territory_warn' | 'hit_taken'
  >,
  DefiningWildlifeOmegaWolfSfxClipId
>;

/** Base howl volume before distance falloff and master volume. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_TARGET_VOLUME = 0.62;

/** Base attack swing volume before distance falloff and master volume. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_TARGET_VOLUME = 0.54;

/** Base chase / territory warn volume before distance falloff and master volume. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_CHASE_TERRITORY_SFX_TARGET_VOLUME = 0.58;

/** Base hit reaction volume before distance falloff and master volume. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_HIT_SFX_TARGET_VOLUME = 0.5;

/**
 * How often active Omega Wolf vocals recompute distance falloff while playing.
 */
export const DEFINING_WILDLIFE_OMEGA_WOLF_SFX_SPATIAL_POLL_INTERVAL_MS = 100;

/** Grid distance where Omega Wolf SFX is inaudible (match predator long calls). */
export const DEFINING_WILDLIFE_OMEGA_WOLF_SFX_MAX_AUDIBLE_DISTANCE_GRID = 14;

/** Grid distance where Omega Wolf SFX plays at full event volume. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_SFX_FULL_VOLUME_DISTANCE_GRID = 2.5;

/**
 * Exponent after linear falloff normalization (match species vocal quartic).
 */
export const DEFINING_WILDLIFE_OMEGA_WOLF_SFX_DISTANCE_FALLOFF_EXPONENT = 4;
