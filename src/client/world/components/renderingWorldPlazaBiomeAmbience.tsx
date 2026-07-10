'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { usingWorldPlazaBiomeAmbience } from '@/components/world/hooks/usingWorldPlazaBiomeAmbience';

export type RenderingWorldPlazaBiomeAmbienceProps = {
  /** Live player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
};

/**
 * Side-effect component that plays biome and flowing-water ambience loops.
 */
export function RenderingWorldPlazaBiomeAmbience({
  playerPositionRef,
}: RenderingWorldPlazaBiomeAmbienceProps): null {
  usingWorldPlazaBiomeAmbience(playerPositionRef);
  return null;
}
