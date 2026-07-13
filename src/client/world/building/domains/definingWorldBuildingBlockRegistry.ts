import {
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL,
  DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_NATURAL,
  type DefiningWorldBuildingBlockCategory,
  type DefiningWorldBuildingBlockDefinition,
  type DefiningWorldBuildingBlockDefinitionId,
} from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  creatingWorldBuildingCircleCollisionShape,
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE,
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK,
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_JUMP_OVER,
} from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_COLLISION_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_COLLISION_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK,
} from '@/components/world/domains/definingWorldPlazaTerrainObstacleConstants';
import { DEFINING_WORLD_PLAZA_TEMPERATURE_ICE_BLOCK_CELSIUS } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

/**
 * Static registry of lightweight building block definitions.
 *
 * ## Adding a block
 * 1. Export a stable id constant (`basic:wall:stone` style).
 * 2. Add one entry to {@link DEFINING_WORLD_BUILDING_BLOCK_DEFINITIONS}.
 * 3. Set `visualConfig.fillColor` / `strokeColor` for Pixi world rendering.
 * 4. Optionally set `visualConfig.paletteSurface` for a PNG/SVG/CSS swatch.
 * 5. Omit `isPaletteVisible` (defaults to shown) or set `isPaletteVisible: false` to hide.
 * 6. Map the id in {@link resolvingWorldBuildingPlacedBlockTopFaceTextureKind} for
 *    procedural Pixi top-face grain (pine wood, stream water, etc.).
 *
 * ## Removing a block from the palette
 * Set `isPaletteVisible: false` on the definition. The id stays registered so
 * already-placed blocks and procedural pipelines (trees, etc.) keep resolving.
 *
 * @module components/world/building/domains/definingWorldBuildingBlockRegistry
 */

/** Natural tree block id. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK =
  'natural:tree:oak' as const;

/** Large rock block id. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_ROCK_LARGE =
  'natural:rock:large' as const;

/** Stream water block id. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_WATER_STREAM =
  'natural:water:stream' as const;

/** Stone wall block id. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE =
  'basic:wall:stone' as const;

/** Wooden floor block id. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD =
  'basic:floor:wood' as const;

/** Wooden door block id. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_DOOR_WOODEN =
  'functional:door:wooden' as const;

/** Basic chest block id. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_CHEST_BASIC =
  'functional:chest:basic' as const;

/** Wooden sign block id. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_SIGN_WOODEN =
  'functional:sign:wooden' as const;

/** Campfire block id. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE =
  'utility:campfire' as const;

/** Ice block id. Emits cold that freezes nearby surface water. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ICE_BLOCK =
  'utility:ice-block' as const;

/** Decorative flower patch block id. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_DECORATIVE_FLOWER_PATCH =
  'decorative:flower:patch' as const;

/** All registered block definitions keyed by id. */
export const DEFINING_WORLD_BUILDING_BLOCK_DEFINITIONS: Record<
  DefiningWorldBuildingBlockDefinitionId,
  DefiningWorldBuildingBlockDefinition
> = {
  [DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK]: {
    id: DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK,
    name: 'Oak tree',
    category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_NATURAL,
    isPaletteVisible: false,
    collisionShape: creatingWorldBuildingCircleCollisionShape(
      0.68,
      DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK
    ),
    isInteractive: false,
    visualConfig: {
      label: 'Tree',
      fillColor: 0x2d6a4f,
      strokeColor: 0x1b4332,
    },
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_ROCK_LARGE]: {
    id: DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_ROCK_LARGE,
    name: 'Large rock',
    category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_NATURAL,
    isPaletteVisible: false,
    collisionShape: creatingWorldBuildingCircleCollisionShape(
      DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_COLLISION_RADIUS_GRID,
      DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK
    ),
    isInteractive: false,
    visualConfig: {
      label: 'Rock',
      fillColor: 0x6c757d,
      strokeColor: 0x495057,
    },
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_WATER_STREAM]: {
    id: DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_WATER_STREAM,
    name: 'Stream',
    category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_NATURAL,
    isPaletteVisible: false,
    collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_JUMP_OVER,
    isInteractive: false,
    visualConfig: {
      label: 'Stream',
      fillColor: 0x4dabf7,
      strokeColor: 0x1864ab,
    },
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE]: {
    id: DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
    name: 'Stone',
    category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC,
    collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK,
    isInteractive: false,
    visualConfig: {
      label: 'Wall',
      fillColor: 0x868e96,
      strokeColor: 0x343a40,
    },
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD]: {
    id: DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
    name: 'Pine',
    category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC,
    collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE,
    isInteractive: false,
    visualConfig: {
      label: 'Floor',
      fillColor: 0xb08968,
      strokeColor: 0x7f5539,
    },
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_DOOR_WOODEN]: {
    id: DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_DOOR_WOODEN,
    name: 'Wooden door',
    category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL,
    isPaletteVisible: false,
    collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK,
    isInteractive: true,
    visualConfig: {
      label: 'Door',
      fillColor: 0xbc6c25,
      strokeColor: 0x603808,
    },
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_CHEST_BASIC]: {
    id: DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_CHEST_BASIC,
    name: 'Chest',
    category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL,
    isPaletteVisible: false,
    collisionShape: creatingWorldBuildingCircleCollisionShape(
      0.3,
      DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK
    ),
    isInteractive: true,
    visualConfig: {
      label: 'Chest',
      fillColor: 0xe9c46a,
      strokeColor: 0x936639,
    },
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_SIGN_WOODEN]: {
    id: DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_SIGN_WOODEN,
    name: 'Sign',
    category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL,
    isPaletteVisible: false,
    collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE,
    isInteractive: true,
    visualConfig: {
      label: 'Sign',
      fillColor: 0xf4d35e,
      strokeColor: 0x936639,
    },
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_DECORATIVE_FLOWER_PATCH]: {
    id: DEFINING_WORLD_BUILDING_BLOCK_ID_DECORATIVE_FLOWER_PATCH,
    name: 'Flower patch',
    category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE,
    isPaletteVisible: false,
    collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE,
    isInteractive: false,
    visualConfig: {
      label: 'Flowers',
      fillColor: 0xff8fab,
      strokeColor: 0xc9184a,
    },
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE]: {
    id: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
    name: 'Campfire',
    category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL,
    isPaletteVisible: false,
    collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE,
    isInteractive: true,
    visualConfig: {
      label: 'Campfire',
      fillColor: 0x6c584c,
      strokeColor: 0x3d2c29,
    },
  },
  [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ICE_BLOCK]: {
    id: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ICE_BLOCK,
    name: 'Ice block',
    category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL,
    collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK,
    isInteractive: false,
    environmentalTemperature: {
      coldLevelCelsius: DEFINING_WORLD_PLAZA_TEMPERATURE_ICE_BLOCK_CELSIUS,
    },
    visualConfig: {
      label: 'Ice',
      fillColor: 0xa8d8ea,
      strokeColor: 0x4a7c9b,
    },
  },
};

