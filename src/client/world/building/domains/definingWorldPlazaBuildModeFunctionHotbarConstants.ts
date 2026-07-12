/**
 * Layout and chrome for the inventory-shaped build-mode function hotbar.
 *
 * @module components/world/building/domains/definingWorldPlazaBuildModeFunctionHotbarConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Outer popover panel anchored above a build function slot. */
export const STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_PANEL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.glassPanel} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme} pointer-events-auto absolute bottom-full left-1/2 z-50 mb-2 w-max min-w-[11rem] max-w-[min(100vw-1.5rem,18rem)] -translate-x-1/2 rounded-md p-2 shadow-lg` as const;

/** Title row inside a build function popover. */
export const STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_TITLE_CLASS_NAME =
  'mb-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f4d35e]' as const;

/** Tools popover status / hint text. */
export const STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_TOOLS_STATUS_CLASS_NAME =
  'text-[9px] font-medium leading-snug text-white/70' as const;

/** Slot wrapper that anchors the popover above the icon button. */
export const STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_SLOT_ANCHOR_CLASS_NAME =
  'relative shrink-0' as const;

/** Column wrapping the mode switch and inventory-shaped toolbar. */
export const STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_STACK_CLASS_NAME =
  'pointer-events-none flex flex-col items-center gap-1' as const;

/** Header block above the build toolbar (Build / Claim mode switch only). */
export const STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_HEADER_CLASS_NAME =
  'pointer-events-auto flex flex-col items-center gap-1' as const;

/** Row of Build / Claim session mode buttons above the hotbar slots. */
export const STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_SWITCHER_CLASS_NAME =
  'flex items-center gap-1.5' as const;

/** Inactive Build/Claim switcher chip (dark plate, light type over grass). */
export const STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_BUTTON_CLASS_NAME =
  'inline-flex items-center gap-1 rounded-md border border-poster-gold/30 bg-poster-teal-deep/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-parchment shadow-md shadow-black/35 backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] hover:border-poster-gold/50 hover:bg-poster-teal-deep hover:text-parchment' as const;

/** Active Build/Claim switcher chip. */
export const STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_BUTTON_ACTIVE_CLASS_NAME =
  'inline-flex items-center gap-1 rounded-md border border-poster-gold/70 bg-[linear-gradient(180deg,#2c4a52_0%,#1a3038_100%)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#f4d35e] shadow-[0_0_0_1px_rgba(244,211,94,0.25),0_2px_8px_rgba(0,0,0,0.45)] backdrop-blur-sm' as const;

/** Icon size inside a Build/Claim switcher chip. */
export const STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ICON_CLASS_NAME =
  'size-3.5 shrink-0 text-current' as const;

/**
 * Minimalist white HUD title with a thin black outline.
 * Matches plaza campfire / combat float outline language.
 */
export const STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_OUTLINE_TITLE_CLASS_NAME =
  'select-none text-center font-display text-[12px] font-bold uppercase leading-none tracking-[0.16em] text-white [-webkit-text-stroke:0.85px_rgba(0,0,0,0.95)] [paint-order:stroke_fill] [text-shadow:0_1px_0_rgba(0,0,0,0.55),0_0_6px_rgba(0,0,0,0.35)]' as const;

/** Compact plot capacity readout under the top action bar. */
export const STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_OUTLINE_METRIC_CLASS_NAME =
  'select-none text-center font-body text-[13px] font-semibold tabular-nums leading-none text-white [-webkit-text-stroke:0.85px_rgba(0,0,0,0.95)] [paint-order:stroke_fill] [text-shadow:0_1px_0_rgba(0,0,0,0.55),0_0_6px_rgba(0,0,0,0.35)]' as const;

/** Build mode toolbar title above the icon slots. */
export const LABELING_WORLD_PLAZA_BUILD_MODE_HOTBAR_TITLE = 'Build' as const;

/**
 * Formats plot + tile capacity shown under the top action bar in edit mode.
 *
 * @param ownedPlotCount - Current owned plot count.
 * @param maxOwnedPlotCount - Per-user plot cap.
 * @param tileClaimCount - Current owned tile claim count.
 * @param maxTileClaimCount - Per-user tile claim cap.
 */
export function formattingWorldPlazaBuildModeHotbarPlotMetric(
  ownedPlotCount: number,
  maxOwnedPlotCount: number,
  tileClaimCount: number,
  maxTileClaimCount: number
): string {
  return `Plots ${ownedPlotCount}/${maxOwnedPlotCount} · Tiles ${tileClaimCount}/${maxTileClaimCount}`;
}
