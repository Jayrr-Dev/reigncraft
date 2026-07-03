import type { DefiningWorldPlazaSavedCoords } from "@/components/world/domains/definingWorldPlazaSavedCoords";
import { formattingWorldPlazaMiniMapCoordinatesLabel } from "@/components/world/domains/formattingWorldPlazaMiniMapStatusLabel";

/**
 * Builds the coordinate badge label for a saved plaza tile.
 *
 * @param savedCoords - Persisted saved coordinates.
 */
export function formattingWorldPlazaSavedCoordsLabel(
  savedCoords: DefiningWorldPlazaSavedCoords,
): string {
  return formattingWorldPlazaMiniMapCoordinatesLabel({
    x: savedCoords.tileX,
    y: savedCoords.tileY,
  });
}
