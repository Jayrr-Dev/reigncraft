'use client';

/**
 * Craft-mode bottom toolbar: inventory-shaped board (empty slots until recipes).
 *
 * @module components/world/building/components/renderingWorldPlazaHudToolbarCraftModePanel
 */

import { RenderingWorldPlazaHudModeToolBoard } from '@/components/world/building/components/renderingWorldPlazaHudModeToolBoard';
import { DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID } from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';

/**
 * Renders the Craft badge body in the bottom HUD stack.
 */
export function RenderingWorldPlazaHudToolbarCraftModePanel(): React.JSX.Element {
  return (
    <RenderingWorldPlazaHudModeToolBoard
      boardId={DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CRAFT}
      activeToolId={null}
      onActivateTool={() => {
        // Recipes not shipped yet — slots stay empty / inert.
      }}
    />
  );
}
