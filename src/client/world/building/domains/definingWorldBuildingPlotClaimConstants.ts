import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';

/**
 * Visual tuning for plot claim tiles rendered in the world.
 *
 * @module components/world/building/domains/definingWorldBuildingPlotClaimConstants
 */

/** World layer where plot ownership is visualized (ground). */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER =
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;

/** Purple fill for owned temporary build tiles in claim mode. */
export const DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_FILL_COLOR = 0x9333ea;

/** Dashed border color for owned temporary build tiles in claim mode. */
export const DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_BORDER_COLOR = 0x581c87;

/** Owned temporary plot tile fill alpha. */
export const DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_TOP_FILL_ALPHA = 0.55;

/** Orange fill for owned and valid preview plot tiles. */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIM_FILL_COLOR = 0xf97316;

/** Dashed border color for plot claim tiles. */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIM_BORDER_COLOR = 0x000000;

/** Owned plot tile fill alpha. */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIM_TOP_FILL_ALPHA = 0.42;

/** Valid claim preview fill alpha. */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIM_PREVIEW_FILL_ALPHA = 0.34;

/** Invalid claim preview fill color. */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIM_INVALID_PREVIEW_COLOR = 0xff3366;

/** Blue fill for tiles the local player can claim next to owned plots. */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_FILL_COLOR = 0x38bdf8;

/** Claimable tile fill alpha in claim mode. */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_TOP_FILL_ALPHA = 0.3;

/** Valid claim hover preview fill alpha. */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_PREVIEW_FILL_ALPHA = 0.42;

/** Minimap CSS color for owned temporary plot tiles. */
export const DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_MINI_MAP_FILL_COLOR =
  'rgba(147, 51, 234, 0.72)' as const;

/** Minimap CSS border for owned temporary plot tiles. */
export const DEFINING_WORLD_BUILDING_PLOT_TEMPORARY_CLAIM_MINI_MAP_BORDER_COLOR =
  'rgba(88, 28, 135, 0.9)' as const;

/** Minimap CSS color for claimable plot tiles. */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIMABLE_MINI_MAP_FILL_COLOR =
  'rgba(56, 189, 248, 0.55)' as const;

/** Minimap CSS color for owned plot tiles. */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIM_MINI_MAP_FILL_COLOR =
  'rgba(249, 115, 22, 0.72)' as const;

/** Minimap CSS border for owned plot tiles. */
export const DEFINING_WORLD_BUILDING_PLOT_CLAIM_MINI_MAP_BORDER_COLOR =
  'rgba(0, 0, 0, 0.85)' as const;

/** Blue fill for plots owned by other players in claim mode. */
export const DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_FILL_COLOR = 0xc084fc;

/** Other-owner plot tile fill alpha in claim mode. */
export const DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_TOP_FILL_ALPHA = 0.28;

/** Minimap CSS color for other-owner plot tiles. */
export const DEFINING_WORLD_BUILDING_PLOT_OTHER_OWNER_MINI_MAP_FILL_COLOR =
  'rgba(192, 132, 252, 0.55)' as const;
