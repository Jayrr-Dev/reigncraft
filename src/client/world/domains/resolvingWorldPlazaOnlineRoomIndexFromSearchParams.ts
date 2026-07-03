import {
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_FIRST_SHARD_INDEX,
  DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_SHARD_COUNT,
} from "@/components/world/domains/definingWorldPlazaOnlineRoom";

/**
 * Reads an optional plaza room shard index from URL search params.
 *
 * Use `?room=1` so friends join the same shard instead of auto-assignment.
 *
 * @param searchParams - Next.js search params (or null).
 */
export function resolvingWorldPlazaOnlineRoomIndexFromSearchParams(
  searchParams: { get: (key: string) => string | null } | null | undefined,
): number | null {
  const rawRoomIndex = searchParams?.get("room")?.trim();

  if (!rawRoomIndex) {
    return null;
  }

  const parsedRoomIndex = Number.parseInt(rawRoomIndex, 10);

  if (
    !Number.isFinite(parsedRoomIndex) ||
    parsedRoomIndex < DEFINING_WORLD_PLAZA_ONLINE_ROOM_FIRST_SHARD_INDEX ||
    parsedRoomIndex > DEFINING_WORLD_PLAZA_ONLINE_ROOM_MAX_SHARD_COUNT
  ) {
    return null;
  }

  return parsedRoomIndex;
}
