import { appendingWorldPlazaOnlineRoomQueryToApiPath } from '@/components/world/domains/managingWorldPlazaOnlineRoomIdStore';
import type {
  WorldHarvestDevvitChoppedTreesResponse,
  WorldHarvestDevvitChopTreeRequest,
  WorldHarvestDevvitChopTreeResponse,
  WorldHarvestDevvitMinedRocksResponse,
  WorldHarvestDevvitMineRockRequest,
  WorldHarvestDevvitMineRockResponse,
  WorldHarvestDevvitPickedPebblesResponse,
  WorldHarvestDevvitPickPebbleRequest,
  WorldHarvestDevvitPickPebbleResponse,
} from '../../../../shared/worldHarvestDevvit';

async function parsingWorldHarvestDevvitJsonResponse(
  response: Response,
): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function resolvingWorldHarvestDevvitErrorMessage(
  body: unknown,
  fallbackMessage: string,
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

async function callingWorldHarvestDevvitApi(
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const response = await fetch(appendingWorldPlazaOnlineRoomQueryToApiPath(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const body = await parsingWorldHarvestDevvitJsonResponse(response);

  if (
    !response.ok ||
    (body &&
      typeof body === 'object' &&
      'type' in body &&
      body.type === 'error')
  ) {
    throw new Error(
      resolvingWorldHarvestDevvitErrorMessage(
        body,
        `Harvest request failed (${response.status}).`,
      ),
    );
  }

  return body;
}

/**
 * Polls chopped-tree state from the Devvit server.
 */
export async function fetchingWorldHarvestDevvitChoppedTrees(
  path: string,
  saveSlotIndex?: number | null,
) {
  const requestPath =
    typeof saveSlotIndex === 'number'
      ? `${path}?saveSlotIndex=${saveSlotIndex}`
      : path;
  const body = await callingWorldHarvestDevvitApi(requestPath);
  const payload = body as Partial<WorldHarvestDevvitChoppedTreesResponse>;

  if (payload.type !== 'chopped-trees' || !Array.isArray(payload.tiles)) {
    throw new Error('Invalid chopped trees response.');
  }

  return payload.tiles;
}

/**
 * Applies one tree chop through the Devvit server.
 */
export async function choppingWorldHarvestDevvitTreeLayer(
  path: string,
  requestBody: WorldHarvestDevvitChopTreeRequest,
) {
  const body = await callingWorldHarvestDevvitApi(path, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  const payload = body as Partial<WorldHarvestDevvitChopTreeResponse>;

  if (payload.type === 'chopped') {
    return {
      outcome: 'chopped' as const,
      remainingVisualLayer: payload.remainingVisualLayer,
      layersRemoved: payload.layersRemoved,
      woodQuantity: payload.woodQuantity,
      isFullyFelled: payload.isFullyFelled,
    };
  }

  if (payload.type === 'out-of-range') {
    return { outcome: 'out-of-range' as const };
  }

  if (payload.type === 'already-felled') {
    return { outcome: 'already-felled' as const };
  }

  throw new Error('Invalid tree chop response.');
}

/**
 * Polls mined-rock state from the Devvit server.
 */
export async function fetchingWorldHarvestDevvitMinedRocks(
  path: string,
  saveSlotIndex?: number | null,
) {
  const requestPath =
    typeof saveSlotIndex === 'number'
      ? `${path}?saveSlotIndex=${saveSlotIndex}`
      : path;
  const body = await callingWorldHarvestDevvitApi(requestPath);
  const payload = body as Partial<WorldHarvestDevvitMinedRocksResponse>;

  if (payload.type !== 'mined-rocks' || !Array.isArray(payload.tiles)) {
    throw new Error('Invalid mined rocks response.');
  }

  return payload.tiles;
}

/**
 * Applies one rock mine through the Devvit server.
 */
export async function miningWorldHarvestDevvitRockLayer(
  path: string,
  requestBody: WorldHarvestDevvitMineRockRequest,
) {
  const body = await callingWorldHarvestDevvitApi(path, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  const payload = body as Partial<WorldHarvestDevvitMineRockResponse>;

  if (payload.type === 'mined') {
    return {
      outcome: 'mined' as const,
      remainingVisualLayer: payload.remainingVisualLayer,
      layersRemoved: payload.layersRemoved,
      stoneQuantity: payload.stoneQuantity,
      isFullyDepleted: payload.isFullyDepleted,
    };
  }

  if (payload.type === 'out-of-range') {
    return { outcome: 'out-of-range' as const };
  }

  if (payload.type === 'already-depleted') {
    return { outcome: 'already-depleted' as const };
  }

  throw new Error('Invalid rock mine response.');
}

/**
 * Polls picked-pebble state from the Devvit server.
 */
export async function fetchingWorldHarvestDevvitPickedPebbles(
  path: string,
  saveSlotIndex?: number | null,
) {
  const requestPath =
    typeof saveSlotIndex === 'number'
      ? `${path}?saveSlotIndex=${saveSlotIndex}`
      : path;
  const body = await callingWorldHarvestDevvitApi(requestPath);
  const payload = body as Partial<WorldHarvestDevvitPickedPebblesResponse>;

  if (payload.type !== 'picked-pebbles' || !Array.isArray(payload.tiles)) {
    throw new Error('Invalid picked pebbles response.');
  }

  return payload.tiles;
}

/**
 * Applies one pebble pick through the Devvit server.
 */
export async function pickingWorldHarvestDevvitPebble(
  path: string,
  requestBody: WorldHarvestDevvitPickPebbleRequest,
) {
  const body = await callingWorldHarvestDevvitApi(path, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  const payload = body as Partial<WorldHarvestDevvitPickPebbleResponse>;

  if (payload.type === 'picked') {
    return {
      outcome: 'picked' as const,
      stoneQuantity: payload.stoneQuantity,
    };
  }

  if (payload.type === 'out-of-range') {
    return { outcome: 'out-of-range' as const };
  }

  if (payload.type === 'already-picked') {
    return { outcome: 'already-picked' as const };
  }

  throw new Error('Invalid pebble pick response.');
}
