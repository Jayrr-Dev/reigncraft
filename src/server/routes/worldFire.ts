import { redis } from '@devvit/web/server';
import { Hono } from 'hono';
import {
  buildingWorldFireDevvitTileKey,
  resolvingWorldFireDevvitMaterialProperties,
  WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID,
  WORLD_FIRE_DEVVIT_CAMPFIRE_FUEL_PER_WOOD_MS,
  WORLD_FIRE_DEVVIT_CAMPFIRE_INITIAL_FUEL_MS,
  WORLD_FIRE_DEVVIT_CAMPFIRE_MAX_FUEL_MS,
  WORLD_FIRE_DEVVIT_FLINT_ITEM_TYPE_ID,
  WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES,
  WORLD_FIRE_DEVVIT_WOOD_ITEM_TYPE_ID,
  type WorldFireDevvitAddFuelRequest,
  type WorldFireDevvitAddFuelResponse,
  type WorldFireDevvitCellsResponse,
  type WorldFireDevvitErrorResponse,
  type WorldFireDevvitIgniteRequest,
  type WorldFireDevvitIgniteResponse,
} from '../../shared/worldFireDevvit';
import { buildingWorldInventoryStateRedisKey } from '../domains/buildingWorldInventoryDevvitRedisKeys';
import {
  consumingWorldInventoryDevvitItem,
  parsingWorldInventoryDevvitPersistedState,
} from '../domains/consumingWorldInventoryDevvitItem';
import { creatingWorldFireDevvitCell } from '../domains/computingWorldFireSimulationTick';
import {
  advancingWorldFireDevvitSimulation,
  findingWorldFireDevvitCellAtTile,
  findingWorldFireDevvitPlacedBlockAtTile,
  upsertingWorldFireDevvitCell,
} from '../domains/managingWorldFireDevvitSimulation';
import { resolvingDevvitRedditUserId } from '../domains/resolvingDevvitRedditUserId';
import { resolvingPlazaDevvitOnlineRoomScope } from '../domains/resolvingPlazaDevvitOnlineRoomScope';

function computingChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

function checkingWorldFireDevvitPlayerWithinInteractionRadius(
  playerX: number,
  playerY: number,
  tileX: number,
  tileY: number,
): boolean {
  return (
    computingChebyshevDistance(playerX, playerY, tileX + 0.5, tileY + 0.5) <=
    WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES
  );
}

function parsingWorldFireDevvitIgniteRequest(
  body: unknown,
): WorldFireDevvitIgniteRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<WorldFireDevvitIgniteRequest>;

  if (
    (payload.mode !== 'flint' && payload.mode !== 'campfire') ||
    typeof payload.tileX !== 'number' ||
    typeof payload.tileY !== 'number' ||
    typeof payload.worldLayer !== 'number' ||
    typeof payload.playerX !== 'number' ||
    typeof payload.playerY !== 'number'
  ) {
    return null;
  }

  return {
    mode: payload.mode,
    tileX: payload.tileX,
    tileY: payload.tileY,
    worldLayer: payload.worldLayer,
    playerX: payload.playerX,
    playerY: payload.playerY,
  };
}

function parsingWorldFireDevvitAddFuelRequest(
  body: unknown,
): WorldFireDevvitAddFuelRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<WorldFireDevvitAddFuelRequest>;

  if (
    typeof payload.tileX !== 'number' ||
    typeof payload.tileY !== 'number' ||
    typeof payload.worldLayer !== 'number' ||
    typeof payload.playerX !== 'number' ||
    typeof payload.playerY !== 'number'
  ) {
    return null;
  }

  return {
    tileX: payload.tileX,
    tileY: payload.tileY,
    worldLayer: payload.worldLayer,
    playerX: payload.playerX,
    playerY: payload.playerY,
  };
}

