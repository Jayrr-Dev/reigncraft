/**
 * Default slot layouts for HUD mode tool boards.
 *
 * @module components/world/building/domains/resolvingWorldPlazaHudModeToolBoardDefaults
 */

import {
  DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_SLOT_COUNT,
  type DefiningWorldPlazaHudModeToolBoardId,
} from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';
import {
  listingWorldPlazaHudModeToolsForBoard,
  type DefiningWorldPlazaHudModeToolId,
} from '@/components/world/building/domains/definingWorldPlazaHudModeToolRegistry';

/** One board layout: tool id or empty slot. */
export type DefiningWorldPlazaHudModeToolBoardLayout =
  readonly (DefiningWorldPlazaHudModeToolId | null)[];

/**
 * Builds the default layout: registry tools left-packed, remaining slots empty.
 *
 * @param boardId - Craft / Build / Claim board
 */
export function resolvingWorldPlazaHudModeToolBoardDefaults(
  boardId: DefiningWorldPlazaHudModeToolBoardId
): DefiningWorldPlazaHudModeToolBoardLayout {
  const tools = listingWorldPlazaHudModeToolsForBoard(boardId);
  const slots: (DefiningWorldPlazaHudModeToolId | null)[] = Array.from(
    { length: DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_SLOT_COUNT },
    () => null
  );

  for (
    let toolIndex = 0;
    toolIndex < tools.length &&
    toolIndex < DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_SLOT_COUNT;
    toolIndex += 1
  ) {
    slots[toolIndex] = tools[toolIndex]!.id;
  }

  return slots;
}
