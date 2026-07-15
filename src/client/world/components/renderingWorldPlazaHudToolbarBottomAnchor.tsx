'use client';

/**
 * Shared bottom-center anchor for HUD toolbar mode badges and hotbar bodies.
 *
 * @module components/world/components/renderingWorldPlazaHudToolbarBottomAnchor
 */

import { RenderingWorldPlazaBuildPlacementCancelButton } from '@/components/world/building/components/renderingWorldPlazaBuildPlacementCancelButton';
import { ProvidingWorldPlazaViewportHudScale } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import {
  RenderingWorldPlazaHudToolbarModeBadges,
  type RenderingWorldPlazaHudToolbarCreativeToolsLauncher,
} from '@/components/world/components/renderingWorldPlazaHudToolbarModeBadges';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import {
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_BOTTOM_BODY_CLASS_NAME,
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_BOTTOM_STACK_CLASS_NAME,
  type DefiningWorldPlazaHudToolbarModeId,
} from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles';
import { STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarDeviceScale } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarDeviceScale';
import { computingWorldPlazaInventoryHotbarShellWidthPx } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import { cn } from '@/lib/utils';
import { useMemo, type ReactNode } from 'react';

export type RenderingWorldPlazaHudToolbarBottomAnchorProps = {
  readonly activeMode: DefiningWorldPlazaHudToolbarModeId;
  readonly onSelectMode: (mode: DefiningWorldPlazaHudToolbarModeId) => void;
  readonly isEditEnabled: boolean;
  readonly viewportHudScale?: number;
  readonly isMobile?: boolean;
  readonly isFullscreen?: boolean;
  /** Optional chrome above mode badges (e.g. active craft progress). */
  readonly topOverlay?: ReactNode;
  /**
   * When set, Items / Craft / Claim and the mode body are replaced by Cancel.
   * Used while a craft placeable ghost is armed.
   */
  readonly onCancelPlacement?: (() => void) | null;
  /** Creative-load-only tools badge left of Items. */
  readonly creativeToolsLauncher?: RenderingWorldPlazaHudToolbarCreativeToolsLauncher | null;
  readonly children: ReactNode;
};

/**
 * Bottom-center stack: mode badges above the active toolbar body.
 * Stack width locks to the inventory hotbar shell so every mode body matches.
 */
export function RenderingWorldPlazaHudToolbarBottomAnchor({
  activeMode,
  onSelectMode,
  isEditEnabled,
  viewportHudScale = 1,
  isMobile = false,
  isFullscreen = false,
  topOverlay = null,
  onCancelPlacement = null,
  creativeToolsLauncher = null,
  children,
}: RenderingWorldPlazaHudToolbarBottomAnchorProps): React.JSX.Element {
  const hotbarViewportHudScale = useMemo(
    () =>
      viewportHudScale *
      resolvingWorldPlazaInventoryHotbarDeviceScale(isMobile),
    [viewportHudScale, isMobile]
  );

  const anchorViewportStyle = useMemo(
    () =>
      resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles(
        viewportHudScale,
        isMobile ? { isFullscreen } : undefined
      ),
    [viewportHudScale, isMobile, isFullscreen]
  );

  const bottomStackStyle = useMemo(
    () => ({
      width: computingWorldPlazaInventoryHotbarShellWidthPx(
        hotbarViewportHudScale
      ),
    }),
    [hotbarViewportHudScale]
  );

  const anchorClassName =
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomCenter
      .inventoryHotbar.anchorClassName;

  return (
    <div
      className={cn(
        anchorClassName,
        STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS
      )}
      style={anchorViewportStyle}
    >
      <ProvidingWorldPlazaViewportHudScale
        viewportHudScale={hotbarViewportHudScale}
      >
        <div
          className={STYLING_WORLD_PLAZA_HUD_TOOLBAR_BOTTOM_STACK_CLASS_NAME}
          style={bottomStackStyle}
          {...{
            [DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE]: 'hotbar',
          }}
        >
          {topOverlay}
          {onCancelPlacement ? (
            <RenderingWorldPlazaBuildPlacementCancelButton
              onCancel={onCancelPlacement}
            />
          ) : (
            <>
              <RenderingWorldPlazaHudToolbarModeBadges
                activeMode={activeMode}
                onSelectMode={onSelectMode}
                isEditEnabled={isEditEnabled}
                creativeToolsLauncher={creativeToolsLauncher}
              />
              <div
                className={
                  STYLING_WORLD_PLAZA_HUD_TOOLBAR_BOTTOM_BODY_CLASS_NAME
                }
              >
                {children}
              </div>
            </>
          )}
        </div>
      </ProvidingWorldPlazaViewportHudScale>
    </div>
  );
}
