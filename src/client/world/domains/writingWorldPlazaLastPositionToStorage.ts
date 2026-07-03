import type { DefiningWorldPlazaLastPosition } from "@/components/world/domains/definingWorldPlazaLastPosition";
import { resolvingWorldPlazaLastPositionStorageKey } from "@/components/world/domains/definingWorldPlazaLastPositionConstants";

/**
 * Persists the last plaza avatar position to localStorage.
 *
 * @param lastPosition - Grid position to store.
 * @param onlineUserId - Auth user id, or null for guest sessions.
 */
export function writingWorldPlazaLastPositionToStorage(
  lastPosition: DefiningWorldPlazaLastPosition,
  onlineUserId: string | null,
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaLastPositionStorageKey(onlineUserId),
    JSON.stringify(lastPosition),
  );
}
