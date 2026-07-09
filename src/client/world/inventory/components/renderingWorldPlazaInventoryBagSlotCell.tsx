'use client';

/**
 * Internal bag slot cell for the bag popover grid.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryBagSlotCell
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
import { definingWorldPlazaInventoryBagSlotDroppableId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagDndIds';
import {
  STYLING_WORLD_PLAZA_INVENTORY_ITEM_ICON_WRAPPER_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DRAG_SURFACE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_INVALID_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_FILL_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_FILL_OK_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_FILL_WORN_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_TRACK_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { formattingWorldPlazaInventoryItemDurabilityLabel } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryItemDurabilityLabel';
import type { DefiningWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryItemDescription } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDescription';
import { resolvingWorldPlazaInventoryItemDurability } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDurability';
import { resolvingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStackQuantityLabel';
import { cn } from '@/lib/utils';
import {
  useDndContext,
  useDraggable,
  useDroppable,
  type Active,
} from '@dnd-kit/core';
import type * as React from 'react';
import { useMemo } from 'react';

type DefiningWorldPlazaInventoryBagSlotDragData = {
  readonly itemId?: string;
  readonly itemTypeId?: string;
};

function resolvingWorldPlazaInventoryBagSlotDraggedItemTypeId(
  active: Active | null
): string | null {
  if (!active) {
    return null;
  }

  const dragData = active.data.current as
    | DefiningWorldPlazaInventoryBagSlotDragData
    | undefined;

  if (typeof dragData?.itemTypeId === 'string') {
    return dragData.itemTypeId;
  }

  return null;
}

export type RenderingWorldPlazaInventoryBagSlotCellProps = {
  readonly bagItemInstanceId: string;
  readonly bagSlotIndex: number;
  readonly item: DefiningInventoryItem | null;
  readonly registry: DefiningInventoryItemRegistry;
  readonly isDropTarget?: boolean;
  readonly isValidDrop?: boolean;
  readonly activeDragItemId?: string | null;
};

function resolvingWorldPlazaInventoryBagSlotClassName({
  isEmpty,
  showDropHighlight,
  isValidDrop,
}: {
  isEmpty: boolean;
  showDropHighlight: boolean;
  isValidDrop: boolean;
}): string {
  return cn(
    STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
    STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
    isEmpty && STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
    showDropHighlight &&
      isValidDrop &&
      STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS,
    showDropHighlight &&
      !isValidDrop &&
      STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_INVALID_CLASS
  );
}

function RenderingWorldPlazaInventoryBagSlotItemIcon({
  item,
  registry,
  viewportStyles,
}: {
  readonly item: DefiningInventoryItem;
  readonly registry: DefiningInventoryItemRegistry;
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
}): React.JSX.Element {
  return (
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
  );
}

/**
 * Renders one internal slot inside an open bag popover.
 */
export function RenderingWorldPlazaInventoryBagSlotCell({
  bagItemInstanceId,
  bagSlotIndex,
  item,
  registry,
  isDropTarget = false,
  isValidDrop: isValidDropOverride,
  activeDragItemId: activeDragItemIdOverride = null,
}: RenderingWorldPlazaInventoryBagSlotCellProps): React.JSX.Element {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const { active } = useDndContext();
  const activeDragItemId =
    activeDragItemIdOverride ??
    (active ? parsingInventoryItemDraggableId(String(active.id)) : null);
  const draggedItemTypeId =
    resolvingWorldPlazaInventoryBagSlotDraggedItemTypeId(active);
  const isValidDrop =
    isValidDropOverride ??
    (draggedItemTypeId === null
      ? true
      : checkingWorldPlazaInventoryBagSlotAcceptsItemTypeId(draggedItemTypeId));
  const viewportStyles = useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale]
  );
  const droppableId = definingWorldPlazaInventoryBagSlotDroppableId(
    bagItemInstanceId,
    bagSlotIndex
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

  const showDropHighlight = isDropTarget || isOver;

  if (isEmpty) {
    return (
      <div
        ref={setDropRef}
        className={resolvingWorldPlazaInventoryBagSlotClassName({
          isEmpty: true,
          showDropHighlight,
          isValidDrop,
        })}
        style={viewportStyles.slotStyle}
        aria-label={`Empty bag slot ${bagSlotIndex + 1}`}
      />
    );
  }

  const isDraggingThisItem = activeDragItemId === item.id;
  const typeDef = registry.resolvingItemType(item.itemTypeId);
  const durabilitySnapshot = resolvingWorldPlazaInventoryItemDurability(item);
  const durabilityLabel =
    formattingWorldPlazaInventoryItemDurabilityLabel(item);
  const slotTitle = [
    resolvingWorldPlazaInventoryItemDescription(item.itemTypeId, {
      fallbackName: typeDef?.name,
    }),
    durabilityLabel,
  ]
    .filter(Boolean)
    .join(' · ');

  const isDraggingActive = isDragging || isDraggingThisItem;

  return (
    <div
      ref={setDropRef}
      className={resolvingWorldPlazaInventoryBagSlotClassName({
        isEmpty: false,
        showDropHighlight,
        isValidDrop,
      })}
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
        title={slotTitle}
        {...attributes}
        {...listeners}
      >
        <RenderingWorldPlazaInventoryBagSlotItemIcon
          item={item}
          registry={registry}
          viewportStyles={viewportStyles}
        />
        {durabilitySnapshot ? (
          <span
            className={STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_TRACK_CLASS}
            aria-hidden
          >
            <span
              className={cn(
                STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_FILL_CLASS,
                durabilitySnapshot.remaining <= 0
                  ? STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_FILL_WORN_CLASS
                  : STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_FILL_OK_CLASS
              )}
              style={{
                width: `${Math.round(durabilitySnapshot.ratio * 100)}%`,
              }}
            />
          </span>
        ) : null}
      </div>
    </div>
  );
}
