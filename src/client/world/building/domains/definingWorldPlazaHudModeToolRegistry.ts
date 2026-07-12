/**
 * Declarative tool icons that occupy Craft / Build / Claim mode boards.
 *
 * @module components/world/building/domains/definingWorldPlazaHudModeToolRegistry
 */

import {
  DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID,
  type DefiningWorldPlazaEditModeFunctionId,
} from '@/components/world/building/domains/definingWorldPlazaEditModeFunctionRegistry';
import {
  DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID,
  type DefiningWorldPlazaHudModeToolBoardId,
} from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';

/** Stable tool ids (reuse edit-mode function ids for Build/Claim). */
export type DefiningWorldPlazaHudModeToolId =
  DefiningWorldPlazaEditModeFunctionId;

/** Display metadata for one mode-board tool. */
export type DefiningWorldPlazaHudModeToolDefinition = {
  readonly id: DefiningWorldPlazaHudModeToolId;
  readonly boardId: DefiningWorldPlazaHudModeToolBoardId;
  readonly label: string;
  readonly ariaLabel: string;
  readonly iconifyIcon: string;
};

/**
 * Tools seeded onto each mode board (left → right into empty slots).
 * Craft stays empty until recipes ship.
 */
export const DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_REGISTRY = [
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS,
    boardId: DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.BUILD,
    label: 'Materials',
    ariaLabel: 'Materials palette',
    iconifyIcon: 'mdi:cube-outline',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.BLOCKS,
    boardId: DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.BUILD,
    label: 'Blocks',
    ariaLabel: 'Block size and placement layer',
    iconifyIcon: 'mdi:shape-square-plus',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CUT,
    boardId: DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.BUILD,
    label: 'Cut',
    ariaLabel: 'Cut footprint',
    iconifyIcon: 'mdi:view-grid-outline',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLOTS,
    boardId: DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CLAIM,
    label: 'Plots',
    ariaLabel: 'Plots, temporary tiles, and saved coordinates',
    iconifyIcon: 'mdi:land-plots',
  },
] as const satisfies readonly DefiningWorldPlazaHudModeToolDefinition[];

/**
 * Lists tools that belong on one mode board (registry order).
 *
 * @param boardId - Craft / Build / Claim board
 */
export function listingWorldPlazaHudModeToolsForBoard(
  boardId: DefiningWorldPlazaHudModeToolBoardId
): readonly DefiningWorldPlazaHudModeToolDefinition[] {
  return DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_REGISTRY.filter(
    (toolDefinition) => toolDefinition.boardId === boardId
  );
}

/**
 * Resolves one tool definition by id, or null when unknown.
 *
 * @param toolId - Tool id
 */
export function resolvingWorldPlazaHudModeToolDefinition(
  toolId: string
): DefiningWorldPlazaHudModeToolDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_REGISTRY.find(
      (toolDefinition) => toolDefinition.id === toolId
    ) ?? null
  );
}
