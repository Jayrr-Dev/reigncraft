'use client';

import { STYLING_INVENTORY_GRID_WRAPPER } from '@/components/inventory/domains/definingInventoryConstants';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import type { RenderingInventorySlotCellProps } from '@/components/inventory/renderingInventorySlotCell';
import { RenderingInventorySlotCell } from '@/components/inventory/renderingInventorySlotCell';
import { cn } from '@/lib/utils';
import type * as React from 'react';

/** Props for {@link RenderingInventoryGrid}. */
export interface RenderingInventoryGridProps {
  /** Current inventory state. */
  readonly state: DefiningInventoryState;
  /** Item type registry. */
  readonly registry: DefiningInventoryItemRegistry;
  /** Id of the item currently being dragged. */
  readonly activeDragItemId?: string | null;
  /** Slot index currently highlighted as drop target. */
  readonly dropTargetSlotIndex?: number | null;
  /** Optional wrapper class name. */
  readonly className?: string;
  /** Optional wrapper inline styles. */
  readonly style?: React.CSSProperties;
  /** Optional slot cell renderer (theming). */
  readonly SlotCellComponent?: React.ComponentType<RenderingInventorySlotCellProps>;
  /**
   * Optional subset of slot indices to render (e.g. main row + one storage page).
   * Defaults to every slot in state order.
   */
  readonly visibleSlotIndices?: readonly number[];
}

/**
 * Presentational grid of inventory slots (single row by default).
 */
export function RenderingInventoryGrid({
  state,
  registry,
  activeDragItemId = null,
  dropTargetSlotIndex = null,
  className,
  style,
  SlotCellComponent = RenderingInventorySlotCell,
  visibleSlotIndices,
}: RenderingInventoryGridProps): React.JSX.Element {
  const slotIndices =
    visibleSlotIndices ?? state.slots.map((_, slotIndex) => slotIndex);

  return (
    <div
      className={cn(STYLING_INVENTORY_GRID_WRAPPER, className)}
      style={style}
      role="list"
      aria-label="Inventory slots"
    >
      {slotIndices.map((slotIndex) => {
        if (slotIndex < 0 || slotIndex >= state.slots.length) {
          return null;
        }

        const item = state.slots[slotIndex] ?? null;

        return (
          <SlotCellComponent
            key={slotIndex}
            slotIndex={slotIndex}
            item={item}
            registry={registry}
            activeDragItemId={activeDragItemId}
            isDropTarget={dropTargetSlotIndex === slotIndex}
            isValidDrop
          />
        );
      })}
    </div>
  );
}
