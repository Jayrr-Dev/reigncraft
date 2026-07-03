import {
  creatingWorldPlazaSavedCoords,
  type DefiningWorldPlazaSavedCoords,
} from "@/components/world/domains/definingWorldPlazaSavedCoords";
import { DEFINING_WORLD_PLAZA_SAVED_COORDS_MAX_COUNT } from "@/components/world/domains/definingWorldPlazaSavedCoordsConstants";

/**
 * Parses one saved coordinate payload from storage.
 *
 * @param value - Raw JSON value for one coordinate row
 */
function resolvingWorldPlazaSavedCoordsFromStorageValue(
  value: unknown,
): DefiningWorldPlazaSavedCoords | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const tileX = record.tileX;
  const tileY = record.tileY;

  if (
    typeof tileX !== "number" ||
    typeof tileY !== "number" ||
    !Number.isFinite(tileX) ||
    !Number.isFinite(tileY)
  ) {
    return null;
  }

  const savedAtMs =
    typeof record.savedAtMs === "number" && Number.isFinite(record.savedAtMs)
      ? record.savedAtMs
      : Date.now();
  const savedCoordsId =
    typeof record.savedCoordsId === "string" && record.savedCoordsId.length > 0
      ? record.savedCoordsId
      : undefined;

  return creatingWorldPlazaSavedCoords(
    Math.round(tileX),
    Math.round(tileY),
    savedAtMs,
    savedCoordsId,
  );
}

/**
 * Normalizes persisted JSON into a bounded saved-coordinate list.
 *
 * @param parsedValue - Parsed localStorage JSON
 */
export function resolvingWorldPlazaSavedCoordsListFromStorage(
  parsedValue: unknown,
): DefiningWorldPlazaSavedCoords[] {
  if (Array.isArray(parsedValue)) {
    return parsedValue
      .map((entry) => resolvingWorldPlazaSavedCoordsFromStorageValue(entry))
      .filter((entry): entry is DefiningWorldPlazaSavedCoords => entry !== null)
      .slice(0, DEFINING_WORLD_PLAZA_SAVED_COORDS_MAX_COUNT);
  }

  const legacySavedCoords =
    resolvingWorldPlazaSavedCoordsFromStorageValue(parsedValue);

  return legacySavedCoords ? [legacySavedCoords] : [];
}

/**
 * Appends a coordinate when capacity remains.
 *
 * @param savedCoordsList - Current saved coordinates
 * @param nextSavedCoords - Coordinate to append
 */
export function appendingWorldPlazaSavedCoordsToList(
  savedCoordsList: readonly DefiningWorldPlazaSavedCoords[],
  nextSavedCoords: DefiningWorldPlazaSavedCoords,
): DefiningWorldPlazaSavedCoords[] {
  if (savedCoordsList.length >= DEFINING_WORLD_PLAZA_SAVED_COORDS_MAX_COUNT) {
    return [...savedCoordsList];
  }

  return [...savedCoordsList, nextSavedCoords];
}

/**
 * Removes one saved coordinate by id.
 *
 * @param savedCoordsList - Current saved coordinates
 * @param savedCoordsId - Stable id of the row to remove
 */
export function removingWorldPlazaSavedCoordsFromList(
  savedCoordsList: readonly DefiningWorldPlazaSavedCoords[],
  savedCoordsId: string,
): DefiningWorldPlazaSavedCoords[] {
  return savedCoordsList.filter(
    (savedCoords) => savedCoords.savedCoordsId !== savedCoordsId,
  );
}

/**
 * Resolves one saved coordinate row by id.
 *
 * @param savedCoordsList - Current saved coordinates
 * @param savedCoordsId - Stable id to find
 */
export function resolvingWorldPlazaSavedCoordsById(
  savedCoordsList: readonly DefiningWorldPlazaSavedCoords[],
  savedCoordsId: string | null,
): DefiningWorldPlazaSavedCoords | null {
  if (!savedCoordsId) {
    return null;
  }

  return (
    savedCoordsList.find(
      (savedCoords) => savedCoords.savedCoordsId === savedCoordsId,
    ) ?? null
  );
}
