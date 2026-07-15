'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { usingWorldPlazaAnchoredPopoverViewportShiftX } from '@/components/world/hooks/usingWorldPlazaAnchoredPopoverViewportShiftX';
import { RenderingWorldPlazaInventoryItemInfoDialog } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemInfoDialog';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_ICONIFY_ICON,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ADD_FUEL,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ATTACH,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_BIND_LEDGER,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_EQUIP,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_PLACE,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_REFINE,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_STUDY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import type { DefiningWorldPlazaInventoryItemActionTowerClassNames } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemActionTowerClassNames';
import { resolvingWorldPlazaInventoryItemActionTowerClassNames } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemActionTowerClassNames';
import type { ResolvingWorldPlazaInventoryItemDetailPopoverModel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailPopoverModel';
import type { ResolvingWorldPlazaInventoryItemEnchantmentRow } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemEnchantments';
import {
  LABELING_WORLD_PLAZA_TEA_BREWING_ADD_WATER,
  LABELING_WORLD_PLAZA_TEA_BREWING_OPEN,
  LABELING_WORLD_PLAZA_TEA_BREWING_POUR,
} from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';
import { cn } from '@/lib/utils';
import { useCallback, useState, type SyntheticEvent } from 'react';

export type RenderingWorldPlazaInventoryItemDetailPopoverProps = {
  readonly model: ResolvingWorldPlazaInventoryItemDetailPopoverModel;
  readonly onEatItem?: () => void;
  readonly onStudyItem?: () => void;
  readonly onAttachRecipePage?: () => void;
  readonly onUnlockStorageRow?: () => void;
  readonly onDropItem?: () => void;
  readonly onEquipItem?: () => void;
  readonly onEquipArmorItem?: () => void;
  readonly onOpenBag?: () => void;
  readonly onRefineItem?: () => void;
  readonly onAddFuelItem?: () => void;
  readonly onAddWater?: () => void;
  readonly onOpenTeapot?: () => void;
  readonly onPourTea?: () => void;
  readonly onUseActiveEnchantment?: (enchantmentId: string) => void;
};

/**
 * Slot-anchored item action menu (same interaction model as the action bar dropdowns).
 */
export function RenderingWorldPlazaInventoryItemDetailPopover({
  model,
  onEatItem,
  onStudyItem,
  onAttachRecipePage,
  onUnlockStorageRow,
  onDropItem,
  onEquipItem,
  onEquipArmorItem,
  onOpenBag,
  onRefineItem,
  onAddFuelItem,
  onAddWater,
  onOpenTeapot,
  onPourTea,
  onUseActiveEnchantment,
}: RenderingWorldPlazaInventoryItemDetailPopoverProps): React.JSX.Element {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const actionTowerClassNames =
    resolvingWorldPlazaInventoryItemActionTowerClassNames();
  const { popoverRef, popoverShiftStyle } =
    usingWorldPlazaAnchoredPopoverViewportShiftX(model.name);

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
        ref={popoverRef}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={actionTowerClassNames.shell}
        style={popoverShiftStyle}
        role="menu"
        aria-label={`${model.name} actions`}
        onPointerDown={stoppingPlazaWalkPointerPropagation}
        onClick={stoppingPlazaWalkPointerPropagation}
      >
        <div className={actionTowerClassNames.panel}>
          <button
            type="button"
            role="menuitem"
            aria-label={LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO}
            className={actionTowerClassNames.infoButton}
            onClick={openingInfoDialog}
          >
            <span className={actionTowerClassNames.infoName}>{model.name}</span>
            <Icon
              icon={
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_ICONIFY_ICON
              }
              className="size-3.5 shrink-0"
              aria-hidden
            />
          </button>

          {model.canEquipArmor && onEquipArmorItem ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onEquipArmorItem}
            >
              Wear
            </button>
          ) : null}

          {model.canEquip && onEquipItem ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onEquipItem}
            >
              {LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_EQUIP}
            </button>
          ) : null}

          {model.canOpenBag && onOpenBag ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onOpenBag}
            >
              Open
            </button>
          ) : null}

          {model.canOpenTeapot && onOpenTeapot ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onOpenTeapot}
            >
              {LABELING_WORLD_PLAZA_TEA_BREWING_OPEN}
            </button>
          ) : null}

          {model.canAddWater && onAddWater ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onAddWater}
            >
              {LABELING_WORLD_PLAZA_TEA_BREWING_ADD_WATER}
            </button>
          ) : null}

          {model.canPourTea && onPourTea ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onPourTea}
            >
              {LABELING_WORLD_PLAZA_TEA_BREWING_POUR}
            </button>
          ) : null}

          {model.canEat && onEatItem ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onEatItem}
            >
              Eat
            </button>
          ) : null}

          {model.canStudy && onStudyItem ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onStudyItem}
            >
              {LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_STUDY}
            </button>
          ) : null}

          {model.canAttachRecipePage && onAttachRecipePage ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onAttachRecipePage}
            >
              {LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ATTACH}
            </button>
          ) : null}

          {model.canUnlockStorageRow && onUnlockStorageRow ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onUnlockStorageRow}
            >
              {LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_BIND_LEDGER}
            </button>
          ) : null}

          {model.canRefine && onRefineItem ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onRefineItem}
            >
              {LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_REFINE}
            </button>
          ) : null}

          {model.canAddFuel && onAddFuelItem ? (
            <button
              type="button"
              role="menuitem"
              className={actionTowerClassNames.button}
              onClick={onAddFuelItem}
            >
              {LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ADD_FUEL}
            </button>
          ) : null}

          {[...model.activeEnhancements, ...model.activeEnchantments].map(
            (enchantment) => (
              <RenderingWorldPlazaInventoryItemActionTowerEnchantmentButton
                key={enchantment.enchantmentId}
                enchantment={enchantment}
                actionTowerClassNames={actionTowerClassNames}
                onUseActiveEnchantment={onUseActiveEnchantment}
              />
            )
          )}

          {model.canDrop && onDropItem ? (
            <button
              type="button"
              role="menuitem"
              className={
                model.dropActionLabel ===
                LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_PLACE
                  ? actionTowerClassNames.button
                  : actionTowerClassNames.destructiveButton
              }
              onClick={onDropItem}
            >
              {model.dropActionLabel}
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
  actionTowerClassNames,
  onUseActiveEnchantment,
}: {
  readonly enchantment: ResolvingWorldPlazaInventoryItemEnchantmentRow;
  readonly actionTowerClassNames: DefiningWorldPlazaInventoryItemActionTowerClassNames;
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
          ? actionTowerClassNames.armedButton
          : actionTowerClassNames.button
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
