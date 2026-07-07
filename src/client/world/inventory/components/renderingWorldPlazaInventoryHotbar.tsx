'use client';

/**
 * Bottom-center inventory hotbar for the world plaza.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryHotbar
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { RenderingInventoryGrid } from '@/components/inventory/renderingInventoryGrid';
import { ProvidingWorldPlazaViewportHudScale } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles';
import { RenderingWorldPlazaHungerIndicator } from '@/components/world/hunger/components/renderingWorldPlazaHungerIndicator';
import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_GAP_ABOVE_HOTBAR_BASE_PX } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerIndicatorViewportStyles';
import { RenderingWorldPlazaInventorySlotCell } from '@/components/world/inventory/components/renderingWorldPlazaInventorySlotCell';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
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
import { showToast } from '@devvit/web/client';
import type * as React from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
  }: RenderingWorldPlazaInventoryHotbarInventoryShellProps): React.JSX.Element {
    const viewportStyles = useMemo(
      () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
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
          onOpenItemDetailPopover={togglingItemActionPopover}
          isItemDetailPopoverOpen={openItemDetailSlotIndex === props.slotIndex}
          onCloseItemDetailPopover={closingItemActionPopover}
          onEatHotbarSlot={onEatHotbarSlot}
          onDropHotbarSlot={onDropHotbarSlot}
          onUseActiveEnchantment={onUseActiveEnchantment}
          onOpenBagPopover={openingBagPopover}
          isBagPopoverOpen={openBagHotbarSlotIndex === props.slotIndex}
          onCloseBagPopover={closingBagPopover}
        />
      ),
      [
        closingBagPopover,
        closingItemActionPopover,
        onDropHotbarSlot,
        onEatHotbarSlot,
        onUseActiveEnchantment,
        onSelectHotbarSlot,
        openBagHotbarSlotIndex,
        openItemDetailSlotIndex,
        openingBagPopover,
        selectedSlotIndex,
        togglingItemActionPopover,
      ]
    );

    return (
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
          <RenderingInventoryGrid
            state={state}
            registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
            style={viewportStyles.gridStyle}
            SlotCellComponent={RenderingWorldPlazaInventorySlotCellEquipped}
          />
        )}
      </div>
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
  inventoryDropPlacement,
  selectedSlotIndex = null,
  onSelectHotbarSlot,
  onEatHotbarSlot,
  onUseActiveEnchantment,
  hungerHud = null,
}: RenderingWorldPlazaInventoryHotbarProps): React.JSX.Element {
  const { state, isLoading } = usingWorldPlazaInventory({
    onlineUserId,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex,
    onlineUsername,
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

  const togglingItemActionPopover = useCallback(
    (slotIndex: number): void => {
      inventoryDropPlacement?.cancellingDropPlacementMode();
      setOpenItemDetailSlotIndex((currentSlotIndex) =>
        currentSlotIndex === slotIndex ? null : slotIndex
      );
      setOpenBagHotbarSlotIndex(null);
    },
    [inventoryDropPlacement]
  );

  const openingBagPopover = useCallback((slotIndex: number): void => {
    setOpenBagHotbarSlotIndex(slotIndex);
    setOpenItemDetailSlotIndex(null);
  }, []);

  const closingBagPopover = useCallback((): void => {
    setOpenBagHotbarSlotIndex(null);
  }, []);

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

  const hungerGapAboveHotbarPx = useMemo(
    () =>
      computingWorldPlazaViewportHudScaledPx(
        DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_GAP_ABOVE_HOTBAR_BASE_PX,
        viewportHudScale
      ),
    [viewportHudScale]
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
          <RenderingWorldPlazaInventoryHotbarInventoryShell
            state={state}
            isLoading={isLoading}
            viewportHudScale={viewportHudScale}
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
          />
        </div>
      </ProvidingWorldPlazaViewportHudScale>
    </div>
  );
}