async function consumingWorldFireDevvitInventoryItem(
  roomScope: string,
  userId: string,
  itemTypeId: string,
  quantity: number,
): Promise<{ type: 'consumed' } | { type: 'missing' } | { type: 'invalid' }> {
  const stateKey = buildingWorldInventoryStateRedisKey(roomScope, userId);
  const rawState = await redis.get(stateKey);
  const parsedState = rawState
    ? parsingWorldInventoryDevvitPersistedState(rawState)
    : null;
  const consumeResult = consumingWorldInventoryDevvitItem(
    parsedState,
    itemTypeId,
    quantity,
  );

  if (consumeResult.type !== 'consumed') {
    return consumeResult;
  }

  await redis.set(stateKey, JSON.stringify(consumeResult.state));

  return { type: 'consumed' };
}

export const worldFire = new Hono();

worldFire.get('/cells', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldFireDevvitErrorResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to view fire.',
      },
      401,
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  const simulationResult = await advancingWorldFireDevvitSimulation(roomScope);

  return c.json<WorldFireDevvitCellsResponse>({
    type: 'fire-cells',
    cells: simulationResult.cells,
    burnedBlockIds: simulationResult.burnedBlockIds,
    lastSimulatedTick: simulationResult.lastSimulatedTick,
  });
});

worldFire.post('/ignite', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldFireDevvitIgniteResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to ignite fire.',
      },
      401,
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const igniteRequest = parsingWorldFireDevvitIgniteRequest(body);

  if (!igniteRequest) {
    return c.json<WorldFireDevvitIgniteResponse>(
      {
        type: 'error',
        message: 'Invalid ignite request.',
      },
      400,
    );
  }

  if (
    !checkingWorldFireDevvitPlayerWithinInteractionRadius(
      igniteRequest.playerX,
      igniteRequest.playerY,
      igniteRequest.tileX,
      igniteRequest.tileY,
    )
  ) {
    return c.json<WorldFireDevvitIgniteResponse>(
      {
        type: 'error',
        message: 'Move closer to ignite fire.',
      },
      400,
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  await advancingWorldFireDevvitSimulation(roomScope);

  const existingCell = await findingWorldFireDevvitCellAtTile(
    roomScope,
    igniteRequest.tileX,
    igniteRequest.tileY,
    igniteRequest.worldLayer,
  );

  if (existingCell) {
    return c.json<WorldFireDevvitIgniteResponse>(
      {
        type: 'error',
        message: 'Fire is already burning here.',
      },
      400,
    );
  }

  const placedBlock = await findingWorldFireDevvitPlacedBlockAtTile(
    roomScope,
    igniteRequest.tileX,
    igniteRequest.tileY,
    igniteRequest.worldLayer,
  );

  if (!placedBlock) {
    return c.json<WorldFireDevvitIgniteResponse>(
      {
        type: 'error',
        message: 'Nothing to ignite here.',
      },
      400,
    );
  }

  if (igniteRequest.mode === 'campfire') {
    if (placedBlock.definition_id !== WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID) {
      return c.json<WorldFireDevvitIgniteResponse>(
        {
          type: 'error',
          message: 'That block is not a campfire.',
        },
        400,
      );
    }

    const woodConsumeResult = await consumingWorldFireDevvitInventoryItem(
      roomScope,
      userId,
      WORLD_FIRE_DEVVIT_WOOD_ITEM_TYPE_ID,
      1,
    );

    if (woodConsumeResult.type !== 'consumed') {
      return c.json<WorldFireDevvitIgniteResponse>(
        {
          type: 'error',
          message: 'You need wood to light the campfire.',
        },
        400,
      );
    }

    const cell = creatingWorldFireDevvitCell(
      'campfire',
      igniteRequest.tileX,
      igniteRequest.tileY,
      igniteRequest.worldLayer,
      WORLD_FIRE_DEVVIT_CAMPFIRE_INITIAL_FUEL_MS,
    );

    await upsertingWorldFireDevvitCell(roomScope, cell);

    return c.json<WorldFireDevvitIgniteResponse>({
      type: 'ignited',
      cell,
    });
  }

  const materialProperties = resolvingWorldFireDevvitMaterialProperties(
    placedBlock.definition_id,
  );

  if (!materialProperties || materialProperties.flammability <= 0) {
    return c.json<WorldFireDevvitIgniteResponse>(
      {
        type: 'error',
        message: 'That material is not flammable.',
      },
      400,
    );
  }

  const flintConsumeResult = await consumingWorldFireDevvitInventoryItem(
    roomScope,
    userId,
    WORLD_FIRE_DEVVIT_FLINT_ITEM_TYPE_ID,
    1,
  );

  if (flintConsumeResult.type !== 'consumed') {
    return c.json<WorldFireDevvitIgniteResponse>(
      {
        type: 'error',
        message: 'You need flint to start a fire.',
      },
      400,
    );
  }

  const cell = creatingWorldFireDevvitCell(
    'spreading',
    igniteRequest.tileX,
    igniteRequest.tileY,
    igniteRequest.worldLayer,
    materialProperties.burnDurationMs,
  );

  await upsertingWorldFireDevvitCell(roomScope, cell);

  return c.json<WorldFireDevvitIgniteResponse>({
    type: 'ignited',
    cell,
  });
});

