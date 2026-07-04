import type { DefiningWorldPlazaSavedCoords } from "@/components/world/domains/definingWorldPlazaSavedCoords";
import { resolvingWorldPlazaSavedCoordsStorageKey } from "@/components/world/domains/definingWorldPlazaSavedCoordsConstants";
import { resolvingWorldPlazaSavedCoordsListFromStorage } from "@/components/world/domains/resolvingWorldPlazaSavedCoordsListFromStorage";

/**
 * Reads the persisted saved plaza coordinates from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 * @returns Saved coordinate rows (empty when unset or invalid).
 */
export function readingWorldPlazaSavedCoordsFromStorage(
  storageOwnerId: string | null = null,
): DefiningWorldPlazaSavedCoords[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaSavedCoordsStorageKey(storageOwnerId),
    );

    if (!rawValue) {
      return [];
    }

    return resolvingWorldPlazaSavedCoordsListFromStorage(JSON.parse(rawValue));
  } catch {
    return [];
  }
}
