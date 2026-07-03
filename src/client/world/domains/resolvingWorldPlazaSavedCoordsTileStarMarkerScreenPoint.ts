import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import type { DefiningWorldPlazaSavedCoords } from "@/components/world/domains/definingWorldPlazaSavedCoords";
import { DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_OFFSET_ABOVE_TILE_PX } from "@/components/world/domains/definingWorldPlazaSavedCoordsTileStarMarkerUiConstants";
import { projectingWorldPlazaGridPointToViewportScreenPoint } from "@/components/world/domains/projectingWorldPlazaGridPointToViewportScreenPoint";

/**
 * Maps a saved coordinate tile to viewport screen coordinates for its star marker.
 *
 * @param savedCoords - Persisted saved tile coordinates.
 * @param cameraOffset - Current camera translation.
 * @param cameraWorldZoom - Effective world-container zoom multiplier.
 */
export function resolvingWorldPlazaSavedCoordsTileStarMarkerScreenPoint(
  savedCoords: DefiningWorldPlazaSavedCoords,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number,
): {
  x: number;
  y: number;
} {
  const viewportPoint = projectingWorldPlazaGridPointToViewportScreenPoint(
    {
      x: savedCoords.tileX,
      y: savedCoords.tileY,
    },
    cameraOffset,
    cameraWorldZoom,
  );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y -
      DEFINING_WORLD_PLAZA_SAVED_COORDS_TILE_STAR_MARKER_OFFSET_ABOVE_TILE_PX *
        cameraWorldZoom,
  };
}
