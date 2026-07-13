import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import type {
  PlazaSinglePlayerSaveSlotPersistedData,
  PlazaSinglePlayerSaveSlotResponse,
  PlazaSinglePlayerSaveSlotSaveResponse,
  PlazaSinglePlayerSaveSlotSummary,
  PlazaSinglePlayerSaveSlotUpdateRequest,
  PlazaSinglePlayerSavesListResponse,
} from '../../../../shared/plazaSinglePlayerSavesDevvit';
import { PLAZA_SINGLE_PLAYER_SAVES_API_BASE_PATH } from '../../../../shared/plazaSinglePlayerSavesDevvit';

async function parsingPlazaSinglePlayerSavesJsonResponse(
  response: Response
): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function resolvingPlazaSinglePlayerSavesErrorMessage(
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

async function callingPlazaSinglePlayerSavesDevvitApi(
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
  const body = await parsingPlazaSinglePlayerSavesJsonResponse(response);

  if (
    !response.ok ||
    (body &&
      typeof body === 'object' &&
      'type' in body &&
      body.type === 'error')
  ) {
    throw new Error(
      resolvingPlazaSinglePlayerSavesErrorMessage(
        body,
        `Save request failed (${response.status}).`
      )
    );
  }

  return body;
}

/**
 * Fetches summaries for all single-player save slots from Devvit Redis.
 */
export async function fetchingPlazaSinglePlayerSaveSlotSummaries(): Promise<
  PlazaSinglePlayerSaveSlotSummary[]
> {
  const body = await callingPlazaSinglePlayerSavesDevvitApi(
    PLAZA_SINGLE_PLAYER_SAVES_API_BASE_PATH
  );
  const payload = body as Partial<PlazaSinglePlayerSavesListResponse>;

  if (payload.type !== 'saves' || !Array.isArray(payload.slots)) {
    throw new Error('Invalid save slot list response.');
  }

  return payload.slots;
}

/**
 * Fetches one single-player save slot payload from Devvit Redis.
 *
 * @param saveSlotIndex - Save slot (1–3).
 */
export async function fetchingPlazaSinglePlayerSaveSlotData(
  saveSlotIndex: PlazaSaveSlotIndex
): Promise<PlazaSinglePlayerSaveSlotPersistedData | null> {
  const body = await callingPlazaSinglePlayerSavesDevvitApi(
    `${PLAZA_SINGLE_PLAYER_SAVES_API_BASE_PATH}/${saveSlotIndex}`
  );
  const payload = body as Partial<PlazaSinglePlayerSaveSlotResponse>;

  if (payload.type !== 'save-slot') {
    throw new Error('Invalid save slot response.');
  }

  return payload.data ?? null;
}

/**
 * Deletes one single-player save slot from Devvit Redis.
 *
 * @param saveSlotIndex - Save slot (1–3).
 */
export async function deletingPlazaSinglePlayerSaveSlotData(
  saveSlotIndex: PlazaSaveSlotIndex
): Promise<void> {
  await savingPlazaSinglePlayerSaveSlotData(saveSlotIndex, {
    lastPosition: null,
    inventory: null,
    playerConditions: null,
    attachedRecipeIds: null,
    bestiaryDiscovery: null,
    exploredBiomeKinds: null,
    discoveredNamedRealmIds: null,
  });
}

/**
 * Upserts one single-player save slot payload to Devvit Redis.
 *
 * @param saveSlotIndex - Save slot (1–3).
 * @param update - Partial save payload to merge.
 */
export async function savingPlazaSinglePlayerSaveSlotData(
  saveSlotIndex: PlazaSaveSlotIndex,
  update: PlazaSinglePlayerSaveSlotUpdateRequest
): Promise<void> {
  const body = await callingPlazaSinglePlayerSavesDevvitApi(
    `${PLAZA_SINGLE_PLAYER_SAVES_API_BASE_PATH}/${saveSlotIndex}`,
    {
      method: 'PUT',
      body: JSON.stringify(update),
      // Let the save survive page close (flush-on-pagehide persistence).
      keepalive: true,
    }
  );
  const payload = body as Partial<PlazaSinglePlayerSaveSlotSaveResponse>;

  if (payload.type !== 'saved') {
    throw new Error('Invalid save slot save response.');
  }
}
