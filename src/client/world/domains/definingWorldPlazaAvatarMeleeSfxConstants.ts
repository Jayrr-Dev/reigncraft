/**
 * 400 Sounds Pack melee SFX for the local avatar punch combo.
 *
 * Assets live under `public/sfx/400-sounds-combat/`.
 *
 * @module components/world/domains/definingWorldPlazaAvatarMeleeSfxConstants
 */

/** Public URL prefix for shipped melee combat clips. */
export const DEFINING_WORLD_PLAZA_AVATAR_MELEE_SFX_ASSET_BASE_URL =
  '/sfx/400-sounds-combat' as const;

/** Stable ids for each bundled avatar melee clip. */
export type DefiningWorldPlazaAvatarMeleeClipId = 'swipe' | 'slap' | 'punch_1';

/** One melee combat clip entry. */
export type DefiningWorldPlazaAvatarMeleeClipDefinition = {
  /** Stable clip id. */
  id: DefiningWorldPlazaAvatarMeleeClipId;
  /** WAV filename on disk. */
  fileName: string;
};

/** Every melee clip shipped for the local avatar. */
export const DEFINING_WORLD_PLAZA_AVATAR_MELEE_CLIP_CATALOG: Record<
  DefiningWorldPlazaAvatarMeleeClipId,
  DefiningWorldPlazaAvatarMeleeClipDefinition
> = {
  swipe: { id: 'swipe', fileName: 'swipe.wav' },
  slap: { id: 'slap', fileName: 'slap.wav' },
  punch_1: { id: 'punch_1', fileName: 'punch.wav' },
};

/**
 * Auto-attack wind-up pattern: swipe, swipe, slap (1-1-2), repeating.
 */
export const DEFINING_WORLD_PLAZA_AVATAR_MELEE_SWING_COMBO_CLIP_IDS = [
  'swipe',
  'swipe',
  'slap',
] as const satisfies readonly DefiningWorldPlazaAvatarMeleeClipId[];

/** Swing wind-up volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_AVATAR_MELEE_SWING_SFX_TARGET_VOLUME = 0.48;

/** Crit / fatal impact volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_AVATAR_MELEE_CRIT_FATAL_SFX_TARGET_VOLUME = 0.58;

/** Damage outcome tiers that play the punch impact clip on connect. */
export const DEFINING_WORLD_PLAZA_AVATAR_MELEE_CRIT_FATAL_OUTCOME_TIERS = [
  'critical',
  'fatal',
  'lethal',
] as const;

export type DefiningWorldPlazaAvatarMeleeCritFatalOutcomeTier =
  (typeof DEFINING_WORLD_PLAZA_AVATAR_MELEE_CRIT_FATAL_OUTCOME_TIERS)[number];
