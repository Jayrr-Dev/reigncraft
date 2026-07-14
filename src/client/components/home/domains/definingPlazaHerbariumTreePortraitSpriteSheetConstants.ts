/**
 * Herbarium tree portrait sprite sheet (4×3 @ 32px).
 *
 * Cell order matches art export and
 * {@link DEFINING_PLAZA_HERBARIUM_TREE_GUIDE_ENTRIES}.
 *
 * @module components/home/domains/definingPlazaHerbariumTreePortraitSpriteSheetConstants
 */

import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';

export const DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-tree-sprites.webp' as const;

export const DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_COLUMN_COUNT = 4;
export const DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_ROW_COUNT = 3;

/** Sprite sheet cell order (left→right, top→bottom). */
export const DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_VARIANTS = [
  'oak',
  'blossom',
  'willow',
  'acacia',
  'spruce',
  'birch',
  'pine',
  'palm',
  'deadwood',
  'cactus',
] as const satisfies readonly DefiningWorldPlazaTreeVariantKind[];

const DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_INDEX_BY_VARIANT = new Map<
  DefiningWorldPlazaTreeVariantKind,
  number
>(
  DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_VARIANTS.map((variant, index) => [
    variant,
    index,
  ])
);

export type PlazaHerbariumTreeSpriteSheetCrop = {
  spriteSheetUrl: string;
  columnCount: number;
  rowCount: number;
  columnIndex: number;
  rowIndex: number;
};

/**
 * Resolves the sprite crop for one tree variant, or null when unmapped.
 */
export function resolvingPlazaHerbariumTreeSpriteSheetCrop(
  variant: DefiningWorldPlazaTreeVariantKind
): PlazaHerbariumTreeSpriteSheetCrop | null {
  const sheetIndex =
    DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_INDEX_BY_VARIANT.get(variant);

  if (sheetIndex === undefined) {
    return null;
  }

  return {
    spriteSheetUrl: DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_URL,
    columnCount: DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_ROW_COUNT,
    columnIndex:
      sheetIndex % DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_COLUMN_COUNT,
    rowIndex: Math.floor(
      sheetIndex / DEFINING_PLAZA_HERBARIUM_TREE_SPRITE_SHEET_COLUMN_COUNT
    ),
  };
}
