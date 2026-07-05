/**
 * Build mode UI styling constants.
 *
 * @module components/world/building/domains/definingWorldBuildingBuildModeConstants
 */

/** Tile search radius around the player when loading plots. */
export const DEFINING_WORLD_BUILDING_VIEWPORT_PLOT_SEARCH_TILE_RADIUS = 24;

/** Build mode sidebar width (Tailwind class). */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_SIDEBAR_WIDTH_CLASS_NAME =
  "w-[176px]" as const;

/** Right-side build mode sidebar shell. */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_SIDEBAR_CLASS_NAME =
  "pointer-events-auto flex h-full min-h-0 flex-col gap-2 border-l border-white/20 bg-[#0d1b2a]/92 p-2 shadow-lg backdrop-blur-sm" as const;

/** Anchor for the build sidebar along the plaza viewport edge. */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_SIDEBAR_ANCHOR_CLASS_NAME =
  "pointer-events-none absolute inset-y-0 right-0 z-40 flex min-h-0 flex-col pt-2 pb-16" as const;

/** Build mode panel container classes (legacy center panel; unused). */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_PANEL_CLASS_NAME =
  "pointer-events-auto flex w-full max-w-md flex-col gap-2 rounded-md border border-white/20 bg-[#0d1b2a]/95 p-3 shadow-lg backdrop-blur-sm" as const;

/** Block palette button classes. */
export const DEFINING_WORLD_BUILDING_BLOCK_PALETTE_BUTTON_CLASS_NAME =
  "w-full truncate rounded border border-white/15 px-1.5 py-0.5 text-left text-[9px] leading-tight text-white/85 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;

/** Selected palette button classes. */
export const DEFINING_WORLD_BUILDING_BLOCK_PALETTE_BUTTON_SELECTED_CLASS_NAME =
  "w-full truncate rounded border border-[#f4d35e]/60 bg-[#f4d35e]/15 px-1.5 py-0.5 text-left text-[9px] font-semibold leading-tight text-[#f4d35e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;

/** Section label classes shared across build mode control groups. */
export const DEFINING_WORLD_BUILDING_SECTION_LABEL_CLASS_NAME =
  "text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45" as const;

/** Segmented pill button (layer / height grids) base classes. */
export const DEFINING_WORLD_BUILDING_SEGMENT_BUTTON_CLASS_NAME =
  "flex h-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-[10px] font-semibold tabular-nums text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-transparent disabled:text-white/20" as const;

/** Segmented pill button selected classes. */
export const DEFINING_WORLD_BUILDING_SEGMENT_BUTTON_SELECTED_CLASS_NAME =
  "flex h-7 items-center justify-center rounded-md border border-[#f4d35e]/70 bg-[#f4d35e]/20 text-[10px] font-semibold tabular-nums text-[#f4d35e] shadow-[0_0_0_1px_rgba(244,211,94,0.25)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;

/** Block swatch grid container classes. */
export const DEFINING_WORLD_BUILDING_BLOCK_SWATCH_GRID_CLASS_NAME =
  "grid grid-cols-4 gap-1" as const;

/** Block swatch tile base classes (solid color picker). */
export const DEFINING_WORLD_BUILDING_BLOCK_SWATCH_TILE_CLASS_NAME =
  "relative flex aspect-square items-center justify-center rounded-md border transition hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;

/** Block swatch tile selected ring classes (merged with the base tile). */
export const DEFINING_WORLD_BUILDING_BLOCK_SWATCH_TILE_SELECTED_CLASS_NAME =
  "ring-2 ring-inset ring-[#f4d35e] brightness-110" as const;

/** Material icon size and contrast styling centered on palette swatches. */
export const DEFINING_WORLD_BUILDING_BLOCK_SWATCH_MATERIAL_ICON_CLASS_NAME =
  "h-3.5 w-3.5 shrink-0 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)]" as const;

/** Category tab strip container classes. */
export const DEFINING_WORLD_BUILDING_CATEGORY_TAB_GRID_CLASS_NAME =
  "grid grid-cols-4 gap-1" as const;

/** Category tab base classes. */
export const DEFINING_WORLD_BUILDING_CATEGORY_TAB_CLASS_NAME =
  "flex h-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-[12px] leading-none transition hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;

