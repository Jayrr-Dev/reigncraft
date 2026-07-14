'use client';

/**
 * Parchment-themed inventory slot cells for the world plaza hotbar.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventorySlotCell
 */

import { DEFINING_INVENTORY_DRAG_ACTIVATION_PX } from '@/components/inventory/domains/definingInventoryConstants';
import {
  definingInventoryItemDraggableId,
  definingInventorySlotDroppableId,
} from '@/components/inventory/domains/definingInventoryDndIds';
import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import type { RenderingInventorySlotCellProps } from '@/components/inventory/renderingInventorySlotCell';
import { Icon } from '@/components/ui/icon';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  gettingWorldPlazaBestiaryStudyCountsSnapshot,
  subscribingWorldPlazaBestiaryDiscovery,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import {
  gettingWorldPlazaHerbariumBerryStudyCountsSnapshot,
  gettingWorldPlazaHerbariumCloverStudyCountSnapshot,
  gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot,
  subscribingWorldPlazaHerbariumDiscovery,
} from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import {
  gettingWorldPlazaLapidaryOreStudyCountsSnapshot,
  subscribingWorldPlazaLapidaryDiscovery,
} from '@/components/world/domains/managingWorldPlazaLapidaryDiscoveryStore';
import { RenderingWorldPlazaInventoryBagPopover } from '@/components/world/inventory/components/renderingWorldPlazaInventoryBagPopover';
import { RenderingWorldPlazaInventoryItemDetailPopover } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemDetailPopover';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import {
  checkingWorldPlazaInventorySlotDoubleActivation,
  type CheckingWorldPlazaInventorySlotDoubleActivationPreviousTap,
} from '@/components/world/inventory/domains/checkingWorldPlazaInventorySlotDoubleActivation';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_ICON,
  DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_OPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_DATA_ATTRIBUTE,
  DEFINING_WORLD_PLAZA_INVENTORY_SLOT_SINGLE_CLICK_DEFER_MS,
  DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX,
  LABELING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_SLOT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  STYLING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_ICON_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_EMPTY_STORAGE_SLOT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_EMPTY_WEAPON_TOOL_SLOT_CLASS,
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
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_WEAPON_TOOL_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_STORAGE_ORDINAL_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { formattingWorldPlazaInventoryItemDurabilityLabel } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryItemDurabilityLabel';
import type { DefiningWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryItemDescription } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDescription';
import { resolvingWorldPlazaInventoryItemDetailPopoverModel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailPopoverModel';
import { resolvingWorldPlazaInventoryItemDurability } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDurability';
import { resolvingWorldPlazaInventorySlotDoubleActivationAction } from '@/components/world/inventory/domains/resolvingWorldPlazaInventorySlotDoubleActivationAction';
import { resolvingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStackQuantityLabel';
import { resolvingWorldPlazaInventoryStorageSlotOrdinal } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStorageSlotOrdinal';
import { cn } from '@/lib/utils';
import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import type * as React from 'react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type SyntheticEvent,
} from 'react';

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
    /** Study a flower specimen for the Herbarium (consumes one). */
    readonly onStudyHotbarSlot?: (slotIndex: number) => void;
    /** Attach a cookbook recipe page from inventory. */
    readonly onAttachRecipePageHotbarSlot?: (slotIndex: number) => void;
    /** Drop action surfaced inside the item action popover. */
    readonly onDropHotbarSlot?: (slotIndex: number) => void;
    /** Deposit ore into a reachable bloomery / kiln / stove. */
    readonly onRefineHotbarSlot?: (slotIndex: number) => void;
    /** Deposit wood or coal as fuel into a reachable smelting station. */
    readonly onAddFuelHotbarSlot?: (slotIndex: number) => void;
    /** Active enchantment use from the item action popover. */
    readonly onUseActiveEnchantment?: (
      slotIndex: number,
      enchantmentId: string
    ) => void;
    /** Opens the bag storage popover for bag items. */
    readonly onOpenBagPopover?: (slotIndex: number) => void;
    readonly isBagPopoverOpen?: boolean;
    readonly onCloseBagPopover?: () => void;
    /** Local player effective max HP for food heal preview. */
    readonly playerEffectiveMaxHealth?: number;
    /**
     * True when a bloomery / kiln / stove UI is open, or the player stands near
     * one. Gates Refine / Add Fuel in the item action tower.
     */
    readonly isOreSmeltingStationReachable?: boolean;
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
  isWeaponToolSlot,
}: {
  isEmpty: boolean;
  isEquipped: boolean;
  isWeaponToolSlot: boolean;
}): string {
  return cn(
    STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
    STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
    isEmpty && STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
    isWeaponToolSlot && STYLING_WORLD_PLAZA_INVENTORY_SLOT_WEAPON_TOOL_CLASS,
    isEquipped && STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS
  );
}

