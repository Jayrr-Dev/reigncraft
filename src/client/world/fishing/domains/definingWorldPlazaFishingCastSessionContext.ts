/**
 * Fishing cast session context: tile target plus the catch rolled at cast start.
 *
 * @module components/world/fishing/domains/definingWorldPlazaFishingCastSessionContext
 */

import type { DefiningWorldPlazaFishingCatchCatalogEntry } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';

export type DefiningWorldPlazaFishingCastSessionContext = {
  readonly tileX: number;
  readonly tileY: number;
  readonly pendingCatch: DefiningWorldPlazaFishingCatchCatalogEntry;
};
