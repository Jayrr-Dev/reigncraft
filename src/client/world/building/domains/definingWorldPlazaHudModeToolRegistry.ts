/**
 * Declarative tool icons that occupy Craft / Build / Claim mode boards.
 *
 * @module components/world/building/domains/definingWorldPlazaHudModeToolRegistry
 */

import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_REGISTRY,
  resolvingWorldPlazaCraftModeCookbookSpriteSheetIcon,
  type DefiningWorldPlazaCraftModeCookbookId,
} from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import {
  DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID,
  type DefiningWorldPlazaEditModeFunctionId,
} from '@/components/world/building/domains/definingWorldPlazaEditModeFunctionRegistry';
import {
  DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID,
  type DefiningWorldPlazaHudModeToolBoardId,
} from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/** Stable tool ids (edit-mode functions for Build/Claim, cookbooks for Craft). */
export type DefiningWorldPlazaHudModeToolId =
  | DefiningWorldPlazaEditModeFunctionId
  | DefiningWorldPlazaCraftModeCookbookId;

/** Display metadata for one mode-board tool. */
export type DefiningWorldPlazaHudModeToolDefinition = {
  readonly id: DefiningWorldPlazaHudModeToolId;
  readonly boardId: DefiningWorldPlazaHudModeToolBoardId;
  readonly label: string;
  readonly ariaLabel: string;
  readonly iconifyIcon: string;
  /** Optional pixel-art glyph; takes precedence over iconifyIcon in slots. */
  readonly spriteSheetIcon?: DefiningWorldPlazaInventorySpriteSheetIcon;
};

/** Craft-board cookbook tools derived from the cookbook registry. */
const DEFINING_WORLD_PLAZA_HUD_MODE_COOKBOOK_TOOLS =
  DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_REGISTRY.map(
    (cookbookDefinition) => ({
      id: cookbookDefinition.id,
      boardId: DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CRAFT,
      label: cookbookDefinition.title,
      ariaLabel: cookbookDefinition.ariaLabel,
      iconifyIcon: cookbookDefinition.emblemIconifyIcon,
      spriteSheetIcon:
        resolvingWorldPlazaCraftModeCookbookSpriteSheetIcon(cookbookDefinition),
    })
  ) satisfies readonly DefiningWorldPlazaHudModeToolDefinition[];

/**
 * Tools seeded onto each mode board (left → right into empty slots).
 */
export const DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_REGISTRY = [
  ...DEFINING_WORLD_PLAZA_HUD_MODE_COOKBOOK_TOOLS,
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
    ariaLabel: 'Owned plots and temporary tiles',
    iconifyIcon: 'mdi:land-plots',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.SAVES,
    boardId: DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CLAIM,
    label: 'Saves',
    ariaLabel: 'Bookmark tile and saved coordinates',
    iconifyIcon: 'mdi:bookmark',
  },
] satisfies readonly DefiningWorldPlazaHudModeToolDefinition[];

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
