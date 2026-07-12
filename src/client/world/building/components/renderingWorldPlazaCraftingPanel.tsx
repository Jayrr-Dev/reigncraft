'use client';

/**
 * Crafting recipes popover body for the edit-mode hotbar.
 *
 * @module components/world/building/components/renderingWorldPlazaCraftingPanel
 */

import {
  LABELING_WORLD_PLAZA_CRAFTING_PANEL_EMPTY,
  STYLING_WORLD_PLAZA_CRAFTING_PANEL_EMPTY_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldPlazaCraftingPanelConstants';

/**
 * Renders the Crafting slot panel (empty until recipes ship).
 */
export function RenderingWorldPlazaCraftingPanel(): React.JSX.Element {
  return (
    <p className={STYLING_WORLD_PLAZA_CRAFTING_PANEL_EMPTY_CLASS_NAME}>
      {LABELING_WORLD_PLAZA_CRAFTING_PANEL_EMPTY}
    </p>
  );
}
