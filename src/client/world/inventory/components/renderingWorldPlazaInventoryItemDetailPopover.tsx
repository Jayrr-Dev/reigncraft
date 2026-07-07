'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { RenderingWorldPlazaInventoryItemInfoDialog } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemInfoDialog';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ARMED_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_DESTRUCTIVE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_PANEL_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_SHELL_CLASS_NAME,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import type { ResolvingWorldPlazaInventoryItemDetailPopoverModel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailPopoverModel';
import type { ResolvingWorldPlazaInventoryItemEnchantmentRow } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemEnchantments';
import { cn } from '@/lib/utils';
import { useCallback, useState, type SyntheticEvent } from 'react';

export type RenderingWorldPlazaInventoryItemDetailPopoverProps = {
  readonly model: ResolvingWorldPlazaInventoryItemDetailPopoverModel;
  readonly onEatItem?: () => void;
  readonly onDropItem?: () => void;
  readonly onEquipItem?: () => void;
  readonly onOpenBag?: () => void;
  readonly onUseActiveEnchantment?: (enchantmentId: string) => void;
};

/**
 * Slot-anchored item action menu (same interaction model as the action bar dropdowns).
 */
export function RenderingWorldPlazaInventoryItemDetailPopover({
  model,
  onEatItem,
  onDropItem,
  onEquipItem,
  onOpenBag,
  onUseActiveEnchantment,
}: RenderingWorldPlazaInventoryItemDetailPopoverProps): React.JSX.Element {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  const openingInfoDialog = useCallback((): void => {
    setIsInfoDialogOpen(true);
  }, []);

  const closingInfoDialog = useCallback((): void => {
    setIsInfoDialogOpen(false);
  }, []);

  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  return (
    <>
      <div
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_SHELL_CLASS_NAME
        }
        role="menu"
        aria-label={`${model.name} actions`}
        onPointerDown={stoppingPlazaWalkPointerPropagation}
        onClick={stoppingPlazaWalkPointerPropagation}
      >
        <div
          className={
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_PANEL_CLASS_NAME
          }
        >
          <button
            type="button"
            role="menuitem"
            className={
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_BUTTON_CLASS_NAME
            }
            onClick={openingInfoDialog}
          >
            {LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO}
          </button>

          {model.canEquip && onEquipItem ? (
            <button
              type="button"
              role="menuitem"
              className={
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_BUTTON_CLASS_NAME
              }
              onClick={onEquipItem}
            >
              Equip
            </button>
          ) : null}

          {model.canOpenBag && onOpenBag ? (
            <button
              type="button"
              role="menuitem"
              className={
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_BUTTON_CLASS_NAME
              }
              onClick={onOpenBag}
            >
              Open
            </button>
          ) : null}

          {model.canEat && onEatItem ? (
            <button
              type="button"
              role="menuitem"
              className={
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_BUTTON_CLASS_NAME
              }
              onClick={onEatItem}
            >
              Eat
            </button>
          ) : null}

          {model.activeEnchantments.map((enchantment) => (
            <RenderingWorldPlazaInventoryItemActionTowerEnchantmentButton
              key={enchantment.enchantmentId}
              enchantment={enchantment}
              onUseActiveEnchantment={onUseActiveEnchantment}
            />
          ))}

          {model.canDrop && onDropItem ? (
            <button
              type="button"
              role="menuitem"
              className={
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_DESTRUCTIVE_BUTTON_CLASS_NAME
              }
              onClick={onDropItem}
            >
              Drop
            </button>
          ) : null}
        </div>
      </div>

      <RenderingWorldPlazaInventoryItemInfoDialog
        isOpen={isInfoDialogOpen}
        model={model}
        onClose={closingInfoDialog}
      />
    </>
  );
}

function RenderingWorldPlazaInventoryItemActionTowerEnchantmentButton({
  enchantment,
  onUseActiveEnchantment,
}: {
  readonly enchantment: ResolvingWorldPlazaInventoryItemEnchantmentRow;
  readonly onUseActiveEnchantment?: (enchantmentId: string) => void;
}): React.JSX.Element {
  const isDisabled = !enchantment.isUsable;
  const label = enchantment.isArmed
    ? `${enchantment.badgeLabel} armed`
    : (enchantment.useButtonLabel ?? enchantment.badgeLabel);

  return (
    <button
      type="button"
      role="menuitem"
      disabled={isDisabled}
      className={cn(
        enchantment.isArmed
          ? DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ARMED_BUTTON_CLASS_NAME
          : DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_BUTTON_CLASS_NAME
      )}
      title={enchantment.description}
      onClick={() => {
        if (!isDisabled) {
          onUseActiveEnchantment?.(enchantment.enchantmentId);
        }
      }}
    >
      {label}
      {enchantment.statusLabel ? ` · ${enchantment.statusLabel}` : ''}
    </button>
  );
}
