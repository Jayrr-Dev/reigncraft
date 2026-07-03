import {
  creatingWorldPlazaLastPosition,
  type DefiningWorldPlazaLastPosition,
} from "@/components/world/domains/definingWorldPlazaLastPosition";
import { resolvingWorldPlazaLastPositionStorageKey } from "@/components/world/domains/definingWorldPlazaLastPositionConstants";
import { DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/** Parsed localStorage payload for last plaza position. */
interface ReadingWorldPlazaLastPositionStoragePayload {
  x?: unknown;
  y?: unknown;
  layer?: unknown;
  updatedAtMs?: unknown;
}

/**
 * Validates one numeric grid coordinate from storage.
 *
 * @param value - Raw parsed value.
 */
function checkingWorldPlazaLastPositionStorageCoordinate(
  value: unknown,
): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Reads the persisted last plaza position from localStorage.
 *
 * @param onlineUserId - Auth user id, or null for guest sessions.
 * @returns Last position or null when unset or invalid.
 */
export function readingWorldPlazaLastPositionFromStorage(
  onlineUserId: string | null,
): DefiningWorldPlazaLastPosition | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaLastPositionStorageKey(onlineUserId),
    );

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(
      rawValue,
    ) as ReadingWorldPlazaLastPositionStoragePayload;

    if (
      !checkingWorldPlazaLastPositionStorageCoordinate(parsedValue.x) ||
      !checkingWorldPlazaLastPositionStorageCoordinate(parsedValue.y)
    ) {
      return null;
    }

    const layer =
      typeof parsedValue.layer === "number" &&
      Number.isFinite(parsedValue.layer) &&
      parsedValue.layer >= DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER
        ? Math.floor(parsedValue.layer)
        : DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER;
    const updatedAtMs =
      typeof parsedValue.updatedAtMs === "number" &&
      Number.isFinite(parsedValue.updatedAtMs)
        ? parsedValue.updatedAtMs
        : Date.now();

    return creatingWorldPlazaLastPosition(
      parsedValue.x,
      parsedValue.y,
      layer,
      updatedAtMs,
    );
  } catch {
    return null;
  }
}
