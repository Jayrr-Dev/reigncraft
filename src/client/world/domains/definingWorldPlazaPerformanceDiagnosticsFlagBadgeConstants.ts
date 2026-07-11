/**
 * Perf overlay Flags tab: badge styling and display order for bisect toggles.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceDiagnosticsFlagBadgeConstants
 */

import {
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE,
  type DefiningWorldPlazaGenerationFeatureId,
} from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';

/** Compact badge when the feature is currently enabled. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_ON_CLASS_NAME =
  'rounded-full border border-lime-300/70 bg-lime-500/25 px-2 py-0.5 text-[9px] font-semibold text-lime-50 shadow-sm transition hover:bg-lime-500/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-300/70' as const;

/** Compact badge when the feature is currently disabled. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_OFF_CLASS_NAME =
  'rounded-full border border-amber-200/25 bg-black/30 px-2 py-0.5 text-[9px] font-semibold text-amber-100/45 transition hover:border-amber-200/45 hover:text-amber-100/75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300/50' as const;

/** Small action chip (All on / All off). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME =
  'rounded border border-amber-200/30 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-50 hover:bg-amber-400/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300/70' as const;

/**
 * Perf-first order for nuance flags (HUD / systems before world gen water).
 * Registry entries not listed still appear after, in registry order.
 */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRIORITY_ORDER: readonly DefiningWorldPlazaGenerationFeatureId[] =
  [
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_MINIMAP,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_ACTION_BAR,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_HOTBAR,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_DAY_NIGHT,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_STATUS,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_WORLD_ANCHORS,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.DOM_OVERLAYS,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.AUDIO_SFX,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.PROJECTILES,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.FLOOR_TILES,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.ELEVATION,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.BIOMES,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.COLUMN_ROCKS,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STONE_DECORATIONS,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAVA,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.OCEAN,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LAKES,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.RIVERS,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STREAMS,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.PONDS,
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SWAMP_PONDS,
  ];
