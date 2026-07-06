/**
 * In-world HUD toast styling and timing for transient gameplay feedback.
 *
 * @module components/world/domains/definingWorldPlazaGameplayHudToastConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';

export { STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_PILL_CLASS } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** How long a gameplay HUD toast stays visible before fading out (ms). */
export const DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_VISIBLE_DURATION_MS = 3200;

/** Fade-out transition duration after the toast expires (ms). */
export const DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_FADE_DURATION_MS = 700;

export const STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_ANCHOR_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomCenter.gameplayHudToast
    .anchorClassName;
