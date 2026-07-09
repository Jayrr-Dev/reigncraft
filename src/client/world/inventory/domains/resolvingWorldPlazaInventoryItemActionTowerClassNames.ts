import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ARMED_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_DESTRUCTIVE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_NAME_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ITEM_ICON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_PANEL_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_SHELL_CLASS_NAME,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';

/** Resolved class names for the item action tower (uniform across viewports). */
export type DefiningWorldPlazaInventoryItemActionTowerClassNames = {
  readonly shell: string;
  readonly panel: string;
  readonly infoButton: string;
  readonly infoName: string;
  readonly itemIcon: string;
  readonly button: string;
  readonly destructiveButton: string;
  readonly armedButton: string;
};

const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_CLASS_NAMES: DefiningWorldPlazaInventoryItemActionTowerClassNames =
  {
    shell: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_SHELL_CLASS_NAME,
    panel: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_PANEL_CLASS_NAME,
    infoButton:
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_BUTTON_CLASS_NAME,
    infoName:
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_NAME_CLASS_NAME,
    itemIcon:
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ITEM_ICON_CLASS_NAME,
    button: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_BUTTON_CLASS_NAME,
    destructiveButton:
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_DESTRUCTIVE_BUTTON_CLASS_NAME,
    armedButton:
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ARMED_BUTTON_CLASS_NAME,
  };

/**
 * Resolves item action tower classes. Same layout on mobile, desktop, and fullscreen.
 */
export function resolvingWorldPlazaInventoryItemActionTowerClassNames(): DefiningWorldPlazaInventoryItemActionTowerClassNames {
  return DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_CLASS_NAMES;
}
