import type { WorldRockMineTileState } from './worldRockMine';
import type { WorldTreeChopTileState } from './worldTreeChop';

/** Client poll interval for shared chopped-tree state (ms). */
export const WORLD_HARVEST_DEVVIT_CHOPPED_TREES_POLL_INTERVAL_MS = 1000;

/** Client poll interval for shared mined-rock state (ms). */
export const WORLD_HARVEST_DEVVIT_MINED_ROCKS_POLL_INTERVAL_MS =
  WORLD_HARVEST_DEVVIT_CHOPPED_TREES_POLL_INTERVAL_MS;

export const WORLD_HARVEST_DEVVIT_API_BASE_PATH = '/api/world-harvest' as const;

export const WORLD_HARVEST_DEVVIT_CHOPPED_TREES_API_PATH =
  `${WORLD_HARVEST_DEVVIT_API_BASE_PATH}/chopped-trees` as const;

export const WORLD_HARVEST_DEVVIT_CHOP_TREE_API_PATH =
  `${WORLD_HARVEST_DEVVIT_API_BASE_PATH}/chop-tree` as const;

export const WORLD_HARVEST_DEVVIT_MINED_ROCKS_API_PATH =
  `${WORLD_HARVEST_DEVVIT_API_BASE_PATH}/mined-rocks` as const;

export const WORLD_HARVEST_DEVVIT_MINE_ROCK_API_PATH =
  `${WORLD_HARVEST_DEVVIT_API_BASE_PATH}/mine-rock` as const;

export type WorldHarvestDevvitChoppedTreeRow = WorldTreeChopTileState & {
  readonly tileKey: string;
};

export type WorldHarvestDevvitChoppedTreesResponse =
  | {
      type: 'chopped-trees';
      tiles: WorldHarvestDevvitChoppedTreeRow[];
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldHarvestDevvitChopTreeRequest = {
  tileX: number;
  tileY: number;
  playerX: number;
  playerY: number;
  currentVisualLayer: number;
  standingSurfaceLayer: number;
  /** Single-player save slot; scopes chopped trees per user instead of the shared room. */
  saveSlotIndex?: number | null;
};

export type WorldHarvestDevvitChopTreeResponse =
  | {
      type: 'chopped';
      remainingVisualLayer: number;
      layersRemoved: number;
      woodQuantity: number;
      isFullyFelled: boolean;
    }
  | {
      type: 'out-of-range';
    }
  | {
      type: 'already-felled';
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldHarvestDevvitMinedRockRow = WorldRockMineTileState & {
  readonly tileKey: string;
};

export type WorldHarvestDevvitMinedRocksResponse =
  | {
      type: 'mined-rocks';
      tiles: WorldHarvestDevvitMinedRockRow[];
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldHarvestDevvitMineRockRequest = {
  tileX: number;
  tileY: number;
  targetCenterX: number;
  targetCenterY: number;
  playerX: number;
  playerY: number;
  currentVisualLayer: number;
  standingSurfaceLayer: number;
  /** Single-player save slot; scopes mined rocks per user instead of the shared room. */
  saveSlotIndex?: number | null;
};

export type WorldHarvestDevvitMineRockResponse =
  | {
      type: 'mined';
      remainingVisualLayer: number;
      layersRemoved: number;
      stoneQuantity: number;
      isFullyDepleted: boolean;
    }
  | {
      type: 'out-of-range';
    }
  | {
      type: 'already-depleted';
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldHarvestDevvitErrorResponse = {
  type: 'error';
  message: string;
};
