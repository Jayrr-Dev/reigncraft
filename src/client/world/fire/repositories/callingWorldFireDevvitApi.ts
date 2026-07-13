import { appendingWorldPlazaOnlineRoomQueryToApiPath } from '@/components/world/domains/managingWorldPlazaOnlineRoomIdStore';
import type {
  WorldFireDevvitAddFuelRequest,
  WorldFireDevvitAddFuelResponse,
  WorldFireDevvitCellsResponse,
  WorldFireDevvitIgniteRequest,
  WorldFireDevvitIgniteResponse,
} from '../../../../shared/worldFireDevvit';

async function parsingWorldFireDevvitJsonResponse(
  response: Response
): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function resolvingWorldFireDevvitErrorMessage(
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

async function callingWorldFireDevvitApi(
  path: string,
  init?: RequestInit
): Promise<unknown> {
  const response = await fetch(appendingWorldPlazaOnlineRoomQueryToApiPath(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const body = await parsingWorldFireDevvitJsonResponse(response);

  if (
    !response.ok ||
    (body &&
      typeof body === 'object' &&
      'type' in body &&
      body.type === 'error')
  ) {
    throw new Error(
      resolvingWorldFireDevvitErrorMessage(
        body,
        `Fire request failed (${response.status}).`
      )
    );
  }

  return body;
}

/**
 * Polls active fire cells from the Devvit server.
 *
 * @param path - Fire cells API path.
 */
export async function fetchingWorldFireDevvitCells(path: string) {
  const body = await callingWorldFireDevvitApi(path);
  const payload = body as Partial<WorldFireDevvitCellsResponse>;

  if (payload.type !== 'fire-cells' || !Array.isArray(payload.cells)) {
    throw new Error('Invalid fire cells response.');
  }

  return {
    cells: payload.cells,
    burnedBlockIds: Array.isArray(payload.burnedBlockIds)
      ? payload.burnedBlockIds
      : [],
    burntGrassTileKeys: Array.isArray(payload.burntGrassTileKeys)
      ? payload.burntGrassTileKeys
      : [],
    extinguishedCampfireTileKeys: Array.isArray(
      payload.extinguishedCampfireTileKeys
    )
      ? payload.extinguishedCampfireTileKeys
      : [],
    lastSimulatedTick:
      typeof payload.lastSimulatedTick === 'number'
        ? payload.lastSimulatedTick
        : 0,
  };
}

/**
 * Ignites fire at a tile through the Devvit server.
 *
 * @param path - Ignite API path.
 * @param requestBody - Ignite payload.
 */
export async function ignitingWorldFireDevvitCell(
  path: string,
  requestBody: WorldFireDevvitIgniteRequest
) {
  const body = await callingWorldFireDevvitApi(path, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  const payload = body as Partial<WorldFireDevvitIgniteResponse>;

  if (payload.type !== 'ignited' || !payload.cell) {
    throw new Error('Invalid ignite response.');
  }

  return payload.cell;
}

/**
 * Refuels a campfire through the Devvit server.
 *
 * @param path - Add-fuel API path.
 * @param requestBody - Add-fuel payload.
 */
export async function addingWorldFireDevvitCampfireFuel(
  path: string,
  requestBody: WorldFireDevvitAddFuelRequest
) {
  const body = await callingWorldFireDevvitApi(path, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  const payload = body as Partial<WorldFireDevvitAddFuelResponse>;

  if (payload.type !== 'fueled' || !payload.cell) {
    throw new Error('Invalid add-fuel response.');
  }

  return payload.cell;
}
