import { redis } from '@devvit/web/server';
import { Hono } from 'hono';
import { randomUUID } from 'node:crypto';
import { checkingWorldInventoryGroundItemIsExpired } from '../../shared/checkingWorldInventoryGroundItemIsExpired';
import { checkingPlazaSaveSlotIndex } from '../../shared/plazaGameSession';
import {
  WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DROP_MAX_POSITION_DRIFT_TILES,
  WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DROP_RADIUS_TILES,
  WORLD_INVENTORY_DEVVIT_GROUND_ITEM_PICKUP_RADIUS_TILES,
  type WorldInventoryDevvitErrorResponse,
  type WorldInventoryDevvitGroundConsumeRequest,
  type WorldInventoryDevvitGroundConsumeResponse,
  type WorldInventoryDevvitGroundDropRequest,
  type WorldInventoryDevvitGroundDropResponse,
  type WorldInventoryDevvitGroundItemRow,
  type WorldInventoryDevvitGroundItemsResponse,
  type WorldInventoryDevvitGroundPickupRequest,
  type WorldInventoryDevvitGroundPickupResponse,
  type WorldInventoryDevvitPersistedState,
  type WorldInventoryDevvitStateResponse,
} from '../../shared/worldInventoryDevvit';
import {
  buildingWorldInventoryGroundItemsRedisKey,
  buildingWorldInventoryStateRedisKey,
} from '../domains/buildingWorldInventoryDevvitRedisKeys';
import { resolvingDevvitRedditUserId } from '../domains/resolvingDevvitRedditUserId';
import { resolvingPlazaDevvitOnlineRoomScope } from '../domains/resolvingPlazaDevvitOnlineRoomScope';

/**
 * Resolves the ground-items scope: a private per-user scope for single-player
 * save slots, or the shared online room scope otherwise.
 *
 * @param userId - Authenticated Reddit user id.
 * @param saveSlotIndex - Optional single-player save slot from the request.
 */
function resolvingGroundItemsScope(
  userId: string,
  saveSlotIndex: number | null | undefined
): string {
  if (
    typeof saveSlotIndex === 'number' &&
    checkingPlazaSaveSlotIndex(saveSlotIndex)
  ) {
    return `single-player:${userId}:slot-${saveSlotIndex}`;
  }

  return resolvingPlazaDevvitOnlineRoomScope();
}

function computingChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

function parsingPersistedInventoryState(
  rawValue: string
): WorldInventoryDevvitPersistedState | null {
  try {
    const parsed = JSON.parse(
      rawValue
    ) as Partial<WorldInventoryDevvitPersistedState>;

    if (typeof parsed.capacity !== 'number' || !Array.isArray(parsed.slots)) {
      return null;
    }

    return {
      capacity: parsed.capacity,
      slots: parsed.slots,
    };
  } catch {
    return null;
  }
}

function parsingGroundItemRow(
  rawValue: string
): WorldInventoryDevvitGroundItemRow | null {
  try {
    const parsed = JSON.parse(
      rawValue
    ) as Partial<WorldInventoryDevvitGroundItemRow>;

    if (
      typeof parsed.id !== 'string' ||
      typeof parsed.itemTypeId !== 'string' ||
      typeof parsed.quantity !== 'number' ||
      typeof parsed.gridX !== 'number' ||
      typeof parsed.gridY !== 'number' ||
      typeof parsed.spawnedAt !== 'number'
    ) {
      return null;
    }

    return {
      id: parsed.id,
      itemTypeId: parsed.itemTypeId,
      quantity: parsed.quantity,
      gridX: parsed.gridX,
      gridY: parsed.gridY,
      layer: typeof parsed.layer === 'number' ? parsed.layer : 1,
      spawnedAt: parsed.spawnedAt,
      ...(parsed.metadata &&
      typeof parsed.metadata === 'object' &&
      !Array.isArray(parsed.metadata)
        ? { metadata: parsed.metadata as Readonly<Record<string, unknown>> }
        : {}),
    };
  } catch {
    return null;
  }
}

async function listingWorldInventoryDevvitGroundItems(
  roomScope: string
): Promise<WorldInventoryDevvitGroundItemRow[]> {
  const groundItemsKey = buildingWorldInventoryGroundItemsRedisKey(roomScope);
  const rawItems = await redis.hGetAll(groundItemsKey);
  const nowMs = Date.now();
  const items: WorldInventoryDevvitGroundItemRow[] = [];

  for (const [groundItemId, rawItem] of Object.entries(rawItems)) {
    const parsedItem = parsingGroundItemRow(rawItem);

    if (!parsedItem) {
      await redis.hDel(groundItemsKey, [groundItemId]);
      continue;
    }

    if (checkingWorldInventoryGroundItemIsExpired(parsedItem, nowMs)) {
      await redis.hDel(groundItemsKey, [groundItemId]);
      continue;
    }

    items.push(parsedItem);
  }

  return items;
}

