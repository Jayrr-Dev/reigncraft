'use client';

/**
 * Hotbar slot interaction context so the grid can use a stable slot cell component.
 *
 * @module components/world/inventory/components/providingWorldPlazaInventoryHotbarSlotInteractions
 */

import type { RenderingInventorySlotCellProps } from '@/components/inventory/renderingInventorySlotCell';
import { RenderingWorldPlazaInventorySlotCell } from '@/components/world/inventory/components/renderingWorldPlazaInventorySlotCell';
import {
  createContext,
  memo,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

/** Popover and equip callbacks shared by hotbar slot cells. */
export type WorldPlazaInventoryHotbarSlotInteractions = {
  readonly selectedSlotIndex: number | null;
  readonly openItemDetailSlotIndex: number | null;
  readonly openBagHotbarSlotIndex: number | null;
  readonly onSelectHotbarSlot?: (slotIndex: number) => void;
  readonly onEatHotbarSlot?: (slotIndex: number) => void;
  readonly onStudyHotbarSlot?: (slotIndex: number) => void;
  readonly onAttachRecipePageHotbarSlot?: (slotIndex: number) => void;
  readonly onDropHotbarSlot?: (slotIndex: number) => void;
  readonly onRefineHotbarSlot?: (slotIndex: number) => void;
  readonly onAddFuelHotbarSlot?: (slotIndex: number) => void;
  readonly onAddWaterHotbarSlot?: (slotIndex: number) => void;
  readonly onOpenTeaPotHotbarSlot?: (slotIndex: number) => void;
  readonly onPourTeaHotbarSlot?: (slotIndex: number) => void;
  readonly openTeaPotHotbarSlotIndex: number | null;
  readonly closingTeaPotPopover: () => void;
  readonly onUseActiveEnchantment?: (
    slotIndex: number,
    enchantmentId: string
  ) => void;
  readonly togglingItemActionPopover: (slotIndex: number) => void;
  readonly closingItemActionPopover: () => void;
  readonly openingBagPopover: (slotIndex: number) => void;
  readonly closingBagPopover: () => void;
  /** Local player effective max HP for food heal preview in item detail. */
  readonly playerEffectiveMaxHealth?: number;
  /** Gates Refine / Add Fuel when near or using a smelting station. */
  readonly isOreSmeltingStationReachable?: boolean;
  /** True when inventory holds a brewed teapot for Pour Tea. */
  readonly hasBrewedTeaPot?: boolean;
};

const WorldPlazaInventoryHotbarSlotInteractionsContext =
  createContext<WorldPlazaInventoryHotbarSlotInteractions | null>(null);

export type ProvidingWorldPlazaInventoryHotbarSlotInteractionsProps = {
  readonly interactions: WorldPlazaInventoryHotbarSlotInteractions;
  readonly children: ReactNode;
};

/** Shares hotbar slot popover/equip handlers without changing the grid cell component type. */
export function ProvidingWorldPlazaInventoryHotbarSlotInteractions({
  interactions,
  children,
}: ProvidingWorldPlazaInventoryHotbarSlotInteractionsProps): React.JSX.Element {
  return (
    <WorldPlazaInventoryHotbarSlotInteractionsContext.Provider
      value={interactions}
    >
      {children}
    </WorldPlazaInventoryHotbarSlotInteractionsContext.Provider>
  );
}

function usingWorldPlazaInventoryHotbarSlotInteractions(): WorldPlazaInventoryHotbarSlotInteractions {
  const interactions = useContext(
    WorldPlazaInventoryHotbarSlotInteractionsContext
  );

  if (!interactions) {
    throw new Error(
      'RenderingWorldPlazaInventoryHotbarSlotCell must render inside ProvidingWorldPlazaInventoryHotbarSlotInteractions'
    );
  }

  return interactions;
}

/**
 * Stable grid slot cell that reads hotbar interaction handlers from context.
 */
export const RenderingWorldPlazaInventoryHotbarSlotCell = memo(
  function RenderingWorldPlazaInventoryHotbarSlotCell(
    props: RenderingInventorySlotCellProps
  ): React.JSX.Element {
    const {
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
      onAddWaterHotbarSlot,
      onOpenTeaPotHotbarSlot,
      onPourTeaHotbarSlot,
      onUseActiveEnchantment,
      togglingItemActionPopover,
      closingItemActionPopover,
      openingBagPopover,
      closingBagPopover,
      playerEffectiveMaxHealth,
      isOreSmeltingStationReachable,
      hasBrewedTeaPot,
    } = usingWorldPlazaInventoryHotbarSlotInteractions();

    return (
      <RenderingWorldPlazaInventorySlotCell
        {...props}
        isEquipped={props.slotIndex === selectedSlotIndex}
        onEquipSlot={onSelectHotbarSlot}
        onOpenItemDetailPopover={togglingItemActionPopover}
        isItemDetailPopoverOpen={openItemDetailSlotIndex === props.slotIndex}
        onCloseItemDetailPopover={closingItemActionPopover}
        onEatHotbarSlot={onEatHotbarSlot}
        onStudyHotbarSlot={onStudyHotbarSlot}
        onAttachRecipePageHotbarSlot={onAttachRecipePageHotbarSlot}
        onDropHotbarSlot={onDropHotbarSlot}
        onRefineHotbarSlot={onRefineHotbarSlot}
        onAddFuelHotbarSlot={onAddFuelHotbarSlot}
        onAddWaterHotbarSlot={onAddWaterHotbarSlot}
        onOpenTeaPotHotbarSlot={onOpenTeaPotHotbarSlot}
        onPourTeaHotbarSlot={onPourTeaHotbarSlot}
        onUseActiveEnchantment={onUseActiveEnchantment}
        onOpenBagPopover={openingBagPopover}
        isBagPopoverOpen={openBagHotbarSlotIndex === props.slotIndex}
        onCloseBagPopover={closingBagPopover}
        playerEffectiveMaxHealth={playerEffectiveMaxHealth}
        isOreSmeltingStationReachable={isOreSmeltingStationReachable}
        hasBrewedTeaPot={hasBrewedTeaPot}
      />
    );
  }
);

/** Builds a memoized interactions object for the hotbar slot context provider. */
export function usingWorldPlazaInventoryHotbarSlotInteractionsValue(
  input: WorldPlazaInventoryHotbarSlotInteractions
): WorldPlazaInventoryHotbarSlotInteractions {
  return useMemo(
    () => input,
    [
      input.closingBagPopover,
      input.closingItemActionPopover,
      input.onAttachRecipePageHotbarSlot,
      input.onDropHotbarSlot,
      input.onEatHotbarSlot,
      input.onRefineHotbarSlot,
      input.onAddFuelHotbarSlot,
      input.onAddWaterHotbarSlot,
      input.onOpenTeaPotHotbarSlot,
      input.onPourTeaHotbarSlot,
      input.closingTeaPotPopover,
      input.openTeaPotHotbarSlotIndex,
      input.onStudyHotbarSlot,
      input.onSelectHotbarSlot,
      input.onUseActiveEnchantment,
      input.openBagHotbarSlotIndex,
      input.openItemDetailSlotIndex,
      input.openingBagPopover,
      input.playerEffectiveMaxHealth,
      input.isOreSmeltingStationReachable,
      input.hasBrewedTeaPot,
      input.selectedSlotIndex,
      input.togglingItemActionPopover,
    ]
  );
}
