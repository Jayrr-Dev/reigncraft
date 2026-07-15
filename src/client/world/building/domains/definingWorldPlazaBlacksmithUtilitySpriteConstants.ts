import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/**
 * Blacksmith craft utility sprites (anvil, clay kiln, clay stove).
 *
 * @module components/world/building/domains/definingWorldPlazaBlacksmithUtilitySpriteConstants
 */

export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND = {
  ANVIL: 'anvil',
  BLOOMERY: 'bloomery',
  BESSEMER_FORGE: 'bessemer-forge',
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
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BESSEMER_FORGE]:
    '/environment/sprites/utilities/bessemer-forge.webp',
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
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BESSEMER_FORGE]:
    '/environment/sprites/utilities/bessemer-forge-active.webp',
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_KILN]:
    '/environment/sprites/utilities/kiln-active.webp',
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_STOVE]:
    '/environment/sprites/utilities/stove-active.webp',
} as const satisfies Record<DefiningWorldPlazaBlacksmithUtilityKind, string>;

/** Cookbook / inventory HQ sheet (4x1 @ 64px). */
export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-blacksmith-utility-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_COLUMN_COUNT = 5;
export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_ROW_COUNT = 1;

const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_SPRITE_SHEET_COLUMN_BY_KIND = {
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.ANVIL]: 0,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_KILN]: 1,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_STOVE]: 2,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BLOOMERY]: 3,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BESSEMER_FORGE]: 4,
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
  /** Waist-high smithing block; keep under player torso height. */
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.ANVIL]: 0.52,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BLOOMERY]: 1.85,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BESSEMER_FORGE]: 1.85,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_KILN]: 1.85,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_STOVE]: 0.95,
} as const satisfies Record<DefiningWorldPlazaBlacksmithUtilityKind, number>;

/**
 * Extra screen-Y sink (positive = down) so sprite feet meet the tile top.
 * Compensates cropped WebP padding that still reads as floating.
 */
export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_FOOT_SINK_PX = {
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.ANVIL]: 6,
  /** Tall 2x2 props: more sink so clay feet meet the tile diamond. */
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BLOOMERY]: 20,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BESSEMER_FORGE]: 20,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_KILN]: 20,
  [DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.CLAY_STOVE]: 4,
} as const satisfies Record<DefiningWorldPlazaBlacksmithUtilityKind, number>;

/** Ghost alpha while dragging a blacksmith utility in craft/build placement. */
export const DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_PLACEMENT_PREVIEW_ALPHA =
  0.72 as const;
