import type {
  WorldBuildingDevvitClaimPlotResponse,
  WorldBuildingDevvitDeleteSessionBlocksResponse,
  WorldBuildingDevvitErrorResponse,
  WorldBuildingDevvitOwnerLimitsResponse,
  WorldBuildingDevvitPlaceBlockResponse,
  WorldBuildingDevvitPlaceSessionBlockResponse,
  WorldBuildingDevvitPlotsPayload,
} from '../../../../shared/worldBuildingDevvit';

/**
 * Calls a Devvit world-building API route and throws on error responses.
 *
 * @module components/world/building/repositories/callingWorldBuildingDevvitApi
 */

async function parsingWorldBuildingDevvitJsonResponse(
  response: Response,
): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function resolvingWorldBuildingDevvitErrorMessage(
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

/**
 * Performs a fetch against a world-building Devvit route.
 *
 * @param path - API path (including query string when needed).
 * @param init - Optional fetch init.
 */
export async function callingWorldBuildingDevvitApi(
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const body = await parsingWorldBuildingDevvitJsonResponse(response);

  if (
    !response.ok ||
    (body &&
      typeof body === 'object' &&
      'type' in body &&
      body.type === 'error')
  ) {
    throw new Error(
      resolvingWorldBuildingDevvitErrorMessage(
        body,
        `World building request failed (${response.status}).`,
      ),
    );
  }

  return body;
}

/**
 * Loads plots and optional blocks from a Devvit world-building route.
 *
 * @param path - API path.
 */
export async function fetchingWorldBuildingDevvitPlotsPayload(
  path: string,
): Promise<WorldBuildingDevvitPlotsPayload> {
  const body = await callingWorldBuildingDevvitApi(path);
  const payload = body as Partial<WorldBuildingDevvitPlotsPayload>;

  if (payload.type !== 'plots' || !Array.isArray(payload.plots)) {
    throw new Error('Invalid plots response.');
  }

  return {
    type: 'plots',
    plots: payload.plots,
    blocks: Array.isArray(payload.blocks) ? payload.blocks : [],
  };
}

/**
 * Claims a tile through the Devvit world-building API.
 *
 * @param path - Claim API path.
 * @param requestBody - Claim payload.
 */
export async function claimingWorldBuildingDevvitPlot(
  path: string,
  requestBody: { tileX: number; tileY: number; isTemporary: boolean },
): Promise<string> {
  const body = await callingWorldBuildingDevvitApi(path, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  const payload = body as Partial<WorldBuildingDevvitClaimPlotResponse>;

  if (payload.type !== 'claim' || typeof payload.plotId !== 'string') {
    throw new Error('Invalid claim response.');
  }

  return payload.plotId;
}

/**
 * Loads per-user plot limits from the Devvit world-building API.
 *
 * @param path - Owner limits API path.
 */
export async function fetchingWorldBuildingDevvitOwnerLimits(path: string) {
  const body = await callingWorldBuildingDevvitApi(path);
  const payload = body as Partial<WorldBuildingDevvitOwnerLimitsResponse>;

  if (payload.type !== 'owner-limits' || !payload.limits) {
    throw new Error('Invalid owner limits response.');
  }

  return payload.limits;
}

/**
 * Places a block through the Devvit world-building API.
 *
 * @param path - Blocks API path.
 * @param requestBody - Block placement payload.
 */
export async function placingWorldBuildingDevvitBlock(
  path: string,
  requestBody: {
    blockId: string;
    plotId: string;
    definitionId: string;
    tileX: number;
    tileY: number;
    worldLayer: number;
    blockHeight: number;
    placedAt: string;
    metadata?: Record<string, string | number | boolean | null>;
  },
) {
  const body = await callingWorldBuildingDevvitApi(path, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  const payload = body as Partial<WorldBuildingDevvitPlaceBlockResponse>;

  if (payload.type !== 'block' || !payload.block) {
    throw new Error('Invalid block placement response.');
  }

  return payload.block;
}

/**
 * Deletes a plot through the Devvit world-building API.
 *
 * @param path - Plot delete API path.
 */
export async function deletingWorldBuildingDevvitPlot(path: string): Promise<void> {
  await callingWorldBuildingDevvitApi(path, { method: 'DELETE' });
}

/**
 * Deletes a block through the Devvit world-building API.
 *
 * @param path - Block delete API path.
 */
export async function deletingWorldBuildingDevvitBlock(path: string): Promise<void> {
  await callingWorldBuildingDevvitApi(path, { method: 'DELETE' });
}

/**
 * Places a session block through the Devvit world-building API.
 *
 * @param path - Session blocks API path.
 * @param requestBody - Session block placement payload.
 */
export async function placingWorldBuildingDevvitSessionBlock(
  path: string,
  requestBody: {
    blockId: string;
    definitionId: string;
    tileX: number;
    tileY: number;
    worldLayer: number;
    blockHeight: number;
    placedAt: string;
    metadata?: Record<string, string | number | boolean | null>;
  },
) {
  const body = await callingWorldBuildingDevvitApi(path, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  const payload = body as Partial<WorldBuildingDevvitPlaceSessionBlockResponse>;

  if (payload.type !== 'block' || !payload.block) {
    throw new Error('Invalid session block placement response.');
  }

  return payload.block;
}

/**
 * Deletes all session blocks owned by the signed-in user.
 *
 * @param path - Session blocks API path.
 */
export async function deletingWorldBuildingDevvitSessionBlocks(
  path: string,
): Promise<number> {
  const body = await callingWorldBuildingDevvitApi(path, { method: 'DELETE' });
  const payload = body as Partial<WorldBuildingDevvitDeleteSessionBlocksResponse>;

  if (payload.type !== 'deleted') {
    throw new Error('Invalid session block delete response.');
  }

  return payload.deletedBlockCount ?? 0;
}

export type { WorldBuildingDevvitErrorResponse };
