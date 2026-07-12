'use client';

/**
 * Items / Craft / Build / Claim badge strip above the bottom plaza hotbar.
 *
 * @module components/world/components/renderingWorldPlazaHudToolbarModeBadges
 */

import { Icon } from '@/components/ui/icon';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_REGISTRY,
  LABELING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_HEADER_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER_CLASS_NAME,
  type DefiningWorldPlazaHudToolbarModeId,
} from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { resolvingWorldPlazaHudToolbarModeBadgesViewportStyles } from '@/components/world/domains/resolvingWorldPlazaHudToolbarModeBadgesViewportStyles';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCallback, useMemo, type SyntheticEvent } from 'react';

export type RenderingWorldPlazaHudToolbarModeBadgesProps = {
  readonly activeMode: DefiningWorldPlazaHudToolbarModeId;
  readonly onSelectMode: (mode: DefiningWorldPlazaHudToolbarModeId) => void;
  /** When false, Build and Claim badges are disabled. */
  readonly isEditEnabled: boolean;
};

/**
 * Renders the four bottom HUD mode badges sized to the inventory hotbar.
 */
export function RenderingWorldPlazaHudToolbarModeBadges({
  activeMode,
  onSelectMode,
  isEditEnabled,
}: RenderingWorldPlazaHudToolbarModeBadgesProps): React.JSX.Element {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const isMobile = useIsMobile();
  const viewportStyles = useMemo(
    () =>
      resolvingWorldPlazaHudToolbarModeBadgesViewportStyles(
        viewportHudScale,
        isMobile
      ),
    [viewportHudScale, isMobile]
  );
  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  return (
    <div
      className={STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_HEADER_CLASS_NAME}
      style={viewportStyles.stackStyle}
    >
      <div
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER_CLASS_NAME}
        style={viewportStyles.switcherStyle}
        role="group"
        aria-label={LABELING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER}
        onPointerDown={stoppingPlazaWalkPointerPropagation}
        onClick={stoppingPlazaWalkPointerPropagation}
      >
        {DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_REGISTRY.map(
          (modeDefinition) => {
            const isActive = activeMode === modeDefinition.id;
            const isDisabled =
              modeDefinition.requiresEditEnabled && !isEditEnabled;

            return (
              <button
                key={modeDefinition.id}
                type="button"
                aria-label={modeDefinition.ariaLabel}
                aria-pressed={isActive}
                disabled={isDisabled}
                onClick={() => {
                  onSelectMode(modeDefinition.id);
                }}
                className={
                  isActive
                    ? STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_ACTIVE_CLASS_NAME
                    : STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_CLASS_NAME
                }
                style={viewportStyles.buttonStyle}
              >
                <Icon
                  icon={modeDefinition.iconifyIcon}
                  className={
                    STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_CLASS_NAME
                  }
                  style={viewportStyles.iconStyle}
                  aria-hidden
                />
                <span
                  className={
                    STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_LABEL_CLASS_NAME
                  }
                  style={viewportStyles.labelStyle}
                >
                  {modeDefinition.label}
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
