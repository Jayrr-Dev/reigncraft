'use client';

/**
 * Shared bottom-center anchor for mode panels stacked above the inventory hotbar.
 *
 * @module components/world/components/renderingWorldPlazaHudToolbarBottomAnchor
 */

import { ProvidingWorldPlazaViewportHudScale } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import { STYLING_WORLD_PLAZA_HUD_TOOLBAR_BOTTOM_STACK_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles';
import { STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarDeviceScale } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarDeviceScale';
import { computingWorldPlazaInventoryHotbarShellWidthPx } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { cn } from '@/lib/utils';
import { useMemo, type ReactNode } from 'react';

export type RenderingWorldPlazaHudToolbarBottomAnchorProps = {
  readonly viewportHudScale?: number;
  readonly isMobile?: boolean;
  readonly isFullscreen?: boolean;
  /** Optional Craft / Build / Claim panel above the always-visible hotbar. */
  readonly modeBody?: ReactNode;
  readonly children: ReactNode;
};

/**
 * Bottom-center stack: optional mode body above the inventory hotbar.
 * Stack width locks to the inventory hotbar shell.
 */
export function RenderingWorldPlazaHudToolbarBottomAnchor({
  viewportHudScale = 1,
  isMobile = false,
  isFullscreen = false,
  modeBody = null,
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
        >
          {modeBody ? (
            <div className="pointer-events-auto flex w-full flex-col items-stretch">
              {modeBody}
            </div>
          ) : null}
          <div className="pointer-events-auto flex w-full flex-col items-stretch">
            {children}
          </div>
        </div>
      </ProvidingWorldPlazaViewportHudScale>
    </div>
  );
}
