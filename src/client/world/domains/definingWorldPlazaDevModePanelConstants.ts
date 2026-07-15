/**
 * Styling and labels for the consolidated plaza dev mode panel.
 *
 * @module components/world/domains/definingWorldPlazaDevModePanelConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import { DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT } from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';

/**
 * Master switch for the in-world Dev tools launcher and panel.
 *
 * Set to `false` before shipping to hide all dev tooling.
 */
export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_ENABLED = true as const;

/**
 * When false, hides the Creative tools badge (left of Items). Panel stays
 * closed unless opened through another path.
 */
export const DEFINING_WORLD_PLAZA_DEV_MODE_LAUNCHER_BUTTON_VISIBLE =
  true as const;

/** sessionStorage key for creative tools panel open state. */
export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_OPEN_STORAGE_KEY =
  'world-plaza-dev-mode-panel-open' as const;

/** Left-side anchor for the creative tools panel (and Home / Perf row). */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topLeft.devModePanel
    .anchorClassName;

/** Home / Perf toolbar row above the open panel. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOOLBAR_ROW_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topLeft.devModePanel
    .toolbarRowClassName;

/** Gap between the action bar shell and the creative tools row. */
export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_BELOW_ACTION_BAR_GAP_BASE_PX =
  DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.belowMinimapGapBasePx;

/**
 * Creative tools badge beside Items (inactive). Orange chrome matches the
 * bottom HUD mode badge footprint.
 */
export const STYLING_WORLD_PLAZA_DEV_MODE_LAUNCHER_BUTTON_CLASS_NAME =
  'pointer-events-auto inline-flex shrink-0 items-center justify-center rounded-md border border-orange-300/80 bg-[linear-gradient(180deg,#9a4a12_0%,#5c2e0a_100%)] font-bold uppercase text-orange-100 shadow-[0_0_0_1px_rgba(251,146,60,0.35),0_2px_8px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] hover:border-orange-200 hover:brightness-110' as const;

/** Creative tools badge when the tools panel is open. */
export const STYLING_WORLD_PLAZA_DEV_MODE_LAUNCHER_BUTTON_ACTIVE_CLASS_NAME =
  'pointer-events-auto inline-flex shrink-0 items-center justify-center rounded-md border border-orange-200 bg-[linear-gradient(180deg,#c45e18_0%,#7a3510_100%)] font-bold uppercase text-orange-50 shadow-[0_0_0_1px_rgba(253,186,116,0.45),0_2px_8px_rgba(0,0,0,0.45)] backdrop-blur-sm' as const;

/** Short label on the Creative tools badge. */
export const LABELING_WORLD_PLAZA_DEV_MODE_LAUNCHER_BADGE = 'Creative' as const;

/** Iconify id for the Creative tools badge glyph. */
export const DEFINING_WORLD_PLAZA_DEV_MODE_LAUNCHER_BADGE_ICONIFY_ICON =
  'mdi:star-four-points' as const;

/** Compact Home exit next to Dev / Perf when the action-bar Home is hidden. */
export const STYLING_WORLD_PLAZA_DEV_MODE_HOME_LAUNCHER_BUTTON_CLASS_NAME =
  'pointer-events-auto min-w-0 flex-1 rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 text-[8px] font-bold uppercase leading-none tracking-wide text-white shadow-sm transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400' as const;

export const LABELING_WORLD_PLAZA_DEV_MODE_HOME_LAUNCHER = 'Home' as const;

/** Expanded dev panel shell. Fixed width keeps every view the same size. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SHELL_CLASS_NAME =
  'pointer-events-auto flex w-[min(17.5rem,calc(100vw-1.25rem))] max-h-[min(78vh,32rem)] flex-col gap-2 overflow-hidden rounded-lg border border-violet-300/35 bg-black/85 p-2.5 shadow-lg backdrop-blur-md' as const;

/** Scrollable view body inside the dev panel shell (wheel/touch scroll, no bar). */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BODY_CLASS_NAME =
  'scrollbar-none min-h-0 flex-1 overflow-y-auto' as const;

