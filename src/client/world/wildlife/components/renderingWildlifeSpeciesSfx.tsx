'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { usingWildlifeSpeciesSfx } from '@/components/world/wildlife/hooks/usingWildlifeSpeciesSfx';

export type RenderingWildlifeSpeciesSfxProps = {
  /** Live player position in grid space for distance falloff. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
};

/**
 * Side-effect component that preloads and plays farm and predator species vocals.
 */
export function RenderingWildlifeSpeciesSfx({
  playerPositionRef,
}: RenderingWildlifeSpeciesSfxProps): null {
  usingWildlifeSpeciesSfx(playerPositionRef);
  return null;
}
