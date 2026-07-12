/**
 * Pure move/swap for HUD mode tool board slots.
 *
 * @module components/world/building/domains/applyingWorldPlazaHudModeToolBoardMove
 */

import type { DefiningWorldPlazaHudModeToolId } from '@/components/world/building/domains/definingWorldPlazaHudModeToolRegistry';
import type { DefiningWorldPlazaHudModeToolBoardLayout } from '@/components/world/building/domains/resolvingWorldPlazaHudModeToolBoardDefaults';

/**
 * Moves (or swaps) a tool from one board slot to another.
 *
 * @param layout - Current board layout
 * @param fromSlotIndex - Source slot
 * @param toSlotIndex - Destination slot
 */
export function applyingWorldPlazaHudModeToolBoardMove(
  layout: DefiningWorldPlazaHudModeToolBoardLayout,
  fromSlotIndex: number,
  toSlotIndex: number
): DefiningWorldPlazaHudModeToolBoardLayout {
  if (
    fromSlotIndex === toSlotIndex ||
    fromSlotIndex < 0 ||
    toSlotIndex < 0 ||
    fromSlotIndex >= layout.length ||
    toSlotIndex >= layout.length
  ) {
    return layout;
  }

  const movingToolId = layout[fromSlotIndex];

  if (movingToolId === null || movingToolId === undefined) {
    return layout;
  }

  const nextLayout: (DefiningWorldPlazaHudModeToolId | null)[] = [...layout];
  nextLayout[fromSlotIndex] = nextLayout[toSlotIndex] ?? null;
  nextLayout[toSlotIndex] = movingToolId;

  return nextLayout;
}
