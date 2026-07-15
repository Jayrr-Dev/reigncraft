/**
 * Declarative registry for Craft-mode cookbooks (toolbar slots + book dialog).
 *
 * @module components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/** Stable ids for craft-mode cookbook slots. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID = {
  SURVIVAL: 'cookbook-survival',
  BLACKSMITH: 'cookbook-blacksmith',
  HEALER: 'cookbook-healer',
  CERAMICS: 'cookbook-ceramics',
} as const;

/** One craft-mode cookbook id. */
export type DefiningWorldPlazaCraftModeCookbookId =
  (typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID)[keyof typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID];

/** Cookbook icon sprite sheet (4 columns x 1 row of 32px cells). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_SPRITE_SHEET_URL =
  '/inventory/sprites/inventory-cookbook-sprites.webp' as const;

export const DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_SPRITE_SHEET_COLUMN_COUNT = 4;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_SPRITE_SHEET_ROW_COUNT = 1;

import {
  DEFINING_PLAZA_OPEN_BOOK_ASPECT_RATIO,
  DEFINING_PLAZA_OPEN_BOOK_PAGE_LAYOUT,
  DEFINING_PLAZA_OPEN_BOOK_URL,
} from '@/components/home/domains/definingPlazaOpenBookUiConstants';

/** Open-book pixel frame used by the craft cookbook dialog. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_OPEN_BOOK_URL =
  DEFINING_PLAZA_OPEN_BOOK_URL;

/** Native open-book art size (width / height). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_OPEN_BOOK_ASPECT_RATIO =
  DEFINING_PLAZA_OPEN_BOOK_ASPECT_RATIO;

/**
 * Content boxes overlaid on the open-book art (percent of frame).
 * Tuned to clear the brown cover, spine, and corner ornaments.
 */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_PAGE_LAYOUT =
  DEFINING_PLAZA_OPEN_BOOK_PAGE_LAYOUT;

/** Display + dialog metadata for one cookbook. */
export type DefiningWorldPlazaCraftModeCookbookDefinition = {
  readonly id: DefiningWorldPlazaCraftModeCookbookId;
  readonly title: string;
  readonly subtitle: string;
  readonly ariaLabel: string;
  /** Column in the cookbook sprite sheet (row is always 0). */
  readonly spriteColumnIndex: number;
  /** Iconify emblem shown on the dialog header chip. */
  readonly emblemIconifyIcon: string;
};

/**
 * Cookbooks in toolbar order (left to right on the Craft board).
 */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_REGISTRY = [
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.SURVIVAL,
    title: 'Survival Cookbook',
    subtitle: 'Trail wear, build mats, and soft shelters for the field.',
    ariaLabel: 'Open the Survival Cookbook',
    spriteColumnIndex: 0,
    emblemIconifyIcon: 'mdi:campfire',
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.BLACKSMITH,
    title: "Blacksmith's Cookbook",
    subtitle: 'Forge-side recipes tempered in soot and steel.',
    ariaLabel: "Open the Blacksmith's Cookbook",
    spriteColumnIndex: 1,
    emblemIconifyIcon: 'mdi:anvil',
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.HEALER,
    title: "Healer's Cookbook",
    subtitle: 'Bandages, salves, sleep draughts, and cures.',
    ariaLabel: "Open the Healer's Cookbook",
    spriteColumnIndex: 2,
    emblemIconifyIcon: 'mdi:mortar-pestle-plus',
  },
  {
    id: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_ID.CERAMICS,
    title: 'Ceramics Cookbook',
    subtitle: 'Clay kilns, stoves, and fired ware from packed earth.',
    ariaLabel: 'Open the Ceramics Cookbook',
    spriteColumnIndex: 3,
    emblemIconifyIcon: 'game-icons:amphora',
  },
] as const satisfies readonly DefiningWorldPlazaCraftModeCookbookDefinition[];

/** Copy shown on blank leaves until recipes ship. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_BLANK_PAGE =
  'This page is still blank. Recipes will be written here soon.' as const;

/**
 * Resolves one cookbook definition by id, or null when unknown.
 *
 * @param cookbookId - Cookbook id
 */
export function resolvingWorldPlazaCraftModeCookbookDefinition(
  cookbookId: string
): DefiningWorldPlazaCraftModeCookbookDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_REGISTRY.find(
      (cookbookDefinition) => cookbookDefinition.id === cookbookId
    ) ?? null
  );
}

/**
 * Resolves the 32px sprite-sheet cell for one cookbook.
 *
 * @param cookbookDefinition - Cookbook definition
 */
export function resolvingWorldPlazaCraftModeCookbookSpriteSheetIcon(
  cookbookDefinition: DefiningWorldPlazaCraftModeCookbookDefinition
): DefiningWorldPlazaInventorySpriteSheetIcon {
  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_SPRITE_SHEET_URL,
    columnCount:
      DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_SPRITE_SHEET_COLUMN_COUNT,
    rowCount: DEFINING_WORLD_PLAZA_CRAFT_MODE_COOKBOOK_SPRITE_SHEET_ROW_COUNT,
    columnIndex: cookbookDefinition.spriteColumnIndex,
    rowIndex: 0,
  };
}
