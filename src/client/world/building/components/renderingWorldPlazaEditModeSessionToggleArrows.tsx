'use client';

/**
 * Inventory-styled Build/Claim switcher (hammer / land-plots) beside the edit hotbar.
 *
 * @module components/world/building/components/renderingWorldPlazaEditModeSessionToggleArrows
 */

import { Icon } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_TOGGLE_ICONS,
  DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_TOGGLE_ORDER,
  LABELING_WORLD_PLAZA_EDIT_MODE_SESSION_TOGGLE,
  type DefiningWorldPlazaEditModeSessionModeId,
} from '@/components/world/building/domains/definingWorldPlazaEditModeFunctionRegistry';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import {
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_FACE_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_FACE_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_FACE_INACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICON_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_STACK_CLASS_NAME,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import {
  resolvingWorldPlazaInventoryHotbarViewportStyles,
  type DefiningWorldPlazaInventoryHotbarViewportStyles,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useMemo } from 'react';

/** Props for {@link RenderingWorldPlazaEditModeSessionToggleArrows}. */
export type RenderingWorldPlazaEditModeSessionToggleArrowsProps = {
  readonly activeSessionModeId: DefiningWorldPlazaEditModeSessionModeId;
  readonly onSelectSessionMode: (
    sessionModeId: DefiningWorldPlazaEditModeSessionModeId
  ) => void;
};

function RenderingWorldPlazaEditModeSessionToggleArrowButton({
  ariaLabel,
  icon,
  isActive,
  viewportStyles,
  onActivate,
}: {
  readonly ariaLabel: string;
  readonly icon: string;
  readonly isActive: boolean;
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
  readonly onActivate: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      className={STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_CLASS_NAME}
      style={viewportStyles.pageArrowHitStyle}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      onClick={onActivate}
    >
      <span
        className={cn(
          STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_FACE_CLASS_NAME,
          isActive
            ? STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_FACE_ACTIVE_CLASS_NAME
            : STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_FACE_INACTIVE_CLASS_NAME
        )}
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
 * Right-side Build/Claim glyphs matching the Items hotbar chrome.
 * Top selects Build (hammer); bottom selects Claim (land-plots).
 * Active mode uses the equipped-slot gold ring.
 */
export function RenderingWorldPlazaEditModeSessionToggleArrows({
  activeSessionModeId,
  onSelectSessionMode,
}: RenderingWorldPlazaEditModeSessionToggleArrowsProps): React.JSX.Element {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const viewportStyles = useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale]
  );

  return (
    <div
      className={STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_STACK_CLASS_NAME}
      style={viewportStyles.pageArrowStackStyle}
    >
      {DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_TOGGLE_ORDER.map(
        (sessionModeId) => (
          <RenderingWorldPlazaEditModeSessionToggleArrowButton
            key={sessionModeId}
            ariaLabel={
              LABELING_WORLD_PLAZA_EDIT_MODE_SESSION_TOGGLE[sessionModeId]
            }
            icon={
              DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_TOGGLE_ICONS[sessionModeId]
            }
            isActive={activeSessionModeId === sessionModeId}
            viewportStyles={viewportStyles}
            onActivate={() => {
              onSelectSessionMode(sessionModeId);
            }}
          />
        )
      )}
    </div>
  );
}
