/**
 * Copy and layout for the plaza entity death screen overlay.
 *
 * @module components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants
 */

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';

/** Death vignette + dialog overlay (above HUD, below teleport fade). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME =
  'pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/70 px-6 text-center' as const;

/** Non-interactive vignette above the Pixi canvas while the player is dead. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_VIGNETTE_OVERLAY_CLASS_NAME =
  'pointer-events-none absolute inset-0 z-[15] bg-[radial-gradient(circle_at_center,transparent_18%,rgba(40,0,0,0.55)_72%,rgba(0,0,0,0.92)_100%)]' as const;

/** Death screen dialog title. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE =
  'You have fallen' as const;

/** Death screen dialog body copy. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_MESSAGE =
  'Your health reached zero. Revive to return to the plaza spawn point with full health.' as const;

/** Primary revive action label. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_REVIVE_LABEL =
  'Revive' as const;

/** Revive button classes. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_REVIVE_BUTTON_CLASS_NAME =
  'rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/75 disabled:cursor-not-allowed disabled:opacity-60' as const;

/** UI marker so click-to-move ignores the revive button. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_UI_DATA_ATTRIBUTE =
  DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE;

/** Avatar knockdown animation duration (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_AVATAR_ANIMATION_MS = 650;

/** Death vignette fade-in duration (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_VIGNETTE_FADE_IN_MS = 520;
