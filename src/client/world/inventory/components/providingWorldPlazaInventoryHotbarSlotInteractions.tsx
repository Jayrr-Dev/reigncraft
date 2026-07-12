'use client';

/**
 * Hotbar slot interaction context so the grid can use a stable slot cell component.
 *
 * @module components/world/inventory/components/providingWorldPlazaInventoryHotbarSlotInteractions
 */

import type { RenderingInventorySlotCellProps } from '@/components/inventory/renderingInventorySlotCell';
import { RenderingWorldPlazaInventorySlotCell } from '@/components/world/inventory/components/renderingWorldPlazaInventorySlotCell';
import { checkingWorldPlazaInventorySlotIsMainHotbar } from '@/components/world/inventory/domains/checkingWorldPlazaInventorySlotIsMainHotbar';
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
  readonly onDropHotbarSlot?: (slotIndex: number) => void;
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
      onDropHotbarSlot,
      onUseActiveEnchantment,
      togglingItemActionPopover,
      closingItemActionPopover,
      openingBagPopover,
      closingBagPopover,
      playerEffectiveMaxHealth,
    } = usingWorldPlazaInventoryHotbarSlotInteractions();

    const isMainHotbarSlot = checkingWorldPlazaInventorySlotIsMainHotbar(
      props.slotIndex
    );

    return (
      <RenderingWorldPlazaInventorySlotCell
        {...props}
        isEquipped={isMainHotbarSlot && props.slotIndex === selectedSlotIndex}
        onEquipSlot={isMainHotbarSlot ? onSelectHotbarSlot : undefined}
        onOpenItemDetailPopover={togglingItemActionPopover}
        isItemDetailPopoverOpen={openItemDetailSlotIndex === props.slotIndex}
        onCloseItemDetailPopover={closingItemActionPopover}
        onEatHotbarSlot={onEatHotbarSlot}
        onDropHotbarSlot={onDropHotbarSlot}
        onUseActiveEnchantment={onUseActiveEnchantment}
        onOpenBagPopover={openingBagPopover}
        isBagPopoverOpen={openBagHotbarSlotIndex === props.slotIndex}
        onCloseBagPopover={closingBagPopover}
        playerEffectiveMaxHealth={playerEffectiveMaxHealth}
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
      input.onDropHotbarSlot,
      input.onEatHotbarSlot,
      input.onSelectHotbarSlot,
      input.onUseActiveEnchantment,
      input.openBagHotbarSlotIndex,
      input.openItemDetailSlotIndex,
      input.openingBagPopover,
      input.playerEffectiveMaxHealth,
      input.selectedSlotIndex,
      input.togglingItemActionPopover,
    ]
  );
}