type DefiningWorldPlazaInventoryHotbarSlotDragData = {
  readonly slotIndex?: number;
  readonly itemTypeId?: string;
};

/**
 * Pure check: whether dropping a dragged item type onto a hotbar slot is allowed.
 */
function checkingWorldPlazaInventoryHotbarDropIsValid({
  slotIndex,
  slotItem,
  draggedItemTypeId,
  fromHotbarSlotIndex,
}: {
  readonly slotIndex: number;
  readonly slotItem: DefiningInventoryItem | null;
  readonly draggedItemTypeId: string | null;
  readonly fromHotbarSlotIndex: number | null;
}): boolean {
  if (draggedItemTypeId === null) {
    return true;
  }

  if (
    !checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
      slotIndex,
      draggedItemTypeId
    )
  ) {
    return false;
  }

  if (
    fromHotbarSlotIndex ===
      DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX &&
    slotItem !== null &&
    !checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
      DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX,
      slotItem.itemTypeId
    )
  ) {
    return false;
  }

  return true;
}

/**
 * Renders one parchment-themed inventory slot for the plaza hotbar.
 */
export function RenderingWorldPlazaInventorySlotCell({
  slotIndex,
  item,
  registry,
  isEquipped = false,
  isDropTarget = false,
  isValidDrop: isValidDropOverride,
  activeDragItemId = null,
  onEquipSlot,
  onOpenItemDetailPopover,
  isItemDetailPopoverOpen = false,
  onCloseItemDetailPopover,
  onEatHotbarSlot,
  onStudyHotbarSlot,
  onAttachRecipePageHotbarSlot,
  onDropHotbarSlot,
  onRefineHotbarSlot,
  onAddFuelHotbarSlot,
  onUseActiveEnchantment,
  onOpenBagPopover,
  isBagPopoverOpen = false,
  onCloseBagPopover,
  playerEffectiveMaxHealth,
  isOreSmeltingStationReachable = false,
}: RenderingWorldPlazaInventorySlotCellProps): React.JSX.Element {
  const viewportStyles = usingWorldPlazaInventoryHotbarViewportStylesResolved();
  const { active } = useDndContext();
  const isEmpty = item === null;
  const droppableId = definingInventorySlotDroppableId(slotIndex);
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: droppableId,
  });
  const showDropHighlight = isDropTarget || isOver;
  const dragData = active?.data.current as
    | DefiningWorldPlazaInventoryHotbarSlotDragData
    | undefined;
  const draggedItemTypeId =
    typeof dragData?.itemTypeId === 'string' ? dragData.itemTypeId : null;
  const fromHotbarSlotIndex =
    typeof dragData?.slotIndex === 'number' ? dragData.slotIndex : null;
  const isValidDrop =
    typeof isValidDropOverride === 'boolean'
      ? isValidDropOverride
      : checkingWorldPlazaInventoryHotbarDropIsValid({
          slotIndex,
          slotItem: item,
          draggedItemTypeId,
          fromHotbarSlotIndex,
        });
  const isReservedWeaponToolSlot =
    slotIndex === DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX;

  if (isEmpty) {
    const storageOrdinal =
      resolvingWorldPlazaInventoryStorageSlotOrdinal(slotIndex);

    return (
      <div
        ref={setDropRef}
        className={cn(
          resolvingWorldPlazaInventorySlotClassName({
            isEmpty: true,
            isEquipped,
            isWeaponToolSlot: isReservedWeaponToolSlot,
          }),
          isReservedWeaponToolSlot &&
            STYLING_WORLD_PLAZA_INVENTORY_EMPTY_WEAPON_TOOL_SLOT_CLASS,
          storageOrdinal !== null &&
            STYLING_WORLD_PLAZA_INVENTORY_EMPTY_STORAGE_SLOT_CLASS,
          showDropHighlight &&
            isValidDrop &&
            STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS,
          showDropHighlight &&
            !isValidDrop &&
            STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_INVALID_CLASS
        )}
        style={viewportStyles.slotStyle}
        aria-label={
          isReservedWeaponToolSlot
            ? LABELING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_SLOT
            : storageOrdinal !== null
              ? `Empty storage slot ${storageOrdinal}`
              : `Empty slot ${slotIndex + 1}`
        }
        onClick={() => {
          onEquipSlot?.(slotIndex);
        }}
      >
        {isReservedWeaponToolSlot ? (
          <Icon
            icon={DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_ICON}
            className={STYLING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_ICON_CLASS}
            style={{
              ...viewportStyles.emptyFistIconStyle,
              opacity: DEFINING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_OPACITY,
            }}
            aria-hidden
          />
        ) : storageOrdinal !== null ? (
          <span
            className={STYLING_WORLD_PLAZA_INVENTORY_STORAGE_ORDINAL_CLASS}
            style={viewportStyles.storageOrdinalStyle}
            aria-hidden
          >
            {storageOrdinal}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <InventoryPlazaSlotItem
      item={item}
      registry={registry}
      viewportStyles={viewportStyles}
      isEquipped={isEquipped}
      isDropTarget={isDropTarget}
      isValidDrop={isValidDrop}
      activeDragItemId={activeDragItemId}
      setDropRef={setDropRef}
      showDropHighlight={showDropHighlight}
      onEquipSlot={onEquipSlot}
      onOpenItemDetailPopover={onOpenItemDetailPopover}
      isItemDetailPopoverOpen={isItemDetailPopoverOpen}
      onCloseItemDetailPopover={onCloseItemDetailPopover}
      onEatHotbarSlot={onEatHotbarSlot}
      onStudyHotbarSlot={onStudyHotbarSlot}
      onAttachRecipePageHotbarSlot={onAttachRecipePageHotbarSlot}
      onDropHotbarSlot={onDropHotbarSlot}
      onRefineHotbarSlot={onRefineHotbarSlot}
      onAddFuelHotbarSlot={onAddFuelHotbarSlot}
      onUseActiveEnchantment={onUseActiveEnchantment}
      onOpenBagPopover={onOpenBagPopover}
      isBagPopoverOpen={isBagPopoverOpen}
      onCloseBagPopover={onCloseBagPopover}
      playerEffectiveMaxHealth={playerEffectiveMaxHealth}
      isOreSmeltingStationReachable={isOreSmeltingStationReachable}
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
  readonly isDropTarget?: boolean;
  readonly isValidDrop?: boolean;
  readonly activeDragItemId?: string | null;
  readonly setDropRef: (node: HTMLElement | null) => void;
  readonly showDropHighlight: boolean;
  readonly onEquipSlot?: (slotIndex: number) => void;
  readonly onOpenItemDetailPopover?: (slotIndex: number) => void;
  readonly isItemDetailPopoverOpen?: boolean;
  readonly onCloseItemDetailPopover?: () => void;
  readonly onEatHotbarSlot?: (slotIndex: number) => void;
  readonly onStudyHotbarSlot?: (slotIndex: number) => void;
  readonly onAttachRecipePageHotbarSlot?: (slotIndex: number) => void;
  readonly onDropHotbarSlot?: (slotIndex: number) => void;
  readonly onRefineHotbarSlot?: (slotIndex: number) => void;
  readonly onAddFuelHotbarSlot?: (slotIndex: number) => void;
  readonly onUseActiveEnchantment?: (
    slotIndex: number,
    enchantmentId: string
  ) => void;
  readonly onOpenBagPopover?: (slotIndex: number) => void;
  readonly isBagPopoverOpen?: boolean;
  readonly onCloseBagPopover?: () => void;
  readonly playerEffectiveMaxHealth?: number;
  readonly isOreSmeltingStationReachable?: boolean;
  readonly slotIndex: number;
};

function InventoryPlazaSlotItem({
  item,
  registry,
  viewportStyles,
  isEquipped = false,
  isValidDrop = true,
  activeDragItemId = null,
  setDropRef,
  showDropHighlight,
  onEquipSlot,
  onOpenItemDetailPopover,
  isItemDetailPopoverOpen = false,
  onCloseItemDetailPopover,
  onEatHotbarSlot,
  onStudyHotbarSlot,
  onAttachRecipePageHotbarSlot,
  onDropHotbarSlot,
  onRefineHotbarSlot,
  onAddFuelHotbarSlot,
  onUseActiveEnchantment,
  onOpenBagPopover,
  isBagPopoverOpen = false,
  onCloseBagPopover,
  playerEffectiveMaxHealth,
  isOreSmeltingStationReachable = false,
  slotIndex,
}: InventoryPlazaSlotItemProps): React.JSX.Element {
  const isReservedWeaponToolSlot =
    slotIndex === DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX;
  const typeDef = registry.resolvingItemType(item.itemTypeId);
  const isBagItem = checkingWorldPlazaInventoryItemIsBag(item.itemTypeId);
  const draggableId = definingInventoryItemDraggableId(item.id);
  const isDraggingThisItem = activeDragItemId === item.id;
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: draggableId,
    data: { slotIndex, itemId: item.id, itemTypeId: item.itemTypeId },
  });
  const { onPointerDown: dragPointerDown, ...dragListeners } = listeners ?? {};
  const isDraggingActive = isDragging || isDraggingThisItem;
  const slotPointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const previousTapRef =
    useRef<CheckingWorldPlazaInventorySlotDoubleActivationPreviousTap | null>(
      null
    );
  const deferredSingleClickTimeoutRef = useRef<number | null>(null);
  const dragActivationDistanceSq =
    DEFINING_INVENTORY_DRAG_ACTIVATION_PX *
    DEFINING_INVENTORY_DRAG_ACTIVATION_PX;
  const studyCountsBySpeciesId = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiaryStudyCountsSnapshot,
    () => ({})
  );
  const flowerStudyCountsBySpeciesId = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot,
    () => ({})
  );
  const cloverStudyCount = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumCloverStudyCountSnapshot,
    () => 0
  );
  const berryStudyCountsByLootKind = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumBerryStudyCountsSnapshot,
    () => ({})
  );
  const oreStudyCountsBySpeciesId = useSyncExternalStore(
    subscribingWorldPlazaLapidaryDiscovery,
    gettingWorldPlazaLapidaryOreStudyCountsSnapshot,
    () => ({})
  );
  const detailPopoverModel = useMemo(
    () =>
      resolvingWorldPlazaInventoryItemDetailPopoverModel(item, {
        isEquipped,
        studyCountsBySpeciesId,
        flowerStudyCountsBySpeciesId,
        cloverStudyCount,
        berryStudyCountsByLootKind,
        oreStudyCountsBySpeciesId,
        playerEffectiveMaxHealth,
        isOreSmeltingStationReachable,
      }),
    [
      berryStudyCountsByLootKind,
      cloverStudyCount,
      flowerStudyCountsBySpeciesId,
      isEquipped,
      isOreSmeltingStationReachable,
      item,
      oreStudyCountsBySpeciesId,
      playerEffectiveMaxHealth,
      studyCountsBySpeciesId,
    ]
  );

  const clearingDeferredSingleClick = useCallback((): void => {
    if (deferredSingleClickTimeoutRef.current !== null) {
      window.clearTimeout(deferredSingleClickTimeoutRef.current);
      deferredSingleClickTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearingDeferredSingleClick();
    };
  }, [clearingDeferredSingleClick]);

  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  const handlingEatFromDetailPopover = useCallback((): void => {
    onEatHotbarSlot?.(slotIndex);
    onCloseItemDetailPopover?.();
  }, [onCloseItemDetailPopover, onEatHotbarSlot, slotIndex]);

  const handlingStudyFromDetailPopover = useCallback((): void => {
    // Keep the action tower open so stacks can be studied with repeated clicks.
    onStudyHotbarSlot?.(slotIndex);
  }, [onStudyHotbarSlot, slotIndex]);

  const handlingAttachRecipePageFromDetailPopover = useCallback((): void => {
    onAttachRecipePageHotbarSlot?.(slotIndex);
    onCloseItemDetailPopover?.();
  }, [onAttachRecipePageHotbarSlot, onCloseItemDetailPopover, slotIndex]);

  const handlingDropFromDetailPopover = useCallback((): void => {
    onDropHotbarSlot?.(slotIndex);
    onCloseItemDetailPopover?.();
  }, [onCloseItemDetailPopover, onDropHotbarSlot, slotIndex]);

  const handlingRefineFromDetailPopover = useCallback((): void => {
    onRefineHotbarSlot?.(slotIndex);
    onCloseItemDetailPopover?.();
  }, [onCloseItemDetailPopover, onRefineHotbarSlot, slotIndex]);

  const handlingAddFuelFromDetailPopover = useCallback((): void => {
    onAddFuelHotbarSlot?.(slotIndex);
    onCloseItemDetailPopover?.();
  }, [onAddFuelHotbarSlot, onCloseItemDetailPopover, slotIndex]);

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

  const togglingItemDetailPopover = useCallback((): void => {
    onOpenItemDetailPopover?.(slotIndex);
  }, [onOpenItemDetailPopover, slotIndex]);

  const togglingBagPopover = useCallback((): void => {
    if (isBagPopoverOpen) {
      onCloseBagPopover?.();
    } else {
      onOpenBagPopover?.(slotIndex);
    }
    onCloseItemDetailPopover?.();
  }, [
    isBagPopoverOpen,
    onCloseBagPopover,
    onCloseItemDetailPopover,
    onOpenBagPopover,
    slotIndex,
  ]);

  const runningPrimarySlotAction = useCallback((): void => {
    const action = resolvingWorldPlazaInventorySlotDoubleActivationAction(
      item.itemTypeId,
      { isEquipped }
    );

    switch (action) {
      case 'eat':
        onEatHotbarSlot?.(slotIndex);
        onCloseItemDetailPopover?.();
        return;
      case 'attach-recipe-page':
        onAttachRecipePageHotbarSlot?.(slotIndex);
        onCloseItemDetailPopover?.();
        return;
      case 'equip':
        onEquipSlot?.(slotIndex);
        onCloseItemDetailPopover?.();
        return;
      case 'toggle-bag':
        togglingBagPopover();
        return;
      case 'open-detail':
        togglingItemDetailPopover();
        return;
    }
  }, [
    isEquipped,
    item.itemTypeId,
    onAttachRecipePageHotbarSlot,
    onCloseItemDetailPopover,
    onEatHotbarSlot,
    onEquipSlot,
    slotIndex,
    togglingBagPopover,
    togglingItemDetailPopover,
  ]);

  const schedulingSingleClickOpen = useCallback((): void => {
    if (isBagItem) {
      togglingBagPopover();
      return;
    }

    clearingDeferredSingleClick();
    deferredSingleClickTimeoutRef.current = window.setTimeout(() => {
      deferredSingleClickTimeoutRef.current = null;
      previousTapRef.current = null;
      togglingItemDetailPopover();
    }, DEFINING_WORLD_PLAZA_INVENTORY_SLOT_SINGLE_CLICK_DEFER_MS);
  }, [
    clearingDeferredSingleClick,
    isBagItem,
    togglingBagPopover,
    togglingItemDetailPopover,
  ]);

  const handlingSlotPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>): void => {
      slotPointerStartRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      dragPointerDown?.(event);
      event.stopPropagation();
    },
    [dragPointerDown]
  );

  const preventingSlotContextMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>): void => {
      event.preventDefault();
    },
    []
  );

  const handlingSlotContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (isBagPopoverOpen) {
        stoppingPlazaWalkPointerPropagation(event);
        onCloseBagPopover?.();
        return;
      }

      if (!isItemDetailPopoverOpen) {
        return;
      }

      stoppingPlazaWalkPointerPropagation(event);
      clearingDeferredSingleClick();
      previousTapRef.current = null;
      togglingItemDetailPopover();
    },
    [
      clearingDeferredSingleClick,
      isBagPopoverOpen,
      isItemDetailPopoverOpen,
      onCloseBagPopover,
      stoppingPlazaWalkPointerPropagation,
      togglingItemDetailPopover,
    ]
  );

  const handlingSlotButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      if (isItemDetailPopoverOpen) {
        return;
      }

      const pointerStart = slotPointerStartRef.current;
      slotPointerStartRef.current = null;

      if (pointerStart) {
        const deltaX = event.clientX - pointerStart.x;
        const deltaY = event.clientY - pointerStart.y;

        if (deltaX * deltaX + deltaY * deltaY > dragActivationDistanceSq) {
          return;
        }
      }

      stoppingPlazaWalkPointerPropagation(event);

      if (isBagPopoverOpen) {
        onCloseBagPopover?.();
        return;
      }

      const nowMs = performance.now();
      const clientPoint = {
        clientX: event.clientX,
        clientY: event.clientY,
      };
      const isDoubleActivation =
        checkingWorldPlazaInventorySlotDoubleActivation({
          eventDetail: event.detail,
          nowMs,
          clientPoint,
          slotIndex,
          previousTap: previousTapRef.current,
        });

      previousTapRef.current = {
        atMs: nowMs,
        clientPoint,
        slotIndex,
      };

      if (isDoubleActivation) {
        clearingDeferredSingleClick();
        previousTapRef.current = null;
        runningPrimarySlotAction();
        return;
      }

      // Defer popover open so a second tap/click can cancel and run the primary use.
      schedulingSingleClickOpen();
    },
    [
      clearingDeferredSingleClick,
      dragActivationDistanceSq,
      isBagPopoverOpen,
      isItemDetailPopoverOpen,
      onCloseBagPopover,
      runningPrimarySlotAction,
      schedulingSingleClickOpen,
      slotIndex,
      stoppingPlazaWalkPointerPropagation,
    ]
  );

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

  return (
    <div
      ref={setDropRef}
      className={cn(
        'relative overflow-visible',
        resolvingWorldPlazaInventorySlotClassName({
          isEmpty: false,
          isEquipped,
          isWeaponToolSlot: isReservedWeaponToolSlot,
        }),
        showDropHighlight &&
          isValidDrop &&
          STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS,
        showDropHighlight &&
          !isValidDrop &&
          STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_INVALID_CLASS
      )}
      style={viewportStyles.slotStyle}
      {...{ [DEFINING_WORLD_PLAZA_INVENTORY_SLOT_DATA_ATTRIBUTE]: slotIndex }}
      onClick={handlingSlotContainerClick}
    >
      <button
        ref={setDragRef}
        type="button"
        className={cn(
          STYLING_WORLD_PLAZA_INVENTORY_SLOT_DRAG_SURFACE_CLASS,
          'absolute inset-0 flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70',
          isDraggingActive && 'pointer-events-none opacity-0'
        )}
        style={{
          ...viewportStyles.dragSurfaceStyle,
          touchAction: 'none',
          pointerEvents: isItemDetailPopoverOpen ? 'none' : 'auto',
        }}
        aria-label={slotTitle}
        title={slotTitle}
        aria-expanded={isItemDetailPopoverOpen || isBagPopoverOpen}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
        {...attributes}
        {...dragListeners}
        aria-pressed={isItemDetailPopoverOpen}
        onPointerDown={handlingSlotPointerDown}
        onContextMenu={preventingSlotContextMenu}
        onClick={handlingSlotButtonClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (isBagPopoverOpen) {
              onCloseBagPopover?.();
              return;
            }
            if (isBagItem) {
              togglingBagPopover();
              return;
            }
            togglingItemDetailPopover();
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
            className={
              STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_TRACK_CLASS
            }
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
      </button>
      {isItemDetailPopoverOpen && detailPopoverModel ? (
        <RenderingWorldPlazaInventoryItemDetailPopover
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
          onStudyItem={
            detailPopoverModel.canStudy && onStudyHotbarSlot
              ? handlingStudyFromDetailPopover
              : undefined
          }
          onAttachRecipePage={
            detailPopoverModel.canAttachRecipePage &&
            onAttachRecipePageHotbarSlot
              ? handlingAttachRecipePageFromDetailPopover
              : undefined
          }
          onRefineItem={
            detailPopoverModel.canRefine && onRefineHotbarSlot
              ? handlingRefineFromDetailPopover
              : undefined
          }
          onAddFuelItem={
            detailPopoverModel.canAddFuel && onAddFuelHotbarSlot
              ? handlingAddFuelFromDetailPopover
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
          isEquipped={isEquipped}
          playerEffectiveMaxHealth={playerEffectiveMaxHealth}
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
