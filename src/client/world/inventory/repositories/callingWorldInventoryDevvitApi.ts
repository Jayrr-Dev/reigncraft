import type {
  WorldInventoryDevvitGroundConsumeResponse,
  WorldInventoryDevvitGroundDropResponse,
  WorldInventoryDevvitGroundItemsResponse,
  WorldInventoryDevvitGroundPickupResponse,
  WorldInventoryDevvitPersistedState,
  WorldInventoryDevvitStateResponse,
} from '../../../../shared/worldInventoryDevvit';

/**
 * Calls a Devvit world-inventory API route and throws on error responses.
 *
 * @module components/world/inventory/repositories/callingWorldInventoryDevvitApi
 */

async function parsingWorldInventoryDevvitJsonResponse(
  response: Response
): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function resolvingWorldInventoryDevvitErrorMessage(
  body: unknown,
  fallbackMessage: string
): string {
  if (
    body &&
    typeof body === 'object' &&
    'message' in body &&
    typeof body.message === 'string'
  ) {
    return body.message;
  }

  return fallbackMessage;
}

export async function callingWorldInventoryDevvitApi(
  path: string,
  init?: RequestInit
): Promise<unknown> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const body = await parsingWorldInventoryDevvitJsonResponse(response);

  if (
    !response.ok ||
    (body &&
      typeof body === 'object' &&
      'type' in body &&
      body.type === 'error')
  ) {
    throw new Error(
      resolvingWorldInventoryDevvitErrorMessage(
        body,
        `Inventory request failed (${response.status}).`
      )
    );
  }

  return body;
}

export async function fetchingWorldInventoryDevvitPersistedState(
  path: string
): Promise<WorldInventoryDevvitPersistedState | null> {
  const body = await callingWorldInventoryDevvitApi(path);
  const payload = body as Partial<WorldInventoryDevvitStateResponse>;

  if (payload.type !== 'inventory') {
    throw new Error('Invalid inventory response.');
  }

  return payload.state ?? null;
}

export async function savingWorldInventoryDevvitPersistedState(
  path: string,
  state: WorldInventoryDevvitPersistedState
): Promise<void> {
  await callingWorldInventoryDevvitApi(path, {
    method: 'PUT',
    body: JSON.stringify(state),
    // Let the save survive page close (flush-on-pagehide persistence).
    keepalive: true,
  });
}

export async function fetchingWorldInventoryDevvitGroundItems(
  path: string,
  saveSlotIndex?: number | null
) {
  const requestPath =
    typeof saveSlotIndex === 'number'
      ? `${path}?saveSlotIndex=${saveSlotIndex}`
      : path;
  const body = await callingWorldInventoryDevvitApi(requestPath);
  const payload = body as Partial<WorldInventoryDevvitGroundItemsResponse>;

  if (payload.type !== 'ground-items' || !Array.isArray(payload.items)) {
    throw new Error('Invalid ground items response.');
  }

  return payload.items;
}

export async function droppingWorldInventoryDevvitGroundItem(
  path: string,
  requestBody: {
    itemTypeId: string;
    quantity: number;
    gridX: number;
    gridY: number;
    layer: number;
    slotIndex: number;
    playerX: number;
    playerY: number;
    saveSlotIndex?: number | null;
  }
) {
  const body = await callingWorldInventoryDevvitApi(path, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  const payload = body as Partial<WorldInventoryDevvitGroundDropResponse>;

  if (payload.type !== 'drop-ack') {
    throw new Error('Invalid ground drop response.');
  }

  return payload;
}

export async function pickingUpWorldInventoryDevvitGroundItem(
  path: string,
  requestBody: {
    groundItemId: string;
    requestedQuantity: number;
    playerX: number;
    playerY: number;
    saveSlotIndex?: number | null;
  }
) {
  const body = await callingWorldInventoryDevvitApi(path, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  const payload = body as Partial<WorldInventoryDevvitGroundPickupResponse>;

  if (payload.type !== 'pickup-grant') {
    throw new Error('Invalid ground pickup response.');
  }

  return payload;
}

export async function consumingWorldInventoryDevvitGroundFoodUnit(
  path: string,
  requestBody: {
    groundItemId: string;
    consumerX: number;
    consumerY: number;
    saveSlotIndex?: number | null;
  }
) {
  const body = await callingWorldInventoryDevvitApi(path, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  const payload = body as Partial<WorldInventoryDevvitGroundConsumeResponse>;

  if (payload.type !== 'consume-ack') {
    throw new Error('Invalid ground consume response.');
  }

  return payload;
}
