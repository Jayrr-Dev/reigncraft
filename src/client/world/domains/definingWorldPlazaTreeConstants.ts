import type { DefiningWorldPlazaBiomeKind } from "@/components/world/domains/definingWorldPlazaBiomeKind";

/**
 * Biome-aware tree catalog and placement tuning for the plaza world.
 *
 * Each biome draws from a weighted set of tree species, so a single forest mixes
 * oaks, birches, and pines instead of cloning one silhouette. Placement stays
 * deterministic (see {@link resolvingWorldPlazaTreeAtTileIndex}) so rendering and
 * collision agree across clients without shared runtime state.
 *
 * @module components/world/domains/definingWorldPlazaTreeConstants
 */

/** Distinct tree silhouettes drawn across biomes. */
export type DefiningWorldPlazaTreeVariantKind =
  | "oak"
  | "blossom"
  | "willow"
  | "acacia"
  | "spruce"
  | "birch"
  | "pine"
  | "palm"
  | "deadwood"
  | "cactus";

/** One drawable tree species with its own silhouette, palette, and size. */
export interface DefiningWorldPlazaTreeSpecies {
  /** Silhouette drawn for this species. */
  variant: DefiningWorldPlazaTreeVariantKind;
  /** Trunk fill color. */
  trunkColor: number;
  /** Layered canopy colors: [base, shade, accent]. */
  canopyColors: readonly [number, number, number];
  /** Minimum visual size multiplier. */
  minScale: number;
  /** Maximum visual size multiplier. */
  maxScale: number;
  /** Trunk block radius in grid tiles. */
  collisionRadiusGrid: number;
}

/** A species paired with its relative spawn weight inside one biome. */
export interface DefiningWorldPlazaTreeSpeciesWeight {
  /** Species to spawn. */
  species: DefiningWorldPlazaTreeSpecies;
  /** Relative weight against the other species in the biome. */
  weight: number;
}

/** Runtime tree placement rules for one biome. */
export interface DefiningWorldPlazaTreeBiomeConfig {
  /**
   * Woodland patch noise must exceed this value in [0, 1).
   * Lower means more tree coverage inside noise patches.
   */
  woodlandThreshold: number;
  /** Weighted species pool the biome rolls from per tree. */
  species: readonly DefiningWorldPlazaTreeSpeciesWeight[];
}

/** Salt for the per-tree size roll. */
export const DEFINING_WORLD_PLAZA_TREE_SCALE_SALT = 137;

/** Salt for the per-tree horizontal jitter roll. */
export const DEFINING_WORLD_PLAZA_TREE_OFFSET_X_SALT = 211;

/** Salt for the per-tree vertical jitter roll. */
export const DEFINING_WORLD_PLAZA_TREE_OFFSET_Y_SALT = 233;

/** Salt for the per-tree species roll within a biome's weighted pool. */
export const DEFINING_WORLD_PLAZA_TREE_SPECIES_SALT = 307;

/** Horizontal jitter range applied to a tree base (screen px, +/-). */
export const DEFINING_WORLD_PLAZA_TREE_OFFSET_X_RANGE_PX = 5;

/** Vertical jitter range applied to a tree base (screen px, +/-). */
export const DEFINING_WORLD_PLAZA_TREE_OFFSET_Y_RANGE_PX = 2;

/**
 * Extra screen-Y added to canopy depth sorting so the foliage covers avatars
 * standing under the crown instead of letting them walk on top.
 *
 * Multiplied by each tree's final visual scale at sort time.
 */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_MIN_DEPTH_SORT_SOUTH_EXTENT_PX = 38;

/** @deprecated Use {@link DEFINING_WORLD_PLAZA_TREE_CANOPY_MIN_DEPTH_SORT_SOUTH_EXTENT_PX}. */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_DEPTH_SORT_OFFSET_PX =
  DEFINING_WORLD_PLAZA_TREE_CANOPY_MIN_DEPTH_SORT_SOUTH_EXTENT_PX;

/**
 * Keep a clearing around the world origin so spawning players never start
 * trapped inside a trunk.
 */
export const DEFINING_WORLD_PLAZA_TREE_SPAWN_CLEARING_RADIUS_GRID = 4;

/** Squared spawn clearing radius (avoids a sqrt in the hot path). */
export const DEFINING_WORLD_PLAZA_TREE_SPAWN_CLEARING_RADIUS_SQUARED =
  DEFINING_WORLD_PLAZA_TREE_SPAWN_CLEARING_RADIUS_GRID *
  DEFINING_WORLD_PLAZA_TREE_SPAWN_CLEARING_RADIUS_GRID;

/** Renders trunks above procedural terrain columns at the same foot depth. */
export {
  DEFINING_WORLD_DEPTH_TREE_TRUNK_TERRAIN_COLUMN_DEPTH_BIAS as DEFINING_WORLD_PLAZA_TREE_TRUNK_TERRAIN_COLUMN_DEPTH_BIAS,
} from '@/components/world/depth';