/** Default block selected when entering build mode. */
export const DEFINING_WORLD_BUILDING_DEFAULT_BLOCK_DEFINITION_ID =
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD;

/** Medium rock radius reused by natural rock variants in future expansions. */
export const DEFINING_WORLD_BUILDING_MEDIUM_ROCK_COLLISION_RADIUS_GRID =
  DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_COLLISION_RADIUS_GRID;

/** Ordered palette category ids derived from visible block definitions. */
const LISTING_WORLD_BUILDING_PALETTE_CATEGORY_ORDER: readonly DefiningWorldBuildingBlockCategory[] =
  [
    DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_NATURAL,
    DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC,
    DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL,
    DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE,
  ];

/**
 * Returns true when a block definition should appear in the build palette.
 *
 * @param definition - Block type definition.
 */
export function checkingWorldBuildingBlockDefinitionIsPaletteVisible(
  definition: DefiningWorldBuildingBlockDefinition
): boolean {
  return definition.isPaletteVisible !== false;
}

/**
 * Resolves a block definition from the registry.
 *
 * @param definitionId - Persisted block type id.
 */
export function resolvingWorldBuildingBlockDefinition(
  definitionId: DefiningWorldBuildingBlockDefinitionId
): DefiningWorldBuildingBlockDefinition | null {
  return DEFINING_WORLD_BUILDING_BLOCK_DEFINITIONS[definitionId] ?? null;
}

/**
 * Lists block definitions for one palette category.
 *
 * @param category - Palette category filter.
 */
export function listingWorldBuildingBlockDefinitionsByCategory(
  category: DefiningWorldBuildingBlockDefinition['category']
): DefiningWorldBuildingBlockDefinition[] {
  return Object.values(DEFINING_WORLD_BUILDING_BLOCK_DEFINITIONS).filter(
    (definition) => definition.category === category
  );
}

/**
 * Lists every registered block definition for the build palette.
 */
export function listingWorldBuildingBlockDefinitions(): DefiningWorldBuildingBlockDefinition[] {
  return Object.values(DEFINING_WORLD_BUILDING_BLOCK_DEFINITIONS);
}

/**
 * Lists block definitions visible in the build palette.
 */
export function listingWorldBuildingPaletteBlockDefinitions(): DefiningWorldBuildingBlockDefinition[] {
  return Object.values(DEFINING_WORLD_BUILDING_BLOCK_DEFINITIONS).filter(
    checkingWorldBuildingBlockDefinitionIsPaletteVisible
  );
}

/**
 * Lists palette-visible block definitions for one category.
 *
 * @param category - Palette category filter.
 */
export function listingWorldBuildingPaletteBlockDefinitionsByCategory(
  category: DefiningWorldBuildingBlockDefinition['category']
): DefiningWorldBuildingBlockDefinition[] {
  return listingWorldBuildingPaletteBlockDefinitions().filter(
    (definition) => definition.category === category
  );
}

/**
 * Lists palette categories that have at least one visible block, in display order.
 */
export function listingWorldBuildingPaletteCategories(): DefiningWorldBuildingBlockCategory[] {
  const visibleCategories = new Set(
    listingWorldBuildingPaletteBlockDefinitions().map(
      (definition) => definition.category
    )
  );

  return LISTING_WORLD_BUILDING_PALETTE_CATEGORY_ORDER.filter((category) =>
    visibleCategories.has(category)
  );
}
