'use client';

/**
 * Shared bottom-center anchor for HUD toolbar mode badges and hotbar bodies.
 *
 * @module components/world/components/renderingWorldPlazaHudToolbarBottomAnchor
 */

import { ProvidingWorldPlazaViewportHudScale } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { RenderingWorldPlazaHudToolbarModeBadges } from '@/components/world/components/renderingWorldPlazaHudToolbarModeBadges';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import {
  STYLING_WORLD_PLAZA_HUD_TOOLBAR_BOTTOM_STACK_CLASS_NAME,
  type DefiningWorldPlazaHudToolbarModeId,
} from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles';
import { STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarDeviceScale } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarDeviceScale';
import { cn } from '@/lib/utils';
import { useMemo, type ReactNode } from 'react';

export type RenderingWorldPlazaHudToolbarBottomAnchorProps = {
  readonly activeMode: DefiningWorldPlazaHudToolbarModeId;
  readonly onSelectMode: (mode: DefiningWorldPlazaHudToolbarModeId) => void;
  readonly isEditEnabled: boolean;
  readonly viewportHudScale?: number;
  readonly isMobile?: boolean;
  readonly isFullscreen?: boolean;
  readonly children: ReactNode;
};

/**
 * Bottom-center stack: mode badges above the active toolbar body.
 */
export function RenderingWorldPlazaHudToolbarBottomAnchor({
  activeMode,
  onSelectMode,
  isEditEnabled,
  viewportHudScale = 1,
  isMobile = false,
  isFullscreen = false,
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
        >
          <RenderingWorldPlazaHudToolbarModeBadges
            activeMode={activeMode}
            onSelectMode={onSelectMode}
            isEditEnabled={isEditEnabled}
          />
          <div className="pointer-events-auto flex flex-col items-center">
            {children}
          </div>
        </div>
      </ProvidingWorldPlazaViewportHudScale>
    </div>
  );
}
