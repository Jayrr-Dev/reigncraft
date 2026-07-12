/**
 * Declarative biome icon + tint mapping for claim mode plot cards.
 *
 * @module components/world/building/domains/definingWorldBuildingPlotBiomeIconRegistry
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/** Icon + tint metadata for one biome kind on plot cards. */
export type DefiningWorldBuildingPlotBiomeIconDefinition = {
  /** Bundled Iconify glyph (must be registered in registeringBundledIconifyIcons). */
  readonly iconifyIcon: string;
  /** Icon tint classes. */
  readonly iconClassName: string;
};

/** Fallback icon when a biome kind is missing from the registry. */
export const DEFINING_WORLD_BUILDING_PLOT_BIOME_FALLBACK_ICON: DefiningWorldBuildingPlotBiomeIconDefinition =
  {
    iconifyIcon: 'mdi:land-plots',
    iconClassName: 'text-white/70',
  };

/** Plot card icon registry keyed by biome kind. */
export const DEFINING_WORLD_BUILDING_PLOT_BIOME_ICON_REGISTRY: Record<
  DefiningWorldPlazaBiomeKind,
  DefiningWorldBuildingPlotBiomeIconDefinition
> = {
  plains: { iconifyIcon: 'mdi:grass', iconClassName: 'text-lime-300' },
  forest: { iconifyIcon: 'mdi:pine-tree', iconClassName: 'text-emerald-300' },
  flower_forest: { iconifyIcon: 'mdi:flower', iconClassName: 'text-pink-300' },
  jungle: { iconifyIcon: 'mdi:palm-tree', iconClassName: 'text-green-300' },
  desert: { iconifyIcon: 'mdi:cactus', iconClassName: 'text-amber-200' },
  snowy_plains: { iconifyIcon: 'mdi:snowflake', iconClassName: 'text-sky-200' },
  swamp: { iconifyIcon: 'mdi:water', iconClassName: 'text-teal-300' },
  savanna: {
    iconifyIcon: 'mdi:tree-outline',
    iconClassName: 'text-yellow-300',
  },
  badlands: { iconifyIcon: 'mdi:terrain', iconClassName: 'text-orange-300' },
  beach: { iconifyIcon: 'mdi:beach', iconClassName: 'text-amber-100' },
  ocean: { iconifyIcon: 'mdi:waves', iconClassName: 'text-blue-300' },
  rocky: {
    iconifyIcon: 'mdi:image-filter-hdr',
    iconClassName: 'text-stone-300',
  },
  firelands: { iconifyIcon: 'mdi:fire', iconClassName: 'text-red-400' },
};

/**
 * Resolves the plot card icon definition for one biome kind.
 *
 * @param biomeKind - Biome kind at the plot center.
 */
export function resolvingWorldBuildingPlotBiomeIconDefinition(
  biomeKind: DefiningWorldPlazaBiomeKind
): DefiningWorldBuildingPlotBiomeIconDefinition {
  return (
    DEFINING_WORLD_BUILDING_PLOT_BIOME_ICON_REGISTRY[biomeKind] ??
    DEFINING_WORLD_BUILDING_PLOT_BIOME_FALLBACK_ICON
  );
}
