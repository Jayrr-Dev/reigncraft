/**
 * Formats the compact action-bar world-layer readout (`4L`).
 *
 * @module components/world/domains/formattingWorldPlazaWorldLayerIndicatorLabel
 */

import { clampingWorldBuildingWorldLayer } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';

/**
 * Returns the short layer label shown inside the action-bar orb.
 *
 * @param worldLayer - One-based standing layer index.
 */
export function formattingWorldPlazaWorldLayerIndicatorLabel(
  worldLayer: number
): string {
  return `${clampingWorldBuildingWorldLayer(worldLayer)}L`;
}
