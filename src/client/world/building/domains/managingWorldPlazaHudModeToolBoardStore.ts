/**
 * Module store for Craft / Build / Claim mode-tool board layouts.
 *
 * @module components/world/building/domains/managingWorldPlazaHudModeToolBoardStore
 */

import { applyingWorldPlazaHudModeToolBoardMove } from '@/components/world/building/domains/applyingWorldPlazaHudModeToolBoardMove';
import {
  DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID,
  DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_STORAGE_KEY,
  type DefiningWorldPlazaHudModeToolBoardId,
} from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';
import { normalizingWorldPlazaHudModeToolBoardLayout } from '@/components/world/building/domains/normalizingWorldPlazaHudModeToolBoardLayout';
import {
  resolvingWorldPlazaHudModeToolBoardDefaults,
  type DefiningWorldPlazaHudModeToolBoardLayout,
} from '@/components/world/building/domains/resolvingWorldPlazaHudModeToolBoardDefaults';

type ManagingWorldPlazaHudModeToolBoardState = Record<
  DefiningWorldPlazaHudModeToolBoardId,
  DefiningWorldPlazaHudModeToolBoardLayout
>;

const ALL_BOARD_IDS = [
  DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CRAFT,
  DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.BUILD,
  DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CLAIM,
] as const;

function creatingDefaultBoardState(): ManagingWorldPlazaHudModeToolBoardState {
  return {
    [DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CRAFT]:
      resolvingWorldPlazaHudModeToolBoardDefaults(
        DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CRAFT
      ),
    [DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.BUILD]:
      resolvingWorldPlazaHudModeToolBoardDefaults(
        DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.BUILD
      ),
    [DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CLAIM]:
      resolvingWorldPlazaHudModeToolBoardDefaults(
        DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CLAIM
      ),
  };
}

const managingWorldPlazaHudModeToolBoardState: {
  boards: ManagingWorldPlazaHudModeToolBoardState;
  revision: number;
} = {
  boards: creatingDefaultBoardState(),
  revision: 0,
};

const managingWorldPlazaHudModeToolBoardSubscribers = new Set<() => void>();

function notifyingWorldPlazaHudModeToolBoardSubscribers(): void {
  managingWorldPlazaHudModeToolBoardState.revision += 1;

  for (const onStoreChange of managingWorldPlazaHudModeToolBoardSubscribers) {
    onStoreChange();
  }
}

function writingWorldPlazaHudModeToolBoardsToStorage(
  boards: ManagingWorldPlazaHudModeToolBoardState
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_STORAGE_KEY,
    JSON.stringify(boards)
  );
}

function readingWorldPlazaHudModeToolBoardsFromStorage(): ManagingWorldPlazaHudModeToolBoardState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_STORAGE_KEY
  );

  if (storedValue === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(storedValue);

    if (parsed === null || typeof parsed !== 'object') {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    const nextBoards = creatingDefaultBoardState();

    for (const boardId of ALL_BOARD_IDS) {
      nextBoards[boardId] = normalizingWorldPlazaHudModeToolBoardLayout(
        boardId,
        record[boardId]
      );
    }

    return nextBoards;
  } catch {
    return null;
  }
}

/**
 * Hydrates mode-tool boards from localStorage once on the client.
 */
export function initializingWorldPlazaHudModeToolBoardStoreFromStorage(): void {
  const storedBoards = readingWorldPlazaHudModeToolBoardsFromStorage();

  if (storedBoards === null) {
    return;
  }

  managingWorldPlazaHudModeToolBoardState.boards = storedBoards;
  notifyingWorldPlazaHudModeToolBoardSubscribers();
}

/**
 * Returns the layout for one mode board.
 *
 * @param boardId - Craft / Build / Claim board
 */
export function gettingWorldPlazaHudModeToolBoardLayout(
  boardId: DefiningWorldPlazaHudModeToolBoardId
): DefiningWorldPlazaHudModeToolBoardLayout {
  return managingWorldPlazaHudModeToolBoardState.boards[boardId];
}

/**
 * Moves a tool within one mode board and persists.
 *
 * @param boardId - Craft / Build / Claim board
 * @param fromSlotIndex - Source slot
 * @param toSlotIndex - Destination slot
 */
export function movingWorldPlazaHudModeToolOnBoard(
  boardId: DefiningWorldPlazaHudModeToolBoardId,
  fromSlotIndex: number,
  toSlotIndex: number
): void {
  const currentLayout = managingWorldPlazaHudModeToolBoardState.boards[boardId];
  const nextLayout = applyingWorldPlazaHudModeToolBoardMove(
    currentLayout,
    fromSlotIndex,
    toSlotIndex
  );

  if (nextLayout === currentLayout) {
    return;
  }

  managingWorldPlazaHudModeToolBoardState.boards = {
    ...managingWorldPlazaHudModeToolBoardState.boards,
    [boardId]: nextLayout,
  };
  writingWorldPlazaHudModeToolBoardsToStorage(
    managingWorldPlazaHudModeToolBoardState.boards
  );
  notifyingWorldPlazaHudModeToolBoardSubscribers();
}

/**
 * Subscribes to mode-tool board layout changes.
 *
 * @param onStoreChange - Callback when layouts change
 */
export function subscribingWorldPlazaHudModeToolBoard(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaHudModeToolBoardSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaHudModeToolBoardSubscribers.delete(onStoreChange);
  };
}

/**
 * Snapshot revision for useSyncExternalStore.
 */
export function gettingWorldPlazaHudModeToolBoardRevision(): number {
  return managingWorldPlazaHudModeToolBoardState.revision;
}
