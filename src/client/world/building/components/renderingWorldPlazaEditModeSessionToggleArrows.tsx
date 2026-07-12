'use client';

/**
 * Inventory-styled up/down arrows that flip the edit hotbar Build/Claim view.
 *
 * @module components/world/building/components/renderingWorldPlazaEditModeSessionToggleArrows
 */

import { Icon } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID,
  LABELING_WORLD_PLAZA_EDIT_MODE_SESSION_TOGGLE,
  type DefiningWorldPlazaEditModeSessionModeId,
} from '@/components/world/building/domains/definingWorldPlazaEditModeFunctionRegistry';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICONS,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_FACE_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICON_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_STACK_CLASS_NAME,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import {
  resolvingWorldPlazaInventoryHotbarViewportStyles,
  type DefiningWorldPlazaInventoryHotbarViewportStyles,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import type * as React from 'react';
import { useMemo } from 'react';

/** Props for {@link RenderingWorldPlazaEditModeSessionToggleArrows}. */
export type RenderingWorldPlazaEditModeSessionToggleArrowsProps = {
  readonly activeSessionModeId: DefiningWorldPlazaEditModeSessionModeId;
  readonly onToggleSessionMode: () => void;
};

function RenderingWorldPlazaEditModeSessionToggleArrowButton({
  ariaLabel,
  icon,
  viewportStyles,
  onActivate,
}: {
  readonly ariaLabel: string;
  readonly icon: string;
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
  readonly onActivate: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      className={STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_CLASS_NAME}
      style={viewportStyles.pageArrowHitStyle}
      aria-label={ariaLabel}
      onClick={onActivate}
    >
      <span
        className={
          STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_FACE_CLASS_NAME
        }
        style={viewportStyles.pageArrowButtonStyle}
        aria-hidden
      >
        <Icon
          icon={icon}
          className={STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICON_CLASS_NAME}
          style={viewportStyles.pageArrowIconStyle}
          aria-hidden
        />
      </span>
    </button>
  );
}

/**
 * Right-side up/down arrows matching the Items hotbar chrome.
 * Both arrows flip between the Build and Claim tool boards.
 */
export function RenderingWorldPlazaEditModeSessionToggleArrows({
  activeSessionModeId,
  onToggleSessionMode,
}: RenderingWorldPlazaEditModeSessionToggleArrowsProps): React.JSX.Element {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const viewportStyles = useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale]
  );

  const targetSessionModeId =
    activeSessionModeId === DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM
      ? DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD
      : DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM;
  const toggleAriaLabel =
    LABELING_WORLD_PLAZA_EDIT_MODE_SESSION_TOGGLE[targetSessionModeId];

  return (
    <div
      className={STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_STACK_CLASS_NAME}
      style={viewportStyles.pageArrowStackStyle}
    >
      <RenderingWorldPlazaEditModeSessionToggleArrowButton
        ariaLabel={toggleAriaLabel}
        icon={DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICONS.up}
        viewportStyles={viewportStyles}
        onActivate={onToggleSessionMode}
      />
      <RenderingWorldPlazaEditModeSessionToggleArrowButton
        ariaLabel={toggleAriaLabel}
        icon={DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICONS.down}
        viewportStyles={viewportStyles}
        onActivate={onToggleSessionMode}
      />
    </div>
  );
}
