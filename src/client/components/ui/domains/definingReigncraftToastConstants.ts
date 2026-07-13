/**
 * Declarative config for Reigncraft Sonner toasts.
 *
 * @module components/ui/domains/definingReigncraftToastConstants
 */

import { STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_CLASS } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Sonner toaster instance ids (multi-toaster routing). */
export const DEFINING_REIGNCRAFT_TOASTER_ID = {
  /** App-level toasts (home, friends, error boundary). */
  global: 'reigncraft-global',
  /** Plaza gameplay toasts stacked under the top action bar. */
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

/**
 * Plaza toast column width under the action bar (readable, near pill width).
 */
export const DEFINING_REIGNCRAFT_TOAST_WIDTH_PX = 220;

/**
 * Shared toast chrome class names.
 * Plaza gameplay: plain white fill, black outline, fixed toast column width.
 */
export const DEFINING_REIGNCRAFT_TOAST_STYLE = {
  /** Outer Sonner list host for the plaza (flow layout under the action bar). */
  plazaToasterClassName:
    'plaza-reigncraft-toaster plaza-reigncraft-toaster--plaza pointer-events-none',
  /** Outer Sonner list host for app-level toasts. */
  globalToasterClassName:
    'plaza-reigncraft-toaster plaza-reigncraft-toaster--global',
  toastClassName: [
    STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_CLASS,
    'pointer-events-auto !box-border !w-full !max-w-full items-start gap-2 !rounded-md !border-2 !border-black !bg-white !p-2 !shadow-none',
  ].join(' '),
  titleClassName:
    'w-full whitespace-normal break-words font-body text-[11px] font-semibold leading-snug text-black',
  descriptionClassName:
    'w-full whitespace-normal break-words font-body text-[10px] font-medium leading-snug text-black/80',
  successClassName: '!border-black',
  errorClassName: '!border-black',
  warningClassName: '!border-black',
  infoClassName: '!border-black',
  iconClassName: 'mt-0.5 shrink-0 text-black',
  /** Compact gameplay toast: white + black outline, locked to toast column width. */
  gameplayToastClassName: [
    'pointer-events-auto !box-border !flex !w-[var(--width)] !min-w-[var(--width)] !max-w-[var(--width)] select-none !items-start !rounded-md !border !border-black !bg-white !px-2 !py-1.5 !shadow-none',
    'font-body text-[11px] font-medium leading-snug text-black',
  ].join(' '),
  gameplayTitleClassName:
    'w-full whitespace-normal break-words text-left font-body text-[11px] font-medium leading-snug text-black',
} as const;
