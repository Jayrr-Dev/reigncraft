'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { usingWildlifeFootsteps } from '@/components/world/wildlife/hooks/usingWildlifeFootsteps';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type RenderingWildlifeFootstepsProps = {
  /** Live player position in grid space for distance falloff. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Wildlife simulation store scanned each poll tick. */
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
};

/**
 * Side-effect component that plays FilmCow footstep SFX for nearby wildlife.
 */
export function RenderingWildlifeFootsteps({
  playerPositionRef,
  wildlifeStoreRef,
}: RenderingWildlifeFootstepsProps): null {
  usingWildlifeFootsteps(playerPositionRef, wildlifeStoreRef);
  return null;
}
