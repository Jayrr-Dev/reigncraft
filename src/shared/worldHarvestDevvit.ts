import type { WorldTreeChopTileState } from './worldTreeChop';

/** Client poll interval for shared chopped-tree state (ms). */
export const WORLD_HARVEST_DEVVIT_CHOPPED_TREES_POLL_INTERVAL_MS = 1000;

export const WORLD_HARVEST_DEVVIT_API_BASE_PATH = '/api/world-harvest' as const;

export const WORLD_HARVEST_DEVVIT_CHOPPED_TREES_API_PATH =
  `${WORLD_HARVEST_DEVVIT_API_BASE_PATH}/chopped-trees` as const;

export const WORLD_HARVEST_DEVVIT_CHOP_TREE_API_PATH =
  `${WORLD_HARVEST_DEVVIT_API_BASE_PATH}/chop-tree` as const;

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

export type WorldHarvestDevvitErrorResponse = {
  type: 'error';
  message: string;
};
