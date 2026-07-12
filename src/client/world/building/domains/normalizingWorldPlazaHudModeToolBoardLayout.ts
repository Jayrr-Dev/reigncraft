/**
 * Validates / repairs persisted HUD mode tool board layouts.
 *
 * @module components/world/building/domains/normalizingWorldPlazaHudModeToolBoardLayout
 */

import {
  DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_SLOT_COUNT,
  type DefiningWorldPlazaHudModeToolBoardId,
} from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';
import {
  listingWorldPlazaHudModeToolsForBoard,
  type DefiningWorldPlazaHudModeToolId,
} from '@/components/world/building/domains/definingWorldPlazaHudModeToolRegistry';
import {
  resolvingWorldPlazaHudModeToolBoardDefaults,
  type DefiningWorldPlazaHudModeToolBoardLayout,
} from '@/components/world/building/domains/resolvingWorldPlazaHudModeToolBoardDefaults';

/**
 * Normalizes a stored layout to valid length, known tools, and no duplicates.
 * Missing board tools are left-packed into the first empty slots.
 *
 * @param boardId - Craft / Build / Claim board
 * @param storedLayout - Raw stored value
 */
export function normalizingWorldPlazaHudModeToolBoardLayout(
  boardId: DefiningWorldPlazaHudModeToolBoardId,
  storedLayout: unknown
): DefiningWorldPlazaHudModeToolBoardLayout {
  const allowedToolIds = new Set(
    listingWorldPlazaHudModeToolsForBoard(boardId).map(
      (toolDefinition) => toolDefinition.id
    )
  );

  if (!Array.isArray(storedLayout)) {
    return resolvingWorldPlazaHudModeToolBoardDefaults(boardId);
  }

  const nextLayout: (DefiningWorldPlazaHudModeToolId | null)[] = Array.from(
    { length: DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_SLOT_COUNT },
    () => null
  );
  const placedToolIds = new Set<DefiningWorldPlazaHudModeToolId>();

  for (
    let slotIndex = 0;
    slotIndex < DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_SLOT_COUNT;
    slotIndex += 1
  ) {
    const rawToolId = storedLayout[slotIndex];

    if (typeof rawToolId !== 'string') {
      continue;
    }

    if (!allowedToolIds.has(rawToolId as DefiningWorldPlazaHudModeToolId)) {
      continue;
    }

    const toolId = rawToolId as DefiningWorldPlazaHudModeToolId;

    if (placedToolIds.has(toolId)) {
      continue;
    }

    nextLayout[slotIndex] = toolId;
    placedToolIds.add(toolId);
  }

  for (const toolDefinition of listingWorldPlazaHudModeToolsForBoard(boardId)) {
    if (placedToolIds.has(toolDefinition.id)) {
      continue;
    }

    const emptySlotIndex = nextLayout.findIndex((slot) => slot === null);

    if (emptySlotIndex < 0) {
      break;
    }

    nextLayout[emptySlotIndex] = toolDefinition.id;
    placedToolIds.add(toolDefinition.id);
  }

  return nextLayout;
}
