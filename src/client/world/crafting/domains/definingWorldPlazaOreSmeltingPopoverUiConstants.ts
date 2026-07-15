/**
 * Declarative popover chrome for ore-smelting stations (bloomery / kiln / stove).
 *
 * Kiln fires ware (ITEM + clay panel). Bloomery refines ore (ORE + soot panel).
 *
 * @module components/world/crafting/domains/definingWorldPlazaOreSmeltingPopoverUiConstants
 */

import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BESSEMER_FORGE,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';

export type DefiningWorldPlazaOreSmeltingPopoverUiTheme = {
  /** Left drop slot caption (ore vs ware). */
  readonly inputSlotLabel: string;
  /** Idle footer hint under the progress bar. */
  readonly idleHintText: string;
  /** Outer panel shell classes (border + fill). */
  readonly panelClassName: string;
  /** Close button hover / text classes. */
  readonly closeButtonClassName: string;
};

/** Shared panel class prefix (position + size). */
const DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_PANEL_BASE_CLASS_NAME =
  'pointer-events-auto fixed left-1/2 top-1/2 z-50 w-56 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 p-2 shadow-xl' as const;

/** Warm terracotta shell for clay kiln / clay stove. */
const DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_PANEL_CLAY_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_PANEL_BASE_CLASS_NAME} border-[#a67c52] bg-[#5c3d28]/95 text-amber-50` as const;

/** Charcoal / ash shell for bloomery (ore refinery). */
const DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_PANEL_SOOT_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_PANEL_BASE_CLASS_NAME} border-[#3d3830] bg-[#141210]/95 text-stone-100` as const;

const DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_CLOSE_CLAY_CLASS_NAME =
  'h-5 w-5 rounded text-xs text-amber-100/80 hover:bg-[#7a5740]' as const;

const DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_CLOSE_SOOT_CLASS_NAME =
  'h-5 w-5 rounded text-xs text-stone-400 hover:bg-[#2a2622]' as const;

/**
 * Per-station popover theme.
 * Only the clay kiln uses ITEM; bloomery (refinery) and stove stay ORE.
 */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_UI_BY_STATION = {
  [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN]: {
    inputSlotLabel: 'Item',
    idleHintText: 'Drop ware + fuel. Grab output when ready.',
    panelClassName:
      DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_PANEL_CLAY_CLASS_NAME,
    closeButtonClassName:
      DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_CLOSE_CLAY_CLASS_NAME,
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY]: {
    inputSlotLabel: 'Ore',
    idleHintText: 'Drop ore + fuel. Grab output when ready.',
    panelClassName:
      DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_PANEL_SOOT_CLASS_NAME,
    closeButtonClassName:
      DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_CLOSE_SOOT_CLASS_NAME,
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BESSEMER_FORGE]: {
    inputSlotLabel: 'Item',
    idleHintText: 'Drop iron ingots + fuel. Grab steel when ready.',
    panelClassName:
      DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_PANEL_SOOT_CLASS_NAME,
    closeButtonClassName:
      DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_CLOSE_SOOT_CLASS_NAME,
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE]: {
    inputSlotLabel: 'Ore',
    idleHintText: 'Drop ore + fuel. Grab output when ready.',
    panelClassName:
      DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_PANEL_CLAY_CLASS_NAME,
    closeButtonClassName:
      DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_CLOSE_CLAY_CLASS_NAME,
  },
} as const satisfies Record<
  string,
  DefiningWorldPlazaOreSmeltingPopoverUiTheme
>;

/** Fallback when station id is unknown (ore + soot). */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_UI_FALLBACK = {
  inputSlotLabel: 'Ore',
  idleHintText: 'Drop ore + fuel. Grab output when ready.',
  panelClassName:
    DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_PANEL_SOOT_CLASS_NAME,
  closeButtonClassName:
    DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_CLOSE_SOOT_CLASS_NAME,
} as const satisfies DefiningWorldPlazaOreSmeltingPopoverUiTheme;