/*
 * Canonical tree species catalog.
 *
 * Each species is defined exactly once. "Cross-biome" species are shared by
 * several biome pools below; "biome-exclusive" species appear in a single biome.
 * Biome identity comes from which species a biome mixes and at what weights, not
 * from redefining a species per biome.
 */

// ---------------------------------------------------------------------------
// Cross-biome species (shared by multiple biomes)
// ---------------------------------------------------------------------------

/** Broadleaf oak. Shared by plains, forest, and flower forests. */
const DEFINING_WORLD_PLAZA_TREE_SPECIES_OAK: DefiningWorldPlazaTreeSpecies = {
  variant: "oak",
  trunkColor: 0x654731,
  canopyColors: [0x4a8a37, 0x366627, 0x63a843],
  minScale: 1.05,
  maxScale: 1.42,
  collisionRadiusGrid: 0.68,
};

/** Slender white-barked birch. Shared by plains, forest, flower, snowy. */
const DEFINING_WORLD_PLAZA_TREE_SPECIES_BIRCH: DefiningWorldPlazaTreeSpecies = {
  variant: "birch",
  trunkColor: 0xe8e6dc,
  canopyColors: [0x7cae4c, 0x5e8c39, 0x9ccb63],
  minScale: 1.0,
  maxScale: 1.35,
  collisionRadiusGrid: 0.5,
};

/** Tall dark conifer. Shared by plains, forest, and snowy plains. */
const DEFINING_WORLD_PLAZA_TREE_SPECIES_PINE: DefiningWorldPlazaTreeSpecies = {
  variant: "pine",
  trunkColor: 0x5a3f29,
  canopyColors: [0x2f6b3a, 0x214f2c, 0x4a8a52],
  minScale: 1.1,
  maxScale: 1.55,
  collisionRadiusGrid: 0.6,
};

/** Bare, branching dead tree. Shared by swamp, savanna, and badlands. */
const DEFINING_WORLD_PLAZA_TREE_SPECIES_DEADWOOD: DefiningWorldPlazaTreeSpecies = {
  variant: "deadwood",
  trunkColor: 0x6b5b46,
  canopyColors: [0x5a4d3a, 0x473d2e, 0x7a6a52],
  minScale: 1.0,
  maxScale: 1.45,
  collisionRadiusGrid: 0.55,
};

/** Saguaro cactus with yellow flowers. Shared by desert and badlands. */
const DEFINING_WORLD_PLAZA_TREE_SPECIES_CACTUS: DefiningWorldPlazaTreeSpecies = {
  variant: "cactus",
  trunkColor: 0x3a7733,
  canopyColors: [0x4f9a44, 0x3a7733, 0xf2d65a],
  minScale: 0.9,
  maxScale: 1.3,
  collisionRadiusGrid: 0.6,
};

// ---------------------------------------------------------------------------
// Biome-exclusive species (each appears in exactly one biome)
// ---------------------------------------------------------------------------

/** Pink-flecked blossom tree. Exclusive to flower forests. */
const DEFINING_WORLD_PLAZA_TREE_SPECIES_BLOSSOM: DefiningWorldPlazaTreeSpecies = {
  variant: "blossom",
  trunkColor: 0x6b4a2f,
  canopyColors: [0x6bb04a, 0x4f8f3a, 0xffb7d5],
  minScale: 1.05,
  maxScale: 1.4,
  collisionRadiusGrid: 0.68,
};

/** Droopy willow. Exclusive to swamps. */
const DEFINING_WORLD_PLAZA_TREE_SPECIES_WILLOW: DefiningWorldPlazaTreeSpecies = {
  variant: "willow",
  trunkColor: 0x4a3a2a,
  canopyColors: [0x6f8f4a, 0x536b34, 0x86a85c],
  minScale: 1.1,
  maxScale: 1.5,
  collisionRadiusGrid: 0.68,
};

/** Flat-crowned acacia. Exclusive to savanna. */
const DEFINING_WORLD_PLAZA_TREE_SPECIES_ACACIA: DefiningWorldPlazaTreeSpecies = {
  variant: "acacia",
  trunkColor: 0x7a5a38,
  canopyColors: [0x8a9a45, 0x6e7d34, 0xa3b257],
  minScale: 1.15,
  maxScale: 1.55,
  collisionRadiusGrid: 0.68,
};

/** Snow-dusted spruce. Exclusive to snowy plains. */
const DEFINING_WORLD_PLAZA_TREE_SPECIES_SPRUCE: DefiningWorldPlazaTreeSpecies = {
  variant: "spruce",
  trunkColor: 0x4a3a2a,
  canopyColors: [0x2f6b4a, 0x21503a, 0xf2f7fb],
  minScale: 1.1,
  maxScale: 1.5,
  collisionRadiusGrid: 0.68,
};

/** Tropical palm. Exclusive to beaches. */
const DEFINING_WORLD_PLAZA_TREE_SPECIES_PALM: DefiningWorldPlazaTreeSpecies = {
  variant: "palm",
  trunkColor: 0x7a5733,
  canopyColors: [0x4fae5a, 0x3a8243, 0x6fc97a],
  minScale: 1.1,
  maxScale: 1.5,
  collisionRadiusGrid: 0.55,
};

