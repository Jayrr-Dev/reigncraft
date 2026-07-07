/**
 * Styling and layout for the mobile plaza roll control.
 *
 * @module components/world/domains/definingWorldPlazaMobileJumpButtonConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Authored scale multiplier for the jump button relative to viewport HUD scale. */
export const DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_SCALE = 1.2 as const;

/**
 * Base touch target edge length (px). Sized so the scaled control stays at or
 * above the 44px mobile minimum at the smallest HUD scale.
 */
export const DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_BASE_PX = 80 as const;

/** Base icon edge length inside the jump button (px). */
export const DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ICON_BASE_PX = 28 as const;

/** Minimum rendered touch edge (px) regardless of viewport HUD scale. */
export const DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_MIN_TOUCH_PX = 44 as const;

/** Iconify glyph for the roll action. */
export const DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ICON =
  'ph:person-simple-run' as const;

/** Accessible label for the roll control. */
export const LABELING_WORLD_PLAZA_MOBILE_JUMP_BUTTON = 'Roll' as const;

/** Bottom-right anchor for the mobile jump button. */
export const STYLING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomRight.mobileJumpButton
    .anchorClassName;

/** Circular jump button shell (size via inline viewport styles). */
export const STYLING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_CLASS_NAME =
  `pointer-events-auto flex shrink-0 touch-manipulation select-none items-center justify-center ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.circularGlassButton} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.circularButtonPress} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGoldBright} disabled:cursor-not-allowed` as const;

/** Icon layout inside the jump button (size via inline viewport styles). */
export const STYLING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ICON_CLASS_NAME =
  'shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]' as const;
