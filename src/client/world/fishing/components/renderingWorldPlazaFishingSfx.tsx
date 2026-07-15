'use client';

import { usingWorldPlazaFishingSfx } from '@/components/world/fishing/hooks/usingWorldPlazaFishingSfx';

/** Mounts fishing cast / catch SFX preload and playback bridge. */
export function RenderingWorldPlazaFishingSfx(): null {
  usingWorldPlazaFishingSfx();
  return null;
}