/** Lookup table for placeable tree variants. */
const DEFINING_WORLD_PLAZA_TREE_SPECIES_BY_VARIANT: Record<
  DefiningWorldPlazaTreeVariantKind,
  DefiningWorldPlazaTreeSpecies
> = {
  oak: DEFINING_WORLD_PLAZA_TREE_SPECIES_OAK,
  blossom: DEFINING_WORLD_PLAZA_TREE_SPECIES_BLOSSOM,
  willow: DEFINING_WORLD_PLAZA_TREE_SPECIES_WILLOW,
  acacia: DEFINING_WORLD_PLAZA_TREE_SPECIES_ACACIA,
  spruce: DEFINING_WORLD_PLAZA_TREE_SPECIES_SPRUCE,
  birch: DEFINING_WORLD_PLAZA_TREE_SPECIES_BIRCH,
  pine: DEFINING_WORLD_PLAZA_TREE_SPECIES_PINE,
  palm: DEFINING_WORLD_PLAZA_TREE_SPECIES_PALM,
  deadwood: DEFINING_WORLD_PLAZA_TREE_SPECIES_DEADWOOD,
  cactus: DEFINING_WORLD_PLAZA_TREE_SPECIES_CACTUS,
};

/**
 * Returns the catalog species entry for a tree variant.
 *
 * @param variant - Tree silhouette kind.
 */
export function resolvingWorldPlazaTreeSpeciesForVariant(
  variant: DefiningWorldPlazaTreeVariantKind,
): DefiningWorldPlazaTreeSpecies {
  return DEFINING_WORLD_PLAZA_TREE_SPECIES_BY_VARIANT[variant];
}

/**
 * Per-biome weighted tree pools. Biomes absent here stay treeless.
 *
 * Each biome curates which species can grow there and at what relative weights.
 * Cross-biome species (oak, birch, pine, deadwood, cactus) reuse the same
 * catalog entry across the biomes that list them.
 */
export const DEFINING_WORLD_PLAZA_TREE_BIOME_CONFIG: Partial<
  Record<DefiningWorldPlazaBiomeKind, DefiningWorldPlazaTreeBiomeConfig>
> = {
  plains: {
    woodlandThreshold: 0.64,
    species: [
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_OAK, weight: 6 },
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_BIRCH, weight: 2 },
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_PINE, weight: 1 },
    ],
  },
  forest: {
    woodlandThreshold: 0.34,
    species: [
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_OAK, weight: 5 },
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_BIRCH, weight: 3 },
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_PINE, weight: 3 },
    ],
  },
  flower_forest: {
    woodlandThreshold: 0.38,
    species: [
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_BLOSSOM, weight: 5 },
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_OAK, weight: 2 },
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_BIRCH, weight: 2 },
    ],
  },
  swamp: {
    woodlandThreshold: 0.46,
    species: [
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_WILLOW, weight: 5 },
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_DEADWOOD, weight: 2 },
    ],
  },
  savanna: {
    woodlandThreshold: 0.58,
    species: [
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_ACACIA, weight: 6 },
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_DEADWOOD, weight: 2 },
    ],
  },
  snowy_plains: {
    woodlandThreshold: 0.5,
    species: [
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_SPRUCE, weight: 5 },
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_PINE, weight: 3 },
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_BIRCH, weight: 1 },
    ],
  },
  desert: {
    woodlandThreshold: 0.72,
    species: [{ species: DEFINING_WORLD_PLAZA_TREE_SPECIES_CACTUS, weight: 1 }],
  },
  badlands: {
    woodlandThreshold: 0.7,
    species: [
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_DEADWOOD, weight: 3 },
      { species: DEFINING_WORLD_PLAZA_TREE_SPECIES_CACTUS, weight: 1 },
    ],
  },
  beach: {
    woodlandThreshold: 0.7,
    species: [{ species: DEFINING_WORLD_PLAZA_TREE_SPECIES_PALM, weight: 1 }],
  },
  ocean: {
    woodlandThreshold: 1,
    species: [],
  },
};

/** Tree silhouettes whose flat canopy tops act as standable platforms. */
export const DEFINING_WORLD_PLAZA_TREE_STANDABLE_FLAT_CANOPY_VARIANTS: ReadonlySet<DefiningWorldPlazaTreeVariantKind> =
  new Set(["acacia", "willow", "spruce", "pine"]);

/**
 * Returns true when a tree variant exposes a flat canopy the player can stand on.
 *
 * @param variant - Tree silhouette kind.
 */
export function checkingWorldPlazaTreeVariantHasStandableFlatCanopy(
  variant: DefiningWorldPlazaTreeVariantKind,
): boolean {
  return DEFINING_WORLD_PLAZA_TREE_STANDABLE_FLAT_CANOPY_VARIANTS.has(variant);
}
