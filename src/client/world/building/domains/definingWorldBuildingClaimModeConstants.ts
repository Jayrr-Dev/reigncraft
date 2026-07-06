/**
 * Claim mode UI styling constants.
 *
 * @module components/world/building/domains/definingWorldBuildingClaimModeConstants
 */

import { DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS } from '@/components/ui/domains/definingReigncraftBadgeConstants';
import { resolvingReigncraftTextBadgeShellClassName } from '@/components/ui/domains/resolvingReigncraftBadgeClassNames';

/** Claim mode sidebar width (Tailwind class). */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_SIDEBAR_WIDTH_CLASS_NAME =
  'w-[196px]' as const;

/** Right-side claim mode sidebar shell. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_SIDEBAR_CLASS_NAME =
  'pointer-events-auto flex h-full min-h-0 flex-col gap-2 border-l border-white/20 bg-[#0d1b2a]/92 p-2 shadow-lg backdrop-blur-sm' as const;

/** Anchor for the claim sidebar along the plaza viewport right edge. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_SIDEBAR_ANCHOR_CLASS_NAME =
  'pointer-events-none absolute inset-y-0 right-0 z-40 flex min-h-0 flex-col pt-2 pb-16' as const;

/** Shared top-right anchor for collapsed build/claim mode toggles. */
export const DEFINING_WORLD_BUILDING_EDIT_MODE_COLLAPSED_TOGGLE_ANCHOR_CLASS_NAME =
  'pointer-events-none absolute right-2 top-2 z-30 flex flex-col items-end gap-1' as const;

/** Claim mode toggle button classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_TOGGLE_BUTTON_CLASS_NAME =
  'pointer-events-auto rounded-md border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70' as const;

/** Active claim mode toggle button classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_TOGGLE_BUTTON_ACTIVE_CLASS_NAME =
  'pointer-events-auto rounded-md border border-sky-300/70 bg-sky-400/20 px-2.5 py-1 text-[10px] font-semibold text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70' as const;

/** Claim mode plot list section label classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_SECTION_LABEL_CLASS_NAME =
  'text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45' as const;

/** Claim mode capacity badge row layout classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_ROW_CLASS_NAME =
  'flex w-full min-w-0 items-stretch gap-1' as const;

/** Claim mode capacity badge shared shell classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_BASE_CLASS_NAME =
  'flex h-5 min-w-0 max-w-full flex-[1_1_calc((100%-0.25rem)/2)] flex-row items-center justify-center gap-1 rounded-sm border px-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]' as const;

/** Claim mode capacity badge label classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_LABEL_CLASS_NAME =
  'text-[7px] font-semibold uppercase tracking-[0.14em]' as const;

/** Claim mode capacity badge value classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_VALUE_CLASS_NAME =
  'text-[11px] font-bold leading-none tabular-nums tracking-tight' as const;

/** Claim mode capacity badge max denominator classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_MAX_VALUE_CLASS_NAME =
  'text-[10px] font-semibold text-white/45' as const;

/** Claim mode plot capacity badge classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_PLOT_BADGE_CLASS_NAME =
  'border-[#f97316]/55 bg-[#f97316]/20' as const;

/** Claim mode plot capacity badge label classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_PLOT_BADGE_LABEL_CLASS_NAME =
  'text-[#f4d35e]/85' as const;

/** Claim mode plot capacity badge value classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_PLOT_BADGE_VALUE_CLASS_NAME =
  'text-[#f4d35e]' as const;

/** Claim mode tile capacity badge classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_CLASS_NAME =
  'border-sky-300/55 bg-sky-400/18' as const;

/** Claim mode tile capacity badge label classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_LABEL_CLASS_NAME =
  'text-sky-100/80' as const;

/** Claim mode tile capacity badge value classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_TILE_BADGE_VALUE_CLASS_NAME =
  'text-sky-50' as const;

/** Claim mode capacity badge classes when the limit is reached. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_CLASS_NAME =
  'border-amber-300/60 bg-amber-400/16' as const;

/** Claim mode capacity badge label classes when the limit is reached. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_LABEL_CLASS_NAME =
  'text-amber-100/85' as const;

/** Claim mode capacity badge value classes when the limit is reached. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_AT_MAX_VALUE_CLASS_NAME =
  'text-amber-50' as const;

/** Claim mode plot list scroll container classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_LIST_CLASS_NAME =
  'flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-0.5' as const;

/** Claim mode owner group card classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_OWNER_GROUP_CLASS_NAME =
  'rounded border border-white/10 bg-white/[0.03] p-1.5' as const;

/** Claim mode owner group title classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_OWNER_GROUP_TITLE_CLASS_NAME =
  'truncate text-[10px] font-semibold text-white/90' as const;

/** Claim mode local owner group title classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_LOCAL_OWNER_GROUP_TITLE_CLASS_NAME =
  'truncate text-[10px] font-semibold text-[#f4d35e]' as const;

/** Claim mode plot badge grid (three-column wrapping flex). */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_BADGE_GRID_CLASS_NAME =
  'mt-1 flex flex-wrap gap-1' as const;

