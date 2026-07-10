'use client';

import { usingWorldPlazaAvatarMeleeSfx } from '@/components/world/hooks/usingWorldPlazaAvatarMeleeSfx';

/**
 * Side-effect component that preloads avatar melee punch SFX.
 */
export function RenderingWorldPlazaAvatarMeleeSfx(): null {
  usingWorldPlazaAvatarMeleeSfx();
  return null;
}