/** Category tab selected classes. */
export const DEFINING_WORLD_BUILDING_CATEGORY_TAB_SELECTED_CLASS_NAME =
  "flex h-6 items-center justify-center rounded-md border border-[#f4d35e]/70 bg-[#f4d35e]/20 text-[12px] leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;

/** Lucide icon size and tint for palette category tabs. */
export const DEFINING_WORLD_BUILDING_CATEGORY_TAB_ICON_CLASS_NAME =
  "h-3.5 w-3.5 text-white/80" as const;

/** Lucide icon tint when its category tab is selected. */
export const DEFINING_WORLD_BUILDING_CATEGORY_TAB_ICON_SELECTED_CLASS_NAME =
  "h-3.5 w-3.5 text-[#f4d35e]" as const;

/** Selected-block readout classes shown under the swatch grid. */
export const DEFINING_WORLD_BUILDING_SELECTED_BLOCK_READOUT_CLASS_NAME =
  "truncate text-center text-[10px] font-semibold text-[#f4d35e]" as const;

/** Compact value readout classes (layer / height summary). */
export const DEFINING_WORLD_BUILDING_VALUE_READOUT_CLASS_NAME =
  "text-center text-[10px] font-semibold tabular-nums text-[#f4d35e]" as const;

/** Build mode toggle button classes. */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_TOGGLE_BUTTON_CLASS_NAME =
  "pointer-events-auto rounded-md border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;

/** Active build mode toggle button classes. */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_TOGGLE_BUTTON_ACTIVE_CLASS_NAME =
  "pointer-events-auto rounded-md border border-[#f4d35e]/60 bg-[#f4d35e]/20 px-2.5 py-1 text-[10px] font-semibold text-[#f4d35e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;

/** Placement preview valid tint class. */
export const DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALID_CLASS_NAME =
  "border-[#66ff66]/80 bg-[#66ff66]/20" as const;

/** Placement preview invalid tint class. */
export const DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_INVALID_CLASS_NAME =
  "border-[#ff3366]/80 bg-[#ff3366]/20" as const;

/** Plot boundary outline classes. */
export const DEFINING_WORLD_BUILDING_PLOT_BOUNDARY_CLASS_NAME =
  "pointer-events-none absolute border border-dashed border-[#f4d35e]/70 bg-[#f4d35e]/5" as const;

/** Save build draft button classes. */
export const DEFINING_WORLD_BUILDING_SAVE_DRAFT_BUTTON_CLASS_NAME =
  "w-full rounded border border-[#66ff66]/50 bg-[#66ff66]/15 px-1.5 py-1 text-[9px] font-semibold text-[#66ff66] transition hover:bg-[#66ff66]/25 disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/5 disabled:text-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66ff66]/70" as const;

/** Unsaved draft badge classes. */
export const DEFINING_WORLD_BUILDING_UNSAVED_DRAFT_BADGE_CLASS_NAME =
  "rounded bg-amber-500/20 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-amber-100" as const;

/** Discard build draft dialog overlay classes. */
export const DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_OVERLAY_CLASS_NAME =
  "pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/75 px-4" as const;

/** Discard build draft dialog panel classes. */
export const DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_PANEL_CLASS_NAME =
  "w-full max-w-xs rounded-md border border-white/20 bg-[#0d1b2a]/95 p-4 shadow-lg backdrop-blur-sm" as const;

/** Discard build draft dialog title copy. */
export const DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_TITLE =
  "Discard unsaved build?" as const;

/** Discard build draft dialog body copy. */
export const DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_MESSAGE =
  "You have changes that are not saved yet. Leaving build mode will remove them." as const;

/** Discard build draft dialog keep-building button label. */
export const DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_KEEP_BUILDING_LABEL =
  "Keep building" as const;

/** Discard build draft dialog confirm discard button label. */
export const DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_CONFIRM_LABEL =
  "Discard and exit" as const;

/** Keep building button classes on the discard dialog. */
export const DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_KEEP_BUILDING_BUTTON_CLASS_NAME =
  "w-full rounded border border-white/20 px-2 py-1.5 text-[10px] font-semibold text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;

