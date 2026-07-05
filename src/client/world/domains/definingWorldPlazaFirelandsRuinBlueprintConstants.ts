/**
 * Hand-authored ruin layouts for clustered Firelands construction props.
 *
 * @module components/world/domains/definingWorldPlazaFirelandsRuinBlueprintConstants
 */

/** Stable ids for Firelands ruin blueprint layouts. */
export type DefiningWorldPlazaFirelandsRuinBlueprintId =
  | 'forge_camp'
  | 'portal_shrine'
  | 'obelisk_circle'
  | 'bastion_settlement';

/** One prop placement relative to a ruin anchor tile. */
export type DefiningWorldPlazaFirelandsRuinBlueprintProp = {
  /** Offset from the ruin anchor column. */
  readonly offsetTileX: number;
  /** Offset from the ruin anchor row. */
  readonly offsetTileY: number;
  /** Prop kind to render at this offset. */
  readonly propKind: DefiningWorldPlazaFirelandsPropKind;
  /** Whether the prop blocks player movement. */
  readonly blocksMovement: boolean;
  /** Circular collision radius in grid tiles. */
  readonly collisionRadiusGrid: number;
};

/** Sprite prop kinds used by scatter decorations and ruin builds. */
export type DefiningWorldPlazaFirelandsPropKind =
  | 'lava_tree'
  | 'volcanic_rock'
  | 'lava_plant'
  | 'mini_volcano'
  | 'volcano'
  | 'lava_forge'
  | 'lava_anvil'
  | 'lava_portal'
  | 'lava_obelisk'
  | 'lava_totem'
  | 'lava_fence';

/** Marks a blueprint tile that should always spawn as lava. */
export type DefiningWorldPlazaFirelandsRuinLavaTile = {
  readonly offsetTileX: number;
  readonly offsetTileY: number;
};

/** One ruin blueprint definition. */
export type DefiningWorldPlazaFirelandsRuinBlueprint = {
  readonly id: DefiningWorldPlazaFirelandsRuinBlueprintId;
  readonly props: readonly DefiningWorldPlazaFirelandsRuinBlueprintProp[];
  readonly lavaTiles: readonly DefiningWorldPlazaFirelandsRuinLavaTile[];
};

/** Forge camp: central forge with anvil, totem, and a broken fence ring. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINT_FORGE_CAMP: DefiningWorldPlazaFirelandsRuinBlueprint =
  {
    id: 'forge_camp',
    props: [
      {
        offsetTileX: 0,
        offsetTileY: 0,
        propKind: 'lava_forge',
        blocksMovement: true,
        collisionRadiusGrid: 0.55,
      },
      {
        offsetTileX: 1,
        offsetTileY: 0,
        propKind: 'lava_anvil',
        blocksMovement: true,
        collisionRadiusGrid: 0.45,
      },
      {
        offsetTileX: -1,
        offsetTileY: 0,
        propKind: 'lava_totem',
        blocksMovement: true,
        collisionRadiusGrid: 0.4,
      },
      {
        offsetTileX: 0,
        offsetTileY: 1,
        propKind: 'lava_fence',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      },
      {
        offsetTileX: 0,
        offsetTileY: -1,
        propKind: 'lava_fence',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      },
      {
        offsetTileX: 1,
        offsetTileY: 1,
        propKind: 'lava_fence',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      },
      {
        offsetTileX: -1,
        offsetTileY: -1,
        propKind: 'lava_plant',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      },
    ],
    lavaTiles: [],
  };

/** Portal shrine: glowing portal flanked by obelisks and a fence arc. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINT_PORTAL_SHRINE: DefiningWorldPlazaFirelandsRuinBlueprint =
  {
    id: 'portal_shrine',
    props: [
      {
        offsetTileX: 0,
        offsetTileY: 0,
        propKind: 'lava_portal',
        blocksMovement: true,
        collisionRadiusGrid: 0.65,
      },
      {
        offsetTileX: -2,
        offsetTileY: 0,
        propKind: 'lava_obelisk',
        blocksMovement: true,
        collisionRadiusGrid: 0.45,
      },
      {
        offsetTileX: 2,
        offsetTileY: 0,
        propKind: 'lava_obelisk',
        blocksMovement: true,
        collisionRadiusGrid: 0.45,
      },
      {
        offsetTileX: 0,
        offsetTileY: -2,
        propKind: 'lava_fence',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      },
      {
        offsetTileX: 1,
        offsetTileY: -1,
        propKind: 'lava_fence',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      },
      {
        offsetTileX: -1,
        offsetTileY: -1,
        propKind: 'lava_fence',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      },
    ],
    lavaTiles: [],
  };

/** Obelisk circle: four totems around a central lava pool. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINT_OBELISK_CIRCLE: DefiningWorldPlazaFirelandsRuinBlueprint =
  {
    id: 'obelisk_circle',
    props: [
      {
        offsetTileX: 0,
        offsetTileY: -2,
        propKind: 'lava_totem',
        blocksMovement: true,
        collisionRadiusGrid: 0.4,
      },
      {
        offsetTileX: 2,
        offsetTileY: 0,
        propKind: 'lava_obelisk',
        blocksMovement: true,
        collisionRadiusGrid: 0.45,
      },
      {
        offsetTileX: 0,
        offsetTileY: 2,
        propKind: 'lava_totem',
        blocksMovement: true,
        collisionRadiusGrid: 0.4,
      },
      {
        offsetTileX: -2,
        offsetTileY: 0,
        propKind: 'lava_obelisk',
        blocksMovement: true,
        collisionRadiusGrid: 0.45,
      },
    ],
    lavaTiles: [{ offsetTileX: 0, offsetTileY: 0 }],
  };

/**
 * Builds the ruined-wall fence perimeter for the bastion settlement.
 *
 * Fences sit on a square ring with gate gaps at the north and south
 * midpoints so players can walk through the planned compound.
 */
