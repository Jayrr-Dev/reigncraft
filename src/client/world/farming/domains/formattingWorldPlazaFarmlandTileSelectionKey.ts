/**
 * Stable selection keys for farmland tile interactions.
 *
 * @module components/world/farming/domains/formattingWorldPlazaFarmlandTileSelectionKey
 */

import type { DefiningWorldPlazaFarmlandInteractionKind } from '@/components/world/farming/domains/listingWorldPlazaFarmlandTilesInInteractionRange';

export function formattingWorldPlazaFarmlandTileSelectionKey(
  tileX: number,
  tileY: number,
  interactionKind: DefiningWorldPlazaFarmlandInteractionKind
): string {
  return `farm:${interactionKind}:${tileX},${tileY}`;
}
