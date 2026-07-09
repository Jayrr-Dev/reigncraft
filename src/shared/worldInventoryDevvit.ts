/** Client poll interval for shared ground items (ms). */
export const WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_POLL_INTERVAL_MS = 1500;

/** Ground item lifetime before auto-despawn (ms). */
export const WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS = 5 * 60 * 1000;

/** Max Chebyshev tile distance for pickup validation. */
export const WORLD_INVENTORY_DEVVIT_GROUND_ITEM_PICKUP_RADIUS_TILES = 1.5;

/** Max Chebyshev tile distance for drop validation. */
export const WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DROP_RADIUS_TILES = 2;

/** Max drift allowed between server and client position during a drop (tiles). */
export const WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DROP_MAX_POSITION_DRIFT_TILES = 4;

export const WORLD_INVENTORY_DEVVIT_API_BASE_PATH =
  '/api/world-inventory' as const;

export const WORLD_INVENTORY_DEVVIT_STATE_API_PATH =
  `${WORLD_INVENTORY_DEVVIT_API_BASE_PATH}/state` as const;

export const WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_API_PATH =
  `${WORLD_INVENTORY_DEVVIT_API_BASE_PATH}/ground-items` as const;

export const WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH =
  `${WORLD_INVENTORY_DEVVIT_API_BASE_PATH}/ground-items/drop` as const;

export const WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_PICKUP_API_PATH =
  `${WORLD_INVENTORY_DEVVIT_API_BASE_PATH}/ground-items/pickup` as const;

export const WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_CONSUME_API_PATH =
  `${WORLD_INVENTORY_DEVVIT_API_BASE_PATH}/ground-items/consume` as const;

/** Serialized inventory payload stored in Redis. */
export type WorldInventoryDevvitPersistedState = {
  capacity: number;
  slots: unknown[];
};

export type WorldInventoryDevvitGroundItemRow = {
  id: string;
  itemTypeId: string;
  quantity: number;
  gridX: number;
  gridY: number;
  layer: number;
  spawnedAt: number;
  metadata?: Readonly<Record<string, unknown>>;
};

export type WorldInventoryDevvitStateResponse =
  | {
      type: 'inventory';
      state: WorldInventoryDevvitPersistedState | null;
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldInventoryDevvitGroundItemsResponse =
  | {
      type: 'ground-items';
      items: WorldInventoryDevvitGroundItemRow[];
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldInventoryDevvitGroundDropRequest = {
  itemTypeId: string;
  quantity: number;
  gridX: number;
  gridY: number;
  layer: number;
  slotIndex: number;
  playerX: number;
  playerY: number;
  metadata?: Readonly<Record<string, unknown>>;
  /** Single-player save slot; scopes ground items per user instead of the shared room. */
  saveSlotIndex?: number | null;
};

export type WorldInventoryDevvitGroundDropResponse =
  | {
      type: 'drop-ack';
      success: boolean;
      groundItemId: string;
      slotIndex: number;
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldInventoryDevvitGroundPickupRequest = {
  groundItemId: string;
  requestedQuantity: number;
  playerX: number;
  playerY: number;
  /** Single-player save slot; scopes ground items per user instead of the shared room. */
  saveSlotIndex?: number | null;
};

export type WorldInventoryDevvitGroundPickupResponse =
  | {
      type: 'pickup-grant';
      groundItemId: string;
      itemTypeId: string;
      quantity: number;
      metadata?: Readonly<Record<string, unknown>>;
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldInventoryDevvitGroundConsumeRequest = {
  groundItemId: string;
  consumerX: number;
  consumerY: number;
  saveSlotIndex?: number | null;
};

export type WorldInventoryDevvitGroundConsumeResponse =
  | {
      type: 'consume-ack';
      groundItemId: string;
      itemTypeId: string;
      quantity: number;
    }
  | {
      type: 'error';
      message: string;
    };

export type WorldInventoryDevvitErrorResponse = {
  type: 'error';
  message: string;
};
