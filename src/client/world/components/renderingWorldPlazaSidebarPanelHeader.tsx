"use client";

/**
 * Shared header row for plaza right-side sidebar panels.
 *
 * @module components/world/components/renderingWorldPlazaSidebarPanelHeader
 */

import { BadgeButton } from "@/components/ui/badge-button";
import {
  LABELING_WORLD_PLAZA_SIDEBAR_PANEL_EXIT,
  STYLING_WORLD_PLAZA_SIDEBAR_PANEL_EXIT_BADGE_CLASS_NAME,
  STYLING_WORLD_PLAZA_SIDEBAR_PANEL_HEADER_CLASS_NAME,
  labelingWorldPlazaSidebarPanelTitleWithShortcut,
} from "@/components/world/domains/definingWorldPlazaSidebarPanelConstants";

import type { ReactNode } from "react";

/** Props for {@link RenderingWorldPlazaSidebarPanelHeader}. */
export interface RenderingWorldPlazaSidebarPanelHeaderProps {
  /** Base panel title, e.g. `Build`. */
  panelTitle: string;
  /** Keyboard shortcut token shown in the title, e.g. `b`. */
  shortcutKey: string;
  /** Header title classes. */
  titleClassName: string;
  /** Closes the sidebar panel. */
  onExit: () => void;
  /** Optional override for the exit badge accessible label. */
  exitAriaLabel?: string;
  /** Optional content rendered after the title, e.g. an unsaved badge. */
  titleTrailing?: ReactNode;
}

/**
 * Title with shortcut hint and badge-styled exit control for plaza sidebars.
 */
export function RenderingWorldPlazaSidebarPanelHeader({
  panelTitle,
  shortcutKey,
  titleClassName,
  onExit,
  exitAriaLabel = LABELING_WORLD_PLAZA_SIDEBAR_PANEL_EXIT,
  titleTrailing = null,
}: RenderingWorldPlazaSidebarPanelHeaderProps): React.JSX.Element {
  return (
    <div className={STYLING_WORLD_PLAZA_SIDEBAR_PANEL_HEADER_CLASS_NAME}>
      <div className="flex min-w-0 items-center gap-1">
        <p className={titleClassName}>
          {labelingWorldPlazaSidebarPanelTitleWithShortcut(
            panelTitle,
            shortcutKey,
          )}
        </p>
        {titleTrailing}
      </div>
      <BadgeButton
        type="button"
        variant="outline"
        aria-label={exitAriaLabel}
        onClick={onExit}
        className={STYLING_WORLD_PLAZA_SIDEBAR_PANEL_EXIT_BADGE_CLASS_NAME}
      >
        Exit
      </BadgeButton>
    </div>
  );
}
