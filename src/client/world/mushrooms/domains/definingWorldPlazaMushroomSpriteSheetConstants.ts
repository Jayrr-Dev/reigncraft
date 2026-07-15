/**
 * Inventory sprite sheets for raw and cooked mushrooms (4×4 @ 32px).
 *
 * @module components/world/mushrooms/domains/definingWorldPlazaMushroomSpriteSheetConstants
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import { DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_IDS } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

export const DEFINING_WORLD_PLAZA_INVENTORY_MUSHROOM_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-mushroom-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_INVENTORY_COOKED_MUSHROOM_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-cooked-mushroom-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_WORLD_MUSHROOM_SPRITE_SHEET_URL =
  '/world/sprites/world-mushroom-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_MUSHROOM_SPRITE_SHEET_COLUMN_COUNT = 4;
export const DEFINING_WORLD_PLAZA_MUSHROOM_SPRITE_SHEET_ROW_COUNT = 4;

const DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_INDEX_BY_ID = new Map<
  DefiningWorldPlazaMushroomSpeciesId,
  number
>(
  DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_IDS.map((speciesId, index) => [
    speciesId,
    index,
  ])
);

const DEFINING_WORLD_PLAZA_MUSHROOM_RAW_ITEM_TYPE_IDS =
  DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.map((entry) => entry.rawItemTypeId);

const DEFINING_WORLD_PLAZA_MUSHROOM_COOKED_ITEM_TYPE_IDS =
  DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.map((entry) => entry.cookedItemTypeId);

const DEFINING_WORLD_PLAZA_MUSHROOM_RAW_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_MUSHROOM_RAW_ITEM_TYPE_IDS.map((typeId, index) => [
    typeId,
    index,
  ])
);

const DEFINING_WORLD_PLAZA_MUSHROOM_COOKED_INDEX_BY_TYPE_ID = new Map<
  string,
  number
>(
  DEFINING_WORLD_PLAZA_MUSHROOM_COOKED_ITEM_TYPE_IDS.map((typeId, index) => [
    typeId,
    index,
  ])
);

function resolvingWorldPlazaMushroomSpriteSheetIconFromIndex(
  sheetIndex: number,
  spriteSheetUrl: string
): DefiningWorldPlazaInventorySpriteSheetIcon {
  const columnIndex =
    sheetIndex % DEFINING_WORLD_PLAZA_MUSHROOM_SPRITE_SHEET_COLUMN_COUNT;
  const rowIndex = Math.floor(
    sheetIndex / DEFINING_WORLD_PLAZA_MUSHROOM_SPRITE_SHEET_COLUMN_COUNT
  );

  return {
    spriteSheetUrl,
    columnCount: DEFINING_WORLD_PLAZA_MUSHROOM_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_MUSHROOM_SPRITE_SHEET_ROW_COUNT,
    columnIndex,
    rowIndex,
  };
}

export function resolvingWorldPlazaMushroomSpeciesSheetIndex(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): number {
  return DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_INDEX_BY_ID.get(speciesId) ?? 0;
}

export function resolvingWorldPlazaInventoryRawMushroomSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_MUSHROOM_RAW_INDEX_BY_TYPE_ID.get(itemTypeId);

  if (sheetIndex === undefined) {
    return null;
  }

  return resolvingWorldPlazaMushroomSpriteSheetIconFromIndex(
    sheetIndex,
    DEFINING_WORLD_PLAZA_INVENTORY_MUSHROOM_SPRITE_SHEET_URL
  );
}

export function resolvingWorldPlazaInventoryCookedMushroomSpriteSheetIcon(
  itemTypeId: string
): DefiningWorldPlazaInventorySpriteSheetIcon | null {
  const sheetIndex =
    DEFINING_WORLD_PLAZA_MUSHROOM_COOKED_INDEX_BY_TYPE_ID.get(itemTypeId);

  if (sheetIndex === undefined) {
    return null;
  }

  return resolvingWorldPlazaMushroomSpriteSheetIconFromIndex(
    sheetIndex,
    DEFINING_WORLD_PLAZA_INVENTORY_COOKED_MUSHROOM_SPRITE_SHEET_URL
  );
}

export function resolvingWorldPlazaWorldMushroomSpriteSheetIcon(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): DefiningWorldPlazaInventorySpriteSheetIcon {
  return resolvingWorldPlazaMushroomSpriteSheetIconFromIndex(
    resolvingWorldPlazaMushroomSpeciesSheetIndex(speciesId),
    DEFINING_WORLD_PLAZA_WORLD_MUSHROOM_SPRITE_SHEET_URL
  );
}