function parsingGroundDropRequest(
  body: unknown
): WorldInventoryDevvitGroundDropRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<WorldInventoryDevvitGroundDropRequest>;

  if (
    typeof payload.itemTypeId !== 'string' ||
    typeof payload.quantity !== 'number' ||
    typeof payload.gridX !== 'number' ||
    typeof payload.gridY !== 'number' ||
    typeof payload.layer !== 'number' ||
    typeof payload.slotIndex !== 'number' ||
    typeof payload.playerX !== 'number' ||
    typeof payload.playerY !== 'number'
  ) {
    return null;
  }

  return {
    itemTypeId: payload.itemTypeId,
    quantity: payload.quantity,
    gridX: payload.gridX,
    gridY: payload.gridY,
    layer: payload.layer,
    slotIndex: payload.slotIndex,
    playerX: payload.playerX,
    playerY: payload.playerY,
    ...(payload.metadata &&
    typeof payload.metadata === 'object' &&
    !Array.isArray(payload.metadata)
      ? { metadata: payload.metadata as Readonly<Record<string, unknown>> }
      : {}),
    saveSlotIndex:
      typeof payload.saveSlotIndex === 'number' ? payload.saveSlotIndex : null,
  };
}

function parsingGroundPickupRequest(
  body: unknown
): WorldInventoryDevvitGroundPickupRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<WorldInventoryDevvitGroundPickupRequest>;

  if (
    typeof payload.groundItemId !== 'string' ||
    typeof payload.requestedQuantity !== 'number' ||
    typeof payload.playerX !== 'number' ||
    typeof payload.playerY !== 'number'
  ) {
    return null;
  }

  return {
    groundItemId: payload.groundItemId,
    requestedQuantity: payload.requestedQuantity,
    playerX: payload.playerX,
    playerY: payload.playerY,
    saveSlotIndex:
      typeof payload.saveSlotIndex === 'number' ? payload.saveSlotIndex : null,
  };
}

function parsingGroundConsumeRequest(
  body: unknown
): WorldInventoryDevvitGroundConsumeRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<WorldInventoryDevvitGroundConsumeRequest>;

  if (
    typeof payload.groundItemId !== 'string' ||
    typeof payload.consumerX !== 'number' ||
    typeof payload.consumerY !== 'number'
  ) {
    return null;
  }

  return {
    groundItemId: payload.groundItemId,
    consumerX: payload.consumerX,
    consumerY: payload.consumerY,
    saveSlotIndex:
      typeof payload.saveSlotIndex === 'number' ? payload.saveSlotIndex : null,
  };
}

function parsingPersistedInventorySaveBody(
  body: unknown
): WorldInventoryDevvitPersistedState | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<WorldInventoryDevvitPersistedState>;

  if (typeof payload.capacity !== 'number' || !Array.isArray(payload.slots)) {
    return null;
  }

  return {
    capacity: payload.capacity,
    slots: payload.slots,
  };
}

function removingPersistedInventorySlotForDrop(
  state: WorldInventoryDevvitPersistedState,
  slotIndex: number,
  itemTypeId: string,
  quantity: number
): WorldInventoryDevvitPersistedState | null {
  if (slotIndex < 0 || slotIndex >= state.slots.length) {
    return null;
  }

  const slot = state.slots[slotIndex];

  if (!slot || typeof slot !== 'object') {
    return null;
  }

  const row = slot as {
    itemTypeId?: unknown;
    quantity?: unknown;
  };

  if (row.itemTypeId !== itemTypeId || row.quantity !== quantity) {
    return null;
  }

  const nextSlots = [...state.slots];
  nextSlots[slotIndex] = null;

  return {
    capacity: state.capacity,
    slots: nextSlots,
  };
}

async function removingOnlineInventorySlotForGroundDrop(
  userId: string,
  slotIndex: number,
  itemTypeId: string,
  quantity: number
): Promise<boolean> {
  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const stateKey = buildingWorldInventoryStateRedisKey(roomScope, userId);
  const rawState = await redis.get(stateKey);

  if (!rawState) {
    return false;
  }

  const parsedState = parsingPersistedInventoryState(rawState);

  if (!parsedState) {
    return false;
  }

  const nextState = removingPersistedInventorySlotForDrop(
    parsedState,
    slotIndex,
    itemTypeId,
    quantity
  );

  if (!nextState) {
    return false;
  }

  await redis.set(stateKey, JSON.stringify(nextState));
  return true;
}

export const worldInventory = new Hono();

