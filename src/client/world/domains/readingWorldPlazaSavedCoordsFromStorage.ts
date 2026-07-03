import type { DefiningWorldPlazaSavedCoords } from "@/components/world/domains/definingWorldPlazaSavedCoords";
import { DEFINING_WORLD_PLAZA_SAVED_COORDS_STORAGE_KEY } from "@/components/world/domains/definingWorldPlazaSavedCoordsConstants";
import { resolvingWorldPlazaSavedCoordsListFromStorage } from "@/components/world/domains/resolvingWorldPlazaSavedCoordsListFromStorage";

/**
 * Reads the persisted saved plaza coordinates from localStorage.
 *
 * @returns Saved coordinate rows (empty when unset or invalid).
 */
export function readingWorldPlazaSavedCoordsFromStorage(): DefiningWorldPlazaSavedCoords[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = localStorage.getItem(
      DEFINING_WORLD_PLAZA_SAVED_COORDS_STORAGE_KEY,
    );

    if (!rawValue) {
      return [];
    }

    return resolvingWorldPlazaSavedCoordsListFromStorage(JSON.parse(rawValue));
  } catch {
    return [];
  }
}
