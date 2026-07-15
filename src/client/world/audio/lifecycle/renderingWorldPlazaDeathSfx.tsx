'use client';

import { usingWorldPlazaDeathSfx } from '@/components/world/audio/lifecycle/usingWorldPlazaDeathSfx';

/**
 * Side-effect component that preloads player-death SFX.
 */
export function RenderingWorldPlazaDeathSfx(): null {
  usingWorldPlazaDeathSfx();
  return null;
}