/** Dev panel title row. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HEADER_CLASS_NAME =
  'flex items-center justify-between gap-2' as const;

/** Dev panel title text. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TITLE_CLASS_NAME =
  'text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200' as const;

/** Section label inside the dev panel. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME =
  'text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45' as const;

/**
 * Shared action button chrome for all dev panel controls.
 * Keep height/padding/type size identical across Health, Combat, Wildlife, etc.
 */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME =
  'pointer-events-auto flex min-h-7 w-full items-center justify-start rounded-md border border-white/20 bg-black/50 px-2 py-1.5 text-left text-[10px] font-medium leading-tight text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70' as const;

/** Pressed / selected action button (gold accent). */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_ACTIVE_CLASS_NAME =
  'border-poster-gold/60 bg-poster-gold/15 text-poster-gold' as const;

/** Shared readout / helper surface. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SURFACE_CLASS_NAME =
  'rounded-md border border-white/10 bg-black/35 px-2 py-1.5 text-[10px] leading-snug text-white/80' as const;

/** Muted helper copy inside a surface. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HINT_CLASS_NAME =
  'rounded-md border border-white/10 bg-black/35 px-2 py-1.5 text-[9px] leading-snug text-white/60' as const;

/** Compact filter chip (biome, aggression, etc.). */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CHIP_CLASS_NAME =
  'rounded-md border border-white/15 bg-black/40 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-white/55 transition hover:border-white/25 hover:text-white/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-300/70' as const;

/** Selected filter chip. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CHIP_ACTIVE_CLASS_NAME =
  'border-violet-300/45 bg-violet-500/20 text-violet-100' as const;

/** Base chrome for overlay toggle buttons in Debug. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TOGGLE_BUTTON_CLASS_NAME =
  'pointer-events-auto flex min-h-7 w-full items-center justify-center rounded-md border border-white/20 bg-black/50 px-2 py-1.5 text-[10px] font-semibold text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70' as const;

/** Stack of per-section view picker bars. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_STACK_CLASS_NAME =
  'flex shrink-0 flex-col gap-1' as const;

/** View picker trigger (one bar per section). */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_TRIGGER_CLASS_NAME =
  'pointer-events-auto flex min-h-8 w-full items-center justify-between gap-2 rounded-md border border-white/15 bg-black/40 px-2.5 py-1.5 text-left text-[10px] font-semibold text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70' as const;

/** Trigger chrome when this section owns the active view. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_TRIGGER_ACTIVE_CLASS_NAME =
  'border-violet-300/35 bg-violet-500/15 text-violet-100 hover:bg-violet-500/25' as const;

/** View picker menu shell (portaled; position set inline from trigger rect). */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_MENU_CLASS_NAME =
  'pointer-events-auto z-[10000] max-h-56 overflow-y-auto rounded-md border border-violet-300/35 bg-black/95 p-1 shadow-lg backdrop-blur-md' as const;

/** View option row in the picker menu. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_OPTION_CLASS_NAME =
  'flex w-full items-center rounded px-2 py-1.5 text-left text-[10px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-300/70' as const;

/** Selected view option row. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_OPTION_ACTIVE_CLASS_NAME =
  'bg-violet-500/25 text-violet-100' as const;

/** Inline client status readout inside the dev panel. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_STATUS_READOUT_CLASS_NAME =
  'rounded-md border border-amber-300/25 bg-black/50 px-2 py-1.5 font-mono text-[10px] leading-snug text-amber-100/90' as const;

/** Accessible label for the Creative tools badge. */
export const LABELING_WORLD_PLAZA_DEV_MODE_LAUNCHER =
  'Open creative tools' as const;

/** Accessible label for closing the creative tools panel. */
export const LABELING_WORLD_PLAZA_DEV_MODE_PANEL_CLOSE =
  'Close creative tools' as const;

/** Creative tools panel title. */
export const LABELING_WORLD_PLAZA_DEV_MODE_PANEL_TITLE =
  'Creative tools' as const;

/** Accessible label prefix for a section view picker (`${prefix}: ${groupLabel}`). */
export const LABELING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT =
  'Creative tools section' as const;

/**
 * Resolves top offset class for the dev panel (inline top is used instead).
 * Kept for callers that still pass stamina context.
 *
 * @param _hasStaminaBar - Unused; layout is fixed top-left under the action bar.
 */
export function resolvingWorldPlazaDevModePanelAnchorTopClassName(
  _hasStaminaBar: boolean
): string {
  return '';
}