worldInventory.get('/state', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldInventoryDevvitStateResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to use inventory.',
      },
      401
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const stateKey = buildingWorldInventoryStateRedisKey(roomScope, userId);
  const rawState = await redis.get(stateKey);

  if (!rawState) {
    return c.json<WorldInventoryDevvitStateResponse>({
      type: 'inventory',
      state: null,
    });
  }

  const parsedState = parsingPersistedInventoryState(rawState);

  return c.json<WorldInventoryDevvitStateResponse>({
    type: 'inventory',
    state: parsedState,
  });
});

worldInventory.put('/state', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldInventoryDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to save inventory.',
      },
      401
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const state = parsingPersistedInventorySaveBody(body);

  if (!state) {
    return c.json<WorldInventoryDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Invalid inventory state.',
      },
      400
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const stateKey = buildingWorldInventoryStateRedisKey(roomScope, userId);
  await redis.set(stateKey, JSON.stringify(state));

  return c.json({ type: 'saved' });
});

worldInventory.get('/ground-items', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldInventoryDevvitGroundItemsResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to view ground items.',
      },
      401
    );
  }

  const rawSaveSlotIndex = c.req.query('saveSlotIndex');
  const parsedSaveSlotIndex = rawSaveSlotIndex
    ? Number.parseInt(rawSaveSlotIndex, 10)
    : null;
  const groundScope = resolvingGroundItemsScope(userId, parsedSaveSlotIndex);
  const items = await listingWorldInventoryDevvitGroundItems(groundScope);

  return c.json<WorldInventoryDevvitGroundItemsResponse>({
    type: 'ground-items',
    items,
  });
});

worldInventory.post('/ground-items/drop', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldInventoryDevvitGroundDropResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to drop items.',
      },
      401
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const dropRequest = parsingGroundDropRequest(body);

  if (!dropRequest || dropRequest.quantity <= 0) {
    return c.json<WorldInventoryDevvitGroundDropResponse>(
      {
        type: 'error',
        message: 'Invalid ground drop request.',
      },
      400
    );
  }

  // Measure to the tile center to match the client-side drop range check.
  const dropDistance = computingChebyshevDistance(
    dropRequest.playerX,
    dropRequest.playerY,
    dropRequest.gridX + 0.5,
    dropRequest.gridY + 0.5
  );

  if (dropDistance > WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DROP_RADIUS_TILES) {
    return c.json<WorldInventoryDevvitGroundDropResponse>({
      type: 'drop-ack',
      success: false,
      groundItemId: '',
      slotIndex: dropRequest.slotIndex,
    });
  }

  const isSinglePlayerGroundScope =
    typeof dropRequest.saveSlotIndex === 'number' &&
    checkingPlazaSaveSlotIndex(dropRequest.saveSlotIndex);

  if (!isSinglePlayerGroundScope) {
    const didRemoveInventorySlot =
      await removingOnlineInventorySlotForGroundDrop(
        userId,
        dropRequest.slotIndex,
        dropRequest.itemTypeId,
        dropRequest.quantity
      );

    if (!didRemoveInventorySlot) {
      return c.json<WorldInventoryDevvitGroundDropResponse>({
        type: 'drop-ack',
        success: false,
        groundItemId: '',
        slotIndex: dropRequest.slotIndex,
      });
    }
  }

  const groundScope = resolvingGroundItemsScope(
    userId,
    dropRequest.saveSlotIndex
  );
  const groundItemsKey = buildingWorldInventoryGroundItemsRedisKey(groundScope);
  const groundItemId = randomUUID();
  const groundItem: WorldInventoryDevvitGroundItemRow = {
    id: groundItemId,
    itemTypeId: dropRequest.itemTypeId,
    quantity: dropRequest.quantity,
    gridX: dropRequest.gridX,
    gridY: dropRequest.gridY,
    layer: dropRequest.layer,
    spawnedAt: Date.now(),
    ...(dropRequest.metadata ? { metadata: dropRequest.metadata } : {}),
  };

  await redis.hSet(groundItemsKey, {
    [groundItemId]: JSON.stringify(groundItem),
  });

  return c.json<WorldInventoryDevvitGroundDropResponse>({
    type: 'drop-ack',
    success: true,
    groundItemId,
    slotIndex: dropRequest.slotIndex,
  });
});

