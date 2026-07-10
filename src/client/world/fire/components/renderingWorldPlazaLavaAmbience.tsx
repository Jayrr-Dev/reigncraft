'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { usingWorldPlazaLavaAmbience } from '@/components/world/fire/hooks/usingWorldPlazaLavaAmbience';

export type RenderingWorldPlazaLavaAmbienceProps = {
  /** Live player position in grid space for distance falloff. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
};

/**
 * Side-effect component that loops fire crackle near lava tiles.
 */
export function RenderingWorldPlazaLavaAmbience({
  playerPositionRef,
}: RenderingWorldPlazaLavaAmbienceProps): null {
  usingWorldPlazaLavaAmbience(playerPositionRef);
  return null;
}
