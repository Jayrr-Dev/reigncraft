import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/**
 * Blacksmith craft utility sprites (anvil, clay kiln, clay stove).
 *
 * @module components/world/building/domains/definingWorldPlazaBlacksmithUtilitySpriteConstants
 */

export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND = {
  ANVIL: 'anvil',
  BLOOMERY: 'bloomery',
  CLAY_KILN: 'clay-kiln',
  CLAY_STOVE: 'clay-stove',
} as const;

export type DefiningWorldPlazaBlacksmithUtilityKind =
  (typeof DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND)[keyof typeof DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND];

/** World prop WebPs (cropped + centered). */
export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_WORLD_SPRITE_URL = {
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.ANVIL]:
    '/environment/sprites/utilities/anvil.webp',
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BLOOMERY]:
    '/environment/sprites/utilities/bloomery.webp',
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_KILN]:
    '/environment/sprites/utilities/kiln.webp',
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_STOVE]:
    '/environment/sprites/utilities/stove.webp',
} as const satisfies Record<DefiningWorldPlazaBlacksmithUtilityKind, string>;

/** Active world prop WebPs shown while ore is smelting. */
export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_ACTIVE_WORLD_SPRITE_URL = {
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.ANVIL]:
    '/environment/sprites/utilities/anvil.webp',
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BLOOMERY]:
    '/environment/sprites/utilities/bloomery-active.webp',
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_KILN]:
    '/environment/sprites/utilities/kiln-active.webp',
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_STOVE]:
    '/environment/sprites/utilities/stove-active.webp',
} as const satisfies Record<DefiningWorldPlazaBlacksmithUtilityKind, string>;

/** Cookbook / inventory HQ sheet (4x1 @ 64px). */
export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-blacksmith-utility-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_COLUMN_COUNT = 4;
export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_ROW_COUNT = 1;

const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_COLUMN_BY_KIND = {
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.ANVIL]: 0,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_KILN]: 1,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_STOVE]: 2,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BLOOMERY]: 3,
} as const satisfies Record<DefiningWorldPlazaBlacksmithUtilityKind, number>;

/**
 * Resolves the 64px cookbook glyph for one blacksmith utility.
 */
export function resolvingWorldPlazaBlacksmithUtilitySpriteSheetIcon(
  utilityKind: DefiningWorldPlazaBlacksmithUtilityKind
): DefiningWorldPlazaInventorySpriteSheetIcon {
  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_COLUMN_BY_KIND[
        utilityKind
      ],
    rowIndex: 0,
  };
}

/** Display scale vs one isometric tile width (kiln / bloomery span ~2 tiles). */
export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_DISPLAY_SCALE = {
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.ANVIL]: 0.85,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BLOOMERY]: 1.85,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_KILN]: 1.85,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_STOVE]: 0.95,
} as const satisfies Record<DefiningWorldPlazaBlacksmithUtilityKind, number>;
