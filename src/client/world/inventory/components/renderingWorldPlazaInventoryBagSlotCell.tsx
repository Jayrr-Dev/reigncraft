'use client';

/**
 * Internal bag slot cell for the bag popover grid.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryBagSlotCell
 */

import { LABELING_INVENTORY_DRAG_ITEM } from '@/components/inventory/domains/definingInventoryConstants';
import { definingInventoryItemDraggableId } from '@/components/inventory/domains/definingInventoryDndIds';
import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { definingWorldPlazaInventoryBagSlotDroppableId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagDndIds';
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
import { formattingWorldPlazaInventoryItemDurabilityLabel } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryItemDurabilityLabel';
import type { DefiningWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryItemDurability } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDurability';
import { resolvingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStackQuantityLabel';
import { cn } from '@/lib/utils';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import type * as React from 'react';
import { useMemo } from 'react';

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
  isValidDrop = true,
  activeDragItemId = null,
}: RenderingWorldPlazaInventoryBagSlotCellProps): React.JSX.Element {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
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
  const draggableId = definingInventoryItemDraggableId(item.id);
  const typeDef = registry.resolvingItemType(item.itemTypeId);
  const durabilitySnapshot = resolvingWorldPlazaInventoryItemDurability(item);
  const durabilityLabel =
    formattingWorldPlazaInventoryItemDurabilityLabel(item);
  const slotTitle = [
    typeDef?.tooltip ?? typeDef?.name ?? item.itemTypeId,
    durabilityLabel,
  ]
    .filter(Boolean)
    .join(' · ');

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: draggableId,
    data: { itemId: item.id },
  });

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
        style={viewportStyles.dragSurfaceStyle}
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
            className="pointer-events-none absolute inset-x-0.5 bottom-px block h-1 overflow-hidden rounded-full bg-black/35"
            aria-hidden
          >
            <span
              className={cn(
                'block h-full rounded-full',
                durabilitySnapshot.remaining <= 0
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
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
