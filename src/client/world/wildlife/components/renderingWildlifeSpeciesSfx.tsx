'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { usingWildlifeSpeciesSfx } from '@/components/world/wildlife/hooks/usingWildlifeSpeciesSfx';

export type RenderingWildlifeSpeciesSfxProps = {
  /** Live player position in grid space for distance falloff. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Wildlife simulation store for live source positions mid-clip. */
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
};

/**
 * Side-effect component that preloads and plays farm and predator species vocals.
 */
export function RenderingWildlifeSpeciesSfx({
  playerPositionRef,
  wildlifeStoreRef,
}: RenderingWildlifeSpeciesSfxProps): null {
  usingWildlifeSpeciesSfx(playerPositionRef, wildlifeStoreRef);
  return null;
}
