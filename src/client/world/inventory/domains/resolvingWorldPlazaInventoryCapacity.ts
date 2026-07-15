/**
 * Derives inventory capacity and hotbar page counts from bonus storage rows.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryCapacity
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS,
  DEFINING_WORLD_PLAZA_INVENTORY_MAIN_ROW_COUNT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_BASE_ROW_COUNT,
  DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_BONUS_ROWS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';

/**
 * Clamps a bonus storage-row count into the allowed 0..max range.
 */
export function resolvingWorldPlazaInventoryClampedBonusStorageRows(
  bonusStorageRows: number
): number {
  if (!Number.isFinite(bonusStorageRows)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_MAX_BONUS_ROWS,
      Math.trunc(bonusStorageRows)
    )
  );
}

/**
 * Total storage rows (base + bonus unlocks).
 */
export function resolvingWorldPlazaInventoryStorageRowCount(
  bonusStorageRows: number
): number {
  return (
    DEFINING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_BASE_ROW_COUNT +
    resolvingWorldPlazaInventoryClampedBonusStorageRows(bonusStorageRows)
  );
}

/**
 * Hotbar pages: main row + each storage row.
 */
export function resolvingWorldPlazaInventoryPageCount(
  bonusStorageRows: number
): number {
  return (
    DEFINING_WORLD_PLAZA_INVENTORY_MAIN_ROW_COUNT +
    resolvingWorldPlazaInventoryStorageRowCount(bonusStorageRows)
  );
}

/**
 * Total inventory slot capacity for the current unlock level.
 */
export function resolvingWorldPlazaInventoryCapacity(
  bonusStorageRows: number
): number {
  return (
    DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS *
    (DEFINING_WORLD_PLAZA_INVENTORY_MAIN_ROW_COUNT +
      resolvingWorldPlazaInventoryStorageRowCount(bonusStorageRows))
  );
}
