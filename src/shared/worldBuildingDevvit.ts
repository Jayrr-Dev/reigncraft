/**
 * Feature flag for the temporary plot ("Temp Claim") system.
 * Off: no new temporary claims client- or server-side; players get extra
 * permanent plots instead (see max owned plot count below).
 */
export const WORLD_BUILDING_DEVVIT_TEMPORARY_PLOT_FEATURE_ENABLED = false;

/** Default per-user plot limits when no profile row exists. */
export const WORLD_BUILDING_DEVVIT_DEFAULT_MAX_OWNED_PLOT_COUNT = 3;
export const WORLD_BUILDING_DEVVIT_DEFAULT_MAX_TILE_CLAIM_COUNT = 64;
export const WORLD_BUILDING_DEVVIT_DEFAULT_MAX_TEMPORARY_TILE_COUNT = 5;

/** Minimum Chebyshev tile distance between a new claim and other players' plots. */
export const WORLD_BUILDING_DEVVIT_OTHER_OWNER_MIN_CLAIM_DISTANCE_TILES = 3;

/** Maximum plots returned by the registry query. */
export const WORLD_BUILDING_DEVVIT_REGISTRY_MAX_PLOT_COUNT = 512;

export const WORLD_BUILDING_DEVVIT_API_BASE_PATH =
  '/api/world-building' as const;

export const WORLD_BUILDING_DEVVIT_PLOTS_REGISTRY_API_PATH =
  `${WORLD_BUILDING_DEVVIT_API_BASE_PATH}/plots/registry` as const;

export const WORLD_BUILDING_DEVVIT_PLOTS_BOUNDS_API_PATH =
  `${WORLD_BUILDING_DEVVIT_API_BASE_PATH}/plots/bounds` as const;

export const WORLD_BUILDING_DEVVIT_PLOTS_OWNED_API_PATH =
  `${WORLD_BUILDING_DEVVIT_API_BASE_PATH}/plots/owned` as const;

export const WORLD_BUILDING_DEVVIT_PLOTS_CLAIM_API_PATH =
  `${WORLD_BUILDING_DEVVIT_API_BASE_PATH}/plots/claim` as const;

export const WORLD_BUILDING_DEVVIT_PLOTS_DELETE_API_PATH =
  `${WORLD_BUILDING_DEVVIT_API_BASE_PATH}/plots` as const;

export const WORLD_BUILDING_DEVVIT_BLOCKS_API_PATH =
  `${WORLD_BUILDING_DEVVIT_API_BASE_PATH}/blocks` as const;

export const WORLD_BUILDING_DEVVIT_OWNER_LIMITS_API_PATH =
  `${WORLD_BUILDING_DEVVIT_API_BASE_PATH}/owner-limits` as const;

/** Raw plot row stored in Redis and returned by API routes. */
export type WorldBuildingDevvitPlotRow = {
  id: string;
  owner_id: string;
  min_tile_x: number;
  min_tile_y: number;
  max_tile_x: number;
  max_tile_y: number;
  created_at: string;
  is_temporary: boolean;
  expires_at: string | null;
};

/** Raw placed block row stored in Redis and returned by API routes. */
export type WorldBuildingDevvitBlockRow = {
  id: string;
  plot_id: string;
  definition_id: string;
  tile_x: number;
  tile_y: number;
  world_layer: number;
  owner_id: string;
  metadata: Record<string, string | number | boolean | null> | null;
  placed_at: string;
};

export type WorldBuildingDevvitPlotOwnerLimits = {
  maxOwnedPlotCount: number;
  maxTileClaimCount: number;
  maxTemporaryTileCount: number;
};

export type WorldBuildingDevvitPlotsPayload = {
  type: 'plots';
  plots: WorldBuildingDevvitPlotRow[];
  blocks: WorldBuildingDevvitBlockRow[];
};

export type WorldBuildingDevvitClaimPlotRequest = {
  tileX: number;
  tileY: number;
  isTemporary: boolean;
};

export type WorldBuildingDevvitClaimPlotResponse =
  | {
      type: 'claim';
      plotId: string;
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldBuildingDevvitPlaceBlockRequest = {
  blockId: string;
  plotId: string;
  definitionId: string;
  tileX: number;
  tileY: number;
  worldLayer: number;
  blockHeight: number;
  placedAt: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type WorldBuildingDevvitPlaceBlockResponse =
  | {
      type: 'block';
      block: WorldBuildingDevvitBlockRow;
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldBuildingDevvitOwnerLimitsResponse =
  | {
      type: 'owner-limits';
      limits: WorldBuildingDevvitPlotOwnerLimits;
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldBuildingDevvitErrorResponse = {
  type: 'error';
  message: string;
};
