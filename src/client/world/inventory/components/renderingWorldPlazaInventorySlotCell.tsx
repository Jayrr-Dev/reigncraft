'use client';

/**
 * Parchment-themed inventory slot cells for the world plaza hotbar.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventorySlotCell
 */

import { LABELING_INVENTORY_DRAG_ITEM } from '@/components/inventory/domains/definingInventoryConstants';
import {
  definingInventoryItemDraggableId,
  definingInventorySlotDroppableId,
} from '@/components/inventory/domains/definingInventoryDndIds';
import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import type { RenderingInventorySlotCellProps } from '@/components/inventory/renderingInventorySlotCell';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import {
  STYLING_WORLD_PLAZA_INVENTORY_DRAG_OVERLAY_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ITEM_ICON_WRAPPER_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DRAG_SURFACE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_INVALID_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import type { DefiningWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStackQuantityLabel';
import { cn } from '@/lib/utils';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import type * as React from 'react';
import { useMemo } from 'react';

export type RenderingWorldPlazaInventorySlotCellProps =
  RenderingInventorySlotCellProps & {
    readonly isEquipped?: boolean;
    readonly onEquipSlot?: (slotIndex: number) => void;
    /** Double-click affordance for consuming food items directly from the hotbar. */
    readonly onDoubleClickSlot?: (slotIndex: number) => void;
  };

/** Props for {@link RenderingWorldPlazaInventoryDragOverlayItem}. */
export type RenderingWorldPlazaInventoryDragOverlayItemProps = {
  readonly item: DefiningInventoryItem;
  readonly registry: DefiningInventoryItemRegistry;
  /** Optional scale override when rendered outside the HUD provider (e.g. drag overlay portal). */
  readonly viewportHudScale?: number;
};

/**
 * Resolves inventory hotbar viewport styles from context or an explicit scale override.
 *
 * @param viewportHudScaleOverride - Optional scale when rendered outside the HUD provider
 */
function usingWorldPlazaInventoryHotbarViewportStylesResolved(
  viewportHudScaleOverride?: number
): DefiningWorldPlazaInventoryHotbarViewportStyles {
  const contextViewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const viewportHudScale = viewportHudScaleOverride ?? contextViewportHudScale;

  return useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale]
  );
}

function resolvingWorldPlazaInventorySlotClassName({
  isEmpty,
  isEquipped,
  showDropHighlight,
  isValidDrop,
}: {
  isEmpty: boolean;
  isEquipped: boolean;
  showDropHighlight: boolean;
  isValidDrop: boolean;
}): string {
  return cn(
    STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
    STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
    isEmpty && STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
    isEquipped && STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS,
    showDropHighlight &&
      isValidDrop &&
      STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS,
    showDropHighlight &&
      !isValidDrop &&
      STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_INVALID_CLASS
  );
}

/**
 * Renders one parchment-themed inventory slot for the plaza hotbar.
 */
export function RenderingWorldPlazaInventorySlotCell({
  slotIndex,
  item,
  registry,
  isDropTarget = false,
  isValidDrop = true,
  activeDragItemId = null,
  isEquipped = false,
  onEquipSlot,
  onDoubleClickSlot,
}: RenderingWorldPlazaInventorySlotCellProps): React.JSX.Element {
  const viewportStyles = usingWorldPlazaInventoryHotbarViewportStylesResolved();
  const droppableId = definingInventorySlotDroppableId(slotIndex);

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: droppableId,
  });

  const isDraggingThisItem = item !== null && activeDragItemId === item.id;
  const showDropHighlight = isDropTarget || isOver;
  const isEmpty = item === null;

  if (isEmpty) {
    return (
      <div
        ref={setDropRef}
        className={resolvingWorldPlazaInventorySlotClassName({
          isEmpty: true,
          isEquipped,
          showDropHighlight,
          isValidDrop,
        })}
        style={viewportStyles.slotStyle}
        aria-label={`Empty slot ${slotIndex + 1}`}
        onClick={() => {
          onEquipSlot?.(slotIndex);
        }}
      />
    );
  }

  return (
    <InventoryPlazaSlotItem
      item={item}
      registry={registry}
      setDropRef={setDropRef}
      isDraggingThisItem={isDraggingThisItem}
      showDropHighlight={showDropHighlight}
      isValidDrop={isValidDrop}
      viewportStyles={viewportStyles}
      isEquipped={isEquipped}
      onEquipSlot={onEquipSlot}
      onDoubleClickSlot={onDoubleClickSlot}
      slotIndex={slotIndex}
    />
  );
}

