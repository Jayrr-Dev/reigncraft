'use client';

/**
 * Craft-mode bottom toolbar shell (empty panel until recipes ship).
 *
 * @module components/world/building/components/renderingWorldPlazaHudToolbarCraftModePanel
 */

import { RenderingWorldPlazaCraftingPanel } from '@/components/world/building/components/renderingWorldPlazaCraftingPanel';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { LABELING_WORLD_PLAZA_HUD_TOOLBAR_CRAFT_MODE_PANEL } from '@/components/world/domains/definingWorldPlazaHudToolbarCraftModeConstants';
import {
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, type SyntheticEvent } from 'react';

/**
 * Renders the Craft badge body in the bottom HUD stack.
 */
export function RenderingWorldPlazaHudToolbarCraftModePanel(): React.JSX.Element {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();

  const viewportStyles = useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale]
  );

  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      className={cn(
        STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
        STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
        'min-w-[min(100vw-1.5rem,18rem)] px-3 py-2'
      )}
      style={viewportStyles.shellStyle}
      aria-label={LABELING_WORLD_PLAZA_HUD_TOOLBAR_CRAFT_MODE_PANEL}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={stoppingPlazaWalkPointerPropagation}
    >
      <RenderingWorldPlazaCraftingPanel />
    </div>
  );
}
