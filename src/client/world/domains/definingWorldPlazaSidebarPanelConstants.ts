/**
 * Shared constants for plaza right-side sidebar panels (friends, build, claim).
 *
 * @module components/world/domains/definingWorldPlazaSidebarPanelConstants
 */

/** Keyboard key that toggles the friends sidebar. */
export const DEFINING_WORLD_PLAZA_FRIENDS_PANEL_TOGGLE_KEY = "f" as const;

/** Keyboard key that dismisses an open sidebar panel. */
export const DEFINING_WORLD_PLAZA_SIDEBAR_PANEL_DISMISS_KEY = "Escape" as const;

/** Shared header row for plaza sidebar panels. */
export const STYLING_WORLD_PLAZA_SIDEBAR_PANEL_HEADER_CLASS_NAME =
  "flex items-center justify-between gap-1" as const;

/** Exit badge on plaza sidebar panels. */
export const STYLING_WORLD_PLAZA_SIDEBAR_PANEL_EXIT_BADGE_CLASS_NAME =
  "inline-flex h-5 min-w-5 shrink-0 items-center justify-center !rounded-sm border-white/25 bg-white/5 px-1 py-0 text-[8px] font-semibold uppercase leading-none text-white/80 hover:bg-white/10 hover:text-white" as const;

/** Accessible label for sidebar exit badges. */
export const LABELING_WORLD_PLAZA_SIDEBAR_PANEL_EXIT = "Exit panel" as const;

/**
 * Formats a sidebar title with its keyboard shortcut, e.g. `Build [B]`.
 *
 * @param panelTitle - Panel label shown in the header
 * @param shortcutKey - Single-letter or key token bound to the panel
 */
export function labelingWorldPlazaSidebarPanelTitleWithShortcut(
  panelTitle: string,
  shortcutKey: string,
): string {
  const normalizedShortcutKey =
    shortcutKey.length === 1 ? shortcutKey.toUpperCase() : shortcutKey;

  return `${panelTitle} [${normalizedShortcutKey}]`;
}
