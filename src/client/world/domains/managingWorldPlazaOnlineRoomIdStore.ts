/**
 * Active multiplayer room id for Devvit world API URL builders.
 *
 * @module components/world/domains/managingWorldPlazaOnlineRoomIdStore
 */

let activeOnlineRoomId: string | null = null;

/**
 * Sets the active multiplayer room id used by world API callers.
 *
 * @param roomId - Named room id slug, or null for single-player.
 */
export function settingWorldPlazaOnlineRoomId(roomId: string | null): void {
  activeOnlineRoomId =
    typeof roomId === 'string' && roomId.trim().length > 0
      ? roomId.trim()
      : null;
}

/**
 * Reads the active multiplayer room id, if any.
 */
export function readingWorldPlazaOnlineRoomId(): string | null {
  return activeOnlineRoomId;
}

/**
 * Appends `room=` to a world API path when a multiplayer room is active.
 *
 * @param apiPath - Relative API path (may already include query params).
 */
export function appendingWorldPlazaOnlineRoomQueryToApiPath(
  apiPath: string
): string {
  if (!activeOnlineRoomId) {
    return apiPath;
  }

  const separator = apiPath.includes('?') ? '&' : '?';

  return `${apiPath}${separator}room=${encodeURIComponent(activeOnlineRoomId)}`;
}
