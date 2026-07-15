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
import { RenderingWorldPlazaInventoryPageArrowButtons } from '@/components/world/inventory/components/renderingWorldPlazaInventoryPageArrowButtons';
import { RenderingWorldPlazaOreSmeltingPopover } from '@/components/world/inventory/components/renderingWorldPlazaOreSmeltingPopover';
import {
  resolvingWorldPlazaInventoryDraggedItemById,
  resolvingWorldPlazaInventoryDragLocationForItemId,
} from '@/components/world/inventory/domains/applyingWorldPlazaInventoryBagTransfer';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX,
  LABELING_WORLD_PLAZA_INVENTORY_HOTBAR,
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
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
import {
  gettingWorldPlazaInventoryBonusStorageRows,
  subscribingWorldPlazaInventoryStorageExpansion,
} from '@/components/world/inventory/domains/managingWorldPlazaInventoryStorageExpansionStore';
import { resolvingWorldPlazaInventoryBagHotbarSlotIndexFromOverId } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagHotbarSlotIndexFromOverId';
import { resolvingWorldPlazaInventoryPageCount } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryCapacity';
import { resolvingWorldPlazaInventoryDropLocationFromOverId } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryDropLocationFromOverId';
import { resolvingWorldPlazaInventoryHotbarDeviceScale } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarDeviceScale';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryRetainedDragSlotIndices } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryRetainedDragSlotIndices';
import { resolvingWorldPlazaInventoryVisibleSlotIndices } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStoragePage';
import type { TrackingWorldPlazaInventoryDropPlacementResult } from '@/components/world/inventory/hooks/trackingWorldPlazaInventoryDropPlacement';
import { usingWorldPlazaInventory } from '@/components/world/inventory/hooks/usingWorldPlazaInventory';
import { usingWorldPlazaInventoryStoragePageDragHover } from '@/components/world/inventory/hooks/usingWorldPlazaInventoryStoragePageDragHover';
import { usingWorldPlazaInventoryStoragePageWheel } from '@/components/world/inventory/hooks/usingWorldPlazaInventoryStoragePageWheel';
import { DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import { RenderingWorldPlazaStorageChestPopover } from '@/components/world/storage-chest/components/renderingWorldPlazaStorageChestPopover';
import type { DefiningWorldPlazaStorageChestDragLocation } from '@/components/world/storage-chest/domains/applyingWorldPlazaStorageChestTransfer';
import { parsingWorldPlazaStorageChestSlotDroppableId } from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestDndIds';
import { RenderingWorldPlazaTeaBrewingPopover } from '@/components/world/tea-brewing/components/renderingWorldPlazaTeaBrewingPopover';
import { checkingWorldPlazaInventoryHasBrewedTeaPot } from '@/components/world/tea-brewing/domains/brewingWorldPlazaTeaPotAtCampfire';
import { parsingWorldPlazaTeaBrewingSlotDroppableId } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingDndIds';
import {
  placingWorldPlazaTeaPotIngredientFromInventorySlot,
  returningWorldPlazaTeaPotIngredientToInventory,
} from '@/components/world/tea-brewing/domains/mutatingWorldPlazaTeaPotIngredientSlots';
import { resolvingWorldPlazaTeaPotIngredientSlots } from '@/components/world/tea-brewing/domains/resolvingWorldPlazaTeaBrewingMetadata';
import { cn } from '@/lib/utils';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import type * as React from 'react';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export type RenderingWorldPlazaInventoryOreSmeltingStation = {
  readonly stationName: string;
  readonly stationBlockDefinitionId: string;
  readonly stationState: DefiningWorldPlazaOreSmeltingStationState;
  readonly onClose: () => void;
  readonly onCollectOutput: () => void;
  readonly onDropInventorySlot: (
    inventorySlotIndex: number,
    slotKind: DefiningWorldPlazaOreSmeltingStationSlotKind
  ) => void;
};

export type RenderingWorldPlazaInventoryStorageChest = {
  readonly blockId: string;
  readonly contents: DefiningInventoryState;
  readonly onClose: () => void;
  readonly applyingDragTransfer: (
    from: DefiningWorldPlazaStorageChestDragLocation,
    to: DefiningWorldPlazaStorageChestDragLocation
  ) => boolean;
  readonly resolvingDragLocationForItemId: (
    itemInstanceId: string
  ) => DefiningWorldPlazaStorageChestDragLocation | null;
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
  /** Equip survival armor from a hotbar slot. */
  readonly onEquipArmorHotbarSlot?: (slotIndex: number) => void;
  /** True when the given item type id is worn in an armor slot. */
  readonly isArmorItemEquipped?: (itemTypeId: string) => boolean;
  /** Eat action from the item action popover for food slots. */
  readonly onEatHotbarSlot?: (slotIndex: number) => void;
  /** Study a specimen for Herbarium / Lapidary / Bestiary (consumes one). */
  readonly onStudyHotbarSlot?: (slotIndex: number) => void;
  /** Attach cookbook recipe page from a hotbar/storage slot. */
  readonly onAttachRecipePageHotbarSlot?: (slotIndex: number) => void;
  /** Use a packing ledger for one bonus storage page. */
  readonly onUnlockStorageRowHotbarSlot?: (slotIndex: number) => void;
  /** Deposit ore into a reachable bloomery / kiln / stove. */
  readonly onRefineHotbarSlot?: (slotIndex: number) => void;
  /** Deposit wood or coal as fuel into a reachable smelting station. */
  readonly onAddFuelHotbarSlot?: (slotIndex: number) => void;
  /** Fill an empty teapot near shore water. */
  readonly onAddWaterHotbarSlot?: (slotIndex: number) => void;
  /** Pour tea from a brewed pot into an empty cup. */
  readonly onPourTeaHotbarSlot?: (slotIndex: number) => void;
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
  /** Open craftable storage chest rendered inside the inventory DnD context. */
  readonly storageChest?: RenderingWorldPlazaInventoryStorageChest | null;
}

type RenderingWorldPlazaInventoryHotbarInventoryShellProps = {
  readonly state: DefiningInventoryState;
  readonly isLoading: boolean;
  readonly viewportHudScale: number;
  readonly selectedSlotIndex: number | null;
  readonly storagePageIndex: number;
  /** Total hotbar pages (main + unlocked storage rows). */
  readonly storagePageCount: number;
  readonly onStoragePageIndexChange: (nextPageIndex: number) => void;
  readonly onSelectHotbarSlot?: (slotIndex: number) => void;
  readonly onEquipArmorHotbarSlot?: (slotIndex: number) => void;
  readonly isArmorItemEquipped?: (itemTypeId: string) => boolean;
  readonly onEatHotbarSlot?: (slotIndex: number) => void;
  readonly onStudyHotbarSlot?: (slotIndex: number) => void;
  readonly onAttachRecipePageHotbarSlot?: (slotIndex: number) => void;
  readonly onUnlockStorageRowHotbarSlot?: (slotIndex: number) => void;
  readonly onDropHotbarSlot?: (slotIndex: number) => void;
  readonly onRefineHotbarSlot?: (slotIndex: number) => void;
  readonly onAddFuelHotbarSlot?: (slotIndex: number) => void;
  readonly onAddWaterHotbarSlot?: (slotIndex: number) => void;
  readonly onPourTeaHotbarSlot?: (slotIndex: number) => void;
  readonly onUseActiveEnchantment?: (
    slotIndex: number,
    enchantmentId: string
  ) => void;
  readonly openBagHotbarSlotIndex: number | null;
  readonly openTeaPotHotbarSlotIndex: number | null;
  readonly openItemDetailSlotIndex: number | null;
  readonly togglingItemActionPopover: (slotIndex: number) => void;
  readonly closingItemActionPopover: () => void;
  readonly openingBagPopover: (slotIndex: number) => void;
  readonly closingBagPopover: () => void;
  readonly openingTeaPotPopover: (slotIndex: number) => void;
  readonly closingTeaPotPopover: () => void;
  readonly handlingReturnTeaPotIngredient: (
    teapotIngredientSlotIndex: number
  ) => void;
  readonly onInventoryDragStart: (event: DragStartEvent) => void;
  readonly onInventoryDragEnd: (event: DragEndEvent) => void;
  readonly resolvingDraggedItemById: (
    itemId: string,
    inventoryState: DefiningInventoryState
  ) => DefiningInventoryItem | null;
  readonly playerEffectiveMaxHealth?: number;
  readonly oreSmeltingStation?: RenderingWorldPlazaInventoryOreSmeltingStation | null;
  readonly isOreSmeltingStationReachable?: boolean;
  readonly storageChest?: RenderingWorldPlazaInventoryStorageChest | null;
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
    storagePageCount,
    onStoragePageIndexChange,
    onSelectHotbarSlot,
    onEquipArmorHotbarSlot,
    isArmorItemEquipped,
    onEatHotbarSlot,
    onStudyHotbarSlot,
    onAttachRecipePageHotbarSlot,
    onUnlockStorageRowHotbarSlot,
    onDropHotbarSlot,
    onRefineHotbarSlot,
    onAddFuelHotbarSlot,
    onAddWaterHotbarSlot,
    onPourTeaHotbarSlot,
    onUseActiveEnchantment,
    openBagHotbarSlotIndex,
    openTeaPotHotbarSlotIndex,
    openItemDetailSlotIndex,
    togglingItemActionPopover,
    closingItemActionPopover,
    openingBagPopover,
    closingBagPopover,
    openingTeaPotPopover,
    closingTeaPotPopover,
    handlingReturnTeaPotIngredient,
    onInventoryDragStart,
    onInventoryDragEnd,
    resolvingDraggedItemById,
    playerEffectiveMaxHealth,
    oreSmeltingStation,
    isOreSmeltingStationReachable = false,
    storageChest = null,
  }: RenderingWorldPlazaInventoryHotbarInventoryShellProps): React.JSX.Element {
    const viewportStyles = useMemo(
      () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
      [viewportHudScale]
    );

    const visibleSlotIndices = useMemo(
      () =>
        resolvingWorldPlazaInventoryVisibleSlotIndices(
          storagePageIndex,
          storagePageCount
        ),
      [storagePageCount, storagePageIndex]
    );

    const hasBrewedTeaPot = useMemo(
      () => checkingWorldPlazaInventoryHasBrewedTeaPot(state),
      [state]
    );

    const openTeaPotItem =
      openTeaPotHotbarSlotIndex !== null
        ? state.slots[openTeaPotHotbarSlotIndex]
        : null;
    const openTeaPotIngredientSlots =
      openTeaPotItem &&
      openTeaPotItem.itemTypeId ===
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT
        ? resolvingWorldPlazaTeaPotIngredientSlots(openTeaPotItem.metadata)
        : null;

    const [draggingFromSlotIndex, setDraggingFromSlotIndex] = useState<
      number | null
    >(null);

    const retainedSlotIndices = useMemo(
      () =>
        resolvingWorldPlazaInventoryRetainedDragSlotIndices(
          storagePageIndex,
          draggingFromSlotIndex,
          storagePageCount
        ),
      [draggingFromSlotIndex, storagePageCount, storagePageIndex]
    );

    const { onDragOver: onStoragePageDragOver, clearingDragHoverPaging } =
      usingWorldPlazaInventoryStoragePageDragHover({
        storagePageIndex,
        storagePageCount,
        onStoragePageIndexChange,
      });

    const onStoragePageWheel = usingWorldPlazaInventoryStoragePageWheel({
      storagePageIndex,
      storagePageCount,
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
        onEquipArmorHotbarSlot,
        isArmorItemEquipped,
        onEatHotbarSlot,
        onStudyHotbarSlot,
        onAttachRecipePageHotbarSlot,
        onUnlockStorageRowHotbarSlot,
        onDropHotbarSlot,
        onRefineHotbarSlot,
        onAddFuelHotbarSlot,
        onAddWaterHotbarSlot,
        onOpenTeaPotHotbarSlot: openingTeaPotPopover,
        onPourTeaHotbarSlot,
        onUseActiveEnchantment,
        togglingItemActionPopover,
        closingItemActionPopover,
        openingBagPopover,
        closingBagPopover,
        openTeaPotHotbarSlotIndex,
        closingTeaPotPopover,
        playerEffectiveMaxHealth,
        isOreSmeltingStationReachable,
        hasBrewedTeaPot,
      });

    return (
      <ProvidingWorldPlazaInventoryHotbarSlotInteractions
        interactions={slotInteractions}
      >
        <div
          {...{
            [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '',
            [DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE]: 'hotbar',
          }}
          className={cn(
            STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
            storagePageIndex > 0 &&
              STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_STORAGE_CLASS_NAME,
            STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS
          )}
          style={viewportStyles.shellStyle}
          onWheel={onStoragePageWheel}
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
                      onClose={oreSmeltingStation.onClose}
                      onCollectOutput={oreSmeltingStation.onCollectOutput}
                    />
                  ) : null}
                  {storageChest ? (
                    <RenderingWorldPlazaStorageChestPopover
                      blockId={storageChest.blockId}
                      contents={storageChest.contents}
                      onClose={storageChest.onClose}
                    />
                  ) : null}
                  {openTeaPotIngredientSlots ? (
                    <RenderingWorldPlazaTeaBrewingPopover
                      ingredientSlots={openTeaPotIngredientSlots}
                      onClose={closingTeaPotPopover}
                      onReturnIngredient={handlingReturnTeaPotIngredient}
                    />
                  ) : null}
                  <RenderingWorldPlazaInventoryPageArrowButtons
                    storagePageIndex={storagePageIndex}
                    storagePageCount={storagePageCount}
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
  onEquipArmorHotbarSlot,
  isArmorItemEquipped,
  onEatHotbarSlot,
  onStudyHotbarSlot,
  onAttachRecipePageHotbarSlot,
  onUnlockStorageRowHotbarSlot,
  onRefineHotbarSlot,
  onAddFuelHotbarSlot,
  onAddWaterHotbarSlot,
  onPourTeaHotbarSlot,
  onUseActiveEnchantment,
  isEmbeddedInHudToolbarStack = false,
  playerEffectiveMaxHealth,
  oreSmeltingStation = null,
  isNearOreSmeltingStation = false,
  storageChest = null,
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

  const [openTeaPotHotbarSlotIndex, setOpenTeaPotHotbarSlotIndex] = useState<
    number | null
  >(null);

  const [storagePageIndex, setStoragePageIndex] = useState(0);
  const bonusStorageRows = useSyncExternalStore(
    subscribingWorldPlazaInventoryStorageExpansion,
    gettingWorldPlazaInventoryBonusStorageRows,
    () => 0
  );
  const storagePageCount =
    resolvingWorldPlazaInventoryPageCount(bonusStorageRows);

  const handlingStoragePageIndexChange = useCallback(
    (nextPageIndex: number): void => {
      setStoragePageIndex(nextPageIndex);
      setOpenItemDetailSlotIndex(null);
      setOpenBagHotbarSlotIndex(null);
    },
    []
  );

  useEffect(() => {
    if (storagePageIndex >= storagePageCount) {
      setStoragePageIndex(Math.max(0, storagePageCount - 1));
    }
  }, [storagePageCount, storagePageIndex]);

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

  const openingTeaPotPopover = useCallback((slotIndex: number): void => {
    setOpenTeaPotHotbarSlotIndex(slotIndex);
    setOpenItemDetailSlotIndex(null);
    setOpenBagHotbarSlotIndex(null);
  }, []);

  const closingTeaPotPopover = useCallback((): void => {
    setOpenTeaPotHotbarSlotIndex(null);
  }, []);

  const handlingReturnTeaPotIngredient = useCallback(
    (teapotIngredientSlotIndex: number): void => {
      if (openTeaPotHotbarSlotIndex === null) {
        return;
      }

      updateState((currentState) => {
        const result = returningWorldPlazaTeaPotIngredientToInventory(
          currentState,
          openTeaPotHotbarSlotIndex,
          teapotIngredientSlotIndex
        );

        if (result.outcome === 'updated') {
          return result.nextState;
        }

        if (result.outcome === 'invalid') {
          showingReigncraftToast(result.reason);
        } else if (result.outcome === 'inventory-full') {
          showingReigncraftToast('Inventory is full.');
        }

        return currentState;
      });
    },
    [openTeaPotHotbarSlotIndex, updateState]
  );

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

  const openTeaPotHotbarSlotIndexRef = useRef(openTeaPotHotbarSlotIndex);
  openTeaPotHotbarSlotIndexRef.current = openTeaPotHotbarSlotIndex;

  const handlingInventoryDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const inventoryState = stateRef.current;
      const overId = event.over ? String(event.over.id) : null;
      const smeltingSlotKind = overId
        ? parsingWorldPlazaOreSmeltingSlotDroppableId(overId)
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

      const storageChestSlot = overId
        ? parsingWorldPlazaStorageChestSlotDroppableId(overId)
        : null;
      const activeItemId = parsingInventoryItemDraggableId(
        String(event.active.id)
      );

      if (storageChest && activeItemId) {
        const fromChestLocation =
          storageChest.resolvingDragLocationForItemId(activeItemId);
        const fromInventoryLocation =
          resolvingWorldPlazaInventoryDragLocationForItemId(
            inventoryState,
            activeItemId,
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
          );
        const fromLocation: DefiningWorldPlazaStorageChestDragLocation | null =
          fromChestLocation?.kind === 'storage-chest'
            ? fromChestLocation
            : fromInventoryLocation?.kind === 'hotbar'
              ? {
                  kind: 'hotbar',
                  slotIndex: fromInventoryLocation.slotIndex,
                }
              : null;

        if (fromLocation) {
          let toLocation: DefiningWorldPlazaStorageChestDragLocation | null =
            null;

          if (storageChestSlot) {
            toLocation = {
              kind: 'storage-chest',
              blockId: storageChestSlot.blockId,
              slotIndex: storageChestSlot.slotIndex,
            };
          } else if (overId) {
            const inventoryDrop =
              resolvingWorldPlazaInventoryDropLocationFromOverId(
                overId,
                inventoryState,
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
              );

            if (inventoryDrop?.kind === 'hotbar') {
              toLocation = {
                kind: 'hotbar',
                slotIndex: inventoryDrop.slotIndex,
              };
            }
          }

          if (
            toLocation &&
            (fromLocation.kind === 'storage-chest' ||
              toLocation.kind === 'storage-chest')
          ) {
            storageChest.applyingDragTransfer(fromLocation, toLocation);
            return;
          }
        }
      }

      const teaBrewingSlotIndex = overId
        ? parsingWorldPlazaTeaBrewingSlotDroppableId(overId)
        : null;

      if (
        teaBrewingSlotIndex !== null &&
        openTeaPotHotbarSlotIndexRef.current !== null
      ) {
        const itemId = parsingInventoryItemDraggableId(String(event.active.id));
        const fromLocation = itemId
          ? resolvingWorldPlazaInventoryDragLocationForItemId(
              inventoryState,
              itemId,
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
            )
          : null;

        if (fromLocation?.kind === 'hotbar') {
          updateState((currentState) => {
            const result = placingWorldPlazaTeaPotIngredientFromInventorySlot(
              currentState,
              openTeaPotHotbarSlotIndexRef.current!,
              fromLocation.slotIndex,
              teaBrewingSlotIndex
            );

            if (result.outcome === 'updated') {
              return result.nextState;
            }

            if (result.outcome === 'invalid') {
              showingReigncraftToast(result.reason);
            } else if (result.outcome === 'inventory-full') {
              showingReigncraftToast('Inventory is full.');
            }

            return currentState;
          });
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
    [
      handleDragEnd,
      moveItem,
      oreSmeltingStation,
      removeItem,
      storageChest,
      updateState,
    ]
  );

  const resolvingDraggedItemById = useCallback(
    (itemId: string, inventoryState: DefiningInventoryState) => {
      const fromInventory = resolvingWorldPlazaInventoryDraggedItemById(
        inventoryState,
        itemId,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      );

      if (fromInventory) {
        return fromInventory;
      }

      if (!storageChest) {
        return null;
      }

      const chestSlotIndex = resolvingInventoryItemSlotIndex(
        storageChest.contents,
        itemId
      );

      if (chestSlotIndex === null) {
        return null;
      }

      return storageChest.contents.slots[chestSlotIndex] ?? null;
    },
    [storageChest]
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

      moveItem(
        slotIndex,
        DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX
      );
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

  useEffect(() => {
    if (openTeaPotHotbarSlotIndex === null) {
      return;
    }

    const slotItem = state.slots[openTeaPotHotbarSlotIndex];

    if (
      !slotItem ||
      slotItem.itemTypeId !==
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WATERED_CLAY_TEAPOT
    ) {
      setOpenTeaPotHotbarSlotIndex(null);
    }
  }, [openTeaPotHotbarSlotIndex, state]);

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
      <div className="pointer-events-none flex flex-col items-center">
        <RenderingWorldPlazaInventoryHotbarInventoryShell
          state={state}
          isLoading={isLoading}
          viewportHudScale={hotbarViewportHudScale}
          selectedSlotIndex={selectedSlotIndex}
          storagePageIndex={storagePageIndex}
          storagePageCount={storagePageCount}
          onStoragePageIndexChange={handlingStoragePageIndexChange}
          onSelectHotbarSlot={handlingEquipHotbarSlot}
          onEquipArmorHotbarSlot={onEquipArmorHotbarSlot}
          isArmorItemEquipped={isArmorItemEquipped}
          onEatHotbarSlot={onEatHotbarSlot}
          onStudyHotbarSlot={onStudyHotbarSlot}
          onAttachRecipePageHotbarSlot={onAttachRecipePageHotbarSlot}
          onUnlockStorageRowHotbarSlot={onUnlockStorageRowHotbarSlot}
          onDropHotbarSlot={handlingDropHotbarSlot}
          onRefineHotbarSlot={onRefineHotbarSlot}
          onAddFuelHotbarSlot={onAddFuelHotbarSlot}
          onAddWaterHotbarSlot={onAddWaterHotbarSlot}
          onPourTeaHotbarSlot={onPourTeaHotbarSlot}
          onUseActiveEnchantment={onUseActiveEnchantment}
          openBagHotbarSlotIndex={openBagHotbarSlotIndex}
          openTeaPotHotbarSlotIndex={openTeaPotHotbarSlotIndex}
          openItemDetailSlotIndex={openItemDetailSlotIndex}
          togglingItemActionPopover={togglingItemActionPopover}
          closingItemActionPopover={closingItemActionPopover}
          openingBagPopover={openingBagPopover}
          closingBagPopover={closingBagPopover}
          openingTeaPotPopover={openingTeaPotPopover}
          closingTeaPotPopover={closingTeaPotPopover}
          handlingReturnTeaPotIngredient={handlingReturnTeaPotIngredient}
          onInventoryDragStart={handlingInventoryDragStart}
          onInventoryDragEnd={handlingInventoryDragEnd}
          resolvingDraggedItemById={resolvingDraggedItemById}
          playerEffectiveMaxHealth={playerEffectiveMaxHealth}
          oreSmeltingStation={oreSmeltingStation}
          isOreSmeltingStationReachable={
            Boolean(oreSmeltingStation) || isNearOreSmeltingStation
          }
          storageChest={storageChest}
        />
      </div>
    </ProvidingWorldPlazaViewportHudScale>
  );

  if (isEmbeddedInHudToolbarStack) {
    return (
      <div
        className="pointer-events-none"
        aria-label={LABELING_WORLD_PLAZA_INVENTORY_HOTBAR}
      >
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
