import type {
  WorldHarvestDevvitChoppedTreesResponse,
  WorldHarvestDevvitChopTreeRequest,
  WorldHarvestDevvitChopTreeResponse,
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
  const response = await fetch(path, {
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