/** Confirm discard button classes on the discard dialog. */
export const DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_CONFIRM_BUTTON_CLASS_NAME =
  "w-full rounded bg-amber-600/90 px-2 py-1.5 text-[10px] font-semibold text-white transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70" as const;

/** Localhost dev clear-all button classes. */
export const DEFINING_WORLD_BUILDING_DEV_CLEAR_ALL_BUTTON_CLASS_NAME =
  "w-full rounded border border-red-400/40 bg-red-500/10 px-1.5 py-1 text-[9px] font-semibold text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/5 disabled:text-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/70" as const;

/** Localhost dev clear-all button label. */
export const DEFINING_WORLD_BUILDING_DEV_CLEAR_ALL_BUTTON_LABEL =
  "Clear all blocks & plots" as const;

/** Build tile popover outer shell classes. */
export const DEFINING_WORLD_BUILDING_TILE_POPOVER_SHELL_CLASS_NAME =
  "pointer-events-auto flex flex-col items-center" as const;

/** Build tile popover menu panel classes. */
export const DEFINING_WORLD_BUILDING_TILE_POPOVER_PANEL_CLASS_NAME =
  "min-w-[4.75rem] overflow-hidden rounded border border-white/25 bg-[#0d1b2a]/95 shadow-sm divide-y divide-white/10" as const;

/** Build tile popover bottom arrow classes. */
export const DEFINING_WORLD_BUILDING_TILE_POPOVER_ARROW_CLASS_NAME =
  "h-1.5 w-1.5 -mt-[3px] rotate-45 border-r border-b border-white/25 bg-[#0d1b2a]/95" as const;

/** Build tile popover action row classes. */
export const DEFINING_WORLD_BUILDING_TILE_POPOVER_ACTION_BUTTON_CLASS_NAME =
  "flex h-[18px] w-full items-center justify-center border-0 bg-transparent px-0 text-[8px] font-medium leading-none text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#f4d35e]/70 disabled:cursor-not-allowed disabled:text-white/30 disabled:hover:bg-transparent" as const;

/** Build tile popover destructive action row classes. */
export const DEFINING_WORLD_BUILDING_TILE_POPOVER_DESTRUCTIVE_BUTTON_CLASS_NAME =
  "flex h-[18px] w-full items-center justify-center border-0 bg-transparent px-0 text-[8px] font-medium leading-none text-red-300 transition hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-red-300/70 disabled:cursor-not-allowed disabled:text-white/30 disabled:hover:bg-transparent" as const;

/** Build tile popover unavailable message classes. */
export const DEFINING_WORLD_BUILDING_TILE_POPOVER_UNAVAILABLE_TEXT_CLASS_NAME =
  "flex h-[18px] w-full items-center justify-center px-1 text-[8px] leading-none text-white/55" as const;

/** Helper text below build controls. */
export const DEFINING_WORLD_BUILDING_HELPER_TEXT_CLASS_NAME =
  "text-[9px] leading-snug text-white/65" as const;

/** Error text below build controls. */
export const DEFINING_WORLD_BUILDING_ERROR_TEXT_CLASS_NAME =
  "text-[9px] leading-snug text-amber-200" as const;

/** Z-index for placed block pixi layer. */
export const DEFINING_WORLD_BUILDING_PLACED_BLOCKS_Z_INDEX = 12;

/** Fixed z-index so build placement preview always draws above blocks and avatars. */
export {
  DEFINING_WORLD_DEPTH_BUILD_PLACEMENT_PREVIEW_Z_INDEX as DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX,
} from '@/components/world/depth';

/** Sort build tile overlays just beneath avatars at the same isometric depth. */
export {
  DEFINING_WORLD_DEPTH_BUILD_TILE_OVERLAY_Z_INDEX_OFFSET as DEFINING_WORLD_BUILDING_TILE_OVERLAY_Z_INDEX_OFFSET,
} from '@/components/world/depth';

/** Keyboard key that lowers the build placement layer. */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_WORLD_LAYER_DECREASE_KEY =
  "q" as const;

/** Keyboard key that raises the build placement layer. */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_WORLD_LAYER_INCREASE_KEY =
  "e" as const;

/** Layer stepper row layout classes. */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_LAYER_STEPPER_CLASS_NAME =
  "grid grid-cols-[1.75rem_1fr_1.75rem] items-center gap-1" as const;

