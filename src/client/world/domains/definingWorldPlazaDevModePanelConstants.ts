/**
 * Styling and labels for the consolidated plaza dev mode panel.
 *
 * @module components/world/domains/definingWorldPlazaDevModePanelConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';

/**
 * Master switch for the in-world Dev tools launcher and panel.
 *
 * Set to `false` before shipping to hide all dev tooling.
 */
export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_ENABLED = true as const;

/** sessionStorage key for dev panel open state. */
export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_OPEN_STORAGE_KEY =
  'world-plaza-dev-mode-panel-open' as const;

/** Left-side anchor for the dev mode launcher and panel. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topLeft.devModePanel
    .anchorClassName;

/** Collapsed dev launcher button. */
export const STYLING_WORLD_PLAZA_DEV_MODE_LAUNCHER_BUTTON_CLASS_NAME =
  'pointer-events-auto rounded-md border border-violet-300/50 bg-violet-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-100 shadow transition hover:bg-violet-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80' as const;

/** Expanded dev panel shell. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SHELL_CLASS_NAME =
  'pointer-events-auto flex max-h-[min(78vh,28rem)] flex-col gap-2 overflow-hidden rounded-lg border border-violet-300/35 bg-black/85 p-2 shadow-lg backdrop-blur-md' as const;

/** Scrollable tab body inside the dev panel shell. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BODY_CLASS_NAME =
  'min-h-0 flex-1 overflow-y-auto pr-0.5' as const;

/** Dev panel title row. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HEADER_CLASS_NAME =
  'flex items-center justify-between gap-2' as const;

/** Dev panel title text. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TITLE_CLASS_NAME =
  'text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200' as const;

/** Section label inside the dev panel. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME =
  'text-[8px] font-semibold uppercase tracking-[0.14em] text-white/40' as const;

/** Wrap row for subcategory badge buttons below the main tab strip. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORY_BADGE_BAR_CLASS_NAME =
  'flex shrink-0 flex-wrap gap-1' as const;

/** Subcategory badge button when inactive. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORY_BADGE_BUTTON_CLASS_NAME =
  'rounded-full border border-white/15 bg-black/35 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white/55 transition hover:border-white/25 hover:text-white/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-300/70' as const;

/** Subcategory badge button when active. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORY_BADGE_ACTIVE_CLASS_NAME =
  'border-violet-300/45 bg-violet-500/20 text-violet-100' as const;

/** Inline client status readout inside the dev panel. */
export const STYLING_WORLD_PLAZA_DEV_MODE_PANEL_STATUS_READOUT_CLASS_NAME =
  'rounded border border-amber-300/25 bg-black/50 px-1.5 py-1 font-mono text-[9px] leading-snug text-amber-100/90' as const;

/** Accessible label for the dev launcher. */
export const LABELING_WORLD_PLAZA_DEV_MODE_LAUNCHER = 'Open dev tools' as const;

/** Accessible label for closing the dev panel. */
export const LABELING_WORLD_PLAZA_DEV_MODE_PANEL_CLOSE =
  'Close dev tools' as const;

/** Dev panel title. */
export const LABELING_WORLD_PLAZA_DEV_MODE_PANEL_TITLE = 'Dev tools' as const;

/**
 * Resolves top offset for the dev panel below gameplay HUD chrome.
 *
 * @param hasStaminaBar - True when the stamina HUD is visible.
 */
export function resolvingWorldPlazaDevModePanelAnchorTopClassName(
  hasStaminaBar: boolean
): string {
  return hasStaminaBar
    ? DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topLeft.devModePanel
        .topWithStaminaBarClassName
    : DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topLeft.devModePanel
        .topWithoutStaminaBarClassName;
}
