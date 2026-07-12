/**
 * Layout + persistence for HUD mode tool boards (Craft / Build / Claim).
 * Matches the visible inventory hotbar row: same column count, empty slots shown.
 *
 * @module components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants
 */

import { DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

/** Stable board ids — one inventory-shaped grid per HUD mode tab. */
export const DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID = {
  CRAFT: 'craft',
  BUILD: 'build',
  CLAIM: 'claim',
} as const;

/** One HUD mode tool board id. */
export type DefiningWorldPlazaHudModeToolBoardId =
  (typeof DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID)[keyof typeof DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID];

/**
 * Slot count per mode board (matches one inventory hotbar row).
 * Extra slots stay empty so the chrome matches Items.
 */
export const DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_SLOT_COUNT =
  DEFINING_WORLD_PLAZA_INVENTORY_COLUMNS;

/** localStorage key for all mode-tool board layouts. */
export const DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_STORAGE_KEY =
  'reigncraft.plaza.hudModeToolBoards.v1' as const;

/** Accessible labels for each mode board shell. */
export const LABELING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD = {
  [DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CRAFT]: 'Crafting tools',
  [DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.BUILD]: 'Build tools',
  [DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CLAIM]: 'Claim tools',
} as const satisfies Record<DefiningWorldPlazaHudModeToolBoardId, string>;
