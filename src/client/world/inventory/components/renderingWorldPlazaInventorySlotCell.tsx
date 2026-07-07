'use client';

/**
 * Parchment-themed inventory slot cells for the world plaza hotbar.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventorySlotCell
 */

import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import type { RenderingInventorySlotCellProps } from '@/components/inventory/renderingInventorySlotCell';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { usingWorldPlazaGameplayHudControlledPopoverDismiss } from '@/components/world/hooks/usingWorldPlazaGameplayHudPopoverOpenState';
import { RenderingWorldPlazaInventoryBagPopover } from '@/components/world/inventory/components/renderingWorldPlazaInventoryBagPopover';
import { RenderingWorldPlazaInventoryItemDetailPopover } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemDetailPopover';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import {
  STYLING_WORLD_PLAZA_INVENTORY_ITEM_ICON_WRAPPER_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { formattingWorldPlazaInventoryItemDurabilityLabel } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryItemDurabilityLabel';
import type { DefiningWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryItemDetailPopoverModel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailPopoverModel';
import { resolvingWorldPlazaInventoryItemDurability } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDurability';
import { resolvingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStackQuantityLabel';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useCallback, useMemo, useRef } from 'react';

export type RenderingWorldPlazaInventorySlotCellProps =
  RenderingInventorySlotCellProps & {
    readonly isEquipped?: boolean;
    readonly onEquipSlot?: (slotIndex: number) => void;
    /** Opens the item action popover for this slot. */
    readonly onOpenItemDetailPopover?: (slotIndex: number) => void;
    readonly isItemDetailPopoverOpen?: boolean;
    readonly onCloseItemDetailPopover?: () => void;
    /** Eat action surfaced inside the item action popover for food. */
    readonly onEatHotbarSlot?: (slotIndex: number) => void;
    /** Drop action surfaced inside the item action popover. */
    readonly onDropHotbarSlot?: (slotIndex: number) => void;
    /** Active enchantment use from the item action popover. */
    readonly onUseActiveEnchantment?: (
      slotIndex: number,
      enchantmentId: string
    ) => void;
    /** Opens the bag storage popover for bag items. */
    readonly onOpenBagPopover?: (slotIndex: number) => void;
    readonly isBagPopoverOpen?: boolean;
    readonly onCloseBagPopover?: () => void;
  };

/** Props for {@link RenderingWorldPlazaInventoryItemIcon}. */
type RenderingWorldPlazaInventoryItemIconProps = {
  readonly item: DefiningInventoryItem;
  readonly registry: DefiningInventoryItemRegistry;
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
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
}: {
  isEmpty: boolean;
  isEquipped: boolean;
}): string {
  return cn(
    STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
    STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
    isEmpty && STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
    isEquipped && STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS
  );
}

/**
 * Renders one parchment-themed inventory slot for the plaza hotbar.
 */
export function RenderingWorldPlazaInventorySlotCell({
  slotIndex,
  item,
  registry,
  isEquipped = false,
  onEquipSlot,
  onOpenItemDetailPopover,
  isItemDetailPopoverOpen = false,
  onCloseItemDetailPopover,
  onEatHotbarSlot,
  onDropHotbarSlot,
  onUseActiveEnchantment,
  onOpenBagPopover,
  isBagPopoverOpen = false,
  onCloseBagPopover,
}: RenderingWorldPlazaInventorySlotCellProps): React.JSX.Element {
  const viewportStyles = usingWorldPlazaInventoryHotbarViewportStylesResolved();
  const isEmpty = item === null;

  if (isEmpty) {
    return (
      <div
        className={resolvingWorldPlazaInventorySlotClassName({
          isEmpty: true,
          isEquipped,
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
      viewportStyles={viewportStyles}
      isEquipped={isEquipped}
      onEquipSlot={onEquipSlot}
      onOpenItemDetailPopover={onOpenItemDetailPopover}
      isItemDetailPopoverOpen={isItemDetailPopoverOpen}
      onCloseItemDetailPopover={onCloseItemDetailPopover}
      onEatHotbarSlot={onEatHotbarSlot}
      onDropHotbarSlot={onDropHotbarSlot}
      onUseActiveEnchantment={onUseActiveEnchantment}
      onOpenBagPopover={onOpenBagPopover}
      isBagPopoverOpen={isBagPopoverOpen}
      onCloseBagPopover={onCloseBagPopover}
      slotIndex={slotIndex}
    />
  );
}

/** Internal item surface within a plaza slot. */
type InventoryPlazaSlotItemProps = {
  readonly item: DefiningInventoryItem;
  readonly registry: DefiningInventoryItemRegistry;
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
  readonly isEquipped?: boolean;
  readonly onEquipSlot?: (slotIndex: number) => void;
  readonly onOpenItemDetailPopover?: (slotIndex: number) => void;
  readonly isItemDetailPopoverOpen?: boolean;
  readonly onCloseItemDetailPopover?: () => void;
  readonly onEatHotbarSlot?: (slotIndex: number) => void;
  readonly onDropHotbarSlot?: (slotIndex: number) => void;
  readonly onUseActiveEnchantment?: (
    slotIndex: number,
    enchantmentId: string
  ) => void;
  readonly onOpenBagPopover?: (slotIndex: number) => void;
  readonly isBagPopoverOpen?: boolean;
  readonly onCloseBagPopover?: () => void;
  readonly slotIndex: number;
};

function InventoryPlazaSlotItem({
  item,
  registry,
  viewportStyles,
  isEquipped = false,
  onEquipSlot,
  onOpenItemDetailPopover,
  isItemDetailPopoverOpen = false,
  onCloseItemDetailPopover,
  onEatHotbarSlot,
  onDropHotbarSlot,
  onUseActiveEnchantment,
  onOpenBagPopover,
  isBagPopoverOpen = false,
  onCloseBagPopover,
  slotIndex,
}: InventoryPlazaSlotItemProps): React.JSX.Element {
  const slotContainerRef = useRef<HTMLDivElement>(null);
  const typeDef = registry.resolvingItemType(item.itemTypeId);
  const isBagItem = checkingWorldPlazaInventoryItemIsBag(item.itemTypeId);
  const detailPopoverModel = useMemo(
    () =>
      resolvingWorldPlazaInventoryItemDetailPopoverModel(item, {
        isEquipped,
      }),
    [isEquipped, item]
  );

  const closingItemDetailPopover = useCallback((): void => {
    onCloseItemDetailPopover?.();
  }, [onCloseItemDetailPopover]);

  usingWorldPlazaGameplayHudControlledPopoverDismiss(
    slotContainerRef,
    isItemDetailPopoverOpen,
    closingItemDetailPopover
  );

  const closingBagPopover = useCallback((): void => {
    onCloseBagPopover?.();
  }, [onCloseBagPopover]);

  usingWorldPlazaGameplayHudControlledPopoverDismiss(
    slotContainerRef,
    isBagPopoverOpen,
    closingBagPopover
  );

  const handlingEatFromDetailPopover = useCallback((): void => {
    onEatHotbarSlot?.(slotIndex);
    onCloseItemDetailPopover?.();
  }, [onCloseItemDetailPopover, onEatHotbarSlot, slotIndex]);

  const handlingDropFromDetailPopover = useCallback((): void => {
    onDropHotbarSlot?.(slotIndex);
    onCloseItemDetailPopover?.();
  }, [onCloseItemDetailPopover, onDropHotbarSlot, slotIndex]);

  const handlingEquipFromDetailPopover = useCallback((): void => {
    onEquipSlot?.(slotIndex);
    onCloseItemDetailPopover?.();
  }, [onCloseItemDetailPopover, onEquipSlot, slotIndex]);

  const handlingOpenBagFromDetailPopover = useCallback((): void => {
    onOpenBagPopover?.(slotIndex);
    onCloseItemDetailPopover?.();
  }, [onCloseItemDetailPopover, onOpenBagPopover, slotIndex]);

  const handlingUseActiveEnchantmentFromDetailPopover = useCallback(
    (enchantmentId: string): void => {
      onUseActiveEnchantment?.(slotIndex, enchantmentId);
    },
    [onUseActiveEnchantment, slotIndex]
  );

  const handlingSlotClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      event.stopPropagation();
      onOpenItemDetailPopover?.(slotIndex);
    },
    [onOpenItemDetailPopover, slotIndex]
  );

  const durabilitySnapshot = resolvingWorldPlazaInventoryItemDurability(item);
  const durabilityLabel =
    formattingWorldPlazaInventoryItemDurabilityLabel(item);
  const slotTitle = [
    typeDef?.tooltip ?? typeDef?.name ?? item.itemTypeId,
    durabilityLabel,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div
      ref={slotContainerRef}
      className={cn(
        'relative',
        resolvingWorldPlazaInventorySlotClassName({
          isEmpty: false,
          isEquipped,
        })
      )}
      style={viewportStyles.slotStyle}
    >
      <div
        className="absolute inset-0 flex cursor-pointer items-center justify-center"
        style={viewportStyles.dragSurfaceStyle}
        aria-label={slotTitle}
        title={slotTitle}
        role="button"
        tabIndex={0}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
        onClick={handlingSlotClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpenItemDetailPopover?.(slotIndex);
          }
        }}
      >
        <RenderingWorldPlazaInventoryItemIcon
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
      {isItemDetailPopoverOpen && detailPopoverModel ? (
        <RenderingWorldPlazaInventoryItemDetailPopover
          itemTypeId={item.itemTypeId}
          registry={registry}
          model={detailPopoverModel}
          onEquipItem={
            detailPopoverModel.canEquip && onEquipSlot
              ? handlingEquipFromDetailPopover
              : undefined
          }
          onOpenBag={
            detailPopoverModel.canOpenBag && onOpenBagPopover
              ? handlingOpenBagFromDetailPopover
              : undefined
          }
          onEatItem={
            detailPopoverModel.canEat && onEatHotbarSlot
              ? handlingEatFromDetailPopover
              : undefined
          }
          onDropItem={
            detailPopoverModel.canDrop && onDropHotbarSlot
              ? handlingDropFromDetailPopover
              : undefined
          }
          onUseActiveEnchantment={
            onUseActiveEnchantment
              ? handlingUseActiveEnchantmentFromDetailPopover
              : undefined
          }
        />
      ) : null}
      {isBagItem ? (
        <RenderingWorldPlazaInventoryBagPopover
          bagItem={item}
          registry={registry}
          isOpen={isBagPopoverOpen}
          onClose={() => {
            onCloseBagPopover?.();
          }}
        />
      ) : null}
    </div>
  );
}

/** Shared item icon/emoji renderer for plaza inventory cells. */
function RenderingWorldPlazaInventoryItemIcon({
  item,
  registry,
  viewportStyles,
}: RenderingWorldPlazaInventoryItemIconProps): React.JSX.Element {
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