/** Claim mode plot coordinate badge base classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_BADGE_CLASS_NAME =
  'h-5 min-w-0 flex-[1_1_calc((100%-0.5rem)/2)] max-w-full shrink-0 justify-center truncate rounded-sm px-0.5 text-[9px] font-medium tabular-nums' as const;

/** Claim mode plot teleport button classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_TELEPORT_BUTTON_CLASS_NAME =
  'h-5 shrink-0 rounded-sm border border-sky-300/40 bg-sky-400/10 px-1 text-[8px] font-semibold text-sky-100 transition hover:bg-sky-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70' as const;

/** Claim mode friend plot visit request button classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_VISIT_BUTTON_CLASS_NAME =
  'h-5 shrink-0 rounded-sm border border-violet-300/40 bg-violet-400/10 px-1 text-[8px] font-semibold text-violet-100 transition hover:bg-violet-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/5 disabled:text-white/35' as const;

/** Claim mode local player plot badge classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_LOCAL_PLOT_BADGE_CLASS_NAME =
  resolvingReigncraftTextBadgeShellClassName(
    DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS.localPlotCoordinate
  );

/** Claim mode other player plot badge classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_OTHER_PLOT_BADGE_CLASS_NAME =
  resolvingReigncraftTextBadgeShellClassName(
    DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS.otherPlotCoordinate
  );

/** Claim mode error text classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_ERROR_TEXT_CLASS_NAME =
  'text-[9px] leading-snug text-amber-200' as const;

/** Claim mode save button classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_SAVE_BUTTON_CLASS_NAME =
  'w-full rounded border border-sky-300/50 bg-sky-400/15 px-1.5 py-1 text-[9px] font-semibold text-sky-100 transition hover:bg-sky-400/25 disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/5 disabled:text-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70' as const;

/** TanStack Query key root for the plot registry. */
export const DEFINING_WORLD_BUILDING_PLOTS_REGISTRY_QUERY_KEY_ROOT =
  'world-building-plots-registry' as const;

/** TanStack Query key root for plot owner display labels. */
export const DEFINING_WORLD_BUILDING_PLOT_OWNER_LABELS_QUERY_KEY_ROOT =
  'world-building-plot-owner-labels' as const;

/** Claim mode legend swatch for temporary local plots. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_TEMPORARY_SWATCH_CLASS_NAME =
  'h-2.5 w-2.5 rounded-sm border border-blue-900/80 bg-blue-600/80' as const;

/** Claim mode legend swatch for local plots. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OWNED_SWATCH_CLASS_NAME =
  'h-2.5 w-2.5 rounded-sm border border-black/80 bg-[#f97316]/80' as const;

/** Claim mode legend swatch for other plots. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OTHER_SWATCH_CLASS_NAME =
  'h-2.5 w-2.5 rounded-sm border border-black/80 bg-violet-400/55' as const;

/** Claim mode legend swatch for claimable plots. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_CLAIMABLE_SWATCH_CLASS_NAME =
  'h-2.5 w-2.5 rounded-sm border border-black/80 bg-sky-400/55' as const;

/** Claim mode legend label classes. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME =
  'text-[8px] text-white/60' as const;

/** Opacity for placed blocks while claim mode is active. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_PLACED_BLOCK_ALPHA = 0.85;

/** Max interval between two taps that count as a claim popover double tap (ms). */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_TILE_POPOVER_DOUBLE_TAP_MAX_INTERVAL_MS = 350;

/** Max pointer drift between two claim popover double taps (pixels). */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_TILE_POPOVER_DOUBLE_TAP_MAX_DISTANCE_PX = 28;

/**
 * Floor-layer z-index for claim tiles so they sit above grass chunks but below
 * entity-layer blocks and avatars.
 */
export {
  DEFINING_WORLD_DEPTH_CLAIM_MODE_PLOT_OVERLAY_ENTITY_Z_INDEX_GAP_BELOW_AVATAR as DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_ENTITY_Z_INDEX_GAP_BELOW_AVATAR,
  DEFINING_WORLD_DEPTH_CLAIM_MODE_PLOT_OVERLAY_FLOOR_Z_INDEX as DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_FLOOR_Z_INDEX,
} from '@/components/world/depth';

/** Small sort nudge for entity-layer claim tiles near cliff faces. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_DEPTH_SORT_SOUTH_GRID_FRACTION = 0.12;

/** Extrusion height (layers) for claim markers on raised terrain. */
export const DEFINING_WORLD_BUILDING_CLAIM_MODE_PLOT_OVERLAY_RAISED_TERRAIN_BLOCK_HEIGHT_LAYERS = 1;
