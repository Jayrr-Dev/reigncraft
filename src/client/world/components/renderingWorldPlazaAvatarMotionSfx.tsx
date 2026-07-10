'use client';

import { usingWorldPlazaAvatarMotionSfx } from '@/components/world/hooks/usingWorldPlazaAvatarMotionSfx';

/**
 * Side-effect component that plays jump takeoff and roll dodge SFX for the
 * girl-sample skin.
 */
export function RenderingWorldPlazaAvatarMotionSfx(): null {
  usingWorldPlazaAvatarMotionSfx();
  return null;
}
