/**
 * dnd-kit id builders for HUD mode tool boards (separate from inventory ids).
 *
 * @module components/world/building/domains/definingWorldPlazaHudModeToolDndIds
 */

import type { DefiningWorldPlazaHudModeToolBoardId } from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';

/** Prefix for mode-board slot droppables. */
export const DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_SLOT_DROPPABLE_PREFIX =
  'hud-mode-tool-slot-' as const;

/** Prefix for mode-board tool draggables. */
export const DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_DRAGGABLE_PREFIX =
  'hud-mode-tool-item-' as const;

/**
 * Builds a droppable id for a board slot.
 *
 * @param boardId - Mode board
 * @param slotIndex - Zero-based slot index
 */
export function definingWorldPlazaHudModeToolSlotDroppableId(
  boardId: DefiningWorldPlazaHudModeToolBoardId,
  slotIndex: number
): string {
  return `${DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_SLOT_DROPPABLE_PREFIX}${boardId}-${slotIndex}`;
}

/**
 * Parses a mode-board slot droppable id.
 *
 * @param droppableId - dnd-kit over/active id
 */
export function parsingWorldPlazaHudModeToolSlotDroppableId(
  droppableId: string
): {
  readonly boardId: DefiningWorldPlazaHudModeToolBoardId;
  readonly slotIndex: number;
} | null {
  if (
    !droppableId.startsWith(
      DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_SLOT_DROPPABLE_PREFIX
    )
  ) {
    return null;
  }

  const remainder = droppableId.slice(
    DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_SLOT_DROPPABLE_PREFIX.length
  );
  const separatorIndex = remainder.lastIndexOf('-');

  if (separatorIndex <= 0) {
    return null;
  }

  const boardId = remainder.slice(0, separatorIndex);
  const slotIndex = Number.parseInt(remainder.slice(separatorIndex + 1), 10);

  if (
    (boardId !== 'craft' && boardId !== 'build' && boardId !== 'claim') ||
    Number.isNaN(slotIndex) ||
    slotIndex < 0
  ) {
    return null;
  }

  return {
    boardId,
    slotIndex,
  };
}

/**
 * Builds a draggable id for a mode-board tool instance on a board.
 *
 * @param boardId - Mode board
 * @param toolId - Tool id
 */
export function definingWorldPlazaHudModeToolDraggableId(
  boardId: DefiningWorldPlazaHudModeToolBoardId,
  toolId: string
): string {
  return `${DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_DRAGGABLE_PREFIX}${boardId}-${toolId}`;
}

/**
 * Parses a mode-board tool draggable id.
 *
 * @param draggableId - dnd-kit active id
 */
export function parsingWorldPlazaHudModeToolDraggableId(draggableId: string): {
  readonly boardId: DefiningWorldPlazaHudModeToolBoardId;
  readonly toolId: string;
} | null {
  if (
    !draggableId.startsWith(DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_DRAGGABLE_PREFIX)
  ) {
    return null;
  }

  const remainder = draggableId.slice(
    DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_DRAGGABLE_PREFIX.length
  );
  const separatorIndex = remainder.indexOf('-');

  if (separatorIndex <= 0) {
    return null;
  }

  const boardId = remainder.slice(0, separatorIndex);
  const toolId = remainder.slice(separatorIndex + 1);

  if (
    (boardId !== 'craft' && boardId !== 'build' && boardId !== 'claim') ||
    toolId.length === 0
  ) {
    return null;
  }

  return {
    boardId,
    toolId,
  };
}
