/**
 * Plaza in-game player profile modal tuning.
 *
 * @module components/world/domains/definingWorldPlazaPlayerProfileModalConstants
 */

import { SIZING_USER_PROFILE_CARD_DISPLAY_MAX_WIDTH_PX } from "@/components/dashboard/profile/domains/definingUserProfileConstants";

/** Data attribute on the portaled profile modal root for dismiss targeting. */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_DATA_ATTRIBUTE =
  "data-plaza-profile-modal" as const;

/** Profile modal overlay classes (covers the plaza viewport). */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_OVERLAY_CLASS_NAME =
  "pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6" as const;

/** Profile modal panel shell classes. */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_PANEL_CLASS_NAME =
  "relative w-fit max-w-[min(100vw-2rem,var(--plaza-profile-modal-width))] overflow-hidden rounded-xl border border-border bg-background shadow-2xl" as const;

/** CSS custom property value for the profile modal panel width (pixels). */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_PANEL_WIDTH_CSS_VALUE = `${SIZING_USER_PROFILE_CARD_DISPLAY_MAX_WIDTH_PX}px` as const;

/** Profile modal close button classes. */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_CLOSE_BUTTON_CLASS_NAME =
  "absolute top-2 right-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" as const;

/** Accessible label for the profile modal close control. */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_CLOSE_BUTTON_ARIA_LABEL =
  "Close profile" as const;
