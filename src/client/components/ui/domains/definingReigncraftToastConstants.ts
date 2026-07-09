/**
 * Declarative config for Reigncraft Sonner toasts.
 *
 * @module components/ui/domains/definingReigncraftToastConstants
 */

import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_CLASS,
} from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Sonner toaster instance ids (multi-toaster routing). */
export const DEFINING_REIGNCRAFT_TOASTER_ID = {
  /** App-level toasts (home, friends, error boundary). */
  global: 'reigncraft-global',
  /** Plaza gameplay toasts stacked above the minimap. */
  plaza: 'reigncraft-plaza',
} as const;

export type DefiningReigncraftToasterId =
  (typeof DEFINING_REIGNCRAFT_TOASTER_ID)[keyof typeof DEFINING_REIGNCRAFT_TOASTER_ID];

/** Default auto-dismiss duration for Reigncraft toasts (ms). */
export const DEFINING_REIGNCRAFT_TOAST_DURATION_MS = 3200;

/** How many stacked toasts stay visible at once. */
export const DEFINING_REIGNCRAFT_TOAST_VISIBLE_COUNT = 3;

/** Gap between stacked toasts (px). */
export const DEFINING_REIGNCRAFT_TOAST_GAP_PX = 8;

/** Max toast width so the stack stays near the minimap column. */
export const DEFINING_REIGNCRAFT_TOAST_WIDTH_PX = 220;

/**
 * Shared toast chrome class names (parchment / poster palette).
 */
export const DEFINING_REIGNCRAFT_TOAST_STYLE = {
  /** Outer Sonner list host for the plaza (flow layout above minimap). */
  plazaToasterClassName:
    'plaza-reigncraft-toaster plaza-reigncraft-toaster--plaza pointer-events-none',
  /** Outer Sonner list host for app-level toasts. */
  globalToasterClassName: 'plaza-reigncraft-toaster plaza-reigncraft-toaster--global',
  toastClassName: [
    STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_CLASS,
    'pointer-events-auto !w-auto max-w-[min(220px,calc(100vw-1.5rem))] items-start gap-2 !rounded-md !border-2 !p-2 !shadow-[inset_0_0_0_1px_rgba(255,250,230,0.6),0_3px_0_0_rgba(61,42,31,0.7),0_8px_16px_rgba(20,28,26,0.35)]',
  ].join(' '),
  titleClassName:
    'font-body text-[11px] font-semibold leading-snug text-ink',
  descriptionClassName: 'font-body text-[10px] font-medium leading-snug text-ink-soft',
  successClassName: 'border-poster-sage-deep/80',
  errorClassName: 'border-poster-orange-deep/80',
  warningClassName: 'border-poster-amber/80',
  infoClassName: 'border-poster-teal/70',
  iconClassName: 'mt-0.5 text-poster-teal-deep',
  /** Compact gameplay pill (default / message-only). */
  gameplayToastClassName: [
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.toast.pill,
    'pointer-events-auto !w-auto max-w-[min(220px,calc(100vw-1.5rem))] !rounded-md !px-2.5 !py-1.5 !text-[11px] !leading-snug',
  ].join(' '),
} as const;
