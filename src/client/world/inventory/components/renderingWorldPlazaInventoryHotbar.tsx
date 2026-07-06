'use client';

/**
 * Bottom-center inventory hotbar for the world plaza.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryHotbar
 */

import { SortingInventory } from '@/components/inventory/sortingInventory';
import { ProvidingWorldPlazaViewportHudScale } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { RenderingWorldPlazaHungerIndicator } from '@/components/world/hunger/components/renderingWorldPlazaHungerIndicator';
import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_GAP_ABOVE_HOTBAR_BASE_PX } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerIndicatorViewportStyles';
import {
  RenderingWorldPlazaInventoryDragOverlayItem,
  RenderingWorldPlazaInventorySlotCell,
} from '@/components/world/inventory/components/renderingWorldPlazaInventorySlotCell';
import {
  LABELING_WORLD_PLAZA_INVENTORY_HOTBAR,
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_LOADING_SHELL_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_LOADING_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import type { TrackingWorldPlazaInventoryDropPlacementResult } from '@/components/world/inventory/hooks/trackingWorldPlazaInventoryDropPlacement';
import { usingWorldPlazaInventory } from '@/components/world/inventory/hooks/usingWorldPlazaInventory';
import { cn } from '@/lib/utils';
import type { DragEndEvent } from '@dnd-kit/core';
import type * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
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
  /** Optional drag-to-ground placement controller from the plaza scene. */
  readonly inventoryDropPlacement?: Pick<
    TrackingWorldPlazaInventoryDropPlacementResult,
    | 'handlingDragStart'
    | 'handlingDragMove'
    | 'handlingDragPointerMove'
    | 'handlingDragEnd'
    | 'handlingDragCancel'
  >;
  /** Selected hotbar slot for equipped tool actions. */
  readonly selectedSlotIndex?: number | null;
  /** Selects or toggles a hotbar slot as equipped. */
  readonly onSelectHotbarSlot?: (slotIndex: number) => void;
  /** Eat action from the item detail popover for food slots. */
  readonly onEatHotbarSlot?: (slotIndex: number) => void;
  /** Active enchantment use from the item detail popover. */
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
  inventoryDropPlacement,
  selectedSlotIndex = null,
  onSelectHotbarSlot,
  onEatHotbarSlot,
  onUseActiveEnchantment,
  hungerHud = null,
}: RenderingWorldPlazaInventoryHotbarProps): React.JSX.Element {
  const { state, isLoading, handleDragEnd } = usingWorldPlazaInventory({
    onlineUserId,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex,
    onlineUsername,
  });

  const [openItemDetailSlotIndex, setOpenItemDetailSlotIndex] = useState<
    number | null
  >(null);

  const handlingOpenItemDetailPopover = useCallback(
    (slotIndex: number): void => {
      setOpenItemDetailSlotIndex((currentSlotIndex) =>
        currentSlotIndex === slotIndex ? null : slotIndex
      );
    },
    []
  );

  const closingItemDetailPopover = useCallback((): void => {
    setOpenItemDetailSlotIndex(null);
  }, []);

  const handlingInventoryDragEnd = useCallback(
    (event: DragEndEvent): void => {
      if (inventoryDropPlacement) {
        inventoryDropPlacement.handlingDragEnd(
          event,
          state,
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
        );
        return;
      }

      handleDragEnd(event);
    },
    [handleDragEnd, inventoryDropPlacement, state]
  );

  const viewportStyles = useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale]
  );
  const hungerGapAboveHotbarPx = useMemo(
    () =>
      computingWorldPlazaViewportHudScaledPx(
        DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_GAP_ABOVE_HOTBAR_BASE_PX,
        viewportHudScale
      ),
    [viewportHudScale]
  );

  const RenderingWorldPlazaInventoryDragOverlayItemScaled = useCallback(
    (
      props: React.ComponentProps<
        typeof RenderingWorldPlazaInventoryDragOverlayItem
      >
    ) => (
      <RenderingWorldPlazaInventoryDragOverlayItem
        {...props}
        viewportHudScale={viewportHudScale}
      />
    ),
    [viewportHudScale]
  );

  const RenderingWorldPlazaInventorySlotCellEquipped = useCallback(
    (
      props: React.ComponentProps<typeof RenderingWorldPlazaInventorySlotCell>
    ) => (
      <RenderingWorldPlazaInventorySlotCell
        {...props}
        isEquipped={props.slotIndex === selectedSlotIndex}
        onEquipSlot={onSelectHotbarSlot}
        onOpenItemDetailPopover={handlingOpenItemDetailPopover}
        isItemDetailPopoverOpen={openItemDetailSlotIndex === props.slotIndex}
        onCloseItemDetailPopover={closingItemDetailPopover}
        onEatHotbarSlot={onEatHotbarSlot}
        onUseActiveEnchantment={onUseActiveEnchantment}
      />
    ),
    [
      closingItemDetailPopover,
      handlingOpenItemDetailPopover,
      onEatHotbarSlot,
      onUseActiveEnchantment,
      onSelectHotbarSlot,
      openItemDetailSlotIndex,
      selectedSlotIndex,
    ]
  );

  return (
    <div
      className={cn(
        STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME,
        STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS
      )}
      aria-label={LABELING_WORLD_PLAZA_INVENTORY_HOTBAR}
    >
      <ProvidingWorldPlazaViewportHudScale viewportHudScale={viewportHudScale}>
        <div
          className="flex flex-col items-center"
          style={{ gap: hungerGapAboveHotbarPx }}
        >
          {hungerHud ? (
            <RenderingWorldPlazaHungerIndicator
              hungerRatio={hungerHud.hungerRatio}
              tier={hungerHud.tier}
              isStarving={hungerHud.isStarving}
              viewportHudScale={viewportHudScale}
            />
          ) : null}
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
                onDragStart={inventoryDropPlacement?.handlingDragStart}
                onDragMove={inventoryDropPlacement?.handlingDragMove}
                onDragPointerMove={
                  inventoryDropPlacement?.handlingDragPointerMove
                }
                onDragCancel={inventoryDropPlacement?.handlingDragCancel}
                onDragEnd={handlingInventoryDragEnd}
                gridStyle={viewportStyles.gridStyle}
                SlotCellComponent={RenderingWorldPlazaInventorySlotCellEquipped}
                DragOverlayItemComponent={
                  RenderingWorldPlazaInventoryDragOverlayItemScaled
                }
              />
            )}
          </div>
        </div>
      </ProvidingWorldPlazaViewportHudScale>
    </div>
  );
}