/** Internal draggable item within a plaza slot. */
type InventoryPlazaSlotItemProps = {
  readonly item: DefiningInventoryItem;
  readonly registry: DefiningInventoryItemRegistry;
  readonly setDropRef: (node: HTMLElement | null) => void;
  readonly isDraggingThisItem: boolean;
  readonly showDropHighlight: boolean;
  readonly isValidDrop: boolean;
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
  readonly isEquipped?: boolean;
  readonly onEquipSlot?: (slotIndex: number) => void;
  readonly onDoubleClickSlot?: (slotIndex: number) => void;
  readonly slotIndex: number;
};

function InventoryPlazaSlotItem({
  item,
  registry,
  setDropRef,
  isDraggingThisItem,
  showDropHighlight,
  isValidDrop,
  viewportStyles,
  isEquipped = false,
  onEquipSlot,
  onDoubleClickSlot,
  slotIndex,
}: InventoryPlazaSlotItemProps): React.JSX.Element {
  const draggableId = definingInventoryItemDraggableId(item.id);
  const typeDef = registry.resolvingItemType(item.itemTypeId);

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
      className={resolvingWorldPlazaInventorySlotClassName({
        isEmpty: false,
        isEquipped,
        showDropHighlight,
        isValidDrop,
      })}
      style={viewportStyles.slotStyle}
      onClick={() => {
        onEquipSlot?.(slotIndex);
      }}
      onDoubleClick={(event: React.MouseEvent) => {
        event.stopPropagation();
        onDoubleClickSlot?.(slotIndex);
      }}
    >
      <div
        ref={setDragRef}
        className={cn(
          STYLING_WORLD_PLAZA_INVENTORY_SLOT_DRAG_SURFACE_CLASS,
          isDraggingActive && 'pointer-events-none opacity-0'
        )}
        style={viewportStyles.dragSurfaceStyle}
        aria-label={LABELING_INVENTORY_DRAG_ITEM}
        title={typeDef?.tooltip ?? typeDef?.name ?? item.itemTypeId}
        {...attributes}
        {...listeners}
      >
        <RenderingWorldPlazaInventoryItemIcon
          item={item}
          registry={registry}
          viewportStyles={viewportStyles}
        />
      </div>
    </div>
  );
}

/** Shared item icon/emoji renderer for plaza inventory cells. */
function RenderingWorldPlazaInventoryItemIcon({
  item,
  registry,
  viewportStyles,
}: RenderingWorldPlazaInventoryDragOverlayItemProps & {
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
 * Parchment-themed drag overlay preview for a plaza inventory item.
 */
export function RenderingWorldPlazaInventoryDragOverlayItem({
  item,
  registry,
  viewportHudScale,
}: RenderingWorldPlazaInventoryDragOverlayItemProps): React.JSX.Element {
  const viewportStyles =
    usingWorldPlazaInventoryHotbarViewportStylesResolved(viewportHudScale);

  return (
    <div
      className={cn(
        STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
        STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
        STYLING_WORLD_PLAZA_INVENTORY_DRAG_OVERLAY_CLASS
      )}
      style={viewportStyles.slotStyle}
    >
      <div
        className={STYLING_WORLD_PLAZA_INVENTORY_SLOT_DRAG_SURFACE_CLASS}
        style={viewportStyles.dragSurfaceStyle}
      >
        <RenderingWorldPlazaInventoryItemIcon
          item={item}
          registry={registry}
          viewportStyles={viewportStyles}
        />
      </div>
    </div>
  );
}
