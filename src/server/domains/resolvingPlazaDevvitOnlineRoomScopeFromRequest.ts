import type { Context } from 'hono';
import {
  parsingPlazaDevvitOnlineRoomIdFromQuery,
  resolvingPlazaDevvitOnlineRoomScope,
} from './resolvingPlazaDevvitOnlineRoomScope';

/** Shared Redis room bucket for single-player Devvit world APIs with no `?room=`. */
export const PLAZA_DEVVIT_ONLINE_SINGLE_PLAYER_DEFAULT_ROOM_ID =
  'single-player-default' as const;

/**
 * Resolves the world Redis room scope from `?room=`.
 * Multiplayer clients always send a named room id. Single-player / legacy
 * callers without `room` use {@link PLAZA_DEVVIT_ONLINE_SINGLE_PLAYER_DEFAULT_ROOM_ID}.
 *
 * @param context - Hono request context.
 */
export function resolvingPlazaDevvitOnlineRoomScopeFromRequest(
  context: Context
): string {
  const roomId =
    parsingPlazaDevvitOnlineRoomIdFromQuery(context.req.query('room')) ??
    PLAZA_DEVVIT_ONLINE_SINGLE_PLAYER_DEFAULT_ROOM_ID;

  return resolvingPlazaDevvitOnlineRoomScope(roomId);
}