worldInventory.post('/ground-items/pickup', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldInventoryDevvitGroundPickupResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to pick up items.',
      },
      401
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const pickupRequest = parsingGroundPickupRequest(body);

  if (!pickupRequest || pickupRequest.requestedQuantity <= 0) {
    return c.json<WorldInventoryDevvitGroundPickupResponse>(
      {
        type: 'error',
        message: 'Invalid ground pickup request.',
      },
      400
    );
  }

  const groundScope = resolvingGroundItemsScope(
    userId,
    pickupRequest.saveSlotIndex
  );
  const groundItemsKey = buildingWorldInventoryGroundItemsRedisKey(groundScope);
  const rawItem = await redis.hGet(groundItemsKey, pickupRequest.groundItemId);
  const groundItem = rawItem ? parsingGroundItemRow(rawItem) : null;

  if (!groundItem) {
    return c.json<WorldInventoryDevvitGroundPickupResponse>(
      {
        type: 'error',
        message: 'Ground item not found.',
      },
      404
    );
  }

  const pickupDistance = computingChebyshevDistance(
    pickupRequest.playerX,
    pickupRequest.playerY,
    groundItem.gridX,
    groundItem.gridY
  );

  if (
    pickupDistance >
    WORLD_INVENTORY_DEVVIT_GROUND_ITEM_PICKUP_RADIUS_TILES +
      WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DROP_MAX_POSITION_DRIFT_TILES
  ) {
    return c.json<WorldInventoryDevvitGroundPickupResponse>(
      {
        type: 'error',
        message: 'Too far away to pick up that item.',
      },
      409
    );
  }

  const grantedQuantity = Math.min(
    pickupRequest.requestedQuantity,
    groundItem.quantity
  );

  if (grantedQuantity <= 0) {
    return c.json<WorldInventoryDevvitGroundPickupResponse>(
      {
        type: 'error',
        message: 'Nothing left to pick up.',
      },
      409
    );
  }

  const remainingQuantity = groundItem.quantity - grantedQuantity;

  if (remainingQuantity <= 0) {
    await redis.hDel(groundItemsKey, [pickupRequest.groundItemId]);
  } else {
    const nextGroundItem: WorldInventoryDevvitGroundItemRow = {
      ...groundItem,
      quantity: remainingQuantity,
    };

    await redis.hSet(groundItemsKey, {
      [pickupRequest.groundItemId]: JSON.stringify(nextGroundItem),
    });
  }

  return c.json<WorldInventoryDevvitGroundPickupResponse>({
    type: 'pickup-grant',
    groundItemId: pickupRequest.groundItemId,
    itemTypeId: groundItem.itemTypeId,
    quantity: grantedQuantity,
    ...(groundItem.metadata ? { metadata: groundItem.metadata } : {}),
  });
});

worldInventory.post('/ground-items/consume', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldInventoryDevvitGroundConsumeResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to consume ground items.',
      },
      401
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const consumeRequest = parsingGroundConsumeRequest(body);

  if (!consumeRequest) {
    return c.json<WorldInventoryDevvitGroundConsumeResponse>(
      {
        type: 'error',
        message: 'Invalid ground consume request.',
      },
      400
    );
  }

  const groundScope = resolvingGroundItemsScope(
    userId,
    consumeRequest.saveSlotIndex
  );
  const groundItemsKey = buildingWorldInventoryGroundItemsRedisKey(groundScope);
  const rawItem = await redis.hGet(groundItemsKey, consumeRequest.groundItemId);
  const groundItem = rawItem ? parsingGroundItemRow(rawItem) : null;

  if (!groundItem) {
    return c.json<WorldInventoryDevvitGroundConsumeResponse>(
      {
        type: 'error',
        message: 'Ground item not found.',
      },
      404
    );
  }

  const consumeDistance = computingChebyshevDistance(
    consumeRequest.consumerX,
    consumeRequest.consumerY,
    groundItem.gridX,
    groundItem.gridY
  );

  if (
    consumeDistance >
    WORLD_INVENTORY_DEVVIT_GROUND_ITEM_PICKUP_RADIUS_TILES +
      WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DROP_MAX_POSITION_DRIFT_TILES
  ) {
    return c.json<WorldInventoryDevvitGroundConsumeResponse>(
      {
        type: 'error',
        message: 'Too far away to eat that item.',
      },
      409
    );
  }

  if (groundItem.quantity <= 0) {
    return c.json<WorldInventoryDevvitGroundConsumeResponse>(
      {
        type: 'error',
        message: 'Nothing left to eat.',
      },
      409
    );
  }

  const remainingQuantity = groundItem.quantity - 1;

  if (remainingQuantity <= 0) {
    await redis.hDel(groundItemsKey, [consumeRequest.groundItemId]);
  } else {
    const nextGroundItem: WorldInventoryDevvitGroundItemRow = {
      ...groundItem,
      quantity: remainingQuantity,
    };

    await redis.hSet(groundItemsKey, {
      [consumeRequest.groundItemId]: JSON.stringify(nextGroundItem),
    });
  }

  return c.json<WorldInventoryDevvitGroundConsumeResponse>({
    type: 'consume-ack',
    groundItemId: consumeRequest.groundItemId,
    itemTypeId: groundItem.itemTypeId,
    quantity: 1,
  });
});