/** Layer stepper +/- button classes. */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_LAYER_STEPPER_BUTTON_CLASS_NAME =
  "flex h-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-sm font-semibold leading-none text-white/85 transition hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-transparent disabled:text-white/25" as const;

/** Layer stepper number input classes. */
export const DEFINING_WORLD_BUILDING_BUILD_MODE_LAYER_STEPPER_INPUT_CLASS_NAME =
  "h-7 w-full rounded-md border border-white/10 bg-black/30 px-1 text-center text-[11px] font-semibold tabular-nums text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" as const;

/** Fixed square size for cut grid type badges (label text stays 8px). */
export const DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_SIZE_CLASS_NAME =
  "size-6" as const;

/** Cut grid type badge row (2/2, 3/3, 4/4, 5/5). */
export const DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_GRID_CLASS_NAME =
  "ml-auto grid w-fit grid-cols-4 gap-0.5" as const;

/** Square slot that sizes each cut grid type badge. */
export const DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_CELL_CLASS_NAME =
  `relative aspect-square shrink-0 ${DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_SIZE_CLASS_NAME}` as const;

/** Square cut grid type badge button base classes. */
export const DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_BUTTON_CLASS_NAME =
  "absolute inset-0 flex items-center justify-center rounded-sm border border-white/10 bg-white/[0.03] p-0 text-[8px] font-semibold tabular-nums leading-none text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;

/** Square cut grid type badge button selected classes. */
export const DEFINING_WORLD_BUILDING_CUT_GRID_TYPE_BADGE_BUTTON_SELECTED_CLASS_NAME =
  "absolute inset-0 flex items-center justify-center rounded-sm border border-[#f4d35e]/70 bg-[#f4d35e]/20 p-0 text-[8px] font-semibold tabular-nums leading-none text-[#f4d35e] shadow-[0_0_0_1px_rgba(244,211,94,0.25)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;

/** Pointer-drag interaction classes for the cut painter grid. */
export const DEFINING_WORLD_BUILDING_CUT_GRID_PAINTER_INTERACTION_CLASS_NAME =
  "select-none touch-none" as const;

/** Cut footprint grid container classes keyed by axis cell count. */
export const DEFINING_WORLD_BUILDING_CUT_GRID_CLASS_NAMES_BY_AXIS_CELL_COUNT = {
  2: "grid aspect-square w-full grid-cols-2 grid-rows-2 gap-0.5 rounded-md border border-white/10 bg-black/30 p-1",
  3: "grid aspect-square w-full grid-cols-3 grid-rows-3 gap-0.5 rounded-md border border-white/10 bg-black/30 p-1",
  4: "grid aspect-square w-full grid-cols-4 grid-rows-4 gap-0.5 rounded-md border border-white/10 bg-black/30 p-1",
  5: "grid aspect-square w-full grid-cols-5 grid-rows-5 gap-0.5 rounded-md border border-white/10 bg-black/30 p-1",
} as const;

/** Legacy alias for the default 4x4 cut grid container. */
export const DEFINING_WORLD_BUILDING_CUT_GRID_CLASS_NAME =
  DEFINING_WORLD_BUILDING_CUT_GRID_CLASS_NAMES_BY_AXIS_CELL_COUNT[4];

/** Cut footprint empty (unfilled) sub-cell button classes. */
export const DEFINING_WORLD_BUILDING_CUT_CELL_BUTTON_CLASS_NAME =
  "h-full min-h-0 w-full rounded-sm border border-white/10 bg-white/[0.04] transition hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f4d35e]/70" as const;

/** Cut footprint filled sub-cell button classes. */
export const DEFINING_WORLD_BUILDING_CUT_CELL_BUTTON_SELECTED_CLASS_NAME =
  "h-full min-h-0 w-full rounded-sm border border-[#f4d35e]/70 bg-[#f4d35e]/55 transition hover:bg-[#f4d35e]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f4d35e]/70" as const;

/** Cut footprint quick-action button classes (Full / Clear). */
export const DEFINING_WORLD_BUILDING_CUT_ACTION_BUTTON_CLASS_NAME =
  "flex-1 rounded border border-white/15 px-1 py-px text-[8px] font-semibold uppercase tracking-wide text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70" as const;
