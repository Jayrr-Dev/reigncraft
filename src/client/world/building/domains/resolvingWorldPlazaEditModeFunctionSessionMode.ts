import {
  DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_SESSION_MODE_BY_ID,
  DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID,
  type DefiningWorldPlazaEditModeFunctionId,
  type DefiningWorldPlazaEditModeSessionModeId,
} from '@/components/world/building/domains/definingWorldPlazaEditModeFunctionRegistry';

/**
 * Resolves which Build/Claim session a hotbar function slot should activate.
 *
 * @module components/world/building/domains/resolvingWorldPlazaEditModeFunctionSessionMode
 */

/**
 * Returns the session mode tied to an edit hotbar function id.
 *
 * @param functionId - Opened function slot id.
 */
export function resolvingWorldPlazaEditModeFunctionSessionMode(
  functionId: DefiningWorldPlazaEditModeFunctionId
): DefiningWorldPlazaEditModeSessionModeId {
  return DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_SESSION_MODE_BY_ID[functionId];
}

/**
 * Returns true when the resolved session mode is Build.
 *
 * @param sessionModeId - Resolved session mode.
 */
export function checkingWorldPlazaEditModeFunctionSessionIsBuild(
  sessionModeId: DefiningWorldPlazaEditModeSessionModeId
): boolean {
  return sessionModeId === DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD;
}
