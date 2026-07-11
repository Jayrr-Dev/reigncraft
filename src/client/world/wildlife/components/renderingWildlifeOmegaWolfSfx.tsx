'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { usingWildlifeOmegaWolfSfx } from '@/components/world/wildlife/hooks/usingWildlifeOmegaWolfSfx';

export type RenderingWildlifeOmegaWolfSfxProps = {
  /** Live player position in grid space for distance falloff. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Wildlife simulation store for live source positions mid-clip. */
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
};

/**
 * Side-effect component that preloads and plays Omega Wolf Werewolf pack SFX.
 */
export function RenderingWildlifeOmegaWolfSfx({
  playerPositionRef,
  wildlifeStoreRef,
}: RenderingWildlifeOmegaWolfSfxProps): null {
  usingWildlifeOmegaWolfSfx(playerPositionRef, wildlifeStoreRef);
  return null;
}
