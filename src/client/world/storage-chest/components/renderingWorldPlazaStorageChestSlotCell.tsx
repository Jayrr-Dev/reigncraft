'use client';

/**
 * One slot cell inside the storage chest 6×6 grid.
 *
 * @module components/world/storage-chest/components/renderingWorldPlazaStorageChestSlotCell
 */

import { LABELING_INVENTORY_DRAG_ITEM } from '@/components/inventory/domains/definingInventoryConstants';
import {
  definingInventoryItemDraggableId,
  parsingInventoryItemDraggableId,
} from '@/components/inventory/domains/definingInventoryDndIds';
import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { checkingWorldPlazaInventoryBagSlotAcceptsItemTypeId } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryBagSlotAcceptsItemTypeId';
import {
  STYLING_WORLD_PLAZA_INVENTORY_ITEM_ICON_WRAPPER_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DRAG_SURFACE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_INVALID_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryItemDescription } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDescription';
import { resolvingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStackQuantityLabel';
import { definingWorldPlazaStorageChestSlotDroppableId } from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestDndIds';
import { cn } from '@/lib/utils';
import {
  useDndContext,
  useDraggable,
  useDroppable,
  type Active,
} from '@dnd-kit/core';
import type * as React from 'react';
import { useMemo } from 'react';

function resolvingDraggedItemTypeId(active: Active | null): string | null {
  if (!active) {
    return null;
  }

  const dragData = active.data.current as
    | { readonly itemTypeId?: string }
    | undefined;

  return typeof dragData?.itemTypeId === 'string' ? dragData.itemTypeId : null;
}

export type RenderingWorldPlazaStorageChestSlotCellProps = {
  readonly blockId: string;
  readonly slotIndex: number;
  readonly item: DefiningInventoryItem | null;
  readonly registry: DefiningInventoryItemRegistry;
};

export function RenderingWorldPlazaStorageChestSlotCell({
  blockId,
  slotIndex,
  item,
  registry,
}: RenderingWorldPlazaStorageChestSlotCellProps): React.JSX.Element {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const { active } = useDndContext();
  const activeDragItemId = active
    ? parsingInventoryItemDraggableId(String(active.id))
    : null;
  const draggedItemTypeId = resolvingDraggedItemTypeId(active);
  const isValidDrop =
    draggedItemTypeId === null
      ? true
      : checkingWorldPlazaInventoryBagSlotAcceptsItemTypeId(draggedItemTypeId);
  const viewportStyles = useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale]
  );
  const droppableId = definingWorldPlazaStorageChestSlotDroppableId(
    blockId,
    slotIndex
  );
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: droppableId,
  });
  const isEmpty = item === null;
  const draggableId = isEmpty
    ? `${droppableId}-empty`
    : definingInventoryItemDraggableId(item.id);
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: draggableId,
    disabled: isEmpty,
    data: isEmpty
      ? undefined
      : { itemId: item.id, itemTypeId: item.itemTypeId },
  });

  const slotClassName = cn(
    STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
    STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
    isEmpty && STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
    isOver &&
      isValidDrop &&
      STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS,
    isOver &&
      !isValidDrop &&
      STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_INVALID_CLASS
  );

  if (isEmpty) {
    return (
      <div
        ref={setDropRef}
        className={slotClassName}
        style={viewportStyles.slotStyle}
        aria-label={`Empty chest slot ${slotIndex + 1}`}
      />
    );
  }

  const typeDef = registry.resolvingItemType(item.itemTypeId);
  const isDraggingActive = isDragging || activeDragItemId === item.id;

  return (
    <div
      ref={setDropRef}
      className={slotClassName}
      style={viewportStyles.slotStyle}
    >
      <div
        ref={setDragRef}
        className={cn(
          STYLING_WORLD_PLAZA_INVENTORY_SLOT_DRAG_SURFACE_CLASS,
          isDraggingActive && 'pointer-events-none opacity-0'
        )}
        style={{ ...viewportStyles.dragSurfaceStyle, touchAction: 'none' }}
        aria-label={LABELING_INVENTORY_DRAG_ITEM}
        title={resolvingWorldPlazaInventoryItemDescription(item.itemTypeId, {
          fallbackName: typeDef?.name,
        })}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
        {...attributes}
        {...listeners}
      >
        <div className={STYLING_WORLD_PLAZA_INVENTORY_ITEM_ICON_WRAPPER_CLASS}>
          <RenderingWorldPlazaInventoryItemGlyph
            itemTypeId={item.itemTypeId}
            registry={registry}
            iconStyle={viewportStyles.iconStyle}
            emojiStyle={viewportStyles.emojiStyle}
            fallbackTextStyle={viewportStyles.fallbackTextStyle}
          />
          {item.quantity > 1 ? (
            <span
              className={STYLING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_CLASS}
              style={viewportStyles.quantityBadgeStyle}
            >
              {resolvingWorldPlazaInventoryStackQuantityLabel(
                item.itemTypeId,
                item.quantity
              )}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