function listingWorldPlazaFirelandsBastionPerimeterFenceProps(): DefiningWorldPlazaFirelandsRuinBlueprintProp[] {
  const wallHalfSpan = 5;
  const fenceProps: DefiningWorldPlazaFirelandsRuinBlueprintProp[] = [];

  for (let wallOffset = -4; wallOffset <= 4; wallOffset += 2) {
    // North and south walls with a gate gap at the midpoint.
    if (wallOffset !== 0) {
      fenceProps.push(
        {
          offsetTileX: wallOffset,
          offsetTileY: -wallHalfSpan,
          propKind: 'lava_fence',
          blocksMovement: false,
          collisionRadiusGrid: 0,
        },
        {
          offsetTileX: wallOffset,
          offsetTileY: wallHalfSpan,
          propKind: 'lava_fence',
          blocksMovement: false,
          collisionRadiusGrid: 0,
        }
      );
    }

    // East and west walls (no gates).
    fenceProps.push(
      {
        offsetTileX: -wallHalfSpan,
        offsetTileY: wallOffset,
        propKind: 'lava_fence',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      },
      {
        offsetTileX: wallHalfSpan,
        offsetTileY: wallOffset,
        propKind: 'lava_fence',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      }
    );
  }

  return fenceProps;
}

/**
 * Bastion settlement: an 11x11 planned compound with a fenced perimeter,
 * central portal plaza, obelisk corners, a forge quarter, and gate totems.
 */
export const DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINT_BASTION_SETTLEMENT: DefiningWorldPlazaFirelandsRuinBlueprint =
  {
    id: 'bastion_settlement',
    props: [
      ...listingWorldPlazaFirelandsBastionPerimeterFenceProps(),
      {
        offsetTileX: 0,
        offsetTileY: 0,
        propKind: 'lava_portal',
        blocksMovement: true,
        collisionRadiusGrid: 0.65,
      },
      {
        offsetTileX: -2,
        offsetTileY: -2,
        propKind: 'lava_obelisk',
        blocksMovement: true,
        collisionRadiusGrid: 0.45,
      },
      {
        offsetTileX: 2,
        offsetTileY: -2,
        propKind: 'lava_obelisk',
        blocksMovement: true,
        collisionRadiusGrid: 0.45,
      },
      {
        offsetTileX: -2,
        offsetTileY: 2,
        propKind: 'lava_obelisk',
        blocksMovement: true,
        collisionRadiusGrid: 0.45,
      },
      {
        offsetTileX: 2,
        offsetTileY: 2,
        propKind: 'lava_obelisk',
        blocksMovement: true,
        collisionRadiusGrid: 0.45,
      },
      {
        offsetTileX: -3,
        offsetTileY: 3,
        propKind: 'lava_forge',
        blocksMovement: true,
        collisionRadiusGrid: 0.55,
      },
      {
        offsetTileX: -2,
        offsetTileY: 4,
        propKind: 'lava_anvil',
        blocksMovement: true,
        collisionRadiusGrid: 0.45,
      },
      {
        offsetTileX: -1,
        offsetTileY: -4,
        propKind: 'lava_totem',
        blocksMovement: true,
        collisionRadiusGrid: 0.4,
      },
      {
        offsetTileX: 1,
        offsetTileY: -4,
        propKind: 'lava_totem',
        blocksMovement: true,
        collisionRadiusGrid: 0.4,
      },
      {
        offsetTileX: -1,
        offsetTileY: 4,
        propKind: 'lava_totem',
        blocksMovement: true,
        collisionRadiusGrid: 0.4,
      },
      {
        offsetTileX: 1,
        offsetTileY: 4,
        propKind: 'lava_totem',
        blocksMovement: true,
        collisionRadiusGrid: 0.4,
      },
      {
        offsetTileX: 3,
        offsetTileY: 3,
        propKind: 'lava_plant',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      },
      {
        offsetTileX: -3,
        offsetTileY: -3,
        propKind: 'lava_plant',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      },
      {
        offsetTileX: 3,
        offsetTileY: -3,
        propKind: 'lava_plant',
        blocksMovement: false,
        collisionRadiusGrid: 0,
      },
    ],
    lavaTiles: [
      { offsetTileX: 4, offsetTileY: 0 },
      { offsetTileX: -4, offsetTileY: 0 },
    ],
  };

/** Every ruin blueprint available for procedural placement. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINTS: readonly DefiningWorldPlazaFirelandsRuinBlueprint[] =
  [
    DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINT_FORGE_CAMP,
    DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINT_PORTAL_SHRINE,
    DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINT_OBELISK_CIRCLE,
    DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINT_BASTION_SETTLEMENT,
  ];

/** Maximum absolute offset used by any ruin blueprint (search radius helper). */
export const DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINT_MAX_OFFSET_TILES = 5;

/**
 * Neighboring structure cells searched when resolving ruin tiles.
 *
 * Blueprint offsets never exceed one structure cell (48 tiles), so scanning
 * the 3x3 cell neighborhood is always sufficient regardless of layout size.
 */
export const DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CELL_SEARCH_RADIUS_CELLS = 1;
