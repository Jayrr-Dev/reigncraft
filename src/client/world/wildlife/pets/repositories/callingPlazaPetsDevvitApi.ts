/**
 * Client repository for the multiplayer companion roster API.
 *
 * @module components/world/wildlife/pets/repositories/callingPlazaPetsDevvitApi
 */

import {
  PLAZA_PETS_API_BASE_PATH,
  type PlazaPetsRosterResponse,
  type PlazaPetsRosterUpdateRequest,
  type PlazaPetsSaveResponse,
} from '../../../../../shared/plazaPetsDevvit';
import type { PlazaSinglePlayerSavePetRoster } from '../../../../../shared/plazaSinglePlayerSavesDevvit';

async function parsingPlazaPetsJsonResponse(
  response: Response
): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function resolvingPlazaPetsErrorMessage(
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

async function callingPlazaPetsDevvitApi(
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
  const body = await parsingPlazaPetsJsonResponse(response);

  if (
    !response.ok ||
    (body &&
      typeof body === 'object' &&
      'type' in body &&
      body.type === 'error')
  ) {
    throw new Error(
      resolvingPlazaPetsErrorMessage(
        body,
        `Companion roster request failed (${response.status}).`
      )
    );
  }

  return body;
}

/**
 * Fetches the multiplayer companion roster for the signed-in Reddit user.
 */
export async function fetchingPlazaPetsMultiplayerRoster(): Promise<PlazaSinglePlayerSavePetRoster | null> {
  const body = await callingPlazaPetsDevvitApi(PLAZA_PETS_API_BASE_PATH);
  const payload = body as Partial<PlazaPetsRosterResponse>;

  if (payload.type !== 'pet-roster') {
    throw new Error('Invalid companion roster response.');
  }

  return payload.roster ?? null;
}

/**
 * Replaces the multiplayer companion roster for the signed-in Reddit user.
 *
 * @param roster - Full companion roster to persist.
 */
export async function savingPlazaPetsMultiplayerRoster(
  roster: PlazaSinglePlayerSavePetRoster
): Promise<void> {
  const update: PlazaPetsRosterUpdateRequest = { roster };
  const body = await callingPlazaPetsDevvitApi(PLAZA_PETS_API_BASE_PATH, {
    method: 'PUT',
    body: JSON.stringify(update),
    keepalive: true,
  });
  const payload = body as Partial<PlazaPetsSaveResponse>;

  if (payload.type !== 'saved') {
    throw new Error('Invalid companion roster save response.');
  }
}
