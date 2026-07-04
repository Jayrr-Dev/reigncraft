'use client';

import { DEFINING_INVENTORY_DRAG_ACTIVATION_PX } from '@/components/inventory/domains/definingInventoryConstants';
import { parsingInventoryItemDraggableId } from '@/components/inventory/domains/definingInventoryDndIds';
import type {
  DefiningInventoryItem,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import {
  lockingInventoryDragPageScroll,
  unlockingInventoryDragPageScroll,
} from '@/components/inventory/domains/lockingInventoryDragPageScroll';
import { modifyingInventorySnapCenterToCursor } from '@/components/inventory/domains/modifyingInventoryDragOverlay';
import { resolvingInventoryItemSlotIndex } from '@/components/inventory/domains/reducingInventoryState';
import { RenderingInventoryGrid } from '@/components/inventory/renderingInventoryGrid';
import type { RenderingInventorySlotCellProps } from '@/components/inventory/renderingInventorySlotCell';
import {
  RenderingInventoryDragOverlayItem,
  type RenderingInventoryDragOverlayItemProps,
} from '@/components/inventory/renderingInventorySlotCell';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import type * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

/** Props for {@link SortingInventory}. */
export interface SortingInventoryProps {
  /** Current inventory state. */
  readonly state: DefiningInventoryState;
  /** Item type registry. */
  readonly registry: DefiningInventoryItemRegistry;
  /** Called when a drag ends (move, swap, or drop-out). */
  readonly onDragEnd: (event: DragEndEvent) => void;
  /** Optional drag lifecycle hooks for world placement overlays. */
  readonly onDragStart?: (event: DragStartEvent) => void;
  readonly onDragMove?: (event: DragMoveEvent) => void;
  readonly onDragPointerMove?: (clientX: number, clientY: number) => void;
  readonly onDragCancel?: () => void;
  /** Optional wrapper class name. */
  readonly className?: string;
  /** Optional grid inline styles. */
  readonly gridStyle?: React.CSSProperties;
  /** Optional slot cell renderer for themed surfaces. */
  readonly SlotCellComponent?: React.ComponentType<RenderingInventorySlotCellProps>;
  /** Optional drag overlay renderer for themed surfaces. */
  readonly DragOverlayItemComponent?: React.ComponentType<RenderingInventoryDragOverlayItemProps>;
}

/**
 * Inventory shell with DndContext, grid, and drag overlay.
 */
export function SortingInventory({
  state,
  registry,
  onDragEnd,
  onDragStart,
  onDragMove,
  onDragPointerMove,
  onDragCancel,
  className,
  gridStyle,
  SlotCellComponent,
  DragOverlayItemComponent = RenderingInventoryDragOverlayItem,
}: SortingInventoryProps): React.JSX.Element {
  const [activeItem, setActiveItem] = useState<DefiningInventoryItem | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DEFINING_INVENTORY_DRAG_ACTIVATION_PX,
      },
    })
  );

  const handlingDragStart = useCallback(
    (event: DragStartEvent): void => {
      const itemId = parsingInventoryItemDraggableId(String(event.active.id));

      if (!itemId) {
        setActiveItem(null);
        return;
      }

      lockingInventoryDragPageScroll();

      const slotIndex = resolvingInventoryItemSlotIndex(state, itemId);
      const item = slotIndex !== null ? (state.slots[slotIndex] ?? null) : null;

      if (!item) {
        unlockingInventoryDragPageScroll();
        setActiveItem(null);
        return;
      }

      setActiveItem(item);
      onDragStart?.(event);
    },
    [onDragStart, state]
  );

  const handlingDragMove = useCallback(
    (event: DragMoveEvent): void => {
      onDragMove?.(event);
    },
    [onDragMove]
  );

  const handlingDragEnd = useCallback(
    (event: DragEndEvent): void => {
      unlockingInventoryDragPageScroll();
      setActiveItem(null);
      onDragEnd(event);
    },
    [onDragEnd]
  );

  const handlingDragCancel = useCallback((): void => {
    unlockingInventoryDragPageScroll();
    setActiveItem(null);
    onDragCancel?.();
  }, [onDragCancel]);

  useEffect(() => {
    if (!activeItem || !onDragPointerMove) {
      return;
    }

    const trackingPointerMove = (event: PointerEvent): void => {
      onDragPointerMove(event.clientX, event.clientY);
    };

    window.addEventListener('pointermove', trackingPointerMove);

    return () => {
      window.removeEventListener('pointermove', trackingPointerMove);
    };
  }, [activeItem, onDragPointerMove]);

  useEffect(() => {
    return () => {
      if (activeItem) {
        unlockingInventoryDragPageScroll();
      }
    };
  }, [activeItem]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      autoScroll={false}
      onDragStart={handlingDragStart}
      onDragMove={handlingDragMove}
      onDragEnd={handlingDragEnd}
      onDragCancel={handlingDragCancel}
    >
      <RenderingInventoryGrid
        state={state}
        registry={registry}
        activeDragItemId={activeItem?.id ?? null}
        className={className}
        style={gridStyle}
        SlotCellComponent={SlotCellComponent}
      />
      <DragOverlay
        modifiers={[modifyingInventorySnapCenterToCursor]}
        // Keep the overlay wrapper transparent to hit-testing so
        // document.elementFromPoint during a drag resolves the world
        // tile underneath instead of the overlay itself.
        style={{ pointerEvents: 'none' }}
      >
        {activeItem ? (
          <DragOverlayItemComponent item={activeItem} registry={registry} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
