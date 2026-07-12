/**
 * React hook for one HUD mode tool board layout + move helper.
 *
 * @module components/world/building/hooks/usingWorldPlazaHudModeToolBoard
 */

import type { DefiningWorldPlazaHudModeToolBoardId } from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';
import {
  gettingWorldPlazaHudModeToolBoardLayout,
  gettingWorldPlazaHudModeToolBoardRevision,
  initializingWorldPlazaHudModeToolBoardStoreFromStorage,
  movingWorldPlazaHudModeToolOnBoard,
  subscribingWorldPlazaHudModeToolBoard,
} from '@/components/world/building/domains/managingWorldPlazaHudModeToolBoardStore';
import type { DefiningWorldPlazaHudModeToolBoardLayout } from '@/components/world/building/domains/resolvingWorldPlazaHudModeToolBoardDefaults';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

let didInitializeWorldPlazaHudModeToolBoardStore = false;

export type UsingWorldPlazaHudModeToolBoardResult = {
  readonly layout: DefiningWorldPlazaHudModeToolBoardLayout;
  readonly movingTool: (fromSlotIndex: number, toSlotIndex: number) => void;
};

/**
 * Subscribes to one mode-tool board and exposes move.
 *
 * @param boardId - Craft / Build / Claim board
 */
export function usingWorldPlazaHudModeToolBoard(
  boardId: DefiningWorldPlazaHudModeToolBoardId
): UsingWorldPlazaHudModeToolBoardResult {
  useLayoutEffect(() => {
    if (didInitializeWorldPlazaHudModeToolBoardStore) {
      return;
    }

    didInitializeWorldPlazaHudModeToolBoardStore = true;
    initializingWorldPlazaHudModeToolBoardStoreFromStorage();
  }, []);

  useSyncExternalStore(
    subscribingWorldPlazaHudModeToolBoard,
    gettingWorldPlazaHudModeToolBoardRevision,
    () => 0
  );

  const layout = gettingWorldPlazaHudModeToolBoardLayout(boardId);

  const movingTool = useCallback(
    (fromSlotIndex: number, toSlotIndex: number): void => {
      movingWorldPlazaHudModeToolOnBoard(boardId, fromSlotIndex, toSlotIndex);
    },
    [boardId]
  );

  return {
    layout,
    movingTool,
  };
}
