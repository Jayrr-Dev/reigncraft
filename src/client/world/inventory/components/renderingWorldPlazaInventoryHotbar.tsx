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
import { SortingInventory } from '@/components/inventory/sortingInventory';
import { ProvidingWorldPlazaViewportHudScale } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles';
import { RenderingWorldPlazaHungerIndicator } from '@/components/world/hunger/components/renderingWorldPlazaHungerIndicator';
import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_GAP_ABOVE_HOTBAR_BASE_PX } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerIndicatorViewportStyles';
import {
  ProvidingWorldPlazaInventoryHotbarSlotInteractions,
  RenderingWorldPlazaInventoryHotbarSlotCell,
  usingWorldPlazaInventoryHotbarSlotInteractionsValue,
} from '@/components/world/inventory/components/providingWorldPlazaInventoryHotbarSlotInteractions';
import { RenderingWorldPlazaInventoryDragOverlayItem } from '@/components/world/inventory/components/renderingWorldPlazaInventoryDragOverlayItem';
import {
  resolvingWorldPlazaInventoryDraggedItemById,
  resolvingWorldPlazaInventoryDragLocationForItemId,
} from '@/components/world/inventory/domains/applyingWorldPlazaInventoryBagTransfer';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import {
  LABELING_WORLD_PLAZA_INVENTORY_HOTBAR,
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  STYLING_WORLD_PLAZA_INVENTORY_GRID_WRAPPER_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_LOADING_SHELL_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_LOADING_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { handlingWorldPlazaInventoryBagAwareDragEnd } from '@/components/world/inventory/domains/handlingWorldPlazaInventoryBagAwareDragEnd';
import { findingWorldPlazaInventoryFirstBagHotbarSlotIndex } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagContents';
import { resolvingWorldPlazaInventoryHotbarDeviceScale } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarDeviceScale';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import type { TrackingWorldPlazaInventoryDropPlacementResult } from '@/components/world/inventory/hooks/trackingWorldPlazaInventoryDropPlacement';
import { usingWorldPlazaInventory } from '@/components/world/inventory/hooks/usingWorldPlazaInventory';
import { cn } from '@/lib/utils';
import { showToast } from '@devvit/web/client';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type * as React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

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
  /** Mobile layout input; desktop/fullscreen render the hotbar larger. */
  readonly isMobile?: boolean;
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
  /** Active enchantment use from the item action popover. */
  readonly onUseActiveEnchantment?: (
    slotIndex: number,
    enchantmentId: string
  ) => void;
  /** When set, renders the hunger drumstick row directly above the hotbar shell. */
  readonly hungerHud?: {
    readonly hungerRatio: number;
    readonly tier: DefiningWorldPlazaHungerTier;
    readonly isStarving: boolean;
  } | null;
}

type RenderingWorldPlazaInventoryHotbarInventoryShellProps = {
  readonly state: DefiningInventoryState;
  readonly isLoading: boolean;
  readonly viewportHudScale: number;
  readonly selectedSlotIndex: number | null;
  readonly onSelectHotbarSlot?: (slotIndex: number) => void;
  readonly onEatHotbarSlot?: (slotIndex: number) => void;
  readonly onDropHotbarSlot?: (slotIndex: number) => void;
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
    onSelectHotbarSlot,
    onEatHotbarSlot,
    onDropHotbarSlot,
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
  }: RenderingWorldPlazaInventoryHotbarInventoryShellProps): React.JSX.Element {
    const viewportStyles = useMemo(
      () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
      [viewportHudScale]
    );

    const slotInteractions =
      usingWorldPlazaInventoryHotbarSlotInteractionsValue({
        selectedSlotIndex,
        openItemDetailSlotIndex,
        openBagHotbarSlotIndex,
        onSelectHotbarSlot,
        onEatHotbarSlot,
        onDropHotbarSlot,
        onUseActiveEnchantment,
        togglingItemActionPopover,
        closingItemActionPopover,
        openingBagPopover,
        closingBagPopover,
      });

    return (
      <ProvidingWorldPlazaInventoryHotbarSlotInteractions
        interactions={slotInteractions}
      >
        <div
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
          className={cn(
            STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
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
              onDragStart={onInventoryDragStart}
              onDragEnd={onInventoryDragEnd}
              resolvingDraggedItemById={resolvingDraggedItemById}
              className={STYLING_WORLD_PLAZA_INVENTORY_GRID_WRAPPER_CLASS_NAME}
              gridStyle={viewportStyles.gridStyle}
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
  inventoryDropPlacement,
  selectedSlotIndex = null,
  onSelectHotbarSlot,
  onEatHotbarSlot,
  onUseActiveEnchantment,
  hungerHud = null,
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
        return;
      }

      if (!draggedItem) {
        return;
      }

      setOpenBagHotbarSlotIndex((currentOpen) => {
        if (currentOpen !== null) {
          const openBagItem = inventoryState.slots[currentOpen];

          if (
            openBagItem &&
            checkingWorldPlazaInventoryItemIsBag(openBagItem.itemTypeId)
          ) {
            return currentOpen;
          }
        }

        return findingWorldPlazaInventoryFirstBagHotbarSlotIndex(
          inventoryState
        );
      });
    },
    []
  );

  const stateRef = useRef(state);
  stateRef.current = state;

  const handlingInventoryDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const inventoryState = stateRef.current;
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
        showToast('Empty your bag before dropping it.');
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
            showToast('Tap the ground where you want to drop it.');
          }

          return;
        }

        removeItem(bagAwareResult.fromSlotIndex);
        return;
      }

      handleDragEnd(event);
    },
    [handleDragEnd, moveItem, removeItem, updateState]
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
        showToast('Tap the ground where you want to drop it.');
      }
    },
    [inventoryDropPlacement, state]
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
      viewportHudScale * resolvingWorldPlazaInventoryHotbarDeviceScale(isMobile),
    [viewportHudScale, isMobile]
  );

  const hungerGapAboveHotbarPx = useMemo(
    () =>
      computingWorldPlazaViewportHudScaledPx(
        DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_GAP_ABOVE_HOTBAR_BASE_PX,
        hotbarViewportHudScale
      ),
    [hotbarViewportHudScale]
  );
  const anchorViewportStyle = useMemo(
    () =>
      resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles(
        viewportHudScale
      ),
    [viewportHudScale]
  );

  return (
    <div
      className={cn(
        STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME,
        STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS
      )}
      style={anchorViewportStyle}
      aria-label={LABELING_WORLD_PLAZA_INVENTORY_HOTBAR}
    >
      <ProvidingWorldPlazaViewportHudScale
        viewportHudScale={hotbarViewportHudScale}
      >
        <div
          className="pointer-events-auto flex flex-col items-center"
          style={{ gap: hungerGapAboveHotbarPx }}
        >
          {hungerHud ? (
            <RenderingWorldPlazaHungerIndicator
              hungerRatio={hungerHud.hungerRatio}
              tier={hungerHud.tier}
              isStarving={hungerHud.isStarving}
              viewportHudScale={hotbarViewportHudScale}
            />
          ) : null}
          <RenderingWorldPlazaInventoryHotbarInventoryShell
            state={state}
            isLoading={isLoading}
            viewportHudScale={hotbarViewportHudScale}
            selectedSlotIndex={selectedSlotIndex}
            onSelectHotbarSlot={onSelectHotbarSlot}
            onEatHotbarSlot={onEatHotbarSlot}
            onDropHotbarSlot={handlingDropHotbarSlot}
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
          />
        </div>
      </ProvidingWorldPlazaViewportHudScale>
    </div>
  );
}
