'use client';

/**
 * Hand-drawn inventory slot cells for the world plaza hotbar.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryRoughSlotCell
 */

import { LABELING_INVENTORY_DRAG_ITEM } from '@/components/inventory/domains/definingInventoryConstants';
import {
  definingInventoryItemDraggableId,
  definingInventorySlotDroppableId,
} from '@/components/inventory/domains/definingInventoryDndIds';
import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import type { RenderingInventorySlotCellProps } from '@/components/inventory/renderingInventorySlotCell';
import { RoughDiv } from '@/components/ui/rough-div';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_DROP_TARGET_SKETCH_COLORS,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_EMPTY_SLOT_FILL_OPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_EMPTY_SLOT_FILL_STYLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_EMPTY_SLOT_SKETCH_COLORS,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SKETCH_PROPS,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FILL_OPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FILL_STYLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_SKETCH_COLORS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_ITEM_ICON_WRAPPER_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_QUANTITY_BADGE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SHELL_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DRAG_SURFACE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DROP_INVALID_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DROP_VALID_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_EMOJI_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FALLBACK_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FOREGROUND_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_ICON_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_SIZE_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryRoughSketchConstants';
import type { DefiningWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { cn } from '@/lib/utils';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import type * as React from 'react';
import { useMemo } from 'react';

export interface RenderingWorldPlazaInventoryRoughSlotCellProps extends RenderingInventorySlotCellProps {
  readonly isEquipped?: boolean;
  readonly onEquipSlot?: (slotIndex: number) => void;
}

/** Props for {@link RenderingWorldPlazaInventoryRoughDragOverlayItem}. */
export interface RenderingWorldPlazaInventoryRoughDragOverlayItemProps {
  readonly item: DefiningInventoryItem;
  readonly registry: DefiningInventoryItemRegistry;
  /** Optional scale override when rendered outside the HUD provider (e.g. drag overlay portal). */
  readonly viewportHudScale?: number;
}

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

/**
 * Renders one hand-drawn inventory slot for the plaza hotbar.
 */
export function RenderingWorldPlazaInventoryRoughSlotCell({
  slotIndex,
  item,
  registry,
  isDropTarget = false,
  isValidDrop = true,
  activeDragItemId = null,
  isEquipped = false,
  onEquipSlot,
}: RenderingWorldPlazaInventoryRoughSlotCellProps): React.JSX.Element {
  const viewportStyles = usingWorldPlazaInventoryHotbarViewportStylesResolved();
  const droppableId = definingInventorySlotDroppableId(slotIndex);

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: droppableId,
  });

  const isDraggingThisItem = item !== null && activeDragItemId === item.id;
  const showDropHighlight = isDropTarget || isOver;
  const isEmpty = item === null;

  const slotSketchColors =
    showDropHighlight && isValidDrop
      ? DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_DROP_TARGET_SKETCH_COLORS
      : isEmpty
        ? DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_EMPTY_SLOT_SKETCH_COLORS
        : DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_SKETCH_COLORS;

  const slotFillStyle = isEmpty
    ? DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_EMPTY_SLOT_FILL_STYLE
    : DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FILL_STYLE;

  const slotFillOpacity = isEmpty
    ? DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_EMPTY_SLOT_FILL_OPACITY
    : DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FILL_OPACITY;

  const equippedRingClassName = isEquipped ? 'ring-2 ring-amber-300/90' : '';

  if (isEmpty) {
    return (
      <RoughDiv
        ref={setDropRef}
        variant="outline-solid"
        {...DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SKETCH_PROPS}
        fillStyle={slotFillStyle}
        fillOpacity={slotFillOpacity}
        sketchColors={slotSketchColors}
        className={cn(
          STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_SIZE_CLASS,
          STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SHELL_TEXT_CLASS,
          equippedRingClassName,
          showDropHighlight &&
            isValidDrop &&
            STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DROP_VALID_CLASS,
          showDropHighlight &&
            !isValidDrop &&
            STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DROP_INVALID_CLASS
        )}
        style={viewportStyles.slotStyle}
        aria-label={`Empty slot ${slotIndex + 1}`}
        onClick={() => {
          onEquipSlot?.(slotIndex);
        }}
      />
    );
  }

  return (
    <InventoryRoughSlotItem
      item={item}
      registry={registry}
      setDropRef={setDropRef}
      isDraggingThisItem={isDraggingThisItem}
      showDropHighlight={showDropHighlight}
      isValidDrop={isValidDrop}
      slotSketchColors={slotSketchColors}
      slotFillStyle={slotFillStyle}
      slotFillOpacity={slotFillOpacity}
      viewportStyles={viewportStyles}
      isEquipped={isEquipped}
      onEquipSlot={onEquipSlot}
      slotIndex={slotIndex}
    />
  );
}

