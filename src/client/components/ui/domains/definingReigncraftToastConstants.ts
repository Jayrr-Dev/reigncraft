/**
 * Declarative config for Reigncraft Sonner toasts.
 *
 * @module components/ui/domains/definingReigncraftToastConstants
 */

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

/** White lettering with a thin dark outline-style shadow (readable over the world). */
const DEFINING_REIGNCRAFT_TOAST_LETTERING_CLASS =
  'text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.95),0_0_2px_rgba(0,0,0,0.75)]';

/**
 * Shared toast chrome class names.
 * Floating text only: no fill, no border; white letters + thin dark shadow.
 */
export const DEFINING_REIGNCRAFT_TOAST_STYLE = {
  /** Outer Sonner list host for the plaza (flow layout under the action bar). */
  plazaToasterClassName:
    'plaza-reigncraft-toaster plaza-reigncraft-toaster--plaza pointer-events-none',
  /** Outer Sonner list host for app-level toasts. */
  globalToasterClassName:
    'plaza-reigncraft-toaster plaza-reigncraft-toaster--global',
  toastClassName: [
    'pointer-events-auto !box-border !w-full !max-w-full items-start gap-2 !rounded-none !border-0 !bg-transparent !p-2 !shadow-none',
    DEFINING_REIGNCRAFT_TOAST_LETTERING_CLASS,
  ].join(' '),
  titleClassName: [
    'w-full whitespace-normal break-words font-body text-[11px] font-semibold leading-snug',
    DEFINING_REIGNCRAFT_TOAST_LETTERING_CLASS,
  ].join(' '),
  descriptionClassName: [
    'w-full whitespace-normal break-words font-body text-[10px] font-medium leading-snug',
    DEFINING_REIGNCRAFT_TOAST_LETTERING_CLASS,
  ].join(' '),
  successClassName: '!border-0 !bg-transparent',
  errorClassName: '!border-0 !bg-transparent',
  warningClassName: '!border-0 !bg-transparent',
  infoClassName: '!border-0 !bg-transparent',
  iconClassName: [
    'mt-0.5 shrink-0',
    DEFINING_REIGNCRAFT_TOAST_LETTERING_CLASS,
  ].join(' '),
  /** Compact gameplay toast: floating letters, locked to toast column width. */
  gameplayToastClassName: [
    'pointer-events-auto !box-border !flex !w-[var(--width)] !min-w-[var(--width)] !max-w-[var(--width)] select-none !items-center !rounded-none !border-0 !bg-transparent !px-2 !py-1.5 !shadow-none',
    'font-body text-[11px] font-medium leading-snug',
    DEFINING_REIGNCRAFT_TOAST_LETTERING_CLASS,
  ].join(' '),
  gameplayTitleClassName: [
    'w-full whitespace-normal break-words text-left font-body text-[11px] font-medium leading-snug',
    DEFINING_REIGNCRAFT_TOAST_LETTERING_CLASS,
  ].join(' '),
  /** Pickup toast body: message left, item glyph far right. */
  gameplayPickupToastRowClassName: 'flex w-full items-center gap-2',
  gameplayPickupToastMessageClassName: [
    'min-w-0 flex-1 whitespace-normal break-words text-left font-body text-[11px] font-medium leading-snug',
    DEFINING_REIGNCRAFT_TOAST_LETTERING_CLASS,
  ].join(' '),
  gameplayPickupToastIconClassName:
    'size-4 shrink-0 text-[1rem] leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.95)]',
} as const;
