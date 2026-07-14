'use client';

/**
 * Bottom-center inventory hotbar for the world plaza.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryHotbar
 */

import { parsingInventoryItemDraggableId } from '@/components/inventory/domains/definingInventoryDndIds';
import type {
  DefiningInventoryItem,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';
import { resolvingInventoryItemSlotIndex } from '@/components/inventory/domains/reducingInventoryState';
import { SortingInventory } from '@/components/inventory/sortingInventory';
import { showingReigncraftToast } from '@/components/ui/domains/showingReigncraftToast';
import { ProvidingWorldPlazaViewportHudScale } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import {
  parsingWorldPlazaOreSmeltingSlotDroppableId,
  type DefiningWorldPlazaOreSmeltingStationSlotKind,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingDndIds';
import type { DefiningWorldPlazaOreSmeltingStationState } from '@/components/world/crafting/hooks/usingWorldPlazaOreSmeltingStations';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles';
import {
  ProvidingWorldPlazaInventoryHotbarSlotInteractions,
  RenderingWorldPlazaInventoryHotbarSlotCell,
  usingWorldPlazaInventoryHotbarSlotInteractionsValue,
} from '@/components/world/inventory/components/providingWorldPlazaInventoryHotbarSlotInteractions';
import { RenderingWorldPlazaInventoryDragOverlayItem } from '@/components/world/inventory/components/renderingWorldPlazaInventoryDragOverlayItem';
import { RenderingWorldPlazaOreSmeltingPopover } from '@/components/world/inventory/components/renderingWorldPlazaOreSmeltingPopover';
import { RenderingWorldPlazaInventoryPageArrowButtons } from '@/components/world/inventory/components/renderingWorldPlazaInventoryPageArrowButtons';
import {
  resolvingWorldPlazaInventoryDraggedItemById,
  resolvingWorldPlazaInventoryDragLocationForItemId,
} from '@/components/world/inventory/domains/applyingWorldPlazaInventoryBagTransfer';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX,
  LABELING_WORLD_PLAZA_INVENTORY_HOTBAR,
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  STYLING_WORLD_PLAZA_INVENTORY_GRID_WRAPPER_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_STORAGE_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_LOADING_SHELL_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_LOADING_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_BODY_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { handlingWorldPlazaInventoryBagAwareDragEnd } from '@/components/world/inventory/domains/handlingWorldPlazaInventoryBagAwareDragEnd';
import { resolvingWorldPlazaInventoryBagHotbarSlotIndexFromOverId } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagHotbarSlotIndexFromOverId';
import { resolvingWorldPlazaInventoryHotbarDeviceScale } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarDeviceScale';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryRetainedDragSlotIndices } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryRetainedDragSlotIndices';
import { resolvingWorldPlazaInventoryVisibleSlotIndices } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStoragePage';
import type { TrackingWorldPlazaInventoryDropPlacementResult } from '@/components/world/inventory/hooks/trackingWorldPlazaInventoryDropPlacement';
import { usingWorldPlazaInventory } from '@/components/world/inventory/hooks/usingWorldPlazaInventory';
import { usingWorldPlazaInventoryStoragePageDragHover } from '@/components/world/inventory/hooks/usingWorldPlazaInventoryStoragePageDragHover';
import { cn } from '@/lib/utils';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import type * as React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export type RenderingWorldPlazaInventoryOreSmeltingStation = {
  readonly stationName: string;
  readonly stationBlockDefinitionId: string;
  readonly stationState: DefiningWorldPlazaOreSmeltingStationState;
  readonly progressRatio: number;
  readonly onClose: () => void;
  readonly onCollectOutput: () => void;
  readonly onDropInventorySlot: (
    inventorySlotIndex: number,
    slotKind: DefiningWorldPlazaOreSmeltingStationSlotKind
  ) => void;
};

/** Props for {@link RenderingWorldPlazaInventoryHotbar}. */
export interface RenderingWorldPlazaInventoryHotbarProps {
  /** Authenticated user id for online persistence. */
  readonly onlineUserId?: string | null;
  /** Offline session owner id for localStorage persistence. */
  readonly localPersistenceOwnerId?: string | null;
  /** Reddit user id for signed-in single-player cloud saves. */
  readonly redditUserId?: string | null;
  /** Active single-player save slot (1–3). */
  readonly saveSlotIndex?: PlazaSaveSlotIndex | null;
  /** Public username; applies the Kingpin founder test load when matched. */
  readonly onlineUsername?: string | null;
  /** Live HUD scale from the plaza viewport frame. */
  readonly viewportHudScale?: number;
  /** Mobile layout input (flank clearance); hotbar size matches fullscreen. */
  readonly isMobile?: boolean;
  /** True while the plaza host is in native fullscreen (mobile flank sizing). */
  readonly isFullscreen?: boolean;
  /** Optional click-to-ground placement controller from the plaza scene. */
  readonly inventoryDropPlacement?: Pick<
    TrackingWorldPlazaInventoryDropPlacementResult,
    'startingDropPlacementFromSlot' | 'cancellingDropPlacementMode'
  >;
  /** Selected hotbar slot for equipped tool actions. */
  readonly selectedSlotIndex?: number | null;
  /** Selects or toggles a hotbar slot as equipped. */
  readonly onSelectHotbarSlot?: (slotIndex: number) => void;
  /** Eat action from the item action popover for food slots. */
  readonly onEatHotbarSlot?: (slotIndex: number) => void;
  /** Study a flower specimen for the Herbarium (consumes one). */
  readonly onStudyHotbarSlot?: (slotIndex: number) => void;
  /** Attach cookbook recipe page from a hotbar/storage slot. */
  readonly onAttachRecipePageHotbarSlot?: (slotIndex: number) => void;
  /** Deposit ore into a reachable bloomery / kiln / stove. */
  readonly onRefineHotbarSlot?: (slotIndex: number) => void;
  /** Deposit wood or coal as fuel into a reachable smelting station. */
  readonly onAddFuelHotbarSlot?: (slotIndex: number) => void;
  /** Active enchantment use from the item action popover. */
  readonly onUseActiveEnchantment?: (
    slotIndex: number,
    enchantmentId: string
  ) => void;
  /** When true, skips the outer bottom-center anchor (parent stack owns it). */
  readonly isEmbeddedInHudToolbarStack?: boolean;
  /** Local player effective max HP for food heal preview in item detail. */
  readonly playerEffectiveMaxHealth?: number;
  /** Selected ore-smelting station rendered inside the inventory DnD context. */
  readonly oreSmeltingStation?: RenderingWorldPlazaInventoryOreSmeltingStation | null;
  /**
   * True when standing near a bloomery / kiln / stove (UI open also counts via
   * oreSmeltingStation). Gates Refine / Add Fuel action tower buttons.
   */
  readonly isNearOreSmeltingStation?: boolean;
}

type RenderingWorldPlazaInventoryHotbarInventoryShellProps = {
  readonly state: DefiningInventoryState;
  readonly isLoading: boolean;
  readonly viewportHudScale: number;
  readonly selectedSlotIndex: number | null;
  readonly storagePageIndex: number;
  readonly onStoragePageIndexChange: (nextPageIndex: number) => void;
  readonly onSelectHotbarSlot?: (slotIndex: number) => void;
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
  readonly openBagHotbarSlotIndex: number | null;
  readonly openItemDetailSlotIndex: number | null;
  readonly togglingItemActionPopover: (slotIndex: number) => void;
  readonly closingItemActionPopover: () => void;
  readonly openingBagPopover: (slotIndex: number) => void;
  readonly closingBagPopover: () => void;
  readonly onInventoryDragStart: (event: DragStartEvent) => void;
  readonly onInventoryDragEnd: (event: DragEndEvent) => void;
  readonly resolvingDraggedItemById: (
    itemId: string,
    inventoryState: DefiningInventoryState
  ) => DefiningInventoryItem | null;
  readonly playerEffectiveMaxHealth?: number;
  readonly oreSmeltingStation?: RenderingWorldPlazaInventoryOreSmeltingStation | null;
  readonly isOreSmeltingStationReachable?: boolean;
};

/**
 * Hotbar grid shell isolated from hunger HUD ticks so slot glyphs do not repaint.
 */
const RenderingWorldPlazaInventoryHotbarInventoryShell = memo(
  function RenderingWorldPlazaInventoryHotbarInventoryShell({
    state,
    isLoading,
    viewportHudScale,
    selectedSlotIndex,
    storagePageIndex,
    onStoragePageIndexChange,
    onSelectHotbarSlot,
    onEatHotbarSlot,
    onStudyHotbarSlot,
    onAttachRecipePageHotbarSlot,
    onDropHotbarSlot,
    onRefineHotbarSlot,
    onAddFuelHotbarSlot,
    onUseActiveEnchantment,
    openBagHotbarSlotIndex,
    openItemDetailSlotIndex,
    togglingItemActionPopover,
    closingItemActionPopover,
    openingBagPopover,
    closingBagPopover,
    onInventoryDragStart,
    onInventoryDragEnd,
    resolvingDraggedItemById,
    playerEffectiveMaxHealth,
    oreSmeltingStation,
    isOreSmeltingStationReachable = false,
  }: RenderingWorldPlazaInventoryHotbarInventoryShellProps): React.JSX.Element {
    const viewportStyles = useMemo(
      () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
      [viewportHudScale]
    );

    const visibleSlotIndices = useMemo(
      () => resolvingWorldPlazaInventoryVisibleSlotIndices(storagePageIndex),
      [storagePageIndex]
    );

    const [draggingFromSlotIndex, setDraggingFromSlotIndex] = useState<
      number | null
    >(null);

    const retainedSlotIndices = useMemo(
      () =>
        resolvingWorldPlazaInventoryRetainedDragSlotIndices(
          storagePageIndex,
          draggingFromSlotIndex
        ),
      [draggingFromSlotIndex, storagePageIndex]
    );

    const { onDragOver: onStoragePageDragOver, clearingDragHoverPaging } =
      usingWorldPlazaInventoryStoragePageDragHover({
        storagePageIndex,
        storagePageCount: DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT,
        onStoragePageIndexChange,
      });

    const handlingInventoryDragOver = useCallback(
      (event: DragOverEvent): void => {
        onStoragePageDragOver(event);

        const overId = event.over ? String(event.over.id) : null;

        if (overId === null) {
          return;
        }

        const activeItemId = parsingInventoryItemDraggableId(
          String(event.active.id)
        );
        const draggedItem =
          activeItemId !== null
            ? resolvingDraggedItemById(activeItemId, state)
            : null;

        if (
          draggedItem &&
          checkingWorldPlazaInventoryItemIsBag(draggedItem.itemTypeId)
        ) {
          return;
        }

        const bagHotbarSlotIndex =
          resolvingWorldPlazaInventoryBagHotbarSlotIndexFromOverId(
            overId,
            state,
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
          );

        if (
          bagHotbarSlotIndex !== null &&
          bagHotbarSlotIndex !== openBagHotbarSlotIndex
        ) {
          openingBagPopover(bagHotbarSlotIndex);
        }
      },
      [
        onStoragePageDragOver,
        openBagHotbarSlotIndex,
        openingBagPopover,
        resolvingDraggedItemById,
        state,
      ]
    );

    const handlingInventoryDragStartWithSourcePin = useCallback(
      (event: DragStartEvent): void => {
        const itemId = parsingInventoryItemDraggableId(String(event.active.id));
        const slotIndex =
          itemId !== null
            ? resolvingInventoryItemSlotIndex(state, itemId)
            : null;
        setDraggingFromSlotIndex(slotIndex);
        onInventoryDragStart(event);
      },
      [onInventoryDragStart, state]
    );

    const handlingInventoryDragCancel = useCallback((): void => {
      clearingDragHoverPaging();
      setDraggingFromSlotIndex(null);
    }, [clearingDragHoverPaging]);

    const handlingInventoryDragEndWithPagingClear = useCallback(
      (event: DragEndEvent): void => {
        clearingDragHoverPaging();
        onInventoryDragEnd(event);
        setDraggingFromSlotIndex(null);
      },
      [clearingDragHoverPaging, onInventoryDragEnd]
    );

    const slotInteractions =
      usingWorldPlazaInventoryHotbarSlotInteractionsValue({
        selectedSlotIndex,
        openItemDetailSlotIndex,
        openBagHotbarSlotIndex,
        onSelectHotbarSlot,
        onEatHotbarSlot,
        onStudyHotbarSlot,
        onAttachRecipePageHotbarSlot,
        onDropHotbarSlot,
        onRefineHotbarSlot,
        onAddFuelHotbarSlot,
        onUseActiveEnchantment,
        togglingItemActionPopover,
        closingItemActionPopover,
        openingBagPopover,
        closingBagPopover,
        playerEffectiveMaxHealth,
        isOreSmeltingStationReachable,
      });

    return (
      <ProvidingWorldPlazaInventoryHotbarSlotInteractions
        interactions={slotInteractions}
      >
        <div
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
          className={cn(
            STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
            storagePageIndex > 0 &&
              STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_STORAGE_CLASS_NAME,
            STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS
          )}
          style={viewportStyles.shellStyle}
        >
          {isLoading ? (
            <div
              className={STYLING_WORLD_PLAZA_INVENTORY_LOADING_SHELL_CLASS}
              style={viewportStyles.loadingShellStyle}
            >
              <span
                className={STYLING_WORLD_PLAZA_INVENTORY_LOADING_TEXT_CLASS}
                style={viewportStyles.loadingTextStyle}
              >
                Loading inventory...
              </span>
            </div>
          ) : (
            <SortingInventory
              state={state}
              registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
              onDragStart={handlingInventoryDragStartWithSourcePin}
              onDragOver={handlingInventoryDragOver}
              onDragEnd={handlingInventoryDragEndWithPagingClear}
              onDragCancel={handlingInventoryDragCancel}
              resolvingDraggedItemById={resolvingDraggedItemById}
              className={STYLING_WORLD_PLAZA_INVENTORY_GRID_WRAPPER_CLASS_NAME}
              gridStyle={viewportStyles.gridStyle}
              visibleSlotIndices={visibleSlotIndices}
              retainedSlotIndices={retainedSlotIndices}
              layoutClassName={
                STYLING_WORLD_PLAZA_INVENTORY_SHELL_BODY_CLASS_NAME
              }
              layoutStyle={viewportStyles.shellBodyStyle}
              trailingContent={
                <>
                  {oreSmeltingStation ? (
                    <RenderingWorldPlazaOreSmeltingPopover
                      stationName={oreSmeltingStation.stationName}
                      stationBlockDefinitionId={
                        oreSmeltingStation.stationBlockDefinitionId
                      }
                      stationState={oreSmeltingStation.stationState}
                      progressRatio={oreSmeltingStation.progressRatio}
                      onClose={oreSmeltingStation.onClose}
                      onCollectOutput={oreSmeltingStation.onCollectOutput}
                    />
                  ) : null}
                  <RenderingWorldPlazaInventoryPageArrowButtons
                    storagePageIndex={storagePageIndex}
                    storagePageCount={DEFINING_WORLD_PLAZA_INVENTORY_PAGE_COUNT}
                    viewportStyles={viewportStyles}
                    onStoragePageIndexChange={onStoragePageIndexChange}
                  />
                </>
              }
              SlotCellComponent={RenderingWorldPlazaInventoryHotbarSlotCell}
              DragOverlayItemComponent={
                RenderingWorldPlazaInventoryDragOverlayItem
              }
            />
          )}
        </div>
      </ProvidingWorldPlazaInventoryHotbarSlotInteractions>
    );
  }
);

/**
 * Bottom-center inventory hotbar overlay for the plaza viewport.
 */
export function RenderingWorldPlazaInventoryHotbar({
  onlineUserId = null,
  localPersistenceOwnerId = null,
  redditUserId = null,
  saveSlotIndex = null,
  onlineUsername = null,
  viewportHudScale = 1,
  isMobile = false,
  isFullscreen = false,
  inventoryDropPlacement,
  selectedSlotIndex = null,
  onSelectHotbarSlot: _onSelectHotbarSlot,
  onEatHotbarSlot,
  onStudyHotbarSlot,
  onAttachRecipePageHotbarSlot,
  onRefineHotbarSlot,
  onAddFuelHotbarSlot,
  onUseActiveEnchantment,
  isEmbeddedInHudToolbarStack = false,
  playerEffectiveMaxHealth,
  oreSmeltingStation = null,
  isNearOreSmeltingStation = false,
}: RenderingWorldPlazaInventoryHotbarProps): React.JSX.Element {
  const { state, isLoading, handleDragEnd, moveItem, removeItem, updateState } =
    usingWorldPlazaInventory({
      onlineUserId,
      localPersistenceOwnerId,
      redditUserId,
      saveSlotIndex,
      onlineUsername,
      seedDemoItems: false,
    });

  const [openBagHotbarSlotIndex, setOpenBagHotbarSlotIndex] = useState<
    number | null
  >(null);

  const [openItemDetailSlotIndex, setOpenItemDetailSlotIndex] = useState<
    number | null
  >(null);

  const [storagePageIndex, setStoragePageIndex] = useState(0);

  const handlingStoragePageIndexChange = useCallback(
    (nextPageIndex: number): void => {
      setStoragePageIndex(nextPageIndex);
      setOpenItemDetailSlotIndex(null);
      setOpenBagHotbarSlotIndex(null);
    },
    []
  );

  const closingItemActionPopover = useCallback((): void => {
    setOpenItemDetailSlotIndex(null);
  }, []);

  const inventoryDropPlacementRef = useRef(inventoryDropPlacement);
  inventoryDropPlacementRef.current = inventoryDropPlacement;

  const togglingItemActionPopover = useCallback((slotIndex: number): void => {
    inventoryDropPlacementRef.current?.cancellingDropPlacementMode();
    setOpenItemDetailSlotIndex((currentSlotIndex) =>
      currentSlotIndex === slotIndex ? null : slotIndex
    );
    setOpenBagHotbarSlotIndex(null);
  }, []);

  const openingBagPopover = useCallback((slotIndex: number): void => {
    setOpenBagHotbarSlotIndex(slotIndex);
    setOpenItemDetailSlotIndex(null);
  }, []);

  const closingBagPopover = useCallback((): void => {
    setOpenBagHotbarSlotIndex(null);
  }, []);

  const handlingInventoryDragStart = useCallback(
    (event: DragStartEvent): void => {
      inventoryDropPlacementRef.current?.cancellingDropPlacementMode();
      setOpenItemDetailSlotIndex(null);

      const itemId = parsingInventoryItemDraggableId(String(event.active.id));

      if (!itemId) {
        return;
      }

      const inventoryState = stateRef.current;
      const fromLocation = resolvingWorldPlazaInventoryDragLocationForItemId(
        inventoryState,
        itemId,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      );

      if (fromLocation?.kind !== 'hotbar') {
        return;
      }

      const draggedItem = inventoryState.slots[fromLocation.slotIndex];

      if (
        draggedItem &&
        checkingWorldPlazaInventoryItemIsBag(draggedItem.itemTypeId)
      ) {
        setOpenBagHotbarSlotIndex(null);
      }
    },
    []
  );

  const stateRef = useRef(state);
  stateRef.current = state;

  const handlingInventoryDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const inventoryState = stateRef.current;
      const smeltingSlotKind = event.over
        ? parsingWorldPlazaOreSmeltingSlotDroppableId(String(event.over.id))
        : null;

      if (smeltingSlotKind && oreSmeltingStation) {
        const itemId = parsingInventoryItemDraggableId(String(event.active.id));
        const fromLocation = itemId
          ? resolvingWorldPlazaInventoryDragLocationForItemId(
              inventoryState,
              itemId,
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
            )
          : null;

        if (fromLocation?.kind === 'hotbar') {
          oreSmeltingStation.onDropInventorySlot(
            fromLocation.slotIndex,
            smeltingSlotKind
          );
        }
        return;
      }

      const bagAwareResult = handlingWorldPlazaInventoryBagAwareDragEnd(
        event,
        inventoryState,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
        {
          moveItem,
          removeItem,
          updateState,
        }
      );

      if (bagAwareResult.kind === 'handled') {
        return;
      }

      if (bagAwareResult.kind === 'blocked-non-empty-bag-drop') {
        showingReigncraftToast('Empty your bag before dropping it.');
        return;
      }

      if (bagAwareResult.kind === 'hotbar-ground-drop') {
        const dropPlacement = inventoryDropPlacementRef.current;

        if (dropPlacement) {
          const didStart = dropPlacement.startingDropPlacementFromSlot(
            bagAwareResult.fromSlotIndex,
            inventoryState,
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
          );

          if (didStart) {
            setOpenItemDetailSlotIndex(null);
            setOpenBagHotbarSlotIndex(null);
          }

          return;
        }

        removeItem(bagAwareResult.fromSlotIndex);
        return;
      }

      handleDragEnd(event);
    },
    [handleDragEnd, moveItem, oreSmeltingStation, removeItem, updateState]
  );

  const resolvingDraggedItemById = useCallback(
    (itemId: string, inventoryState: DefiningInventoryState) =>
      resolvingWorldPlazaInventoryDraggedItemById(
        inventoryState,
        itemId,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      ),
    []
  );

  const handlingDropHotbarSlot = useCallback(
    (slotIndex: number): void => {
      if (!inventoryDropPlacement) {
        return;
      }

      const didStart = inventoryDropPlacement.startingDropPlacementFromSlot(
        slotIndex,
        state,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      );

      if (didStart) {
        setOpenItemDetailSlotIndex(null);
        setOpenBagHotbarSlotIndex(null);
      }
    },
    [inventoryDropPlacement, state]
  );

  const handlingEquipHotbarSlot = useCallback(
    (slotIndex: number): void => {
      if (slotIndex === DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX) {
        return;
      }

      moveItem(slotIndex, DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX);
      setOpenItemDetailSlotIndex(null);
      setOpenBagHotbarSlotIndex(null);
    },
    [moveItem]
  );

  useEffect(() => {
    if (openBagHotbarSlotIndex === null) {
      return;
    }

    const slotItem = state.slots[openBagHotbarSlotIndex];

    if (
      !slotItem ||
      !checkingWorldPlazaInventoryItemIsBag(slotItem.itemTypeId)
    ) {
      setOpenBagHotbarSlotIndex(null);
    }
  }, [openBagHotbarSlotIndex, state]);

  const hotbarViewportHudScale = useMemo(
    () =>
      viewportHudScale *
      resolvingWorldPlazaInventoryHotbarDeviceScale(isMobile),
    [viewportHudScale, isMobile]
  );

  const anchorViewportStyle = useMemo(
    () =>
      resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles(
        viewportHudScale,
        isMobile ? { isFullscreen } : undefined
      ),
    [viewportHudScale, isMobile, isFullscreen]
  );

  const inventoryHotbarBody = (
    <ProvidingWorldPlazaViewportHudScale
      viewportHudScale={hotbarViewportHudScale}
    >
      <div className="pointer-events-auto flex flex-col items-center">
        <RenderingWorldPlazaInventoryHotbarInventoryShell
          state={state}
          isLoading={isLoading}
          viewportHudScale={hotbarViewportHudScale}
          selectedSlotIndex={selectedSlotIndex}
          storagePageIndex={storagePageIndex}
          onStoragePageIndexChange={handlingStoragePageIndexChange}
          onSelectHotbarSlot={handlingEquipHotbarSlot}
          onEatHotbarSlot={onEatHotbarSlot}
          onStudyHotbarSlot={onStudyHotbarSlot}
          onAttachRecipePageHotbarSlot={onAttachRecipePageHotbarSlot}
          onDropHotbarSlot={handlingDropHotbarSlot}
          onRefineHotbarSlot={onRefineHotbarSlot}
          onAddFuelHotbarSlot={onAddFuelHotbarSlot}
          onUseActiveEnchantment={onUseActiveEnchantment}
          openBagHotbarSlotIndex={openBagHotbarSlotIndex}
          openItemDetailSlotIndex={openItemDetailSlotIndex}
          togglingItemActionPopover={togglingItemActionPopover}
          closingItemActionPopover={closingItemActionPopover}
          openingBagPopover={openingBagPopover}
          closingBagPopover={closingBagPopover}
          onInventoryDragStart={handlingInventoryDragStart}
          onInventoryDragEnd={handlingInventoryDragEnd}
          resolvingDraggedItemById={resolvingDraggedItemById}
          playerEffectiveMaxHealth={playerEffectiveMaxHealth}
          oreSmeltingStation={oreSmeltingStation}
          isOreSmeltingStationReachable={
            Boolean(oreSmeltingStation) || isNearOreSmeltingStation
          }
        />
      </div>
    </ProvidingWorldPlazaViewportHudScale>
  );

  if (isEmbeddedInHudToolbarStack) {
    return (
      <div aria-label={LABELING_WORLD_PLAZA_INVENTORY_HOTBAR}>
        {inventoryHotbarBody}
      </div>
    );
  }

  return (
    <div
      className={cn(
        STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME,
        STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS
      )}
      style={anchorViewportStyle}
      aria-label={LABELING_WORLD_PLAZA_INVENTORY_HOTBAR}
    >
      {inventoryHotbarBody}
    </div>
  );
}