/** Internal draggable item within a rough slot. */
interface InventoryRoughSlotItemProps {
  readonly item: DefiningInventoryItem;
  readonly registry: DefiningInventoryItemRegistry;
  readonly setDropRef: (node: HTMLElement | null) => void;
  readonly isDraggingThisItem: boolean;
  readonly showDropHighlight: boolean;
  readonly isValidDrop: boolean;
  readonly slotSketchColors: typeof DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_SKETCH_COLORS;
  readonly slotFillStyle: typeof DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FILL_STYLE;
  readonly slotFillOpacity: number;
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
  readonly isEquipped?: boolean;
  readonly onEquipSlot?: (slotIndex: number) => void;
  readonly slotIndex: number;
}

function InventoryRoughSlotItem({
  item,
  registry,
  setDropRef,
  isDraggingThisItem,
  showDropHighlight,
  isValidDrop,
  slotSketchColors,
  slotFillStyle,
  slotFillOpacity,
  viewportStyles,
  isEquipped = false,
  onEquipSlot,
  slotIndex,
}: InventoryRoughSlotItemProps): React.JSX.Element {
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
    <RoughDiv
      ref={setDropRef}
      variant="outline-solid"
      {...DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SKETCH_PROPS}
      fillStyle={slotFillStyle}
      fillOpacity={slotFillOpacity}
      sketchColors={slotSketchColors}
      className={cn(
        STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_SIZE_CLASS,
        STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SHELL_TEXT_CLASS,
        isEquipped && 'ring-2 ring-amber-300/90',
        showDropHighlight &&
          isValidDrop &&
          STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DROP_VALID_CLASS,
        showDropHighlight &&
          !isValidDrop &&
          STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DROP_INVALID_CLASS
      )}
      style={viewportStyles.slotStyle}
      onClick={() => {
        onEquipSlot?.(slotIndex);
      }}
    >
      <div
        ref={setDragRef}
        className={cn(
          STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DRAG_SURFACE_CLASS,
          isDraggingActive && 'pointer-events-none opacity-0'
        )}
        style={viewportStyles.dragSurfaceStyle}
        aria-label={LABELING_INVENTORY_DRAG_ITEM}
        title={typeDef?.tooltip ?? typeDef?.name ?? item.itemTypeId}
        {...attributes}
        {...listeners}
      >
        <RenderingWorldPlazaInventoryRoughItemIcon
          item={item}
          registry={registry}
          viewportStyles={viewportStyles}
        />
      </div>
    </RoughDiv>
  );
}

/** Shared item icon/emoji renderer for rough inventory cells. */
function RenderingWorldPlazaInventoryRoughItemIcon({
  item,
  registry,
  viewportStyles,
}: RenderingWorldPlazaInventoryRoughDragOverlayItemProps & {
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
}): React.JSX.Element {
  const typeDef = registry.resolvingItemType(item.itemTypeId);
  const Icon = typeDef?.Icon;

  return (
    <div
      className={STYLING_WORLD_PLAZA_INVENTORY_ROUGH_ITEM_ICON_WRAPPER_CLASS}
    >
      {Icon ? (
        <Icon
          className={cn(
            STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_ICON_CLASS,
            STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FOREGROUND_CLASS
          )}
          style={viewportStyles.iconStyle}
          aria-hidden
        />
      ) : typeDef?.iconEmoji ? (
        <span
          className={STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_EMOJI_CLASS}
          style={viewportStyles.emojiStyle}
          aria-hidden
        >
          {typeDef.iconEmoji}
        </span>
      ) : (
        <span
          className={cn(
            STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FALLBACK_TEXT_CLASS,
            STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FOREGROUND_CLASS
          )}
          style={viewportStyles.fallbackTextStyle}
        >
          ?
        </span>
      )}
      {item.quantity > 1 ? (
        <span
          className={STYLING_WORLD_PLAZA_INVENTORY_ROUGH_QUANTITY_BADGE_CLASS}
          style={viewportStyles.quantityBadgeStyle}
        >
          {item.quantity}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Hand-drawn drag overlay preview for a plaza inventory item.
 */
export function RenderingWorldPlazaInventoryRoughDragOverlayItem({
  item,
  registry,
  viewportHudScale,
}: RenderingWorldPlazaInventoryRoughDragOverlayItemProps): React.JSX.Element {
  const viewportStyles =
    usingWorldPlazaInventoryHotbarViewportStylesResolved(viewportHudScale);

  return (
    <RoughDiv
      variant="outline-solid"
      {...DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SKETCH_PROPS}
      fillStyle={DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FILL_STYLE}
      fillOpacity={DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FILL_OPACITY}
      sketchColors={DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_SKETCH_COLORS}
      className={cn(
        STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_SIZE_CLASS,
        STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SHELL_TEXT_CLASS,
        'pointer-events-none'
      )}
      style={viewportStyles.slotStyle}
    >
      <div
        className={STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DRAG_SURFACE_CLASS}
        style={viewportStyles.dragSurfaceStyle}
      >
        <RenderingWorldPlazaInventoryRoughItemIcon
          item={item}
          registry={registry}
          viewportStyles={viewportStyles}
        />
      </div>
    </RoughDiv>
  );
}
