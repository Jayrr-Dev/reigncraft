/**
 * Maps build palette categories to Iconify icons and labels for the category tab strip.
 *
 * @module components/world/building/domains/resolvingWorldBuildingBlockPaletteIcon
 */

import {
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FLOORS,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_NATURAL,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_ORES,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_REFINED,
  type DefiningWorldBuildingBlockCategory,
} from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';

/** Fallback Iconify icon when a category has no explicit mapping. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_FALLBACK_CATEGORY_ICON =
  'mdi:view-grid-outline' as const;

/** Fallback label when a category has no explicit mapping. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_FALLBACK_CATEGORY_LABEL =
  'Blocks' as const;

/** Metadata for one palette category tab. */
export type ResolvingWorldBuildingBlockPaletteCategoryMetadata = {
  readonly label: string;
  readonly iconifyIcon: string;
};

/** Label and Iconify icon shown per palette category tab. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_CATEGORY_METADATA_BY_CATEGORY: Record<
  DefiningWorldBuildingBlockCategory,
  ResolvingWorldBuildingBlockPaletteCategoryMetadata
> = {
  [DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_NATURAL]: {
    label: 'Natural',
    iconifyIcon: 'mdi:leaf',
  },
  [DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC]: {
    label: 'Basic',
    iconifyIcon: 'mdi:view-grid-outline',
  },
  [DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FLOORS]: {
    label: 'Wood',
    iconifyIcon: 'mdi:pine-tree',
  },
  [DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_ORES]: {
    label: 'Ore',
    iconifyIcon: 'game-icons:stone-pile',
  },
  [DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_REFINED]: {
    label: 'Refined',
    iconifyIcon: 'mdi:anvil',
  },
  [DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL]: {
    label: 'Utility',
    iconifyIcon: 'mdi:snowflake',
  },
  [DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE]: {
    label: 'Flowers',
    iconifyIcon: 'mdi:flower',
  },
};

/**
 * Resolves display metadata for a palette category tab.
 *
 * @param category - Palette category.
 */
export function resolvingWorldBuildingBlockPaletteCategoryMetadata(
  category: DefiningWorldBuildingBlockCategory
): ResolvingWorldBuildingBlockPaletteCategoryMetadata {
  return (
    RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_CATEGORY_METADATA_BY_CATEGORY[
      category
    ] ?? {
      label: RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_FALLBACK_CATEGORY_LABEL,
      iconifyIcon: RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_FALLBACK_CATEGORY_ICON,
    }
  );
}

/**
 * Resolves the Iconify icon id for a palette category tab.
 *
 * @param category - Palette category.
 */
export function resolvingWorldBuildingBlockPaletteCategoryIcon(
  category: DefiningWorldBuildingBlockCategory
): string {
  return resolvingWorldBuildingBlockPaletteCategoryMetadata(category)
    .iconifyIcon;
}

/**
 * Resolves the display label for a palette category tab.
 *
 * @param category - Palette category.
 */
export function resolvingWorldBuildingBlockPaletteCategoryLabel(
  category: DefiningWorldBuildingBlockCategory
): string {
  return resolvingWorldBuildingBlockPaletteCategoryMetadata(category).label;
}
