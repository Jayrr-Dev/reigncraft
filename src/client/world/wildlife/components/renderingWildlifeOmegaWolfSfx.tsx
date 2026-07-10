'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { usingWildlifeOmegaWolfSfx } from '@/components/world/wildlife/hooks/usingWildlifeOmegaWolfSfx';

export type RenderingWildlifeOmegaWolfSfxProps = {
  /** Live player position in grid space for distance falloff. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
};

/**
 * Side-effect component that preloads and plays Omega Wolf Werewolf pack SFX.
 */
export function RenderingWildlifeOmegaWolfSfx({
  playerPositionRef,
}: RenderingWildlifeOmegaWolfSfxProps): null {
  usingWildlifeOmegaWolfSfx(playerPositionRef);
  return null;
}
