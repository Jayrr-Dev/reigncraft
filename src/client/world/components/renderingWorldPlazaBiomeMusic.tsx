'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { usingWorldPlazaBiomeMusic } from '@/components/world/hooks/usingWorldPlazaBiomeMusic';

export type RenderingWorldPlazaBiomeMusicProps = {
  /** Live player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
};

/**
 * Side-effect component that plays biome-themed Cozy Tunes background music.
 */
export function RenderingWorldPlazaBiomeMusic({
  playerPositionRef,
}: RenderingWorldPlazaBiomeMusicProps): null {
  usingWorldPlazaBiomeMusic(playerPositionRef);
  return null;
}
