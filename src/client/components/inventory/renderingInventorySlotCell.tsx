"use client";

import type { DefiningInventoryItem } from "@/components/inventory/domains/definingInventoryItem";
import type { DefiningInventoryItemRegistry } from "@/components/inventory/domains/definingInventoryItemRegistry";
import {
  LABELING_INVENTORY_DRAG_ITEM,
  STYLING_INVENTORY_DRAG_OVERLAY,
  STYLING_INVENTORY_ITEM_QUANTITY_BADGE,
  STYLING_INVENTORY_SLOT_CELL,
} from "@/components/inventory/domains/definingInventoryConstants";
import {
  definingInventoryItemDraggableId,
  definingInventorySlotDroppableId,
} from "@/components/inventory/domains/definingInventoryDndIds";
import { cn } from "@/lib/utils";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import type * as React from "react";

/** Props for {@link RenderingInventorySlotCell}. */
export interface RenderingInventorySlotCellProps {
  /** Zero-based slot index. */
  readonly slotIndex: number;
  /** Item in this slot, or null when empty. */
  readonly item: DefiningInventoryItem | null;
  /** Item type registry for icon resolution. */
  readonly registry: DefiningInventoryItemRegistry;
  /** Whether this slot is the current drop target. */
  readonly isDropTarget?: boolean;
  /** Whether dropping on this slot is valid. */
  readonly isValidDrop?: boolean;
  /** Id of the item currently being dragged. */
  readonly activeDragItemId?: string | null;
}

/**
 * Renders one inventory slot: empty droppable or draggable item.
 */
export function RenderingInventorySlotCell({
  slotIndex,
  item,
  registry,
  isDropTarget = false,
  isValidDrop = true,
  activeDragItemId = null,
}: RenderingInventorySlotCellProps): React.JSX.Element {
  const droppableId = definingInventorySlotDroppableId(slotIndex);

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: droppableId,
  });

  const isDraggingThisItem =
    item !== null && activeDragItemId === item.id;

  const showDropHighlight = isDropTarget || isOver;

  if (item === null) {
    return (
      <div
        ref={setDropRef}
        className={cn(
          STYLING_INVENTORY_SLOT_CELL,
          "border-dashed border-white/15 bg-black/25",
          showDropHighlight &&
            isValidDrop &&
            "border-primary/70 bg-primary/15 ring-1 ring-primary/40",
          showDropHighlight &&
            !isValidDrop &&
            "border-destructive/40 ring-1 ring-destructive/30",
        )}
        aria-label={`Empty slot ${slotIndex + 1}`}
      />
    );
  }

  return (
    <InventorySlotItem
      item={item}
      registry={registry}
      slotIndex={slotIndex}
      setDropRef={setDropRef}
      isDraggingThisItem={isDraggingThisItem}
      showDropHighlight={showDropHighlight}
      isValidDrop={isValidDrop}
    />
  );
}

/** Internal draggable item within a slot. */
interface InventorySlotItemProps {
  readonly item: DefiningInventoryItem;
  readonly registry: DefiningInventoryItemRegistry;
  readonly slotIndex: number;
  readonly setDropRef: (node: HTMLElement | null) => void;
  readonly isDraggingThisItem: boolean;
  readonly showDropHighlight: boolean;
  readonly isValidDrop: boolean;
}

function InventorySlotItem({
  item,
  registry,
  slotIndex,
  setDropRef,
  isDraggingThisItem,
  showDropHighlight,
  isValidDrop,
}: InventorySlotItemProps): React.JSX.Element {
  const draggableId = definingInventoryItemDraggableId(item.id);
  const typeDef = registry.resolvingItemType(item.itemTypeId);

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: draggableId,
    data: { slotIndex, itemId: item.id },
  });

  const isDraggingActive = isDragging || isDraggingThisItem;
  const Icon = typeDef?.Icon;

  return (
    <div
      ref={setDropRef}
      className={cn(
        STYLING_INVENTORY_SLOT_CELL,
        showDropHighlight &&
          isValidDrop &&
          "ring-1 ring-primary/40",
        showDropHighlight &&
          !isValidDrop &&
          "ring-1 ring-destructive/30",
      )}
    >
      <div
        ref={setDragRef}
        className={cn(
          "relative flex size-full touch-none items-center justify-center",
          isDraggingActive && "pointer-events-none opacity-0",
        )}
        aria-label={LABELING_INVENTORY_DRAG_ITEM}
        title={typeDef?.tooltip ?? typeDef?.name ?? item.itemTypeId}
        {...attributes}
        {...listeners}
      >
        {Icon ? (
          <Icon className="size-5 text-white/90" aria-hidden />
        ) : typeDef?.iconEmoji ? (
          <span className="text-lg leading-none" aria-hidden>
            {typeDef.iconEmoji}
          </span>
        ) : (
          <span className="text-[10px] font-medium text-white/60">?</span>
        )}
        {item.quantity > 1 ? (
          <span className={STYLING_INVENTORY_ITEM_QUANTITY_BADGE}>
            {item.quantity}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Props for the drag overlay item preview. */
export interface RenderingInventoryDragOverlayItemProps {
  readonly item: DefiningInventoryItem;
  readonly registry: DefiningInventoryItemRegistry;
}

/**
 * Drag overlay preview for an inventory item.
 */
export function RenderingInventoryDragOverlayItem({
  item,
  registry,
}: RenderingInventoryDragOverlayItemProps): React.JSX.Element {
  const typeDef = registry.resolvingItemType(item.itemTypeId);
  const Icon = typeDef?.Icon;

  return (
    <div
      className={cn(
        STYLING_INVENTORY_DRAG_OVERLAY,
        "flex size-10 items-center justify-center",
      )}
    >
      {Icon ? (
        <Icon className="size-5 text-white/90" aria-hidden />
      ) : typeDef?.iconEmoji ? (
        <span className="text-lg leading-none" aria-hidden>
          {typeDef.iconEmoji}
        </span>
      ) : (
        <span className="text-[10px] font-medium text-white/60">?</span>
      )}
      {item.quantity > 1 ? (
        <span className={STYLING_INVENTORY_ITEM_QUANTITY_BADGE}>
          {item.quantity}
        </span>
      ) : null}
    </div>
  );
}
