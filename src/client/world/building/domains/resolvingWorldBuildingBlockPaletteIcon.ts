/**
 * Maps build palette categories to Lucide icons and labels for the category tab strip.
 *
 * @module components/world/building/domains/resolvingWorldBuildingBlockPaletteIcon
 */

import {
  Blocks as BlocksIcon,
  Cog as CogIcon,
  Flower2 as Flower2Icon,
  Leaf as LeafIcon,
  type LucideIcon,
} from "lucide-react";

import {
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_NATURAL,
  type DefiningWorldBuildingBlockCategory,
} from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";

/** Fallback Lucide icon when a category has no explicit mapping. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_FALLBACK_CATEGORY_ICON =
  BlocksIcon;

/** Fallback label when a category has no explicit mapping. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_FALLBACK_CATEGORY_LABEL =
  "Blocks" as const;

/** Metadata for one palette category tab. */
export interface ResolvingWorldBuildingBlockPaletteCategoryMetadata {
  readonly label: string;
  readonly icon: LucideIcon;
}

/** Label and Lucide icon shown per palette category tab. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_CATEGORY_METADATA_BY_CATEGORY: Record<
  DefiningWorldBuildingBlockCategory,
  ResolvingWorldBuildingBlockPaletteCategoryMetadata
> = {
  [DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_NATURAL]: {
    label: "Natural",
    icon: LeafIcon,
  },
  [DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC]: {
    label: "Basic",
    icon: BlocksIcon,
  },
  [DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL]: {
    label: "Functional",
    icon: CogIcon,
  },
  [DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE]: {
    label: "Decorative",
    icon: Flower2Icon,
  },
};

/**
 * Resolves display metadata for a palette category tab.
 *
 * @param category - Palette category.
 */
export function resolvingWorldBuildingBlockPaletteCategoryMetadata(
  category: DefiningWorldBuildingBlockCategory,
): ResolvingWorldBuildingBlockPaletteCategoryMetadata {
  return (
    RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_CATEGORY_METADATA_BY_CATEGORY[
      category
    ] ?? {
      label: RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_FALLBACK_CATEGORY_LABEL,
      icon: RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_FALLBACK_CATEGORY_ICON,
    }
  );
}

/**
 * Resolves the Lucide icon component for a palette category tab.
 *
 * @param category - Palette category.
 */
export function resolvingWorldBuildingBlockPaletteCategoryIcon(
  category: DefiningWorldBuildingBlockCategory,
): LucideIcon {
  return resolvingWorldBuildingBlockPaletteCategoryMetadata(category).icon;
}

/**
 * Resolves the display label for a palette category tab.
 *
 * @param category - Palette category.
 */
export function resolvingWorldBuildingBlockPaletteCategoryLabel(
  category: DefiningWorldBuildingBlockCategory,
): string {
  return resolvingWorldBuildingBlockPaletteCategoryMetadata(category).label;
}
