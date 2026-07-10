'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { usingWorldPlazaCampfireAmbience } from '@/components/world/fire/hooks/usingWorldPlazaCampfireAmbience';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

export type RenderingWorldPlazaCampfireAmbienceProps = {
  /** Live player position in grid space for distance falloff. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Live fire cells, including lit campfires. */
  fireCellsRef: React.RefObject<readonly WorldFireDevvitCell[]>;
};

/**
 * Side-effect component that loops bonfire crackle near lit campfires.
 */
export function RenderingWorldPlazaCampfireAmbience({
  playerPositionRef,
  fireCellsRef,
}: RenderingWorldPlazaCampfireAmbienceProps): null {
  usingWorldPlazaCampfireAmbience(playerPositionRef, fireCellsRef);
  return null;
}
