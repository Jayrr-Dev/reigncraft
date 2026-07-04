import type { DefiningWorldPlazaSavedCoords } from "@/components/world/domains/definingWorldPlazaSavedCoords";
import { resolvingWorldPlazaSavedCoordsStorageKey } from "@/components/world/domains/definingWorldPlazaSavedCoordsConstants";

/**
 * Persists saved plaza coordinates to localStorage.
 *
 * @param savedCoordsList - Saved coordinate rows to store.
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function writingWorldPlazaSavedCoordsToStorage(
  savedCoordsList: readonly DefiningWorldPlazaSavedCoords[],
  storageOwnerId: string | null = null,
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaSavedCoordsStorageKey(storageOwnerId),
    JSON.stringify(savedCoordsList),
  );
}
