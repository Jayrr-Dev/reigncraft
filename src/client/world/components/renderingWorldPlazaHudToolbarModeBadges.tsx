'use client';

/**
 * Items / Craft / Build↔Claim badge strip above the bottom plaza hotbar.
 *
 * @module components/world/components/renderingWorldPlazaHudToolbarModeBadges
 */

import { Icon } from '@/components/ui/icon';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_REGISTRY,
  LABELING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_CONTENT_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_HEADER_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_SLOT_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER_CLASS_NAME,
  type DefiningWorldPlazaHudToolbarModeId,
} from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import {
  checkingWorldPlazaHudToolbarBuildClaimToggleActive,
  resolvingWorldPlazaHudToolbarBuildClaimToggleFace,
  resolvingWorldPlazaHudToolbarBuildClaimToggleNextMode,
} from '@/components/world/domains/resolvingWorldPlazaHudToolbarBuildClaimToggle';
import { resolvingWorldPlazaHudToolbarModeBadgesViewportStyles } from '@/components/world/domains/resolvingWorldPlazaHudToolbarModeBadgesViewportStyles';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCallback, useMemo, type SyntheticEvent } from 'react';

export type RenderingWorldPlazaHudToolbarModeBadgesProps = {
  readonly activeMode: DefiningWorldPlazaHudToolbarModeId;
  readonly onSelectMode: (mode: DefiningWorldPlazaHudToolbarModeId) => void;
  /** When false, the Build↔Claim toggle is disabled. */
  readonly isEditEnabled: boolean;
};

/**
 * Renders the bottom HUD mode badges sized to the inventory hotbar.
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
        {DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_REGISTRY.map(
          (badgeDefinition) => {
            if (badgeDefinition.kind === 'buildClaimToggle') {
              const toggleFace =
                resolvingWorldPlazaHudToolbarBuildClaimToggleFace(activeMode);
              const isActive =
                checkingWorldPlazaHudToolbarBuildClaimToggleActive(activeMode);
              const isDisabled = !isEditEnabled;

              return (
                <button
                  key="build-claim-toggle"
                  type="button"
                  aria-label={toggleFace.ariaLabel}
                  aria-pressed={isActive}
                  disabled={isDisabled}
                  onClick={() => {
                    onSelectMode(
                      resolvingWorldPlazaHudToolbarBuildClaimToggleNextMode(
                        activeMode
                      )
                    );
                  }}
                  className={
                    isActive
                      ? toggleFace.activeButtonClassName
                      : STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_CLASS_NAME
                  }
                  style={viewportStyles.buttonStyle}
                >
                  <span
                    className={
                      STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_CONTENT_CLASS_NAME
                    }
                    style={viewportStyles.contentStyle}
                  >
                    <span
                      className={
                        STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_SLOT_CLASS_NAME
                      }
                      style={viewportStyles.iconSlotStyle}
                      aria-hidden
                    >
                      <Icon
                        icon={toggleFace.iconifyIcon}
                        className={
                          STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_CLASS_NAME
                        }
                        style={viewportStyles.iconStyle}
                        aria-hidden
                      />
                    </span>
                    <span
                      className={
                        STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_LABEL_CLASS_NAME
                      }
                      style={viewportStyles.labelStyle}
                    >
                      {toggleFace.label}
                    </span>
                  </span>
                </button>
              );
            }

            const isActive = activeMode === badgeDefinition.id;
            const isDisabled =
              badgeDefinition.requiresEditEnabled && !isEditEnabled;

            return (
              <button
                key={badgeDefinition.id}
                type="button"
                aria-label={badgeDefinition.ariaLabel}
                aria-pressed={isActive}
                disabled={isDisabled}
                onClick={() => {
                  onSelectMode(badgeDefinition.id);
                }}
                className={
                  isActive
                    ? STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_ACTIVE_CLASS_NAME
                    : STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_CLASS_NAME
                }
                style={viewportStyles.buttonStyle}
              >
                <span
                  className={
                    STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_CONTENT_CLASS_NAME
                  }
                  style={viewportStyles.contentStyle}
                >
                  <span
                    className={
                      STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_SLOT_CLASS_NAME
                    }
                    style={viewportStyles.iconSlotStyle}
                    aria-hidden
                  >
                    <Icon
                      icon={badgeDefinition.iconifyIcon}
                      className={
                        STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_CLASS_NAME
                      }
                      style={viewportStyles.iconStyle}
                      aria-hidden
                    />
                  </span>
                  <span
                    className={
                      STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_LABEL_CLASS_NAME
                    }
                    style={viewportStyles.labelStyle}
                  >
                    {badgeDefinition.label}
                  </span>
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
