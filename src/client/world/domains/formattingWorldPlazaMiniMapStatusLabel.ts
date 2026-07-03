import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Builds the coordinate portion of the minimap status label.
 *
 * @param displayPosition - Rounded tile coordinates.
 */
export function formattingWorldPlazaMiniMapCoordinatesLabel(
  displayPosition: DefiningWorldPlazaWorldPoint,
): string {
  return `X ${Math.round(displayPosition.x)}  Y ${Math.round(displayPosition.y)}`;
}

/**
 * Builds the full minimap status label (biome plus tile coordinates).
 *
 * @param biomeDisplayName - Player-facing biome name.
 * @param displayPosition - Rounded tile coordinates.
 */
export function formattingWorldPlazaMiniMapStatusLabel(
  biomeDisplayName: string,
  displayPosition: DefiningWorldPlazaWorldPoint,
): string {
  return `${biomeDisplayName} ${formattingWorldPlazaMiniMapCoordinatesLabel(displayPosition)}`;
}
