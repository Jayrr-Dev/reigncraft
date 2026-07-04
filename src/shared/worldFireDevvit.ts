/** Simulation tick interval for lazy fire spread (ms). */
export const WORLD_FIRE_DEVVIT_TICK_MS = 2000;

/** Base per-tick spread probability multiplier (0..1 roll * flammability). */
export const WORLD_FIRE_DEVVIT_SPREAD_BASE_CHANCE = 0.15;

/** Initial fuel when lighting a campfire with one wood (ms). */
export const WORLD_FIRE_DEVVIT_CAMPFIRE_INITIAL_FUEL_MS = 30_000;

/** Fuel added per wood when refueling a campfire (ms). */
export const WORLD_FIRE_DEVVIT_CAMPFIRE_FUEL_PER_WOOD_MS = 15_000;

/** Maximum stored fuel on a campfire (ms). */
export const WORLD_FIRE_DEVVIT_CAMPFIRE_MAX_FUEL_MS = 120_000;

/** Max Chebyshev tile distance for ignite / refuel actions. */
export const WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES = 2;

/** Client poll interval for fire cells (ms). */
export const WORLD_FIRE_DEVVIT_CELLS_POLL_INTERVAL_MS = 1500;

export const WORLD_FIRE_DEVVIT_API_BASE_PATH = '/api/world-fire' as const;

export const WORLD_FIRE_DEVVIT_CELLS_API_PATH =
  `${WORLD_FIRE_DEVVIT_API_BASE_PATH}/cells` as const;

export const WORLD_FIRE_DEVVIT_IGNITE_API_PATH =
  `${WORLD_FIRE_DEVVIT_API_BASE_PATH}/ignite` as const;

export const WORLD_FIRE_DEVVIT_ADD_FUEL_API_PATH =
  `${WORLD_FIRE_DEVVIT_API_BASE_PATH}/add-fuel` as const;

/** Placeable campfire block definition id. */
export const WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID =
  'utility:campfire' as const;

/** Flint inventory item type id. */
export const WORLD_FIRE_DEVVIT_FLINT_ITEM_TYPE_ID =
  'world-plaza-flint' as const;

/** Wood inventory item type id (existing plaza resource). */
export const WORLD_FIRE_DEVVIT_WOOD_ITEM_TYPE_ID =
  'world-plaza-wood' as const;

export type WorldFireDevvitCellKind = 'spreading' | 'campfire';

/** One burning tile stored in Redis. */
export type WorldFireDevvitCell = {
  tileX: number;
  tileY: number;
  worldLayer: number;
  kind: WorldFireDevvitCellKind;
  ignitedAtMs: number;
  fuelRemainingMs: number;
  intensity: number;
};

/** Flammability and burn duration for a placed block definition id. */
export type WorldFireDevvitMaterialProperties = {
  flammability: number;
  burnDurationMs: number;
};

/** Shared flammability map — server simulates, client previews ignite targets. */
export const WORLD_FIRE_DEVVIT_MATERIAL_PROPERTIES: Record<
  string,
  WorldFireDevvitMaterialProperties
> = {
  'basic:floor:wood': {
    flammability: 0.35,
    burnDurationMs: 12_000,
  },
  'functional:door:wooden': {
    flammability: 0.4,
    burnDurationMs: 15_000,
  },
  'functional:sign:wooden': {
    flammability: 0.45,
    burnDurationMs: 8_000,
  },
  'natural:tree:oak': {
    flammability: 0.25,
    burnDurationMs: 20_000,
  },
  'decorative:flower:patch': {
    flammability: 0.5,
    burnDurationMs: 5_000,
  },
  [WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID]: {
    flammability: 0,
    burnDurationMs: 0,
  },
};

export type WorldFireDevvitCellsResponse =
  | {
      type: 'fire-cells';
      cells: WorldFireDevvitCell[];
      burnedBlockIds: string[];
      lastSimulatedTick: number;
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldFireDevvitIgniteRequest = {
  mode: 'flint' | 'campfire';
  tileX: number;
  tileY: number;
  worldLayer: number;
  playerX: number;
  playerY: number;
};

export type WorldFireDevvitIgniteResponse =
  | {
      type: 'ignited';
      cell: WorldFireDevvitCell;
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldFireDevvitAddFuelRequest = {
  tileX: number;
  tileY: number;
  worldLayer: number;
  playerX: number;
  playerY: number;
};

export type WorldFireDevvitAddFuelResponse =
  | {
      type: 'fueled';
      cell: WorldFireDevvitCell;
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldFireDevvitErrorResponse = {
  type: 'error';
  message: string;
};

/**
 * Builds a stable Redis hash field key for one fire tile.
 *
 * @param tileX - Tile X index.
 * @param tileY - Tile Y index.
 * @param worldLayer - World layer index.
 */
export function buildingWorldFireDevvitTileKey(
  tileX: number,
  tileY: number,
  worldLayer: number,
): string {
  return `${tileX},${tileY},${worldLayer}`;
}

/**
 * Parses a fire tile key back into coordinates.
 *
 * @param tileKey - Serialized tile key.
 */
export function parsingWorldFireDevvitTileKey(
  tileKey: string,
): { tileX: number; tileY: number; worldLayer: number } | null {
  const parts = tileKey.split(',');

  if (parts.length !== 3) {
    return null;
  }

  const tileX = Number.parseInt(parts[0] ?? '', 10);
  const tileY = Number.parseInt(parts[1] ?? '', 10);
  const worldLayer = Number.parseInt(parts[2] ?? '', 10);

  if (
    !Number.isFinite(tileX) ||
    !Number.isFinite(tileY) ||
    !Number.isFinite(worldLayer)
  ) {
    return null;
  }

  return { tileX, tileY, worldLayer };
}

/**
 * Resolves flammability properties for a block definition id.
 *
 * @param definitionId - Placed block definition id.
 */
export function resolvingWorldFireDevvitMaterialProperties(
  definitionId: string,
): WorldFireDevvitMaterialProperties | null {
  return WORLD_FIRE_DEVVIT_MATERIAL_PROPERTIES[definitionId] ?? null;
}

/**
 * Computes fire glow intensity from remaining fuel (0..1).
 *
 * @param fuelRemainingMs - Remaining burn fuel.
 * @param initialFuelMs - Starting fuel when ignited.
 */
export function computingWorldFireDevvitIntensityFromFuel(
  fuelRemainingMs: number,
  initialFuelMs: number,
): number {
  if (initialFuelMs <= 0) {
    return fuelRemainingMs > 0 ? 1 : 0;
  }

  return Math.max(0, Math.min(1, fuelRemainingMs / initialFuelMs));
}
