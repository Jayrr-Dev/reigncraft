import type { DefiningWorldPlazaSavedCoords } from "@/components/world/domains/definingWorldPlazaSavedCoords";
import { DEFINING_WORLD_PLAZA_SAVED_COORDS_STORAGE_KEY } from "@/components/world/domains/definingWorldPlazaSavedCoordsConstants";

/**
 * Persists saved plaza coordinates to localStorage.
 *
 * @param savedCoordsList - Saved coordinate rows to store.
 */
export function writingWorldPlazaSavedCoordsToStorage(
  savedCoordsList: readonly DefiningWorldPlazaSavedCoords[],
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    DEFINING_WORLD_PLAZA_SAVED_COORDS_STORAGE_KEY,
    JSON.stringify(savedCoordsList),
  );
}