worldFire.post('/add-fuel', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<WorldFireDevvitAddFuelResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to refuel fire.',
      },
      401,
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const addFuelRequest = parsingWorldFireDevvitAddFuelRequest(body);

  if (!addFuelRequest) {
    return c.json<WorldFireDevvitAddFuelResponse>(
      {
        type: 'error',
        message: 'Invalid add-fuel request.',
      },
      400,
    );
  }

  if (
    !checkingWorldFireDevvitPlayerWithinInteractionRadius(
      addFuelRequest.playerX,
      addFuelRequest.playerY,
      addFuelRequest.tileX,
      addFuelRequest.tileY,
    )
  ) {
    return c.json<WorldFireDevvitAddFuelResponse>(
      {
        type: 'error',
        message: 'Move closer to refuel the campfire.',
      },
      400,
    );
  }

  const roomScope = resolvingPlazaDevvitOnlineRoomScope();
  await advancingWorldFireDevvitSimulation(roomScope);

  const tileKey = buildingWorldFireDevvitTileKey(
    addFuelRequest.tileX,
    addFuelRequest.tileY,
    addFuelRequest.worldLayer,
  );
  const existingCell = await findingWorldFireDevvitCellAtTile(
    roomScope,
    addFuelRequest.tileX,
    addFuelRequest.tileY,
    addFuelRequest.worldLayer,
  );

  if (!existingCell || existingCell.kind !== 'campfire') {
    return c.json<WorldFireDevvitAddFuelResponse>(
      {
        type: 'error',
        message: 'No lit campfire here to refuel.',
      },
      400,
    );
  }

  if (existingCell.fuelRemainingMs >= WORLD_FIRE_DEVVIT_CAMPFIRE_MAX_FUEL_MS) {
    return c.json<WorldFireDevvitAddFuelResponse>(
      {
        type: 'error',
        message: 'Campfire fuel is already full.',
      },
      400,
    );
  }

  const woodConsumeResult = await consumingWorldFireDevvitInventoryItem(
    roomScope,
    userId,
    WORLD_FIRE_DEVVIT_WOOD_ITEM_TYPE_ID,
    1,
  );

  if (woodConsumeResult.type !== 'consumed') {
    return c.json<WorldFireDevvitAddFuelResponse>(
      {
        type: 'error',
        message: 'You need wood to refuel the campfire.',
      },
      400,
    );
  }

  const nextFuelRemainingMs = Math.min(
    WORLD_FIRE_DEVVIT_CAMPFIRE_MAX_FUEL_MS,
    existingCell.fuelRemainingMs + WORLD_FIRE_DEVVIT_CAMPFIRE_FUEL_PER_WOOD_MS,
  );
  const nextCell = {
    ...existingCell,
    fuelRemainingMs: nextFuelRemainingMs,
    intensity: Math.min(
      1,
      nextFuelRemainingMs / WORLD_FIRE_DEVVIT_CAMPFIRE_INITIAL_FUEL_MS,
    ),
  };

  await upsertingWorldFireDevvitCell(roomScope, nextCell);

  return c.json<WorldFireDevvitAddFuelResponse>({
    type: 'fueled',
    cell: nextCell,
  });
});

export { buildingWorldFireDevvitTileKey };
