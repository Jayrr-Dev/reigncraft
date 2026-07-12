'use client';

import type { DefiningWorldPlazaAvatarMotionState } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { usingWorldPlazaAvatarFootsteps } from '@/components/world/hooks/usingWorldPlazaAvatarFootsteps';

export type RenderingWorldPlazaAvatarFootstepsProps = {
  /** Live player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Live local avatar motion state written each frame. */
  localAvatarMotionStateRef: React.RefObject<DefiningWorldPlazaAvatarMotionState>;
};

/**
 * Side-effect component that plays FilmCow footstep walk/run/land SFX for
 * girl-sample and playable animal skins.
 */
export function RenderingWorldPlazaAvatarFootsteps({
  playerPositionRef,
  localAvatarMotionStateRef,
}: RenderingWorldPlazaAvatarFootstepsProps): null {
  usingWorldPlazaAvatarFootsteps(playerPositionRef, localAvatarMotionStateRef);
  return null;
}
