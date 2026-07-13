/**
 * Formats player-facing world-layer copy for the minimap status bar.
 *
 * @module components/world/domains/formattingWorldPlazaWorldLayerIndicatorLabel
 */

import { clampingWorldBuildingWorldLayer } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';

/**
 * Returns the elevation label shown above the minimap (`Elevation 1`).
 *
 * @param worldLayer - One-based standing layer index.
 */
export function formattingWorldPlazaWorldLayerIndicatorLabel(
  worldLayer: number
): string {
  return `Elevation ${clampingWorldBuildingWorldLayer(worldLayer)}`;
}
