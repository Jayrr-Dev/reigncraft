/**
 * One-shot SFX when the local player dies.
 *
 * Boolean Transitions impact boom under `public/health/sfx/boolean-transitions/`.
 *
 * @module components/world/audio/lifecycle/definingWorldPlazaDeathSfxConstants
 */

/** Public URL prefix for shipped death clips. */
export const DEFINING_WORLD_PLAZA_DEATH_SFX_ASSET_BASE_URL =
  '/health/sfx/boolean-transitions' as const;

/** Stable id for the player-death impact boom. */
export type DefiningWorldPlazaDeathSfxClipId = 'impact_boom';

/** Base one-shot volume before the SFX volume slider is applied. */
export const DEFINING_WORLD_PLAZA_DEATH_SFX_TARGET_VOLUME = 0.82 as const;
